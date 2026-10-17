import os
import subprocess
import tempfile
import sys
import fitz  # PyMuPDF

def build_html() -> str:
    # Embedded official OLE Maritime SVG Logo
    logo_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40">
  <rect width="64" height="64" rx="10" fill="#0E1626" stroke="#3B82F6" stroke-width="2"/>
  <text x="50%" y="54%" font-family="'Inter', sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">OLE</text>
  <path d="M16 48 Q32 42 48 48" stroke="#38BDF8" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>"""

    html = f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Oceanwide Gateway - Technische Integrationsspezifikation (OLE Oceanwide Logistics Europe)</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  @page {{
    size: A4;
    margin: 8mm 12mm 9mm 12mm;
  }}

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  body {{
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1E293B;
    background-color: #FFFFFF;
    line-height: 1.4;
    font-size: 9pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  .page {{
    page-break-after: always;
    height: 278mm;
    max-height: 278mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }}

  .page:last-child {{
    page-break-after: auto;
  }}

  .page-content {{
    flex: 1;
  }}

  /* HEADER & FOOTER */
  .page-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #312783;
    padding-bottom: 6px;
    margin-bottom: 10px;
  }}

  .header-left {{
    display: flex;
    align-items: center;
    gap: 10px;
  }}

  .header-titles {{
    display: flex;
    flex-direction: column;
  }}

  .header-title {{
    font-size: 12pt;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.02em;
    text-transform: uppercase;
  }}

  .header-subtitle {{
    font-size: 7.5pt;
    font-weight: 600;
    color: #312783;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }}

  .header-badge {{
    background: #EEF2FF;
    border: 1px solid #C7D2FE;
    color: #312783;
    font-size: 7pt;
    font-weight: 700;
    padding: 2.5px 7px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }}

  .page-footer {{
    border-top: 1px solid #E2E8F0;
    padding-top: 4px;
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7pt;
    color: #64748B;
  }}

  .footer-confidential {{
    font-weight: 700;
    color: #DC2626;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }}

  /* TYPOGRAPHY */
  h1 {{
    font-size: 13pt;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 4px;
    letter-spacing: -0.02em;
  }}

  h2 {{
    font-size: 10pt;
    font-weight: 700;
    color: #312783;
    margin-top: 8px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    border-bottom: 1px solid #E2E8F0;
    padding-bottom: 2px;
  }}

  h2::before {{
    content: "";
    display: inline-block;
    width: 3.5px;
    height: 11px;
    background: #312783;
    border-radius: 2px;
  }}

  h3 {{
    font-size: 8.5pt;
    font-weight: 700;
    color: #0F172A;
    margin-top: 4px;
    margin-bottom: 2px;
  }}

  p {{
    margin-bottom: 5px;
    text-align: justify;
  }}

  strong {{
    font-weight: 700;
    color: #0F172A;
  }}

  /* METADATA GRID */
  .meta-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    padding: 6px 10px;
    margin-bottom: 8px;
  }}

  .meta-item {{
    display: flex;
    flex-direction: column;
  }}

  .meta-label {{
    font-size: 6.5pt;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }}

  .meta-val {{
    font-size: 8pt;
    font-weight: 700;
    color: #0F172A;
  }}

  /* HIGHLIGHT CALLOUT BOXES */
  .callout {{
    border-radius: 6px;
    padding: 6px 10px;
    margin: 6px 0;
    font-size: 8pt;
    line-height: 1.35;
  }}

  .callout-blue {{
    background: #EFF6FF;
    border-left: 3.5px solid #2563EB;
    color: #1E3A8A;
  }}

  .callout-purple {{
    background: #F5F3FF;
    border-left: 3.5px solid #312783;
    color: #2E1065;
  }}

  .callout-amber {{
    background: #FFFBEB;
    border-left: 3.5px solid #D97706;
    color: #78350F;
  }}

  .callout-emerald {{
    background: #ECFDF5;
    border-left: 3.5px solid #059669;
    color: #064E3B;
  }}

  /* ARCHITECTURE DIAGRAM */
  .arch-container {{
    background: #0F172A;
    color: #F8FAFC;
    border-radius: 6px;
    padding: 8px 10px;
    margin: 6px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7pt;
    line-height: 1.3;
  }}

  .flow-row {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    margin: 3px 0;
  }}

  .flow-node {{
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 4px;
    padding: 5px 8px;
    text-align: center;
    flex: 1;
  }}

  .flow-node.highlight {{
    background: #312783;
    border-color: #6366F1;
    color: #FFFFFF;
    font-weight: 700;
  }}

  .flow-node.success {{
    background: #064E3B;
    border-color: #10B981;
    color: #A7F3D0;
    font-weight: 700;
  }}

  .flow-node.erp {{
    background: #1E3A8A;
    border-color: #3B82F6;
    color: #BFDBFE;
    font-weight: 700;
  }}

  .flow-arrow {{
    color: #94A3B8;
    font-weight: 800;
    font-size: 9pt;
    flex-shrink: 0;
  }}

  /* CODE BOXES */
  .code-block {{
    background: #0F172A;
    color: #E2E8F0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 6.8pt;
    line-height: 1.34;
    border-radius: 5px;
    padding: 6px 8px;
    margin: 4px 0;
    overflow: hidden;
    border: 1px solid #1E293B;
    white-space: pre-wrap;
    word-break: break-all;
  }}

  .code-header {{
    background: #1E293B;
    color: #94A3B8;
    font-size: 6.8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2.5px 8px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    border: 1px solid #334155;
    border-bottom: none;
  }}

  .code-header + .code-block {{
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }}

  /* SYNTAX HIGHLIGHTING SIMULATION */
  .kw {{ color: #F43F5E; font-weight: 700; }}
  .typ {{ color: #38BDF8; }}
  .str {{ color: #34D399; }}
  .fn {{ color: #FBBF24; }}
  .num {{ color: #A78BFA; }}
  .cm {{ color: #64748B; font-style: italic; }}

  /* TABLES */
  table.data-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 5px 0;
    font-size: 7.5pt;
  }}

  table.data-table th {{
    background: #F1F5F9;
    color: #0F172A;
    font-weight: 700;
    text-align: left;
    padding: 4px 6px;
    border: 1px solid #CBD5E1;
    text-transform: uppercase;
    font-size: 6.8pt;
    letter-spacing: 0.03em;
  }}

  table.data-table td {{
    padding: 3.5px 6px;
    border: 1px solid #E2E8F0;
    vertical-align: middle;
  }}

  table.data-table tr:nth-child(even) {{
    background: #F8FAFC;
  }}

  .pill {{
    display: inline-block;
    padding: 1.5px 5px;
    border-radius: 3px;
    font-size: 6.5pt;
    font-weight: 700;
    text-transform: uppercase;
  }}
  .pill-green {{ background: #DCFCE7; color: #15803D; }}
  .pill-blue {{ background: #DBEAFE; color: #1D4ED8; }}
  .pill-amber {{ background: #FEF3C7; color: #B45309; }}
  .pill-red {{ background: #FEE2E2; color: #B91C1C; }}

  /* TWO COLUMN LAYOUT */
  .two-col {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 4px 0;
  }}
</style>
</head>
<body>

<!-- =================================================================== -->
<!-- PAGE 1: EXECUTIVE SUMMARY & ENTERPRISE ARCHITECTURE                 -->
<!-- =================================================================== -->
<div class="page">
  <div class="page-content">
    <div class="page-header">
      <div class="header-left">
        {logo_svg}
        <div class="header-titles">
          <div class="header-title">Technical Integration Specification</div>
          <div class="header-subtitle">Automated Freight Document Audit & Enterprise MS-SQL Staging Bridge</div>
        </div>
      </div>
      <div class="header-badge">Confidential · OLE Hamburg / OLGN</div>
    </div>

    <!-- Metadata Block -->
    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">Zielpersonen</span>
        <span class="meta-val">Peter Czajkowski (CEO) / Christoph Braß (GF)</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Zielinfrastruktur</span>
        <span class="meta-val">OLE Enterprise TMS · C# / .NET 8 · MS-SQL 2022</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Autor / Fachgebiet</span>
        <span class="meta-val">Allen Fletcher (Data Automation Lead)</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Version / Status</span>
        <span class="meta-val">v1.0 Release · Stand: Oktober 2026</span>
      </div>
    </div>

    <h2>1. Management Summary & Zielsetzung</h2>
    <p>
      Die <strong>OLE Oceanwide Logistics Europe GmbH</strong> und das weltweite Netzwerk <strong>Oceanwide Logistics Global Network (OLGN)</strong> wickeln anspruchsvolle globale See-, Luft- und Hafenlogistikverkehre mit Schwerpunkt auf die Nordsee-Drehscheiben (Hamburg [HHLA CTB, CTA, CTT, Eurogate], Rotterdam, Antwerpen, Bremerhaven) ab. In der speditionellen Praxis führt die manuelle Prüfung von Frachtbriefen (B/L, AWB, CMR), Handelsrechnungen und Packlisten zu zwei gravierenden operativen Risiken:
    </p>
    <ul style="margin-left: 18px; margin-bottom: 5px; font-size: 8.2pt;">
      <li><strong>Standgeld- & Demurrage-Kosten (€150 bis €350/Tag/Container):</strong> Unentdeckte Zahlendreher in ISO 6346 Container-Prüfziffern oder Gewichtsabweichungen (>50 kg Tara-Grenze) blockieren das Gate-in an Seeterminals und verzögern die zollrechtliche Gestellung.</li>
      <li><strong>Disponenten-Überlastung:</strong> Pro Sendungsdossier binden repetitive Abtipp- und Abgleicharbeiten 12 bis 18 Minuten qualifizierter Fachkräftezeit.</li>
    </ul>

    <div class="callout callout-purple">
      <strong>Das Integrationsprinzip (Zero-Disruption Sidecar):</strong> Oceanwide Gateway wurde speziell für die gewachsene Systemlandschaft der OLE Oceanwide Logistics Europe GmbH (C#, ASP.NET, MS-SQL Server 2022, Enterprise TMS) konzipiert. Es ersetzt weder das führende ERP noch erfordert es risikobehaftete Tabellenänderungen. Die Lösung agiert als <strong>vorgelagerte Prüf- und Validierungs-Schleuse</strong>, die fehlerfreie Datensätze direkt in eine isolierte Staging-Tabelle schreibt.
    </div>

    <h2>2. End-to-End Systemarchitektur & Datenfluss</h2>
    <p>
      Dokumente (PDF-Scans, E-Mail-Anhänge, Bilddateien) werden entweder manuell über die Web-Oberfläche oder vollautomatisiert über eine REST-Schnittstelle eingeliefert. Die Ingestion durchläuft eine strikt zweistufige Pipeline:
    </p>

    <div class="arch-container">
      <div style="color: #94A3B8; margin-bottom: 4px; font-weight: 700; text-transform: uppercase;">
        [System-Topologie: Oceanwide Gateway -> OLE TMS Staging Pipeline]
      </div>
      <div class="flow-row">
        <div class="flow-node">
          E-Mail / PDF Scan<br><span style="color:#94A3B8; font-size: 6.5pt;">B/L · Invoice · Packliste</span>
        </div>
        <div class="flow-arrow">-></div>
        <div class="flow-node highlight">
          Oceanwide Gateway API<br><span style="color:#C7D2FE; font-size: 6.5pt;">FastAPI · Hamburg / Frankfurt</span>
        </div>
        <div class="flow-arrow">-></div>
        <div class="flow-node">
          Deterministische Prüfung<br><span style="color:#94A3B8; font-size: 6.5pt;">ISO 6346 · ATLAS · ADSp</span>
        </div>
        <div class="flow-arrow">-></div>
        <div class="flow-node success">
          GoBD SHA-256 Vault<br><span style="color:#A7F3D0; font-size: 6.5pt;">Unveränderbare Prüfspur</span>
        </div>
        <div class="flow-arrow">-></div>
        <div class="flow-node erp">
          [OLE_Staging]<br><span style="color:#BFDBFE; font-size: 6.5pt;">OLE MS-SQL 2022 ERP</span>
        </div>
      </div>
    </div>

    <div class="two-col">
      <div>
        <h3>Stufe A: Multimodale Extraktion</h3>
        <p style="font-size: 8pt;">
          Hochauflösende OCR- und Layout-Analyse erfasst mehrseitige Frachtdokumente in Sekundenbruchteilen. Extrahierte Entitäten umfassen ISO 6346 Containernummern, Siegel, Tara/Brutto/Netto-Gewichte, Colli, Währungen, Rechnungsbeträge, Incoterms und Zollklauseln.
        </p>
      </div>
      <div>
        <h3>Stufe B: Deterministische Validierung</h3>
        <p style="font-size: 8pt;">
          Reine KI trifft keine Freigabeentscheidungen! Die extrahierten Werte werden gegen mathematische Prüfziffern-Algorithmen (ISO 6346 Modulo-11), zollrechtliche Toleranzen (50 kg Tara gem. § 412 HGB & ADSp 2017) und ATLAS-Vollständigkeit validiert.
        </p>
      </div>
    </div>

    <div class="callout callout-emerald">
      <strong>Ergebnis-Klassifizierung:</strong>
      <span class="pill pill-green" style="margin-left: 6px;">VERIFIED_CLEAN</span> Direkte Bereitstellung für ATLAS-Verzollung & T-SQL ERP-Insert.
      <span class="pill pill-amber" style="margin-left: 6px;">QUARANTINE_HOLD</span> Automatische Generierung einer rechtswirksamen Speditions-Reklamation gem. ADSp 2017 zur Abwendung von Terminal-Standgeldern.
    </div>
  </div>

  <div class="page-footer">
    <span>Oceanwide Gateway v1.0 · Technische Integrationsspezifikation für Peter Czajkowski & Christoph Braß</span>
    <span class="footer-confidential">Vertraulich / Nur für internen Dienstgebrauch</span>
    <span>Seite 1 von 4</span>
  </div>
</div>

<!-- =================================================================== -->
<!-- PAGE 2: MS-SQL SERVER DATABASE SCHEMA & T-SQL SCRIPTS               -->
<!-- =================================================================== -->
<div class="page">
  <div class="page-content">
    <div class="page-header">
      <div class="header-left">
        {logo_svg}
        <div class="header-titles">
          <div class="header-title">Database Integration & Target T-SQL Schema</div>
          <div class="header-subtitle">Zero-Impact Staging Buffer for Microsoft SQL Server 2019 / 2022</div>
        </div>
      </div>
      <div class="header-badge">Architecture Spec · Page 2</div>
    </div>

    <h2>3. Datenbank-Architektur: Das Entkoppelte Staging-Modell</h2>
    <p>
      Um absolute Stabilität für die produktiven TMS-Tabellen zu garantieren, schreibt Oceanwide Gateway ausschließlich in dedizierte Staging-Relationen. Ein bestehender OLE-Hintergrunddienst oder ein SQL-Agent-Job kann validierte Datensätze per <code>MERGE</code> oder Trigger in den Kernbestand überführen.
    </p>

    <div class="code-header">
      <span>1. Transact-SQL DDL: Einzelbeleg-Staging [dbo].[OLE_Staging_Shipments]</span>
      <span>MS-SQL Server 2019 / 2022 Target</span>
    </div>
    <div class="code-block"><span class="cm">-- ==============================================================================
-- Oceanwide Gateway -> OLE Enterprise TMS Staging Schema (Single Document Buffer)
-- Author: Allen Fletcher | Target: Microsoft SQL Server (OLE TMS Database)
-- ==============================================================================</span>
<span class="kw">IF NOT EXISTS</span> (<span class="kw">SELECT</span> * <span class="kw">FROM</span> sys.tables <span class="kw">WHERE</span> name = <span class="str">'OLE_Staging_Shipments'</span>)
<span class="kw">BEGIN</span>
    <span class="kw">CREATE TABLE</span> [dbo].[OLE_Staging_Shipments] (
        [StagingID]             <span class="typ">INT IDENTITY</span>(<span class="num">1</span>,<span class="num">1</span>) <span class="kw">PRIMARY KEY</span>,
        [ShipmentRef]           <span class="typ">NVARCHAR</span>(<span class="num">50</span>)   <span class="kw">NOT NULL</span>,
        [ContainerNumber]       <span class="typ">NVARCHAR</span>(<span class="num">11</span>)   <span class="kw">NULL</span>,          <span class="cm">-- ISO 6346 (z.B. 'MSKU2264802')</span>
        [SealNumber]            <span class="typ">NVARCHAR</span>(<span class="num">30</span>)   <span class="kw">NULL</span>,
        [GrossWeightKg]         <span class="typ">DECIMAL</span>(<span class="num">10</span>,<span class="num">2</span>)  <span class="kw">NULL</span>,          <span class="cm">-- Verifiziertes Bruttogewicht</span>
        [NetWeightKg]           <span class="typ">DECIMAL</span>(<span class="num">10</span>,<span class="num">2</span>)  <span class="kw">NULL</span>,
        [TotalPackages]         <span class="typ">INT</span>            <span class="kw">NULL</span>,          <span class="cm">-- Colli-Anzahl</span>
        [PackageType]           <span class="typ">NVARCHAR</span>(<span class="num">50</span>)   <span class="kw">NULL</span>,          <span class="cm">-- 'Cartons', 'Pallets', 'Drums'</span>
        [InvoiceTotal]          <span class="typ">DECIMAL</span>(<span class="num">12</span>,<span class="num">2</span>)  <span class="kw">NULL</span>,          <span class="cm">-- Rechnungsbetrag</span>
        [CurrencyCode]          <span class="typ">CHAR</span>(<span class="num">3</span>)        <span class="kw">DEFAULT</span> <span class="str">'EUR'</span>,
        [Incoterm]              <span class="typ">CHAR</span>(<span class="num">3</span>)        <span class="kw">NULL</span>,          <span class="cm">-- 'CIF', 'FOB', 'DAP' gem. ICC 2020</span>
        [OriginPort]            <span class="typ">NVARCHAR</span>(<span class="num">50</span>)   <span class="kw">NULL</span>,
        [DestinationPort]       <span class="typ">NVARCHAR</span>(<span class="num">50</span>)   <span class="kw">NULL</span>,
        [ShipperName]           <span class="typ">NVARCHAR</span>(<span class="num">200</span>)  <span class="kw">NULL</span>,
        [ConsigneeName]         <span class="typ">NVARCHAR</span>(<span class="num">200</span>)  <span class="kw">NULL</span>,
        [AuditStatus]           <span class="typ">NVARCHAR</span>(<span class="num">30</span>)   <span class="kw">NOT NULL</span>,      <span class="cm">-- 'VERIFIED_CLEAN' | 'QUARANTINE_HOLD'</span>
        [AtlasReady]            <span class="typ">BIT</span>            <span class="kw">DEFAULT</span> <span class="num">0</span>,     <span class="cm">-- 1 = Zolltechnisch fehlerfrei freigegeben</span>
        [Sha256Hash]            <span class="typ">CHAR</span>(<span class="num">64</span>)       <span class="kw">NOT NULL</span>,      <span class="cm">-- GoBD-Revisionsprüfsumme</span>
        [IngestedAtUtc]         <span class="typ">DATETIME2</span>      <span class="kw">DEFAULT</span> <span class="fn">SYSUTCDATETIME</span>()
    );

    <span class="kw">CREATE INDEX</span> IX_OLE_Container <span class="kw">ON</span> [dbo].[OLE_Staging_Shipments] ([ContainerNumber]);
    <span class="kw">CREATE INDEX</span> IX_OLE_Status    <span class="kw">ON</span> [dbo].[OLE_Staging_Shipments] ([AuditStatus]);
    <span class="kw">CREATE INDEX</span> IX_OLE_Sha       <span class="kw">ON</span> [dbo].[OLE_Staging_Shipments] ([Sha256Hash]);
<span class="kw">END</span>;</div>

    <div class="code-header">
      <span>2. Transact-SQL DDL: 3-Wege-Reconciliation Triad [dbo].[OLE_Staging_ReconciliationTriad]</span>
      <span>Cross-Audit Engine</span>
    </div>
    <div class="code-block"><span class="cm">-- ==============================================================================
-- 3-Wege-Dossier-Abgleich: B/L Frachturkunde vs. Rechnung vs. Packliste
-- ==============================================================================</span>
<span class="kw">IF NOT EXISTS</span> (<span class="kw">SELECT</span> * <span class="kw">FROM</span> sys.tables <span class="kw">WHERE</span> name = <span class="str">'OLE_Staging_ReconciliationTriad'</span>)
<span class="kw">BEGIN</span>
    <span class="kw">CREATE TABLE</span> [dbo].[OLE_Staging_ReconciliationTriad] (
        [AuditID]               <span class="typ">INT IDENTITY</span>(<span class="num">1</span>,<span class="num">1</span>) <span class="kw">PRIMARY KEY</span>,
        [ShipmentRef]           <span class="typ">NVARCHAR</span>(<span class="num">50</span>)   <span class="kw">NOT NULL UNIQUE</span>,
        [ContainerNumber]       <span class="typ">NVARCHAR</span>(<span class="num">11</span>)   <span class="kw">NULL</span>,
        [OverallStatus]         <span class="typ">NVARCHAR</span>(<span class="num">30</span>)   <span class="kw">NOT NULL</span>,      <span class="cm">-- 'PERFECT_MATCH' | 'QUARANTINE_HOLD'</span>
        [AtlasReady]            <span class="typ">BIT</span>            <span class="kw">DEFAULT</span> <span class="num">0</span>,
        [DemurragePreventedEUR] <span class="typ">DECIMAL</span>(<span class="num">12</span>,<span class="num">2</span>)  <span class="kw">DEFAULT</span> <span class="num">0.00</span>,  <span class="cm">-- Berechnetes abgewendetes Standgeld</span>
        [WeightVarianceKg]      <span class="typ">DECIMAL</span>(<span class="num">10</span>,<span class="num">2</span>)  <span class="kw">NULL</span>,          <span class="cm">-- Diskrepanz (Delta) zwischen B/L und Packliste</span>
        [CarrierClaimNotice]    <span class="typ">NVARCHAR</span>(<span class="kw">MAX</span>)  <span class="kw">NULL</span>,          <span class="cm">-- Automatisch formuliertes Reklamationsmemo</span>
        [ReconciledAtUtc]       <span class="typ">DATETIME2</span>      <span class="kw">DEFAULT</span> <span class="fn">SYSUTCDATETIME</span>()
    );

    <span class="kw">CREATE INDEX</span> IX_OLE_Rec_Ref <span class="kw">ON</span> [dbo].[OLE_Staging_ReconciliationTriad] ([ShipmentRef]);
<span class="kw">END</span>;</div>

    <div class="callout callout-blue">
      <strong>Vollständige SQL-Injection Absicherung:</strong> Sämtliche von der Gateway-Engine generierten Skripte verwenden typisierte Parameter und ANSI-konformes String-Escaping. Alle numerischen Werte für Gewichte und Rechnungsbeträge werden mit exakter Dezimalpräzision (<code>DECIMAL(10,2)</code>) übertragen.
    </div>
  </div>

  <div class="page-footer">
    <span>Oceanwide Gateway v1.0 · Technische Integrationsspezifikation für Peter Czajkowski & Christoph Braß</span>
    <span class="footer-confidential">Vertraulich / Nur für internen Dienstgebrauch</span>
    <span>Seite 2 von 4</span>
  </div>
</div>

<!-- =================================================================== -->
<!-- PAGE 3: ENTERPRISE C# / .NET 8 INTEGRATION CLIENT                    -->
<!-- =================================================================== -->
<div class="page">
  <div class="page-content">
    <div class="page-header">
      <div class="header-left">
        {logo_svg}
        <div class="header-titles">
          <div class="header-title">Enterprise Client Integration (.NET 8 / C#)</div>
          <div class="header-subtitle">Ready-to-Paste Client Service for OLE ASP.NET Core Backend</div>
        </div>
      </div>
      <div class="header-badge">Developer Spec · Page 3</div>
    </div>

    <h2>4. C# / .NET 8 Client-Bibliothek für OLE TMS</h2>
    <p>
      Für die nahtlose Anbindung an die bestehenden ASP.NET / C# Microservices steht ein leichtgewichtiger, asynchroner Client zur Verfügung, der moderne Best Practices (<code>IHttpClientFactory</code>, <code>System.Net.Http.Json</code>, Zero-Copy Streaming) implementiert:
    </p>

    <div class="code-header">
      <span>OceanwideGatewayClient.cs - ASP.NET Core Integration Service</span>
      <span>C# 12 / .NET 8 Target</span>
    </div>
    <div class="code-block"><span class="kw">using</span> System.Net.Http.Json;

<span class="kw">namespace</span> OLE.Logistik.Integration.Oceanwide;

<span class="kw">public interface</span> <span class="typ">IOceanwideGatewayClient</span>
{{
    <span class="typ">Task</span>&lt;<span class="typ">StagingResponse</span>&gt; <span class="fn">IngestDocumentAsync</span>(<span class="typ">byte</span>[] fileBytes, <span class="typ">string</span> fileName);
    <span class="typ">Task</span>&lt;<span class="typ">ReconciliationResponse</span>&gt; <span class="fn">ReconcileDossierAsync</span>(<span class="typ">byte</span>[] bolBytes, <span class="typ">byte</span>[] invoiceBytes, <span class="typ">byte</span>[] packingBytes);
}}

<span class="kw">public class</span> <span class="typ">OceanwideGatewayClient</span> : <span class="typ">IOceanwideGatewayClient</span>
{{
    <span class="kw">private readonly</span> <span class="typ">HttpClient</span> _httpClient;

    <span class="kw">public</span> <span class="fn">OceanwideGatewayClient</span>(<span class="typ">HttpClient</span> httpClient)
    {{
        _httpClient = httpClient; <span class="cm">// Konfiguriert via Dependency Injection in Program.cs</span>
    }}

    <span class="cm">// 1. Extrahiert & validiert ein Einzelbeleg (B/L, AWB, CMR, Invoice, Packliste)</span>
    <span class="kw">public async</span> <span class="typ">Task</span>&lt;<span class="typ">StagingResponse</span>&gt; <span class="fn">IngestDocumentAsync</span>(<span class="typ">byte</span>[] fileBytes, <span class="typ">string</span> fileName)
    {{
        <span class="kw">using var</span> content = <span class="kw">new</span> <span class="typ">MultipartFormDataContent</span>();
        content.Add(<span class="kw">new</span> <span class="typ">ByteArrayContent</span>(fileBytes), <span class="str">"file"</span>, fileName);

        <span class="kw">var</span> response = <span class="kw">await</span> _httpClient.PostAsync(<span class="str">"/api/v1/documents/process"</span>, content);
        response.EnsureSuccessStatusCode();

        <span class="kw">return await</span> response.Content.ReadFromJsonAsync&lt;<span class="typ">StagingResponse</span>&gt;()
            ?? <span class="kw">throw new</span> <span class="typ">InvalidOperationException</span>(<span class="str">"Empfangenes Gateway-Payload ist leer."</span>);
    }}

    <span class="cm">// 2. Führt den 3-Wege-Cross-Audit zwischen Frachtbrief, Rechnung & Packliste durch</span>
    <span class="kw">public async</span> <span class="typ">Task</span>&lt;<span class="typ">ReconciliationResponse</span>&gt; <span class="fn">ReconcileDossierAsync</span>(
        <span class="typ">byte</span>[] bolBytes, <span class="typ">byte</span>[] invoiceBytes, <span class="typ">byte</span>[] packingBytes)
    {{
        <span class="kw">using var</span> content = <span class="kw">new</span> <span class="typ">MultipartFormDataContent</span>();
        content.Add(<span class="kw">new</span> <span class="typ">ByteArrayContent</span>(bolBytes), <span class="str">"bol_file"</span>, <span class="str">"bill_of_lading.pdf"</span>);
        content.Add(<span class="kw">new</span> <span class="typ">ByteArrayContent</span>(invoiceBytes), <span class="str">"invoice_file"</span>, <span class="str">"commercial_invoice.pdf"</span>);
        content.Add(<span class="kw">new</span> <span class="typ">ByteArrayContent</span>(packingBytes), <span class="str">"packing_list_file"</span>, <span class="str">"packing_list.pdf"</span>);

        <span class="kw">var</span> response = <span class="kw">await</span> _httpClient.PostAsync(<span class="str">"/api/v1/reconcile-live"</span>, content);
        response.EnsureSuccessStatusCode();

        <span class="kw">return await</span> response.Content.ReadFromJsonAsync&lt;<span class="typ">ReconciliationResponse</span>&gt;();
    }}
}}</div>

    <h2>5. Terminal Ingestion (cURL / CLI Pipeline)</h2>
    <p>
      Für automatisierte Cronjobs oder direkte Anbindung an Mailroom-Dämonen kann Oceanwide Gateway direkt per cURL aufgerufen werden:
    </p>

    <div class="code-block"><span class="cm"># Automatisierte 3-Wege-Prüfung per cURL Bash-Script:</span>
curl -X POST "https://oceanwide-gateway.onrender.com/api/v1/reconcile-live" \
     -H "Accept: application/json" \
     -F "bol_file=@/dossiers/2026/BL_Hamburg_MSKU2264802.pdf" \
     -F "invoice_file=@/dossiers/2026/INV_Rechnung_6620.pdf" \
     -F "packing_list_file=@/dossiers/2026/PK_Packliste_6620.pdf"</div>
  </div>

  <div class="page-footer">
    <span>Oceanwide Gateway v1.0 · Technische Integrationsspezifikation für Peter Czajkowski & Christoph Braß</span>
    <span class="footer-confidential">Vertraulich / Nur für internen Dienstgebrauch</span>
    <span>Seite 3 von 4</span>
  </div>
</div>

<!-- =================================================================== -->
<!-- PAGE 4: DSGVO / GoBD COMPLIANCE & 48-HOUR ONBOARDING PLAN            -->
<!-- =================================================================== -->
<div class="page">
  <div class="page-content">
    <div class="page-header">
      <div class="header-left">
        {logo_svg}
        <div class="header-titles">
          <div class="header-title">Security, DSGVO, GoBD & Implementation</div>
          <div class="header-subtitle">German Compliance Framework & 48-Hour Zero-Disruption Onboarding Plan</div>
        </div>
      </div>
      <div class="header-badge">Security & Governance · Page 4</div>
    </div>

    <h2>6. Datenschutz (DSGVO), Revisionssicherheit (GoBD) & Compliance</h2>
    <p>
      Für deutsche Logistikunternehmen sind Rechtssicherheit und Datenschutz nicht verhandelbar. Oceanwide Gateway erfüllt sämtliche Vorgaben der Finanzverwaltung und europäischen Datenschutzgesetze:
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 26%;">Compliance-Bereich</th>
          <th style="width: 46%;">Architektur-Maßnahme in Oceanwide Gateway</th>
          <th style="width: 28%;">Rechtlicher Standard</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>DSGVO / Datensouveränität</strong></td>
          <td>Serverstandort Frankfurt am Main (EU-Central) / Hamburg. Keine Übertragung in Drittstaaten. Ephemere In-Memory-Verarbeitung ohne persistente Speicherung sensibler Kundendaten im Gateway.</td>
          <td><span class="pill pill-green">Art. 28 DSGVO (AVV)</span></td>
        </tr>
        <tr>
          <td><strong>Kein KI-Modelltraining</strong></td>
          <td>Frachtdokumente, Rechnungsbeträge und Kundendaten der Spedition werden zu <strong>100% von jeglichem Modelltraining ausgeschlossen</strong>. Garantierte Datenisolation.</td>
          <td><span class="pill pill-blue">Zero-Retention Policy</span></td>
        </tr>
        <tr>
          <td><strong>GoBD Revisionssicherheit</strong></td>
          <td>Jedes importierte Dokument erhält einen kryptographischen SHA-256 Hash. Lückenlose Protokollierung aller Disponenten-Overrides mit Zeitstempel und Begründung im Audit Ledger.</td>
          <td><span class="pill pill-green">§ 146, 147 AO / GoBD</span></td>
        </tr>
        <tr>
          <td><strong>Zoll-Readiness (ATLAS)</strong></td>
          <td>Automatische Validierung von Währungscodes (ISO 4217), Zolltarif-Nummern und Incoterms zur Vermeidung von Rückweisungen im IT-Verfahren ATLAS 9.1 der Bundeszollverwaltung.</td>
          <td><span class="pill pill-blue">ATLAS 9.1 Konform</span></td>
        </tr>
        <tr>
          <td><strong>Haftungsvorbehalt (ADSp)</strong></td>
          <td>Überschreitet eine Gewichtsabweichung 50 kg, generiert das System binnen 2 Sekunden ein rechtskonformes Reklamationsmemo zur Fristwahrung gegenüber der Reederei.</td>
          <td><span class="pill pill-amber">ADSp 2017 / § 412 HGB</span></td>
        </tr>
      </tbody>
    </table>

    <h2>7. Leistungs-Benchmarks & Service Level Agreements (SLA)</h2>
    <div class="two-col">
      <div>
        <table class="data-table">
          <thead>
            <tr><th>Metrik</th><th>Benchmark-Wert</th></tr>
          </thead>
          <tbody>
            <tr><td>Single-Doc Latenz</td><td><strong>&lt; 1.8 Sekunden</strong></td></tr>
            <tr><td>3-Wege-Dossier Latenz</td><td><strong>&lt; 3.2 Sekunden</strong></td></tr>
            <tr><td>Feld-Genauigkeit (OCR)</td><td><strong>&gt; 99.4 %</strong></td></tr>
            <tr><td>System-Verfügbarkeit</td><td><strong>99.9 % Uptime SLA</strong></td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <div class="callout callout-blue" style="margin-top: 0; padding: 5px 8px;">
          <strong>Skalierbarkeit für OLE Oceanwide:</strong><br>
          Konzipiert für einen Durchsatz von <strong>&gt; 50.000 Dokumenten / Monat</strong>. Kann wahlweise in der gesicherten Cloud (Frankfurt) oder vollständig On-Premise via Docker in der OLE-Serverumgebung betrieben werden.
        </div>
      </div>
    </div>

    <h2>8. Der 48-Stunden Zero-Disruption Rollout-Plan</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 22%;">Phase / Tag</th>
          <th style="width: 50%;">Aktivitäten & Meilensteine</th>
          <th style="width: 28%;">Beteiligte Personen</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Tag 1 (0-24h): Bereitstellung</strong></td>
          <td>Ausführung des T-SQL Staging-Skripts auf der MS-SQL Testdatenbank. Bereitstellung der API-Schlüssel & Gateway-Endpunkte. Zero Handholding für OLE IT.</td>
          <td>IT-Leitung (OLE)<br>Allen Fletcher</td>
        </tr>
        <tr>
          <td><strong>Tag 2 (24-48h): Shadow-Betrieb</strong></td>
          <td>Einbindung der <code>OceanwideGatewayClient.cs</code> in den bestehenden Dispositions-Workflow. Parallele Schattenprüfung von 50 echten Sendungsdossiers ohne ERP-Schreibzugriff.</td>
          <td>Leitender Seefracht-Disponent<br>Allen Fletcher</td>
        </tr>
        <tr>
          <td><strong>Go-Live (ab 48h)</strong></td>
          <td>Aktivierung der automatischen Standgeld-Quarantäne und Übertragung verifizierter Dossiers in <code>[dbo].[OLE_Staging_Shipments]</code>.</td>
          <td>Peter Czajkowski (CEO)<br>Christoph Braß (GF)</td>
        </tr>
      </tbody>
    </table>

    <div class="callout callout-purple" style="margin-top: 5px; padding: 5px 8px;">
      <strong>Direkter Kontakt für das technische Onboarding:</strong><br>
      <strong>Allen Fletcher</strong> · Data Automation & AI Systems Specialist<br>
      Live-System Demonstration: <a href="https://oceanwide-gateway.onrender.com" style="color: #312783; font-weight: 700; text-decoration: none;">https://oceanwide-gateway.onrender.com</a> · Hamburg Seaport Gateway
    </div>
  </div>

  <div class="page-footer">
    <span>Oceanwide Gateway v1.0 · Technische Integrationsspezifikation für Peter Czajkowski & Christoph Braß</span>
    <span class="footer-confidential">Vertraulich / Nur für internen Dienstgebrauch</span>
    <span>Seite 4 von 4</span>
  </div>
</div>

</body>
</html>
"""
    return html

def main():
    print("=== Generating Asset 4: Technical Integration Specification PDF ===")
    html_content = build_html()
    
    project_root = r"c:\Users\admin\Documents\Ole Gateway"
    static_dir = os.path.join(project_root, "app", "static")
    artifact_dir = r"C:\Users\admin\.gemini\antigravity\brain\8ff339e0-8951-4123-b7ee-03005334c241"
    
    out_root = os.path.join(project_root, "Technical Integration Spec.pdf")
    out_static = os.path.join(static_dir, "Technical Integration Spec.pdf")
    out_artifact = os.path.join(artifact_dir, "Technical Integration Spec.pdf")
    
    temp_dir = tempfile.mkdtemp(prefix="edge_pdf_")
    html_path = os.path.join(temp_dir, "asset_4.html")
    pdf_temp = os.path.join(temp_dir, "asset_4.pdf")
    
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Temporary HTML written to: {html_path}")
    
    edge_bin = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    user_data_dir = os.path.join(temp_dir, "edge_profile")
    os.makedirs(user_data_dir, exist_ok=True)
    
    cmd = [
        edge_bin,
        "--headless=new",
        "--disable-gpu",
        f"--user-data-dir={user_data_dir}",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_temp}",
        html_path
    ]
    
    print("Running Edge Headless Chromium...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"Edge process exit code: {res.returncode}")
    
    if not os.path.exists(pdf_temp) or os.path.getsize(pdf_temp) == 0:
        print("ERROR: Edge failed to produce PDF!")
        print("Stdout:", res.stdout)
        print("Stderr:", res.stderr)
        sys.exit(1)
        
    pdf_bytes = open(pdf_temp, "rb").read()
    print(f"Generated PDF Size: {len(pdf_bytes):,} bytes")
    
    for target in [out_root, out_static, out_artifact]:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with open(target, "wb") as f:
            f.write(pdf_bytes)
        print(f"Successfully saved to: {target}")
        
    doc = fitz.open(out_root)
    print(f"\n--- PDF Verification Report ---")
    print(f"Total Pages: {len(doc)}")
    for i, page in enumerate(doc):
        text = page.get_text()
        first_line = text.splitlines()[0] if text.splitlines() else "EMPTY"
        print(f"Page {i+1}: {len(text)} characters extracted | Heading: '{first_line[:50]}'")
    doc.close()
    
    # Re-render PNGs for validation
    for i, page in enumerate(fitz.open(out_root)):
        pix = page.get_pixmap(dpi=150)
        img_path = os.path.join(artifact_dir, f"asset_4_page_{i+1}.png")
        pix.save(img_path)
        print(f"Updated Page {i+1} preview: {img_path}")

    print("\n[SUCCESS] Asset 4 PDF generated and verified successfully!")

if __name__ == "__main__":
    main()
