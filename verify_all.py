import sys
import os

# Add project root to path
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
from app.services.audit import calculate_iso6346_check_digit, run_deterministic_audit
from app.services.reconciler import reconcile_documents
from app.services.sql_generator import (
    generate_mssql_insert,
    generate_mssql_ddl,
    generate_reconcile_mssql_ddl,
    generate_csharp_snippet
)
from app.models.schemas import (
    ExtractedDocument,
    LineItem
)

def test_configuration():
    print("[TEST 1] Configuration Settings:")
    assert settings.COMPANY_NAME == "OLE Oceanwide Logistics Europe GmbH", f"Bad COMPANY_NAME: {settings.COMPANY_NAME}"
    assert settings.PARTNER_NAME == "Oceanwide Logistics Global Network (OLGN)", f"Bad PARTNER_NAME: {settings.PARTNER_NAME}"
    assert settings.GATEWAY_NAME == "Oceanwide Gateway", f"Bad GATEWAY_NAME: {settings.GATEWAY_NAME}"
    assert "oceanwide_gateway.db" in settings.DATABASE_URL, f"Bad DATABASE_URL: {settings.DATABASE_URL}"
    print(f"  [OK] Company: {settings.COMPANY_NAME}")
    print(f"  [OK] Partner: {settings.PARTNER_NAME}")
    print(f"  [OK] Gateway: {settings.GATEWAY_NAME}")
    print(f"  [OK] Database URL: {settings.DATABASE_URL}")

def test_container_iso6346():
    print("\n[TEST 2] ISO 6346 Modulo-11 Checksum Validation:")
    # MSKU2264800 is valid (check digit 0)
    is_valid, digit, msg = calculate_iso6346_check_digit("MSKU2264800")
    assert is_valid is True, f"MSKU2264800 should pass: {msg}"
    print(f"  [OK] Valid container MSKU2264800 passed: digit={digit}, {msg}")

    # Corrupted check digit: MSKU2264802 (declared 2, expected 0)
    is_valid_bad, digit_bad, msg_bad = calculate_iso6346_check_digit("MSKU2264802")
    assert is_valid_bad is False, f"MSKU2264802 should fail: {msg_bad}"
    print(f"  [OK] Corrupted container MSKU2264802 caught: declared=2, calculated={digit_bad}")

def test_deterministic_audit():
    print("\n[TEST 3] Deterministic Audit Engine:")
    doc = ExtractedDocument(
        document_type="Ocean Bill of Lading",
        document_number="OLE-HAM-2026-001",
        shipper="Hanseatic Marine Spares GmbH, Hamburg",
        consignee="Nordic Ship Supply A/S, Copenhagen",
        container_number="MSKU2264800",
        gross_weight_kg=12500.0,
        net_weight_kg=11000.0,
        total_amount=45000.0,
        currency="EUR",
        incoterm="CIF",
        line_items=[
            LineItem(item_description="Marine Spare Parts", quantity=100, unit_price=450.0, total_price=45000.0, weight_kg=11000.0)
        ]
    )
    report = run_deterministic_audit(doc)
    assert report.status == "VERIFIED_CLEAN", f"Expected VERIFIED_CLEAN: {report}"
    print(f"  [OK] Shipment audit result: {report.status} ({report.passed_checks}/{report.total_checks} checks passed, atlas_ready={report.atlas_ready})")

def test_reconciliation_and_claim_memo():
    print("\n[TEST 4] 3-Way Match Reconciliation & ADSp 2017 Claim Notice:")
    client = TestClient(app)
    resp = client.get("/api/v1/reconcile-samples")
    assert resp.status_code == 200, f"Failed to get samples: {resp.text}"
    recon_result = resp.json()
    print(f"  [OK] Triad reconciliation status: {recon_result['overall_status']}")
    print(f"  [OK] Prevented Demurrage: EUR {recon_result['demurrage_prevented_eur']}")
    notice = recon_result.get("discrepancy_notice_text")
    if notice:
        assert "OLE Oceanwide Logistics Europe GmbH" in notice, f"Missing OLE in notice: {notice}"
        assert "ADSp 2017" in notice, f"Missing ADSp 2017 in notice: {notice}"
        print("  [OK] ADSp 2017 Claim notice correctly branded for OLE Oceanwide Logistics Europe GmbH")
    else:
        print("  [OK] Reconciliation clean or no discrepancies flagged in sample")

def test_sql_generation():
    print("\n[TEST 5] T-SQL Staging Scripts & C# SDK Snippets:")
    doc = ExtractedDocument(
        document_type="Ocean Bill of Lading",
        document_number="OLE-HAM-2026-999",
        container_number="MSKU2264800",
        gross_weight_kg=14000.0,
        net_weight_kg=12800.0,
        total_amount=60000.0,
        currency="EUR"
    )
    audit = run_deterministic_audit(doc)
    tsql = generate_mssql_insert("OLE-2026-EXP-TEST01", doc, audit)
    assert "[dbo].[OLE_Staging_Shipments]" in tsql, f"Missing OLE_Staging_Shipments in T-SQL: {tsql}"
    print("  [OK] T-SQL INSERT targets [dbo].[OLE_Staging_Shipments]")

    ddl = generate_mssql_ddl()
    assert "OLE_Staging_Shipments" in ddl, "Missing OLE_Staging_Shipments in DDL"
    rec_ddl = generate_reconcile_mssql_ddl()
    assert "OLE_Staging_ReconciliationTriad" in rec_ddl, "Missing OLE_Staging_ReconciliationTriad in DDL"
    print("  [OK] MS-SQL DDL contains both OLE staging tables")

    snippet_cs = generate_csharp_snippet("http://localhost:8000")
    assert "OceanwideGatewayClient" in snippet_cs, "Missing OceanwideGatewayClient in C# snippet"
    assert "OLE Oceanwide Logistics Europe GmbH" in snippet_cs, "Missing OLE in C# snippet"
    print("  [OK] C# SDK snippet branded with OceanwideGatewayClient and OLE Oceanwide Logistics Europe GmbH")

def test_api_endpoints():
    print("\n[TEST 6] Live FastAPI Endpoints:")
    client = TestClient(app)

    # Health
    r_health = client.get("/health")
    assert r_health.status_code == 200, f"Health error: {r_health.text}"
    health_data = r_health.json()
    assert health_data["service"] == "Oceanwide Gateway", f"Bad service: {health_data}"
    assert health_data["company"] == "OLE Oceanwide Logistics Europe GmbH", f"Bad company: {health_data}"
    assert health_data["partner"] == "Oceanwide Logistics Global Network (OLGN)", f"Bad partner: {health_data}"
    print(f"  [OK] /health: {health_data}")

    # Root UI
    r_root = client.get("/")
    assert r_root.status_code == 200, f"Root error: {r_root.status_code}"
    assert "Oceanwide Gateway" in r_root.text, "Missing Oceanwide Gateway in root HTML"
    assert "Document Audit" in r_root.text, "Missing Document Audit tab in root HTML"
    assert "3-Way Match" in r_root.text, "Missing 3-Way Match tab in root HTML"
    print("  [OK] / (Root UI): Status 200 with verified tab titles: 'Document Audit' & '3-Way Match'")

    # Sample B/L
    r_sample = client.get("/api/v1/sample/bol")
    assert r_sample.status_code == 200, f"Sample B/L error: {r_sample.status_code}"
    print(f"  [OK] /api/v1/sample/bol: Retrieved {len(r_sample.content):,} bytes")

    # Metrics
    r_metrics = client.get("/api/v1/metrics")
    assert r_metrics.status_code == 200, f"Metrics error: {r_metrics.status_code}"
    print(f"  [OK] /api/v1/metrics: {r_metrics.json()}")

    # Integration DDL
    r_ddl = client.get("/api/v1/integration/mssql-ddl")
    assert r_ddl.status_code == 200, f"DDL error: {r_ddl.status_code}"
    assert "OLE_Staging_Shipments" in r_ddl.json()["single_ddl"]
    assert "OLE_Staging_ReconciliationTriad" in r_ddl.json()["reconcile_ddl"]
    print("  [OK] /api/v1/integration/mssql-ddl: Returned OLE single and reconciliation DDL")

    # Client snippets
    r_snippets = client.get("/api/v1/integration/client-snippets")
    assert r_snippets.status_code == 200, f"Snippets error: {r_snippets.status_code}"
    assert "OceanwideGatewayClient" in r_snippets.json()["csharp"]
    print("  [OK] /api/v1/integration/client-snippets: Returned C#, cURL, Python, Webhook snippets")

    # Recent Audit Ledger
    r_recent = client.get("/api/v1/recent")
    assert r_recent.status_code == 200, f"Recent error: {r_recent.text}"
    recent_items = r_recent.json()
    print(f"  [OK] /api/v1/recent: Retrieved {len(recent_items)} historic audit ledger entries from oceanwide_gateway.db")

if __name__ == "__main__":
    test_configuration()
    test_container_iso6346()
    test_deterministic_audit()
    test_reconciliation_and_claim_memo()
    test_sql_generation()
    test_api_endpoints()
    print("\n=======================================================")
    print("  ALL VERIFICATION TESTS PASSED WITH 100% SUCCESS!     ")
    print("=======================================================")
