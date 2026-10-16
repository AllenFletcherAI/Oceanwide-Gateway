from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class LineItem(BaseModel):
    item_description: str = Field(default="Standard Freight Item")
    quantity: float = Field(default=1.0)
    unit_price: float = Field(default=0.0)
    total_price: float = Field(default=0.0)
    hs_code: Optional[str] = Field(default=None, description="Harmonized System 6-11 digit tariff code")
    weight_kg: Optional[float] = Field(default=None)

class ExtractedDocument(BaseModel):
    document_type: str = Field(default="Commercial Invoice")
    document_number: Optional[str] = Field(default=None)
    document_date: Optional[str] = Field(default=None)
    shipper: Optional[str] = Field(default=None)
    consignee: Optional[str] = Field(default=None)
    notify_party: Optional[str] = Field(default=None)
    vessel_name_or_flight: Optional[str] = Field(default=None)
    origin_port: Optional[str] = Field(default=None)
    destination_port: Optional[str] = Field(default=None)
    container_number: Optional[str] = Field(default=None, description="Standard 11-char ISO container ID")
    seal_number: Optional[str] = Field(default=None)
    gross_weight_kg: Optional[float] = Field(default=None)
    net_weight_kg: Optional[float] = Field(default=None)
    total_packages: Optional[int] = Field(default=None)
    package_type: Optional[str] = Field(default=None)
    incoterm: Optional[str] = Field(default=None, description="e.g. FOB, CIF, DAP, EXW")
    currency: Optional[str] = Field(default="EUR")
    total_amount: Optional[float] = Field(default=None)
    line_items: List[LineItem] = Field(default_factory=list)
    extraction_notes: Optional[str] = Field(default=None)

class AuditCheck(BaseModel):
    check_name: str
    passed: bool
    requirement: str
    observed_value: str
    severity: str = "PASS"  # PASS | WARNING | CRITICAL_FAIL
    message: str

class AuditReport(BaseModel):
    status: str = Field(description="VERIFIED_CLEAN or QUARANTINE_HOLD")
    passed_checks: int
    total_checks: int
    demurrage_risk_detected: bool
    estimated_demurrage_liability_eur: float
    atlas_ready: bool
    checks: List[AuditCheck]
    quarantine_reason: Optional[str] = None

class ReconciliationItem(BaseModel):
    field_name: str
    bol_value: Optional[str] = None
    invoice_value: Optional[str] = None
    packing_list_value: Optional[str] = None
    tolerance_or_delta: Optional[str] = None
    document_1_value: Optional[str] = None
    document_2_value: Optional[str] = None
    matched: bool
    variance: Optional[str] = None

class ThreeWayReconciliationResult(BaseModel):
    overall_status: str = Field(description="PERFECT_MATCH or DISCREPANCY_FLAGGED")
    container_match: bool
    weight_match: bool
    value_match: bool
    items: List[ReconciliationItem]
    demurrage_prevented_eur: float = 0.0
    action_required: str
    discrepancy_notice_text: Optional[str] = None
    preview_urls: Optional[Dict[str, str]] = None
    summary_chips: Optional[Dict[str, str]] = None

class ProcessedShipmentResponse(BaseModel):
    shipment_id: str
    sha256_hash: str
    mime_type: str
    file_size_bytes: int
    document_preview_url: Optional[str] = None
    extracted_data: ExtractedDocument
    audit_report: AuditReport
    mssql_schema_ready: bool
    mssql_insert_statement: str
    ole_staging_payload: Optional[Dict[str, Any]] = None
