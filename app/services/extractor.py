import json
import re
import time
import logging
from typing import Optional, Any, List
from google import genai
from google.genai import types

from app.config import settings
from app.models.schemas import ExtractedDocument, LineItem

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are the enterprise document intake parser for OLE Oceanwide Logistics Europe GmbH (Oceanwide Logistics Global Network / OLGN), located at Süderstraße 77, 20097 Hamburg, Germany.
Your task is to analyze this international freight or customs shipping document and extract all available data fields accurately without hallucinating.

Identify the document and output a strictly valid JSON object matching this schema:
{
  "document_type": "Commercial Invoice" | "Proforma Invoice" | "Ocean Bill of Lading" | "Master Bill of Lading (MBL)" | "House Bill of Lading (HBL)" | "Sea Waybill" | "Ocean Cargo Manifest" | "Delivery Order (D/O)" | "VGM Certificate" | "Container Packing Certificate" | "Air Waybill" | "Master Air Waybill (MAWB)" | "House Air Waybill (HAWB)" | "Air Cargo Manifest" | "ULD Manifest" | "Consignment Security Declaration (CSD)" | "CMR Consignment Note" | "CIM Rail Consignment Note" | "Bordero / Loading List" | "Delivery Note (POD)" | "Forwarder Transport Instruction" | "Weighing Certificate" | "Packing List" | "Certificate of Origin" | "EUR.1 Movement Certificate" | "A.TR Movement Certificate" | "T1/T2 Transit Document" | "ATLAS Export Accompanying Document (ABD)" | "ATLAS Import Duty Notice" | "Dangerous Goods Declaration" | "Other",
  "document_number": "string or null",
  "document_date": "YYYY-MM-DD or string or null",
  "shipper": "Full Shipper Name and address as string or null",
  "consignee": "Full Consignee Name and address as string or null",
  "notify_party": "string or null",
  "vessel_name_or_flight": "Vessel / Flight name or number or null",
  "origin_port": "Port of loading / departure or null",
  "destination_port": "Port of discharge / destination or null",
  "container_number": "Standard 11-char container ID (e.g. MNBU3147540) or null",
  "seal_number": "Seal number or null",
  "gross_weight_kg": "float or numeric string or null",
  "net_weight_kg": "float or numeric string or null",
  "total_packages": "integer or numeric string or null",
  "package_type": "cartons, pallets, crates, etc. or null",
  "incoterm": "EXW, FCA, CPT, CIP, DAP, DPU, DDP, FAS, FOB, CFR, CIF or null",
  "currency": "EUR, USD, GBP, etc. (3-letter code) or null",
  "total_amount": "float or numeric string or null",
  "line_items": [
    {
      "item_description": "string",
      "quantity": float,
      "unit_price": float,
      "total_price": float,
      "hs_code": "6-11 digit tariff code or null",
      "weight_kg": float or null
    }
  ],
  "extraction_notes": "Observations on document quality, stamps, handwritten marks or null"
}

Important Rules:
- If a value is missing or unreadable, set it to null.
- Extract numbers cleanly (convert "6,300 kg" to 6300.0).
- For shipper and consignee, if both name and address exist, combine them into a single comprehensive string.
- For container numbers, look for 4 letters followed by 7 digits (e.g. MNBU3147540). Format as continuous 11 characters.
- Return ONLY valid JSON.
"""

def format_party_field(val: Any) -> Optional[str]:
    """Ensures party field (shipper, consignee) is cleanly converted to string."""
    if not val:
        return None
    if isinstance(val, dict):
        name = str(val.get("name") or "").strip()
        addr = str(val.get("address") or "").strip()
        if name and addr:
            return f"{name}, {addr}"
        return name or addr or None
    if isinstance(val, str):
        clean = val.strip()
        return clean if clean else None
    return str(val).strip()

def clean_float(val: Any) -> Optional[float]:
    """Sanitizes floats, handling commas, currencies, and units."""
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    if isinstance(val, str):
        cleaned = re.sub(r'[^\d.-]', '', val.replace(',', ''))
        try:
            return float(cleaned) if cleaned else None
        except ValueError:
            return None
    return None

def clean_int(val: Any) -> Optional[int]:
    """Sanitizes integers."""
    f = clean_float(val)
    return int(round(f)) if f is not None else None

def clean_currency(val: Any, raw_context: str = "") -> str:
    """Ensures ISO 4217 3-letter currency code."""
    if val and isinstance(val, str):
        code = val.strip().upper()
        if len(code) == 3 and code.isalpha():
            return code
    if "$" in raw_context or "USD" in raw_context:
        return "USD"
    if "£" in raw_context or "GBP" in raw_context:
        return "GBP"
    return "EUR"

def extract_freight_document(file_bytes: bytes, mime_type: str) -> ExtractedDocument:
    """
    Multimodal extraction of freight documents using Gemini with candidate model waterfall
    prioritizing active, low-latency, free-tier models with exponential backoff.
    """
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    part = types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
    
    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        temperature=0.0
    )
    
    # Prioritize active models in 2026 that have available quota
    candidate_models = [
        "gemini-flash-lite-latest",
        "gemini-3.1-flash-lite-preview",
        "gemini-3-flash-preview",
        "gemini-flash-latest"
    ]
    last_error = None
    
    for target_model in candidate_models:
        for attempt in range(1, 3):
            try:
                response = client.models.generate_content(
                    model=target_model,
                    contents=[part, SYSTEM_PROMPT],
                    config=config
                )
                
                if response and response.text:
                    raw_text = response.text.strip()
                    # Strip markdown codeblocks if model returned wrapped json
                    if raw_text.startswith("```"):
                        lines = raw_text.splitlines()
                        raw_text = "\n".join(lines[1:-1] if lines[-1].startswith("```") else lines[1:])
                    
                    data = json.loads(raw_text)
                    
                    # Sanitize line items
                    line_items: List[LineItem] = []
                    for item in data.get("line_items", []):
                        if isinstance(item, dict):
                            desc = str(item.get("item_description") or "Standard Freight Item").strip()
                            qty = clean_float(item.get("quantity")) or 1.0
                            u_price = clean_float(item.get("unit_price")) or 0.0
                            tot = clean_float(item.get("total_price"))
                            if tot is None or tot == 0.0:
                                tot = round(qty * u_price, 2)
                            hs = str(item.get("hs_code")).strip() if item.get("hs_code") else None
                            if hs and (hs.lower() in ("null", "none", "-", "")):
                                hs = None
                            w = clean_float(item.get("weight_kg"))
                            line_items.append(LineItem(
                                item_description=desc,
                                quantity=qty,
                                unit_price=u_price,
                                total_price=tot,
                                hs_code=hs,
                                weight_kg=w
                            ))
                    
                    # Sanitize container number
                    raw_container = data.get("container_number")
                    clean_container = None
                    if raw_container and isinstance(raw_container, str):
                        c_strip = re.sub(r'[^A-Za-z0-9]', '', raw_container.upper())
                        if len(c_strip) == 11:
                            clean_container = c_strip
                        elif c_strip:
                            clean_container = c_strip
                    
                    # Sanitize incoterm
                    raw_incoterm = data.get("incoterm")
                    clean_incoterm = str(raw_incoterm).strip().upper() if raw_incoterm else None
                    if clean_incoterm and len(clean_incoterm) > 4:
                        clean_incoterm = clean_incoterm[:3]
                    
                    currency = clean_currency(data.get("currency"), raw_text)
                    gross_weight = clean_float(data.get("gross_weight_kg"))
                    net_weight = clean_float(data.get("net_weight_kg"))
                    total_amount = clean_float(data.get("total_amount"))
                    total_packages = clean_int(data.get("total_packages"))
                    
                    return ExtractedDocument(
                        document_type=str(data.get("document_type") or "Commercial Invoice").strip(),
                        document_number=str(data.get("document_number") or "").strip() or None,
                        document_date=str(data.get("document_date") or "").strip() or None,
                        shipper=format_party_field(data.get("shipper")),
                        consignee=format_party_field(data.get("consignee")),
                        notify_party=format_party_field(data.get("notify_party")),
                        vessel_name_or_flight=str(data.get("vessel_name_or_flight") or "").strip() or None,
                        origin_port=str(data.get("origin_port") or "").strip() or None,
                        destination_port=str(data.get("destination_port") or "").strip() or None,
                        container_number=clean_container,
                        seal_number=str(data.get("seal_number") or "").strip() or None,
                        gross_weight_kg=gross_weight,
                        net_weight_kg=net_weight,
                        total_packages=total_packages,
                        package_type=str(data.get("package_type") or "").strip() or None,
                        incoterm=clean_incoterm,
                        currency=currency,
                        total_amount=total_amount,
                        line_items=line_items,
                        extraction_notes=f"Engine: {target_model} | {data.get('extraction_notes') or 'Verified Multimodal Ingestion'}"
                    )
            except Exception as e:
                last_error = e
                err_str = str(e)
                logger.warning(f"Model {target_model} attempt {attempt} failed: {err_str}")
                if "503" in err_str or "429" in err_str:
                    time.sleep(1.2 * attempt)
                    continue
                break  # Try next candidate model
                
    logger.error(f"Extraction failed across all models: {last_error}")
    return ExtractedDocument(
        document_type="Document Processing Exception",
        extraction_notes=f"Extraction failed: {str(last_error)}"
    )
