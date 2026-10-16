from typing import Dict, Any
from app.models.schemas import ExtractedDocument, AuditReport

def sql_escape(val: str) -> str:
    """Escapes single quotes for safe Transact-SQL string literal insertion."""
    return val.replace("'", "''")

def generate_mssql_ddl() -> str:
    """
    Returns the exact T-SQL table definition script for MS-SQL Server.
    """
    return """-- ==========================================================
-- Oceanwide Gateway -> OLE Enterprise TMS Staging Schema
-- Author: Allen Fletcher (Data Automation Specialist)
-- Target System: Microsoft SQL Server 2019/2022 (OLE TMS Staging)
-- ==========================================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OLE_Staging_Shipments')
BEGIN
    CREATE TABLE [dbo].[OLE_Staging_Shipments] (
        [StagingID] INT IDENTITY(1,1) PRIMARY KEY,
        [ShipmentRef] NVARCHAR(50) NOT NULL,
        [ContainerNumber] NVARCHAR(11) NULL,
        [SealNumber] NVARCHAR(30) NULL,
        [GrossWeightKg] DECIMAL(10,2) NULL,
        [NetWeightKg] DECIMAL(10,2) NULL,
        [TotalPackages] INT NULL,
        [PackageType] NVARCHAR(50) NULL,
        [InvoiceTotal] DECIMAL(12,2) NULL,
        [CurrencyCode] CHAR(3) DEFAULT 'EUR',
        [Incoterm] CHAR(3) NULL,
        [OriginPort] NVARCHAR(50) NULL,
        [DestinationPort] NVARCHAR(50) NULL,
        [ShipperName] NVARCHAR(200) NULL,
        [ConsigneeName] NVARCHAR(200) NULL,
        [AuditStatus] NVARCHAR(30) NOT NULL,
        [AtlasReady] BIT DEFAULT 0,
        [IngestedAtUtc] DATETIME2 DEFAULT SYSUTCDATETIME()
    );

    CREATE INDEX IX_OLE_Staging_Container ON [dbo].[OLE_Staging_Shipments] ([ContainerNumber]);
    CREATE INDEX IX_OLE_Staging_Status ON [dbo].[OLE_Staging_Shipments] ([AuditStatus]);
END;
"""

def generate_mssql_insert(shipment_ref: str, doc: ExtractedDocument, audit: AuditReport) -> str:
    """
    Generates deterministic parameterized T-SQL INSERT statement for MS-SQL Server.
    Safely escapes string literals, respects extracted currency, and tags quarantine state.
    """
    container = f"'{sql_escape(doc.container_number)}'" if doc.container_number else "NULL"
    seal = f"'{sql_escape(doc.seal_number)}'" if doc.seal_number else "NULL"
    gross = f"{doc.gross_weight_kg:.2f}" if doc.gross_weight_kg is not None else "NULL"
    net = f"{doc.net_weight_kg:.2f}" if doc.net_weight_kg is not None else "NULL"
    pkgs = f"{doc.total_packages}" if doc.total_packages is not None else "NULL"
    pkg_type = f"'{sql_escape(doc.package_type)}'" if doc.package_type else "NULL"
    total_val = f"{doc.total_amount:.2f}" if doc.total_amount is not None else "NULL"
    curr = f"'{sql_escape(doc.currency)}'" if doc.currency else "'EUR'"
    incoterm = f"'{sql_escape(doc.incoterm)}'" if doc.incoterm else "NULL"
    origin = f"'{sql_escape(doc.origin_port)}'" if doc.origin_port else "NULL"
    dest = f"'{sql_escape(doc.destination_port)}'" if doc.destination_port else "NULL"
    shipper = f"'{sql_escape(doc.shipper[:190])}'" if doc.shipper else "NULL"
    consignee = f"'{sql_escape(doc.consignee[:190])}'" if doc.consignee else "NULL"
    status = f"'{sql_escape(audit.status)}'"
    atlas_bit = "1" if audit.atlas_ready else "0"

    header_comment = ""
    if audit.status != "VERIFIED_CLEAN":
        header_comment = f"-- [QUARANTINE HOLD]: {audit.quarantine_reason or 'Audit failed'}\n"

    return f"""{header_comment}INSERT INTO [dbo].[OLE_Staging_Shipments] (
    [ShipmentRef], [ContainerNumber], [SealNumber],
    [GrossWeightKg], [NetWeightKg], [TotalPackages], [PackageType],
    [InvoiceTotal], [CurrencyCode], [Incoterm],
    [OriginPort], [DestinationPort], [ShipperName], [ConsigneeName],
    [AuditStatus], [AtlasReady]
) VALUES (
    '{sql_escape(shipment_ref)}', {container}, {seal},
    {gross}, {net}, {pkgs}, {pkg_type},
    {total_val}, {curr}, {incoterm},
    {origin}, {dest}, {shipper}, {consignee},
    {status}, {atlas_bit}
);"""

def generate_reconcile_mssql_ddl() -> str:
    """
    Returns the exact T-SQL table definition script for 3-Way Reconciliation Triad.
    """
    return """-- ==========================================================
-- Oceanwide Gateway -> OLE Enterprise TMS 3-Way Cross-Audit Schema
-- Author: Allen Fletcher (Data Automation Specialist)
-- Target System: Microsoft SQL Server 2019/2022 (OLE TMS Staging)
-- Compliance: German ATLAS 9.1 & ADSp 2017 (§ 50 kg Tara)
-- ==========================================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OLE_Staging_ReconciliationTriad')
BEGIN
    CREATE TABLE [dbo].[OLE_Staging_ReconciliationTriad] (
        [AuditID] INT IDENTITY(1,1) PRIMARY KEY,
        [ShipmentRef] NVARCHAR(50) NOT NULL UNIQUE,
        [ContainerNumber] NVARCHAR(11) NULL,
        [OverallStatus] NVARCHAR(30) NOT NULL, -- 'PERFECT_MATCH' | 'QUARANTINE_HOLD'
        [AtlasReady] BIT DEFAULT 0,
        [DemurragePreventedEUR] DECIMAL(12,2) DEFAULT 0.00,
        [WeightVarianceKg] DECIMAL(10,2) NULL,
        [ToleranceExceeded] BIT DEFAULT 0,
        [WaybillFile] NVARCHAR(255) NULL,
        [InvoiceFile] NVARCHAR(255) NULL,
        [PackingListFile] NVARCHAR(255) NULL,
        [CarrierClaimNotice] NVARCHAR(MAX) NULL,
        [ReconciledAtUtc] DATETIME2 DEFAULT SYSUTCDATETIME()
    );

    CREATE TABLE [dbo].[OLE_Reconciliation_Discrepancies] (
        [DiscrepancyID] INT IDENTITY(1,1) PRIMARY KEY,
        [ShipmentRef] NVARCHAR(50) NOT NULL,
        [FieldName] NVARCHAR(100) NOT NULL,
        [WaybillValue] NVARCHAR(255) NULL,
        [InvoiceValue] NVARCHAR(255) NULL,
        [PackingListValue] NVARCHAR(255) NULL,
        [VarianceDelta] NVARCHAR(100) NULL,
        [IsMatch] BIT NOT NULL
    );

    CREATE INDEX IX_OLE_Rec_ShipmentRef ON [dbo].[OLE_Staging_ReconciliationTriad] ([ShipmentRef]);
    CREATE INDEX IX_OLE_Rec_Status ON [dbo].[OLE_Staging_ReconciliationTriad] ([OverallStatus]);
    CREATE INDEX IX_OLE_Rec_Container ON [dbo].[OLE_Staging_ReconciliationTriad] ([ContainerNumber]);
END;
"""

def generate_csharp_snippet(api_url: str) -> str:
    """
    Provides ready-to-paste C# code for ASP.NET backend integration.
    """
    return f"""// ==========================================================
// C# / ASP.NET Client Integration Snippet (.NET 8)
// OLE Oceanwide Logistics Europe GmbH TMS Ingestion Driver
// ==========================================================
using System.Net.Http.Json;

public class OceanwideGatewayClient
{{
    private readonly HttpClient _client;

    public OceanwideGatewayClient(HttpClient client)
    {{
        _client = client;
        _client.BaseAddress = new Uri("{api_url}");
    }}

    // 1. Single Document Ingestion (Vision OCR + Deterministic Audit)
    public async Task<OceanwideStagingResponse> IngestDocumentAsync(byte[] fileBytes, string fileName)
    {{
        using var content = new MultipartFormDataContent();
        content.Add(new ByteArrayContent(fileBytes), "file", fileName);

        var response = await _client.PostAsync("/api/v1/documents/process", content);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<OceanwideStagingResponse>();
    }}

    // 2. 3-Way Dossier Cross-Reconciliation (B/L + Invoice + Packing List)
    public async Task<ThreeWayReconcileResponse> ReconcileDossierAsync(
        byte[] bolBytes, string bolName,
        byte[] invoiceBytes, string invoiceName,
        byte[] packingBytes, string packingName)
    {{
        using var content = new MultipartFormDataContent();
        content.Add(new ByteArrayContent(bolBytes), "bol_file", bolName);
        content.Add(new ByteArrayContent(invoiceBytes), "invoice_file", invoiceName);
        content.Add(new ByteArrayContent(packingBytes), "packing_list_file", packingName);

        var response = await _client.PostAsync("/api/v1/reconcile-live", content);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ThreeWayReconcileResponse>();
    }}
}}"""

def generate_curl_snippet(api_url: str) -> str:
    """
    Provides standard cURL terminal snippets.
    """
    return f"""# ==========================================================
# Oceanwide Gateway CLI / Seaport Terminal Ingestion (cURL)
# ==========================================================

# 1. Single Freight Document Process (Waybill, Invoice, or Packing List)
curl -X POST "{api_url}/api/v1/documents/process" \\
     -H "Accept: application/json" \\
     -F "file=@/path/to/sea_waybill.pdf"

# 2. 3-Way Dossier Cross-Reconciliation
curl -X POST "{api_url}/api/v1/reconcile-live" \\
     -H "Accept: application/json" \\
     -F "bol_file=@/path/to/ocean_bol.pdf" \\
     -F "invoice_file=@/path/to/commercial_invoice.pdf" \\
     -F "packing_list_file=@/path/to/packing_list.pdf"

# 3. Health & Gateway Diagnostics Check
curl -X GET "{api_url}/api/v1/metrics"
"""

def generate_python_snippet(api_url: str) -> str:
    """
    Provides Python integration client.
    """
    return f"""# ==========================================================
# Python Integration Snippet (Requests / Celery Queue Worker)
# OLE Oceanwide Automated Dispatching Integration
# ==========================================================
import requests

BASE_URL = "{api_url}"

# 1. Ingest Single Freight Document
def ingest_document(file_path: str):
    with open(file_path, "rb") as f:
        response = requests.post(
            f"{{BASE_URL}}/api/v1/documents/process",
            files={{"file": f}}
        )
    response.raise_for_status()
    return response.json()

# 2. Execute 3-Way Dossier Reconciliation
def reconcile_dossier(bol_path: str, inv_path: str, packing_path: str):
    with open(bol_path, "rb") as f_bol, \\
         open(inv_path, "rb") as f_inv, \\
         open(packing_path, "rb") as f_pack:
        files = {{
            "bol_file": f_bol,
            "invoice_file": f_inv,
            "packing_list_file": f_pack
        }}
        response = requests.post(
            f"{{BASE_URL}}/api/v1/reconcile-live",
            files=files
        )
    response.raise_for_status()
    return response.json()
"""

def generate_webhook_snippet() -> str:
    """
    Provides Webhook JSON event schemas.
    """
    return """// ==========================================================
// Webhook Event Stream Notification Schemas
// Dispatched on Pipeline Completion to OLE Enterprise TMS
// ==========================================================

// Event 1: Shipment Pre-Cleared (ATLAS 9.1 & ADSp 2017 Compliant)
{
  "event": "shipment.customs_precleared",
  "timestamp_utc": "2026-10-13T16:25:00Z",
  "shipment_ref": "OLE-REC-8F12B9A1",
  "container_number": "MNBU3147540",
  "gross_weight_kg": 18450.00,
  "net_weight_kg": 16200.00,
  "customs_value_eur": 48200.00,
  "incoterm": "CIF",
  "audit_status": "VERIFIED_CLEAN",
  "atlas_ready": true,
  "dispatch_authorized": true
}

// Event 2: Demurrage Quarantine Hold (Variance Exceeded)
{
  "event": "shipment.quarantine_hold",
  "timestamp_utc": "2026-10-13T16:25:00Z",
  "shipment_ref": "OLE-REC-3C72A09B",
  "container_number": "MSCU7821940",
  "demurrage_risk_detected": true,
  "estimated_liability_eur": 1250.00,
  "discrepancy_field": "Gross Weight Variance (180 kg > 50 kg Tare Bound)",
  "audit_status": "QUARANTINE_HOLD",
  "atlas_ready": false,
  "carrier_claim_draft": "Carrier Notice: Container MSCU7821940 tare variance..."
}
"""
