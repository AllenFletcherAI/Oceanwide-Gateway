import hashlib
import json
import sqlite3
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = "oceanwide_gateway.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS processed_shipments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shipment_ref TEXT UNIQUE NOT NULL,
        document_type TEXT,
        container_number TEXT,
        shipper TEXT,
        consignee TEXT,
        gross_weight_kg REAL,
        total_amount REAL,
        currency TEXT,
        audit_status TEXT,
        demurrage_risk INTEGER DEFAULT 0,
        estimated_liability REAL DEFAULT 0.0,
        atlas_ready INTEGER DEFAULT 0,
        extracted_json TEXT,
        audit_json TEXT,
        processed_at TEXT,
        override_reason TEXT,
        override_operator TEXT,
        override_at TEXT,
        sha256 TEXT
    );
    """)
    conn.commit()

    # Dynamic migration for existing databases
    cursor.execute("PRAGMA table_info(processed_shipments)")
    cols = [col[1] for col in cursor.fetchall()]
    if "override_reason" not in cols:
        cursor.execute("ALTER TABLE processed_shipments ADD COLUMN override_reason TEXT")
    if "override_operator" not in cols:
        cursor.execute("ALTER TABLE processed_shipments ADD COLUMN override_operator TEXT")
    if "override_at" not in cols:
        cursor.execute("ALTER TABLE processed_shipments ADD COLUMN override_at TEXT")
    if "sha256" not in cols:
        cursor.execute("ALTER TABLE processed_shipments ADD COLUMN sha256 TEXT")
    
    # Backfill SHA-256 cryptographic hashes for legacy/pre-seeded records
    cursor.execute("SELECT id, shipment_ref, document_type, processed_at FROM processed_shipments WHERE sha256 IS NULL OR sha256 = ''")
    rows_to_backfill = cursor.fetchall()
    for row in rows_to_backfill:
        h = hashlib.sha256(f"{row[1]}:{row[2]}:{row[3]}".encode()).hexdigest()
        cursor.execute("UPDATE processed_shipments SET sha256 = ? WHERE id = ?", (h, row[0]))
    conn.commit()
    conn.close()

def save_shipment(
    shipment_ref: str,
    doc_type: str,
    container_no: Optional[str],
    shipper: Optional[str],
    consignee: Optional[str],
    gross_weight: Optional[float],
    total_val: Optional[float],
    currency: Optional[str],
    audit_status: str,
    demurrage_risk: bool,
    liability: float,
    atlas_ready: bool,
    extracted_data: Dict[str, Any],
    audit_report: Dict[str, Any]
):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    ext_str = json.dumps(extracted_data)
    aud_str = json.dumps(audit_report)
    sha_hash = hashlib.sha256(f"{shipment_ref}:{ext_str}:{now_str}".encode('utf-8')).hexdigest()
    
    cursor.execute("""
    INSERT OR REPLACE INTO processed_shipments (
        shipment_ref, document_type, container_number, shipper, consignee,
        gross_weight_kg, total_amount, currency, audit_status,
        demurrage_risk, estimated_liability, atlas_ready,
        extracted_json, audit_json, processed_at, sha256
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        shipment_ref, doc_type, container_no, shipper, consignee,
        gross_weight, total_val, currency, audit_status,
        1 if demurrage_risk else 0, liability, 1 if atlas_ready else 0,
        ext_str, aud_str, now_str, sha_hash
    ))
    conn.commit()
    conn.close()

def override_shipment(shipment_ref: str, reason: str, operator: str = "Lead Dispatcher") -> bool:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    cursor.execute("""
    UPDATE processed_shipments
    SET audit_status = 'OVERRIDDEN_RELEASED',
        demurrage_risk = 0,
        atlas_ready = 1,
        override_reason = ?,
        override_operator = ?,
        override_at = ?
    WHERE shipment_ref = ?
    """, (reason, operator, now_str, shipment_ref))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0

def get_recent_shipments(limit: int = 100) -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("""
    SELECT shipment_ref, document_type, container_number, shipper, consignee,
           gross_weight_kg, total_amount, currency, audit_status,
           demurrage_risk, estimated_liability, atlas_ready, processed_at,
           extracted_json, audit_json, override_reason, override_operator, override_at, sha256
    FROM processed_shipments
    ORDER BY id DESC
    LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for r in rows:
        d = dict(r)
        if not d.get("sha256"):
            raw_fingerprint = f"{d['shipment_ref']}:{d.get('extracted_json','')}:{d.get('processed_at','')}"
            d["sha256"] = hashlib.sha256(raw_fingerprint.encode('utf-8')).hexdigest()
        try:
            d["extracted_data"] = json.loads(d.get("extracted_json") or "{}")
        except Exception:
            d["extracted_data"] = {}
        try:
            d["audit_report"] = json.loads(d.get("audit_json") or "{}")
        except Exception:
            d["audit_report"] = {}
        result.append(d)
    return result

def get_dashboard_metrics() -> Dict[str, Any]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM processed_shipments")
    total_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM processed_shipments WHERE audit_status IN ('VERIFIED_CLEAN', 'OVERRIDDEN_RELEASED')")
    clean_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM processed_shipments WHERE audit_status NOT IN ('VERIFIED_CLEAN', 'OVERRIDDEN_RELEASED')")
    quarantine_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT SUM(estimated_liability) FROM processed_shipments WHERE demurrage_risk = 1 OR audit_status NOT IN ('VERIFIED_CLEAN', 'OVERRIDDEN_RELEASED')")
    prevented_liability = cursor.fetchone()[0] or 0.0
    
    conn.close()
    return {
        "total_documents": total_count,
        "verified_clean": clean_count,
        "quarantine_holds": quarantine_count,
        "demurrage_prevented_eur": prevented_liability,
        "atlas_readiness_rate": f"{(clean_count / total_count * 100):.1f}%" if total_count > 0 else "100.0%"
    }
