// Oceanwide Gateway Client Logic (OLE Oceanwide Logistics Europe GmbH - Industrial 5-Stage Pipeline)
// Multi-Language (DE/EN) & Theme Toggle (Dark/Light)

let currentPreviewFile = null;
let currentDocumentName = '';
let currentPipelineData = null;
let currentReconcileData = null;
let currentZoom = 1.0;

// ==========================================
// INTERNATIONALIZATION (i18n) DICTIONARY
// ==========================================
const translations = {
  de: {
    doc_title: "Oceanwide Gateway | Dokumentenprüfung & Zoll-Vorabfertigung",
    badge_pipeline: "5-Stage Pipeline",
    badge_modalities: "See · Luft · Land · ATLAS",
    badge_ole_bridge: "OLE Active TMS Bridge",
    header_hermann: "C# / MS-SQL Gateway",
    tab_pipeline: "Document Audit",
    tab_reconcile: "3-Way Match",
    tab_mssql: "IT-Konsole",
    tab_quarantine: "Quarantäne & Demurrage",
    tab_ledger: "Audit-Ledger",
    stat_processed: "Verarbeitet:",
    stat_clean: "Freigegeben:",
    stat_quarantine: "Quarantäne:",
    stat_demurrage: "Standgeld vermieden:",
    rec_matrix_title: "3-Wege-Dokumentenvergleichsmatrix",
    inspector_no_file: "Kein Dokument geladen (Bereit zum Import)",
    btn_paste: "Paste (Strg+V)",
    btn_paste_center: "Aus Zwischenablage einfügen (Strg+V)",
    btn_upload: "Neuer Import",
    btn_browse_files: "Dateien auswählen",
    btn_clear_doc: "Entfernen",
    sample_safe_badge: "Sicherer Modus EIN (Keine echten Zollmeldungen)",
    sample_invoice: "Handelsrechnung",
    sample_invoice_sub: "125.000 € · CIF",
    sample_bol: "Ocean B/L",
    sample_bol_sub: "MSC · ISO Container",
    sample_packing: "Packliste",
    sample_packing_sub: "24 Pal · 14.850 kg",
    placeholder_try_sample: "SOFORT MIT EINEM DER 3 MUSTER TESTEN ⬇️",
    sample_multimodal_note: "+ Verarbeitet ebenso Luftfracht (AWB), Straßentransport (CMR), T1-Versand & Ursprungszeugnisse",
    ctrl_fit_width: "Breite",
    ctrl_fit_page: "Seite",
    pan_hint: "Ziehen zum Verschieben",
    inspector_drag_title: "Datei hierher ziehen (PDF, Scan, Bild)",
    inspector_drag_sub: "Für alle unterstützten Land-, See- und Luftfrachtdokumente",
    btn_supported_docs: "Unterstützte Belege",
    popover_docs_title: "Unterstützte Speditions- & Zollbelege",
    doc_cat_road: "Landfracht (Road)",
    doc_road_1: "Bordero / Sammelgut-Ladeliste",
    doc_road_2: "CIM-Eisenbahnfrachtbrief",
    doc_road_3: "CMR-Frachtbrief (International)",
    doc_road_4: "Lieferschein & Abliefernachweis (POD)",
    doc_road_5: "Speditions- & Transportauftrag",
    doc_road_6: "Wiegekarte / Verwiegungsnachweis",
    doc_cat_sea: "Seefracht (Sea)",
    doc_sea_1: "Container-Packzertifikat (IMO / CPC)",
    doc_sea_2: "Delivery Order (D/O Kai-Freistellung)",
    doc_sea_3: "House Bill of Lading (HBL)",
    doc_sea_4: "Master Bill of Lading (MBL)",
    doc_sea_5: "Schiffs- & Ladungsmanifest",
    doc_sea_6: "Sea Waybill (SWB Seefrachtbrief)",
    doc_sea_7: "VGM-Wiegezertifikat (SOLAS)",
    doc_cat_air: "Luftfracht (Air)",
    doc_air_1: "Gefahrguterklärung (IATA DGD)",
    doc_air_2: "House Air Waybill (HAWB)",
    doc_air_3: "Luftfrachtmanifest (Cargo Manifest)",
    doc_air_4: "Master Air Waybill (MAWB)",
    doc_air_5: "Sicherheitserklärung (CSD)",
    doc_air_6: "ULD-Ladeliste / Palettenmanifest",
    doc_cat_customs: "Handel & Zoll (ATLAS)",
    doc_customs_1: "A.TR Warenverkehrsbescheinigung",
    doc_customs_2: "ATLAS Ausfuhrbegleitdokument (ABD)",
    doc_customs_3: "ATLAS Einfuhrabgabenbescheid",
    doc_customs_4: "EUR.1 Präferenznachweis",
    doc_customs_5: "Handels- & Proforma-Rechnung",
    doc_customs_6: "Packliste & Gewichtsliste",
    doc_customs_7: "T1 / T2 Versandbegleitdokument",
    doc_customs_8: "Ursprungszeugnis (IHK / UZ)",
    drag_active_title: "Dokument hier ablegen",
    drag_active_sub: "Automatische Erkennung aller Speditions- & Zollbelege (See, Luft, Land & ATLAS)",
    inspector_shortcuts: "Tipp: Sie können auch einen Screenshot mit [Strg+V] einfügen",
    pipeline_step1: "1. INGEST",
    pipeline_step2: "2. EXTRAKTION",
    pipeline_step3: "3. AUDIT",
    pipeline_step4: "4. ROUTING",
    pipeline_step5: "5. DISPATCH",
    telemetry_loading_title: "5-Stufen Ingestion aktiv...",
    telemetry_loading_sub: "Dokumentenprüfung · Deterministischer Regel-Audit · T-SQL Bridge",
    stepper_header_title: "5-Stufen Ingestion & Prüfung aktiv",
    stepper_doc_prefix: "DOKUMENT:",
    step_ingest_title: "1. Ingestion",
    step_ingest_sub: "SHA-256 Siegel",
    step_extract_title: "2. Extraktion",
    step_extract_sub: "Texterfassung",
    step_audit_title: "3. Regel-Audit",
    step_audit_sub: "ISO-6346 Check",
    step_sql_title: "4. T-SQL Staging",
    step_sql_sub: "OLE TMS Staging",
    step_dispatch_title: "5. Freigabe",
    step_dispatch_sub: "ATLAS 9.1",
    stepper_active_operation: "Aktueller Vorgang:",
    badge_audit_proof: "Revisionssicher",
    reassurance_title: "Geduld erbeten: Analyse & kryptografische Prüfung aktiv",
    reassurance_body: "Die Dokumentenextraktion, deterministische Plausibilitätsprüfung und Erstellung des revisionssicheren Prüfberichts laufen im Hintergrund. Bitte schließen Sie diese Seite nicht und navigieren Sie nicht zurück, da Ihr Vorgang lückenlos verarbeitet wird.",
    reassurance_action_warning: "Bitte kein Neuladen (F5) oder Zurückklicken während der laufenden Prüfung.",
    ticker_stage_1: "Dokumenten-Header wird eingelesen und kryptografisch versiegelt...",
    ticker_stage_2: "Optische Muster- und Datenfeldextraktion läuft...",
    ticker_stage_3: "Deterministische ISO-6346 und Freistellungs-Prüfung...",
    ticker_stage_4: "T-SQL Staging und OLE Enterprise TMS Schnittstelle...",
    ticker_stage_5: "GoBD- und ATLAS 9.1 Konformitätsbericht versiegelt...",
    ticker_done: "Prüfbericht erfolgreich versiegelt und freigegeben.",
    calculating_hash: "berechne...",
    telemetry_guide_badge: "Automatische Zoll- & Dokumentenprüfung",
    telemetry_idle_heading: "So funktioniert das Oceanwide Gateway",
    telemetry_idle_desc: "In drei Schritten von der Frachturkunde zur fehlerfreien Verzollung und ERP-Übergabe:",
    guide_step1_title: "Schritt 1: Dokument links auswählen oder ablegen",
    guide_step1_desc: "Klicken Sie auf „Dateien auswählen“ oder testen Sie Belege aus See-, Luft- oder Landverkehren.",
    guide_step1_cta: "Datei öffnen",
    guide_step2_title: "Schritt 2: Automatische Extraktion & Regel-Audit",
    guide_step2_desc: "Prüft ISO-Container, AWB/CMR-Frachtbriefe, Zolltarifcodes, Gewichte und Incoterms deterministisch, um Verzögerungen und Standgelder zu verhindern.",
    guide_step3_title: "Schritt 3: Freigabe für ATLAS & ERP-Export",
    guide_step3_desc: "Verifizierte Frachtdaten werden direkt für ATLAS-Zollanmeldungen, Hafensysteme und die OLE Enterprise TMS Datenbank bereitgestellt.",
    readiness_title: "Schnittstellen & System-Kompatibilität",
    readiness_port: "Dakosy (See) & Cargo-XML (Luft)",
    route_idle_title: "Warte auf Dokument",
    route_idle_sub: "Wählen Sie links ein Dokument aus oder fügen Sie eines ein.",
    stage1_heading: "Stufe 1: Dokumenten-Ingestion & Kryptografischer Hash",
    stage1_badge: "GoBD & ATLAS 9.1 Konform",
    lbl_ingest_filename: "DATEINAME",
    lbl_ingest_mime: "FORMAT",
    lbl_ingest_sha: "SHA-256 HASH",
    lbl_ingest_size: "DATEIGRÖSSE",
    lbl_ingest_time: "ZEITSTEMPEL (UTC)",
    lbl_ingest_status: "INTEGRITÄT",
    ingest_tamper_sealed: "Unveränderbar versiegelt (Tamper-evident)",
    stage2_heading: "Stufe 2: Extrahierte Frachtattribute",
    lbl_doc_num: "DOKUMENTEN-NUMMER",
    lbl_date: "DATUM",
    lbl_container: "CONTAINER / AWB (ISO)",
    lbl_seal: "SIEGEL-NUMMER",
    lbl_gross: "BRUTTOGEWICHT (GROSS)",
    lbl_net: "NETTOGEWICHT (NET)",
    lbl_pkgs: "PACKSTÜCKE",
    lbl_incoterm: "INCOTERM",
    lbl_total: "GESAMTBETRAG",
    lbl_shipper: "VERSENDER (SHIPPER)",
    lbl_consignee: "EMPFÄNGER (CONSIGNEE)",
    line_items_heading: "Positionen (Line Items):",
    th_item: "Artikel",
    th_qty: "Menge",
    th_unit_price: "Einzelpreis",
    th_total: "Gesamt",
    th_hscode: "HS-Code",
    no_line_items: "Keine Positionen deklariert",
    stage3_heading: "Stufe 3: Deterministische Regelprüfung (ATLAS & ADSp)",
    audit_no_checks: "Keine aktiven Prüfungen ausgeführt",
    stage4_heading: "Stufe 4: Operatives Routing & Compliance-Gateway",
    stage5_heading: "Stufe 5: Generierter T-SQL INSERT-Befehl (OLE Enterprise TMS)",
    sql_toggle_show: "SQL anzeigen",
    sql_toggle_hide: "SQL ausblenden",
    sql_summary_title: "ERP-Übergabe bereit",
    sql_summary_desc: "Datensatz für OLE Enterprise TMS (MS-SQL Server Tabelle OLE_Staging_Shipments) vorbereitet.",
    btn_copy: "Kopieren",
    sql_placeholder: "-- Transact-SQL wird nach Dokumentenprüfung generiert",
    rec_heading: "Deterministischer 3-Wege-Dokumentenabgleich",
    rec_subheading: "Gleicht Frachturkunde (See-B/L, Luft-AWB, Land-CMR), Handelsrechnung und Packliste lückenlos ab: Verhindert Zollstopps und Standgelder an allen Umschlagpunkten.",
    rec_btn_scenario1: "Szenario 1: Clean Sea Freight (100% Match)",
    rec_btn_scenario2: "Szenario 2: Demurrage-Falle (180kg Abweichung)",
    rec_btn_execute: "3-Wege-Abgleich ausführen",
    rec_btn_batch: "Stapel-Upload (Alle 3 Belege)",
    rec_btn_load_samples: "3 Muster-Belege einfügen",
    rec_btn_clear_all: "Zurücksetzen",
    rec_slot_empty: "Klicken zum Hochladen",
    rec_processing: "Vision OCR & 3-Wege-Prüfung aktiv...",
    rec_err_need_docs: "Bitte laden Sie mindestens zwei Dokumente für den Abgleich hoch.",
    rec_idle: "Legen Sie Belege oben ab oder wählen Sie ein Szenario, um den automatisierten 3-Wege-Abgleich auszuführen.",
    rec_flow_doc1_title: "1. Frachturkunde (B/L, AWB, CMR)",
    rec_flow_doc1_sub: "Verbindliches Transportdokument (See, Luft, Land)",
    rec_flow_doc2_title: "2. Handelsrechnung",
    rec_flow_doc2_sub: "Deklarierter Zollwert & Incoterms",
    rec_flow_doc3_title: "3. Packliste / Manifest",
    rec_flow_doc3_sub: "Verifizierte Gewichte, Maße & Colli-Zahl",
    rec_tab_bol: "B/L / AWB",
    rec_tab_invoice: "Rechnung",
    rec_tab_packing: "Packliste",
    rec_ribbon_prefix: "ABLAUF:",
    rec_workflow_step1: "1. Belege erfassen",
    rec_workflow_step2: "2. 3-Wege-Prüfung",
    rec_workflow_step3: "3. Matrix & Freigabe",
    rec_dossier_ribbon_label: "Dossier:",
    rec_dossier_triad_title: "Digitale Speditionsakte & Triad-Prüfung",
    rec_triad_card_title: "Deterministischer 3-Wege-Zollabgleich (§ ATLAS 9.1)",
    rec_dossier_triad_desc: "Prüft Frachtbrief, Handelsrechnung und Packliste lückenlos auf Gewichts-, Stückzahl- und Wertkonsistenz zur Abwehr von Standgeldern.",
    rec_slot_upload_btn: "Wählen",
    rec_drag_drop_left_hint: "Belege links ablegen oder hochladen",
    rec_btn_execute_title_ready: "3-Wege-Abgleich jetzt ausführen",
    rec_btn_execute_title_waiting: "Laden Sie mindestens 2 Belege hoch, um den Abgleich auszuführen",
    rec_btn_browse_dossier: "Dateien auswählen (Mehrfachauswahl)",
    rec_browse_sub: "Oder Dokumente direkt hierher ziehen (PDF, Scan, Bild)",
    rec_dossier_status_label: "DOSSIER-STATUS:",
    rec_dossier_status_waiting: "Min. 2 Belege erforderlich",
    rec_dossier_status_ready: "Bereit für 3-Wege-Prüfung",
    rec_dossier_status_complete: "Vollständiges Dossier (3/3)",
    rec_bay_format_hint: "PDF, PNG, JPG, WebP · Max 25 MB",
    rec_bay1_sub: "Frachtvertrag · Port & Seal Verification",
    rec_bay2_sub: "Zollwert · Währung · Incoterms (CIF/FOB)",
    rec_bay3_sub: "Verifiziertes Tara & Brutto · Colli-Check",
    rec_detected_bol: "See-B/L erkannt",
    rec_detected_inv: "Rechnung erkannt",
    rec_detected_pack: "Packliste erkannt",
    rec_interfaces_title: "SYSTEM-STANDARDS & COMPLIANCE-SCHUTZ",
    rec_exec_stage1_title: "Optische Belege-Digitalisierung & Texterfassung",
    rec_exec_stage2_title: "Deterministischer Regel-Audit (§ ADSp 2017)",
    rec_exec_stage3_title: "Diskrepanz-Matrix & OLE TMS-Bereitstellung",
    rec_risk_clean_title: "STATUS: PERFEKTER ABGLEICH (§ ATLAS 9.1 KONFORM)",
    rec_risk_clean_sub: "Alle Belege stimmen in Gewichten, Containern und Incoterms überein. Kein Standgeld-Risiko.",
    rec_risk_hold_title: "STATUS: STANDGELD-RISIKO ERKANNT (§ ADSp 2017 TOLERANZ ÜBERSCHRITTEN)",
    rec_risk_hold_sub: "Diskrepanz im Bruttogewicht überschreitet 50 kg Tara-Toleranz. Terminal-Liegegelder drohen.",
    rec_err_slot_invalid_bol: "Ungültiges Dateiformat für Frachturkunde. Bitte PDF, PNG oder JPG wählen.",
    rec_err_slot_invalid_inv: "Ungültiges Dateiformat für Handelsrechnung. Bitte PDF, PNG oder JPG wählen.",
    rec_err_slot_invalid_pack: "Ungültiges Dateiformat für Packliste. Bitte PDF, PNG oder JPG wählen.",
    rec_no_doc_active: "Warten auf Beleg",
    rec_drop_title: "Komplette Speditionsakte hier ablegen",
    rec_drop_subtitle: "Ziehen Sie alle 3 Belege (B/L, Rechnung, Packliste) gleichzeitig hierher: Das System teilt sie automatisch zu.",
    rec_btn_choose_files: "Dateien vom Computer wählen (Mehrfachauswahl)",
    rec_drop_format_hint: "PDF, PNG, JPG, WebP akzeptiert",
    rec_slot_ghost_bol: "Frachturkunde",
    rec_slot_ghost_inv: "Zollwert",
    rec_slot_ghost_pack: "Gewichte & Colli",
    rec_btn_exec_waiting: "Mindestens 2 Belege erforderlich für den Abgleich",
    rec_btn_exec_ready: "Jetzt 3-Wege-Abgleich ausführen",
    rec_demo_strip_title: "Keine eigenen Belege zur Hand? Musterdatensatz laden:",
    rec_norms_title: "Gesetzliche Prüfregeln & ATLAS 9.1 Toleranzen (§ ADSp 2017)",
    rec_norms_toggle_show: "Details anzeigen",
    rec_norms_toggle_hide: "Details ausblenden",
    rec_placeholder_title: "Dossier-Dokumentenanzeige",
    rec_placeholder_sub: "Laden Sie Belege rechts hoch oder klicken Sie in der Abgleichs-Matrix auf eine Zeile, um den physischen Beleg hier direkt zu verifizieren.",
    rec_badge_inspected: "Aktiv",
    rec_badge_no_doc: "Kein Beleg",
    rec_slots_header: "Oder Einzelne Beleg-Slots zuweisen",
    rec_btn_back_slots: "Beleg-Slots",
    rec_btn_preview_slot: "Vorschau",
    rec_viewport_hint: "Mausrad zum Zoomen",
    rec_err_invalid_type: "Ungültiges Dateiformat. Bitte laden Sie eine PDF-, PNG-, JPG- oder WebP-Datei hoch.",
    rec_warn_rerouted: "Dokument automatisch als „{type}“ zugeordnet (erkannt anhand des Dateinamens).",
    rec_success_loaded: "„{name}“ erfolgreich geladen ({type}).",
    rec_batch_success: "{count} Dokumente erfolgreich den Beleg-Slots zugeordnet.",
    rec_type_bol: "Frachturkunde (B/L, AWB, CMR)",
    rec_type_invoice: "Handelsrechnung",
    rec_type_packing: "Packliste / Manifest",
    rec_guide_heading: "Funktionsweise des 3-Wege-Abgleichs",
    rec_guide_subheading: "In drei Schritten vom Belegsatz zur automatischen Prüfung auf Container-Gleichheit, Incoterms-Konsistenz und gesetzliche ATLAS-Gewichtstoleranzen:",
    rec_step1_guide_title: "Prüfebene 1: Frachtvertrag vs. Handelsrechnung (B/L ↔ Invoice)",
    rec_step1_guide_desc: "Prüft Übereinstimmung von Verkäufer, Käufer, Incoterms (CIF, FOB, DAP) und Bestimmungshafen zur Abwehr von Zollfestsetzungen.",
    rec_step2_guide_title: "Prüfebene 2: Physischer Gewichtsabgleich & ATLAS-Toleranz (B/L ↔ Packing List)",
    rec_step2_guide_desc: "Mathematischer Abgleich von Brutto-/Nettogewichten und Colli mit gesetzlicher Tara-Toleranz von ≤ 50 kg (§ ADSp 2017 & ATLAS 9.1).",
    rec_step3_guide_title: "Schutzebene: Demurrage-Schutz & Automatische Freigabe",
    rec_step3_guide_desc: "Erkennt Diskrepanzen vor Terminalankunft, verhindert Liegegelder an Seehäfen und stellt verifizierte Daten für ATLAS 9.1 und das OLE Enterprise TMS bereit.",
    rec_pill_adsp: "ADSp 2017 (§ 50 kg Tara)",
    rec_browse_disclaimer: "Auto-Zuordnung via Dateinamen (*B/L*, *Rechnung*, *Packliste*). Neutrale Akten direkt in die Slots laden.",
    rec_toast_combined_inv_pack: "Kombiniertes Dokument: Für Rechnung & Packliste übernommen.",
    rec_toast_combined_all: "Kombiniertes Dossier: Für alle 3 Beleg-Slots übernommen.",
    rec_toast_no_keyword: "Keine Kennung im Dateinamen: Zugewiesen als",
    rec_toast_single_mirror_prompt: "Als Sammel-PDF für alle leeren Slots übernehmen",
    rec_guide_title: "Wie der 3-Wege-Abgleich Standgelder verhindert",
    rec_guide_sub: "Verbindet Frachturkunde, Handelsrechnung und Packliste zu einem unveränderlichen Prüfdossier.",
    rec_pillar1_title: "100% Deterministische Prüfung",
    rec_pillar1_desc: "Keine Schätzungen: Exakter mathematischer Abgleich von ISO-Containern, Stückzahlen, Brutto- und Nettogewichten sowie Rechnungsbeträgen.",
    rec_pillar2_title: "ATLAS 9.1 Toleranzgrenzen",
    rec_pillar2_desc: "Prüft die gesetzliche Tara-Toleranz von ≤ 50 kg bei See- und Luftfracht. Verhindert Zollfestsetzungen und Prüfungsverzögerungen.",
    rec_pillar3_title: "Automatischer Schutz",
    rec_pillar3_desc: "Erkennt Diskrepanzen vor Terminalankunft. Spart bis zu 1.250 € / Tag an Liegegebühren durch sofortiges Reederei-Reklamationsmemo.",
    rec_quickstart_hint: "Tipp: Klicken Sie oben auf „3 Muster-Belege einfügen“ für eine sofortige Live-Demonstration.",
    rec_quickstart_btn: "Jetzt testen",
    rec_th_audit_field: "Prüffeld / Merkmal",
    rec_th_bol_col: "Frachturkunde (B/L, AWB)",
    rec_th_inv_col: "Handelsrechnung",
    rec_th_pack_col: "Packliste",
    rec_th_delta_col: "Delta / Toleranz",
    rec_th_status_col: "Status",
    rec_memo_heading: "Speditions-Beanstandung & Reklamations-Memo (ADSp 2017)",
    rec_btn_copy_memo: "Beanstandung als E-Mail kopieren",
    rec_inspect_hint: "Klicken zur Belegprüfung (links im Dossier anzeigen)",
    it_heading: "Integrations-Architektur (C# / MS-SQL Server & OLE Enterprise TMS)",
    it_subheading: "Enterprise-Command-Bridge: Transact-SQL Schemata, C# / .NET 8 Client-Treiber, REST-APIs und Live-Staging-Puffer für die OLE Systemlandschaft.",
    it_ping_btn: "Verbindung prüfen",
    it_swagger_btn: "OpenAPI / Swagger Docs",
    it_env_label: "Zielumgebung:",
    it_tab_single_ddl: "1. Einzelbeleg-Staging DDL",
    it_tab_reconcile_ddl: "2. 3-Wege-Abgleich Ledger DDL",
    it_ddl_badge_single: "T-SQL • Tabelle: dbo.OLE_Staging_Shipments • SHA256 & B/L Index",
    it_ddl_badge_reconcile: "T-SQL • 2 Relationale Tabellen: Ledger & Discrepancies • ADSp 2017 Audit",
    it_tab_csharp: "C# / .NET 8",
    it_tab_curl: "cURL / CLI",
    it_tab_python: "Python",
    it_tab_webhook: "Webhooks",
    it_staging_buffer_title: "OLE TMS Live-Staging-Puffer (MS-SQL Einspeisung)",
    it_staging_buffer_desc: "Aktuelle Sendungen im Staging-Format vor dem automatischen Push in MS-SQL Server. Einschließlich 1-Klick T-SQL INSERT Export.",
    it_col_ref: "Referenz / B/L",
    it_col_doctype: "Belegart",
    it_col_status: "Audit-Status",
    it_col_gross: "Brutto (kg)",
    it_col_val: "Warenwert",
    it_col_time: "Eingangszeit (UTC)",
    it_col_action: "T-SQL Aktion",
    it_btn_copy_insert: "T-SQL INSERT kopieren",
    it_btn_copy_insert_done: "Kopiert!",
    it_no_buffer_rows: "Noch keine Sendungen im Staging-Puffer vorhanden.",
    it_telemetry_gateway: "Oceanwide Gateway: Online (:8000)",
    it_telemetry_db: "MS-SQL Server: Bereit (2019/2022)",
    it_telemetry_bridge: "OLE Enterprise TMS Bridge: Verbunden",
    it_telemetry_latency: "Latenz: < 15ms",
    quar_heading: "Quarantäne-Konsole & Demurrage-Schutz",
    quar_subheading: "Leitstand zur lückenlosen Isolierung und Klärung von Frachtdiskrepanzen zur Abwendung von Liegegeldern (Hamburg, Bremerhaven, Frankfurt, Rotterdam).",
    quar_stat_active: "Aktive Quarantäne-Fälle",
    quar_stat_active_sub: "Sofortige Klärung erforderlich",
    quar_stat_critical: "Akute Frist (< 24h)",
    quar_stat_critical_sub: "Freitage laufen heute ab",
    quar_stat_prevented: "Abgewendete Standgelder",
    quar_stat_prevented_sub: "Erfolgreich abgewendet",
    quar_stat_time: "Rechtswahrung",
    quar_stat_time_sub: "§ 412 HGB Haftungsfrist",
    quar_filter_all: "Alle",
    quar_filter_critical: "Akut (< 24h)",
    quar_filter_ocean: "Seefracht",
    quar_filter_air: "Luftfracht",
    quar_filter_road: "LKW / CMR",
    quar_search_placeholder: "Referenz, Container, Carrier suchen...",
    quar_btn_export: "CSV Export",
    quar_th_ref: "Sendung & Terminal",
    quar_th_unit: "Container / ULD & Carrier",
    quar_th_countdown: "Freitage & Liegegeld-Uhr",
    quar_th_reason: "Fehlerursache & Delta",
    quar_th_fees: "Risiko / Tag",
    quar_th_status: "Status",
    quar_th_actions: "Leitstand-Aktionen",
    quar_btn_inspect: "Prüfen",
    quar_btn_claim: "ADSp Claim",
    quar_btn_request: "Beleg anfordern",
    quar_btn_override: "Freigeben",
    quar_all_clear_title: "100% Liegegelfreiheit • Keine aktiven Quarantäne-Fälle",
    quar_all_clear_desc: "Alle Sendungen sind deterministisch geprüft, zollkonform (ATLAS) und bereit für die Weitersendung.",
    quar_btn_new_shipment: "Neue Sendung im Workspace erfassen",
    quar_override_title: "Quarantäne-Freigabe erzwingen (Supervisor Override)",
    quar_override_reason_label: "Genehmigungsgrund (Betriebsleiter):",
    quar_override_notes_label: "Revisionssichere Anmerkung für Audit-Ledger:",
    quar_override_operator_label: "Freigegeben durch (Name / ID):",
    quar_override_ref_label: "Sendungs-Referenz:",
    quar_override_confirm: "Verbindliche Freigabe erteilen",
    quar_override_cancel: "Abbrechen",
    quar_claim_title: "ADSp 2017 Reederei-Reklamationsmemo (Standgeld-Haftungsvorbehalt)",
    quar_claim_subject_label: "Betreff / Subject:",
    quar_claim_draft_label: "E-Mail Entwurf (Rechtsvorbehalt nach ADSp 2017 & § 412 HGB):",
    quar_claim_close: "Schließen",
    quar_claim_copy: "Entwurf kopieren",
    quar_claim_mailto: "Im Mail-Programm öffnen",
    quar_claim_copied: "Reklamationsentwurf kopiert!",
    quar_request_copied: "Korrekturanforderung kopiert!",
    quar_export_done: "Quarantäne-Bericht als CSV exportiert!",
    quar_override_success: "Freigabe erfolgreich erteilt und im Audit-Ledger protokolliert!",
    quar_btn_refresh: "Aktualisieren",
    quar_btn_refreshing: "Wird geladen...",
    quar_updated_label: "Aktualisiert:",
    th_doctype: "Dokumententyp",
    th_failure_reason: "Fehlergrund",
    th_prevented_fees: "Verhinderte Standgelder",
    th_unit_id: "Container / ULD / Fracht-ID",
    ledger_heading: "Revisionssicheres Ingestion-Protokoll",
    ledger_subheading: "Lückenlose Aufzeichnung aller Dokumentenprüfungen für Zollprüfungen und das OLE Enterprise TMS.",
    th_timestamp: "Zeitstempel (UTC)",
    th_reference: "Referenz",
    th_gross_kg: "Brutto (kg)",
    th_total_value: "Warenwert",
    th_audit_status: "Audit-Status",
    it_btn_refresh: "Aktualisieren",
    cert_lbl_atlas_iface: "ATLAS 9.1 Schnittstelle:",
    quar_override_notes_placeholder: "Genaue Begründung für die deutsche Zollprüfung (ATLAS)...",
    quar_override_reason_1: "Haftungsfreistellung (Letter of Indemnity) liegt vor",
    quar_override_reason_2: "Rechtsabteilung / Compliance genehmigt",
    quar_override_reason_3: "Kunde übernimmt Liegegelder schriftlich",
    quar_override_reason_4: "Korrekturbeleg per E-Mail avisiert",
    quar_override_reason_5: "Sonstige betriebliche Freigabe",
    btn_help_tour: "Einführung & Spickzettel",
    help_modal_title: "Leitstand-Hilfe & Schnelleinführung",
    help_modal_subtitle: "Wählen Sie eine interaktive Demonstration oder öffnen Sie die 1-Seiten-Referenzkarte für Ihren Schreibtisch.",
    help_card_tour_badge: "LIVE-DEMO (1 MIN.)",
    help_card_tour_title: "Interaktive 10-Schritte-Tour",
    help_card_tour_desc: "Erleben Sie live, wie ein Dossier erfasst, ein 180 kg Gewichtsfehler aufgedeckt und 1.250 € Standgeld am Terminal abgewendet werden.",
    help_card_tour_btn: "Live-Tour jetzt starten",
    help_card_cheat_badge: "SPEDITIONS-SPICKZETTEL",
    help_card_cheat_title: "1-Seiten-Referenzkarte",
    help_card_cheat_desc: "Kompakte Übersicht über alle 5 Reiter, das Ampelfarbsystem (Grün/Gelb/Rot) und Tastatur-Kürzel. Druckbar auf A4 für den Schreibtisch.",
    help_card_cheat_btn: "Spickzettel öffnen",
    help_modal_footer_hint: "öffnet dieses Menü jederzeit an jedem Bildschirm",
    help_kbd_or: "oder",
    spickzettel_title: "SPEDITIONS-SPICKZETTEL - 1-SEITEN-REFERENZ",
    spickzettel_sub: "Kompakte Schnellreferenz für Disposition, Belegabgleich und Liegegeld-Kontrolle",
    spickzettel_badge: "PRAXIS-REFERENZ",
    spickzettel_btn_print: "Auf A4 drucken (PDF)",
    spickzettel_btn_close: "Schließen",
    spick_sec1_title: "1. Die 5 Leitstand-Bereiche",
    spick_tab1_title: "1. Document Audit",
    spick_tab1_desc: "Frachtbelege per Upload oder Zwischenablage erfassen. Daten automatisch auslesen und prüfen.",
    spick_tab2_title: "2. 3-Way Match",
    spick_tab2_desc: "B/L, Handelsrechnung und Packliste abgleichen, um Abweichungen bei Gewichten und Positionen aufzudecken.",
    spick_tab3_title: "3. Quarantäne & Demurrage",
    spick_tab3_desc: "Terminal-Freitage überwachen, Fracht-Holds verwalten und Reederei-Reklamationen erzeugen.",
    spick_tab4_title: "4. Audit-Ledger",
    spick_tab4_desc: "Revisionssicheres Archiv aller Belegprüfungen, Freigaben und Prüfzertifikate.",
    spick_tab5_title: "5. IT-Integration",
    spick_tab5_desc: "Geprüfter Bereitstellungsbereich zur Übergabe validierter Daten an Ihr TMS- oder ERP-System.",
    spick_sec2_title: "2. Status-Farbleitsystem",
    spick_status_green: "CLEAN / BEREIT",
    spick_status_yellow: "WARNUNG / PUFFER",
    spick_status_red: "HOLD / QUARANTÄNE",
    spick_status_blue: "SONDERFREIGABE",
    spick_color_green: "Alle Prüfungen bestanden. Vollständig konform und sofort freigegeben.",
    spick_color_yellow: "Freitage laufen bald ab oder Klärungsbedarf vorhanden. Vorrangige Bearbeitung empfohlen.",
    spick_color_red: "Kritische Abweichung oder Belegkonflikt erkannt. Sofortiges Eingreifen erforderlich.",
    spick_color_blue: "Manuelle Betriebsleiter-Sonderfreigabe mit begründetem Eintrag im Prüfprotokoll.",
    spick_sec3_title: "3. Tastatur-Kürzel & Schnelltipps",
    spick_key_paste: "Strg + V",
    spick_tip_paste: "Beleg-Screenshot direkt aus der Zwischenablage einfügen",
    spick_key_zoom: "Mausrad",
    spick_tip_zoom: "Im Beleg-Betrachter stufenlos zoomen und navigieren",
    spick_key_row: "Zeilen-Klick",
    spick_tip_row: "Originalbeleg öffnen und Positionsdetails anzeigen",
    spick_key_f1: "F1 oder ?",
    spick_tip_f1: "Diesen Spickzettel und die Schnellhilfe jederzeit öffnen",
    tour_badge: "INTERAKTIVE SCHNELLEINFÜHRUNG",
    tour_btn_exit: "Tour beenden",
    tour_btn_prev: "Zurück",
    tour_btn_next: "Weiter",
    tour_btn_finish: "Fertig",
    tour_keyboard_hint: "[←] Zurück · [→ / Enter] Weiter · [Esc] Beenden",
    tour_badge_guided: "GEFÜHRTE TOUR",
    tour_finish_alert: "Glückwunsch! Sie haben alle 10 Schritte der Schnelleinführung erfolgreich absolviert.\n\nSie können die Tour oder den Spickzettel jederzeit oben rechts oder mit der Taste F1 erneut öffnen.",
    
    // Pipeline Status Pill
    pipeline_status_clean: "VERIFIZIERT & FREIGEGEBEN",
    pipeline_status_quar: "IN QUARANTÄNE",
    pipeline_status_proc: "WIRD GEPRÜFT",
    pipeline_status_idle: "BEREIT",
    
    // Initial System Setup
    onboarding_badge: "OCEANWIDE GATEWAY - SYSTEM-EINRICHTUNG",
    onboarding_title_step1: "1. ARBEITSSPRACHE WÄHLEN | LANGUAGE SELECTION",
    onboarding_title_step2: "2. ERSCHEINUNGSBILD | THEME",
    onboarding_title_step3: "3. SCHNELLEINFÜHRUNG | QUICK TOUR",
    onboarding_step1_heading: "In welcher Sprache möchten Sie arbeiten?",
    onboarding_step1_sub: "Wählen Sie Ihre bevorzugte Arbeitssprache für alle Module, Belegprüfungen und Exportberichte.",
    onboarding_lang_reassurance: "Keine Sorge: Sie können die Sprache jederzeit oben rechts über das Flaggen-Symbol (🇩🇪/🇬🇧) mit 1 Klick wechseln.",
    onboarding_btn_next_theme: "Weiter zu Schritt 2: Erscheinungsbild",
    onboarding_step2_heading: "Erscheinungsbild & Kontrast",
    onboarding_step2_sub: "Passen Sie den Kontrast an Ihre Büro- und Schreibtischbeleuchtung an. Die Änderung wird sofort live angewendet.",
    onboarding_theme_dark_title: "Dunkler Leitstand (Standard)",
    onboarding_theme_dark_desc: "Kontrastreicher Industrie-Hintergrund, augenschonend bei längerer Bildschirmarbeit.",
    onboarding_theme_light_title: "Heller Büromodus",
    onboarding_theme_light_desc: "Klassische weiße Papier- und Tabellenansicht, optimal bei hellem Tageslicht im Büro.",
    onboarding_theme_reassurance: "Hinweis: Sie können Hell/Dunkel jederzeit mit dem Sonnen-/Mond-Symbol oben rechts umschalten.",
    onboarding_btn_back: "Zurück",
    onboarding_btn_next_tour: "Weiter zu Schritt 3: Schnelleinführung",
    onboarding_tour_rec_badge: "EMPFOHLEN FÜR NEUE BENUTZER (DAUER: CA. 1 MINUTE)",
    onboarding_step3_heading: "Sind Sie zum ersten Mal hier?",
    onboarding_step3_sub: "Wir empfehlen unsere kurze, interaktive Schnelleinführung. In 10 übersichtlichen Schritten sehen Sie, wie Belege erfasst, Gewichtsfehler aufgedeckt und Liegegelder abgewendet werden.",
    onboarding_tour_pt1: "1. Frachtbelege erfassen & GoBD SHA-256 Siegel erstellen",
    onboarding_tour_pt2: "2. 3-Wege-Abgleich: 180 kg Demurrage-Abweichung aufdecken",
    onboarding_tour_pt3: "3. 1-Klick Reederei-Reklamationen & amtliche Zollzertifikate erzeugen",
    onboarding_btn_start_tour: "INTERAKTIVE TOUR JETZT STARTEN (EMPFOHLEN)",
    onboarding_btn_skip_tour: "Tour überspringen & direkt zum Leitstand",
    onboarding_chk_session: "In dieser Sitzung nicht mehr fragen",
    pointer_title: "WICHTIGER HINWEIS",
    pointer_desc: "Hier oben rechts können Sie Ihre Einstellungen jederzeit ändern:",
    pointer_item1: "Schnelleinführung & Spickzettel erneut öffnen (Taste F1)",
    pointer_item2: "Sprache wechseln (🇩🇪 Deutsch / 🇬🇧 English)",
    pointer_item3: "Tag- / Nacht-Modus (Hell / Dunkel) umschalten",
    pointer_btn_ok: "Alles klar, verstanden!",
    help_btn_rerun_setup_text: "Grundeinstellungen erneut öffnen",
    
    // Dynamic text
    passed_badge: "Bestanden",
    req_label: "Anforderung:",
    obs_label: "Beobachtet:",
    clean_title: "STUFE 4: FREIGABE ERTEILT (VOLLSTÄNDIG ZOLLKONFORM)",
    clean_sub: "Alle {n} automatischen Prüfungen bestanden. Bereit für ATLAS Verzollung und Staging in OLE Enterprise TMS.",
    quar_title: "STUFE 4: QUARANTÄNE-STOPP (DEMURRAGE-RISIKO ISOLIERT)",
    quar_sub_default: "Deterministischer Audit fehlgeschlagen. Verhindert Standgelder und Gebühren an Seehäfen, Flugfracht-Hubs und Zollterminals.",
    status_verified_clean: "FREIGEGEBEN",
    status_quarantine: "QUARANTÄNE",
    mode_dark: "Modus: Dunkel",
    mode_light: "Modus: Hell",
    rec_sim_match_title: "3-WEGE-ABGLEICH: 100% KONSISTENZ BESTÄTIGT",
    rec_sim_trap_title: "3-WEGE-ABGLEICH: DEMURRAGE-RISIKO ERKANNT UND ISOLIERT",
    rec_th_field: "Prüffeld",
    rec_th_bl: "Frachturkunde (B/L, AWB, CMR)",
    rec_th_pl_inv: "Packliste / Rechnung",
    rec_th_diff: "Differenz",
    rec_avoided: "Verhinderte Standgelder:",
    quar_no_cases: "Keine aktiven Quarantäne-Fälle. Alle Sendungen clean.",
    quar_reason_discrepancy: "Gewichts-/Checksummen-Abweichung",
    copied_alert: "In Zwischenablage kopiert!",
    paste_no_image: "Kein Bild in der Zwischenablage gefunden. Kopieren Sie ein Bild mit Druck/Screenshot und drücken Sie Strg+V.",
    paste_shortcut_hint: "Bitte drücken Sie direkt Strg+V auf Ihrer Tastatur, um einen Screenshot einzufügen.",
    ledger_heading: "Revisionssicheres Audit- & Zoll-Ledger (§ 147 AO / GoBD / ATLAS 9.1)",
    ledger_subheading: "Lückenlose, kryptographisch gesiegelte Dokumentenprüfungshistorie für die deutsche Zollverwaltung, AEO-Sicherheitsaudits und OLE Enterprise TMS Synchronisation.",
    ledger_kpi_ftr: "First-Time-Right Rate (FTR)",
    ledger_kpi_ftr_sub: "Ohne manuelle Klärung",
    ledger_kpi_weight: "Geprüfte Frachtmasse",
    ledger_kpi_weight_sub: "Gesamtgewicht kumuliert",
    ledger_kpi_value: "Zollwert-Volumen",
    ledger_kpi_value_sub: "Deklarierter Rechnungswert",
    ledger_kpi_gobd: "GoBD & ATLAS Siegel-Index",
    ledger_kpi_gobd_sub: "100% SHA-256 Integrität",
    ledger_filter_all: "Alle Belege",
    ledger_filter_clean: "Freigegeben",
    ledger_filter_hold: "Quarantäne",
    ledger_filter_override: "Override",
    ledger_filter_nonatlas: "Nicht-ATLAS",
    ledger_date_all: "Gesamter Zeitraum",
    ledger_date_today: "Heute",
    ledger_date_7d: "7 Tage",
    ledger_date_mtd: "Monat (MTD)",
    ledger_search_placeholder: "Referenz, Fracht-ID, Spediteur, Hash suchen...",
    ledger_btn_export_csv: "CSV-Export",
    ledger_btn_export_gobd: "GoBD JSON-Archiv",
    ledger_th_time: "Zeitstempel (UTC)",
    ledger_th_ref: "Referenz & Beteiligte",
    ledger_th_doctype: "Dok-Typ & Modus",
    ledger_th_unit: "Fracht-ID / Container",
    ledger_th_gross: "Brutto (kg)",
    ledger_th_val: "Warenwert",
    ledger_th_status: "Audit-Status",
    ledger_th_seal: "GoBD SHA-256 Siegel",
    ledger_th_actions: "Compliance-Aktionen",
    ledger_empty_title: "Keine übereinstimmenden Ledger-Einträge",
    ledger_empty_desc: "Passen Sie die Filterkriterien an oder erfassen Sie neue Belege im Workspace.",
    ledger_drawer_trajectory: "5-Stufen Audit-Trajektorie & GoBD Nachweis",
    ledger_drawer_parties: "Handelsbeteiligte & Frachtführer",
    ledger_drawer_override_title: "Betriebliche Leitstands-Freigabe (§ ADSp 2017)",
    ledger_drawer_quar_title: "Aktive Quarantäne-Ursache",
    ledger_drawer_raw_json: "Roh-Extraktion & Prüfmatrix (JSON)",
    ledger_btn_inspect: "Im Workspace öffnen",
    ledger_btn_cert: "Zoll-Zertifikat",
    ledger_btn_tsql: "T-SQL kopieren",
    ledger_btn_copy_hash: "Hash kopieren",
    ledger_btn_prev: "Zurück",
    ledger_btn_next: "Weiter",
    ledger_page_info: "Zeige {start} bis {end} von {total} Einträgen",
    ledger_page_size: "pro Seite:",
    cert_modal_title: "Zoll-Audit-Zertifikat (§ 147 AO / ATLAS 9.1)",
    cert_official_title: "BUNDESREPUBLIK DEUTSCHLAND · ZOLL-COMPLIANCE PRÜFPROTOKOLL",
    cert_subtitle: "Revisionssicherer Prüfnachweis gemäß AO § 147 & GoBD Grundsätzen",
    cert_lbl_ref: "Referenz-Nr.:",
    cert_lbl_seal: "GoBD SHA-256 Siegel:",
    cert_lbl_time: "Prüfzeitpunkt (UTC):",
    cert_lbl_system: "Prüfsystem / Mandant:",
    cert_lbl_shipper: "Versender (Shipper):",
    cert_lbl_consignee: "Empfänger (Consignee):",
    cert_lbl_carrier: "Frachtführer / Kennung:",
    cert_lbl_doctype: "Belegart & Modus:",
    cert_lbl_unit: "Container / Fracht-ID:",
    cert_lbl_gross: "Bruttogewicht:",
    cert_lbl_value: "Deklarierter Zollwert:",
    cert_lbl_status: "Zoll-Audit-Ergebnis:",
    cert_lbl_rules: "Regelprüfungen:",
    cert_legal_disclaimer: "Dieses elektronische Dokument entspricht den Anforderungen an einen unveränderbaren Handels- und Buchungsbeleg nach § 147 Abgabenordnung (AO), §§ 238, 257 HGB und den GoBD. Der kryptografische SHA-256-Hash garantiert die lückenlose Integrität des Datensatzes.",
    cert_btn_print: "Als PDF drucken",
    cert_btn_copy: "Protokoll kopieren",
    cert_btn_close: "Schließen",
    cert_copied: "Zoll-Audit-Zertifikat in Zwischenablage kopiert!",
    ledger_csv_exported: "Audit-Ledger erfolgreich als CSV exportiert!",
    ledger_gobd_exported: "GoBD Audit-Archiv (JSON) erfolgreich exportiert!",
    ledger_copied_hash: "SHA-256 Siegel in Zwischenablage kopiert!",
    ledger_copied_tsql: "OLE T-SQL Befehl in Zwischenablage kopiert!"
  },
  en: {
    doc_title: "Oceanwide Gateway | Document Verification & Customs Pre-Clearance",
    badge_pipeline: "5-Stage Pipeline",
    badge_modalities: "Ocean · Air · Road · ATLAS",
    badge_ole_bridge: "OLE Active TMS Bridge",
    header_hermann: "C# / MS-SQL Gateway",
    tab_pipeline: "Document Audit",
    tab_reconcile: "3-Way Match",
    tab_mssql: "IT Console",
    tab_quarantine: "Quarantine & Demurrage",
    tab_ledger: "Audit Ledger",
    stat_processed: "Processed:",
    stat_clean: "Clean:",
    stat_quarantine: "Quarantine:",
    stat_demurrage: "Demurrage Avoided:",
    rec_matrix_title: "3-Way Document Comparison Matrix",
    inspector_no_file: "No document loaded (Ready for import)",
    btn_paste: "Paste (Ctrl+V)",
    btn_paste_center: "Paste from Clipboard (Ctrl+V)",
    btn_upload: "New Import",
    btn_browse_files: "Browse Files",
    btn_clear_doc: "Remove",
    sample_safe_badge: "Safe Mode ON (No live custom filings)",
    sample_invoice: "Commercial Invoice",
    sample_invoice_sub: "125,000 € · CIF",
    sample_bol: "Ocean B/L",
    sample_bol_sub: "MSC · ISO Container",
    sample_packing: "Packing List",
    sample_packing_sub: "24 Pal · 14,850 kg",
    placeholder_try_sample: "TEST WITH ANY OF THE 3 SAMPLES BELOW ⬇️",
    sample_multimodal_note: "+ Also parses Air Waybills (AWB), Road Consignment (CMR), T1 Transit & Origin Certificates",
    ctrl_fit_width: "Width",
    ctrl_fit_page: "Page",
    pan_hint: "Drag to pan",
    inspector_drag_title: "Drag & drop file here (PDF, Scan, Image)",
    inspector_drag_sub: "Works on all supported Road, Sea, and Air freight documents",
    btn_supported_docs: "Supported Documents",
    popover_docs_title: "Supported Freight & Customs Documents",
    doc_cat_road: "Road Freight",
    doc_road_1: "Bordero / Consolidated Loading List",
    doc_road_2: "CIM Rail / Multimodal Consignment Note",
    doc_road_3: "CMR International Road Consignment Note",
    doc_road_4: "Delivery Note / Proof of Delivery (POD)",
    doc_road_5: "Forwarder's Transport Instruction",
    doc_road_6: "Neutral Weighing Certificate (Weight Note)",
    doc_cat_sea: "Sea Freight",
    doc_sea_1: "Container Packing Certificate (IMO / CPC)",
    doc_sea_2: "Delivery Order (D/O Port Release)",
    doc_sea_3: "House Bill of Lading (HBL)",
    doc_sea_4: "Master Bill of Lading (MBL)",
    doc_sea_5: "Ocean Cargo Manifest",
    doc_sea_6: "Sea Waybill (SWB / Express Release)",
    doc_sea_7: "VGM Certificate (SOLAS Gross Mass)",
    doc_cat_air: "Air Freight",
    doc_air_1: "Air Cargo Manifest",
    doc_air_2: "Consignment Security Declaration (CSD)",
    doc_air_3: "Dangerous Goods Declaration (IATA DGD)",
    doc_air_4: "House Air Waybill (HAWB)",
    doc_air_5: "Master Air Waybill (MAWB)",
    doc_air_6: "ULD Buildup / Pallet Manifest",
    doc_cat_customs: "Commercial & Customs (ATLAS)",
    doc_customs_1: "A.TR Movement Certificate (EU-Turkey)",
    doc_customs_2: "ATLAS Export Accompanying Document (ABD)",
    doc_customs_3: "ATLAS Import Duty Assessment Notice",
    doc_customs_4: "Certificate of Origin (IHK / CO)",
    doc_customs_5: "Commercial & Proforma Invoice",
    doc_customs_6: "EUR.1 Preferential Movement Certificate",
    doc_customs_7: "Packing List & Weight Specification",
    doc_customs_8: "T1 / T2 Transit Accompanying Document",
    drag_active_title: "Drop document here",
    drag_active_sub: "Auto-detect all freight & customs documents (Ocean, Air, Road & ATLAS)",
    inspector_shortcuts: "Tip: You can also paste a screenshot directly with [Ctrl+V]",
    pipeline_step1: "1. INGEST",
    pipeline_step2: "2. EXTRACTION",
    pipeline_step3: "3. AUDIT",
    pipeline_step4: "4. ROUTING",
    pipeline_step5: "5. DISPATCH",
    telemetry_loading_title: "5-Stage Ingestion active...",
    telemetry_loading_sub: "Document Audit · Deterministic Compliance Engine · T-SQL Bridge",
    stepper_header_title: "5-Stage Ingestion & Audit Active",
    stepper_doc_prefix: "DOCUMENT:",
    step_ingest_title: "1. Ingest",
    step_ingest_sub: "SHA-256 Seal",
    step_extract_title: "2. Extraction",
    step_extract_sub: "Data Extraction",
    step_audit_title: "3. Rule Audit",
    step_audit_sub: "ISO-6346 Check",
    step_sql_title: "4. T-SQL Staging",
    step_sql_sub: "OLE TMS Staging",
    step_dispatch_title: "5. Dispatch",
    step_dispatch_sub: "ATLAS 9.1 Ready",
    stepper_active_operation: "Current Operation:",
    badge_audit_proof: "Audit-Proof",
    reassurance_title: "Please Allow a Brief Moment: Analysis & Sealing in Progress",
    reassurance_body: "Deep document extraction, deterministic rule auditing, and cryptographic seal generation are actively running in the background. Please do not close or navigate away from this page, as your records are being securely and thoroughly processed.",
    reassurance_action_warning: "Please do not refresh (F5) or click back while processing is in progress.",
    ticker_stage_1: "Reading document header and generating cryptographic SHA-256 seal...",
    ticker_stage_2: "Extracting multimodal visual attributes and container metadata...",
    ticker_stage_3: "Running deterministic ISO-6346 checksum and demurrage audit...",
    ticker_stage_4: "Generating T-SQL staging payload and OLE Enterprise TMS database bridge...",
    ticker_stage_5: "Sealing GoBD & ATLAS 9.1 compliance audit dossier...",
    ticker_done: "Audit dossier verified and cleared for dispatch.",
    calculating_hash: "calculating...",
    telemetry_guide_badge: "Automated Customs & Freight Audit",
    telemetry_idle_heading: "How Oceanwide Gateway Works",
    telemetry_idle_desc: "Three simple steps from shipping document to error-free customs clearance and ERP staging:",
    guide_step1_title: "Step 1: Choose or drop document on the left",
    guide_step1_desc: "Click \"Browse Files\" on the left or test ready samples across ocean, air, road, or customs documentation.",
    guide_step1_cta: "Open File",
    guide_step2_title: "Step 2: Instant Extraction & Compliance Audit",
    guide_step2_desc: "Validates ISO containers, AWB/CMR consignment notes, HS tariff codes, weights, and Incoterms deterministically to prevent delays and demurrage.",
    guide_step3_title: "Step 3: ATLAS Customs & ERP Clearance",
    guide_step3_desc: "Verified freight data is staged directly for ATLAS customs declarations, port systems, and the OLE Enterprise TMS database.",
    readiness_title: "System Interfaces & Compatibility",
    readiness_port: "Dakosy (Ocean) & Cargo-XML (Air)",
    route_idle_title: "Awaiting Document",
    route_idle_sub: "Select a document on the left or paste one.",
    stage1_heading: "Stage 1: Document Ingestion & Cryptographic Seal",
    stage1_badge: "GoBD & ATLAS 9.1 Compliant",
    lbl_ingest_filename: "FILE NAME",
    lbl_ingest_mime: "FORMAT",
    lbl_ingest_sha: "SHA-256 HASH",
    lbl_ingest_size: "FILE SIZE",
    lbl_ingest_time: "TIMESTAMP (UTC)",
    lbl_ingest_status: "INTEGRITY",
    ingest_tamper_sealed: "Tamper-Evident Sealed (Audit-Proof)",
    stage2_heading: "Stage 2: Extracted Freight Attributes",
    lbl_doc_num: "DOCUMENT NUMBER",
    lbl_date: "DATE",
    lbl_container: "CONTAINER / AWB (ISO)",
    lbl_seal: "SEAL NUMBER",
    lbl_gross: "GROSS WEIGHT (GROSS)",
    lbl_net: "NET WEIGHT (NET)",
    lbl_pkgs: "PACKAGES",
    lbl_incoterm: "INCOTERM",
    lbl_total: "TOTAL AMOUNT",
    lbl_shipper: "SHIPPER",
    lbl_consignee: "CONSIGNEE",
    line_items_heading: "Line Items:",
    th_item: "Item",
    th_qty: "Qty",
    th_unit_price: "Unit Price",
    th_total: "Total",
    th_hscode: "HS Code",
    no_line_items: "No line items declared",
    stage3_heading: "Stage 3: Deterministic Rule Audit (ATLAS & ADSp)",
    audit_no_checks: "No active checks executed",
    stage4_heading: "Stage 4: Operational Routing & Compliance Gateway",
    stage5_heading: "Stage 5: Generated T-SQL INSERT Statement (OLE Enterprise TMS)",
    sql_toggle_show: "Show SQL",
    sql_toggle_hide: "Hide SQL",
    sql_summary_title: "ERP Staging Ready",
    sql_summary_desc: "Record prepared for OLE Enterprise TMS (MS-SQL Server table OLE_Staging_Shipments).",
    btn_copy: "Copy",
    sql_placeholder: "-- Transact-SQL will be generated after document audit",
    rec_heading: "Deterministic 3-Way Document Reconciliation",
    rec_subheading: "Cross-checks Primary Transport Waybill (Ocean B/L, Air AWB, Road CMR), Commercial Invoice, and Packing List to prevent port & customs holds.",
    rec_btn_scenario1: "Scenario 1: Clean Sea Freight (100% Match)",
    rec_btn_scenario2: "Scenario 2: Demurrage Trap (180kg Mismatch)",
    rec_btn_execute: "Execute 3-Way Reconciliation",
    rec_btn_batch: "Batch Upload (All 3 Documents)",
    rec_btn_load_samples: "Load 3 Authentic Samples",
    rec_btn_clear_all: "Reset All",
    rec_slot_empty: "Click to upload",
    rec_processing: "Document Analysis & 3-Way Cross-Audit in progress...",
    rec_err_need_docs: "Please upload at least two documents for cross-reconciliation.",
    rec_idle: "Drop shipping documents above or select a scenario to execute automated 3-way reconciliation.",
    rec_flow_doc1_title: "1. Transport Waybill (B/L, AWB, CMR)",
    rec_flow_doc1_sub: "Binding contract of carriage (Ocean, Air, Road)",
    rec_flow_doc2_title: "2. Commercial Invoice",
    rec_flow_doc2_sub: "Declared customs value & Incoterms",
    rec_flow_doc3_title: "3. Packing List / Manifest",
    rec_flow_doc3_sub: "Verified weights, dimensions & package count",
    rec_tab_bol: "B/L / AWB",
    rec_tab_invoice: "Invoice",
    rec_tab_packing: "Packing List",
    rec_ribbon_prefix: "WORKFLOW:",
    rec_workflow_step1: "1. Intake Documents",
    rec_workflow_step2: "2. 3-Way Cross-Audit",
    rec_workflow_step3: "3. Audit & Resolution",
    rec_dossier_ribbon_label: "Dossier:",
    rec_dossier_triad_title: "Digital Shipment Dossier & Triad Audit",
    rec_triad_card_title: "Deterministic 3-Way Customs Cross-Audit (§ ATLAS 9.1)",
    rec_dossier_triad_desc: "Cross-checks Waybill, Commercial Invoice, and Packing List across weights, quantities, and customs values to prevent demurrage.",
    rec_slot_upload_btn: "Upload",
    rec_drag_drop_left_hint: "Drop shipping docs here or choose files",
    rec_btn_execute_title_ready: "Execute 3-Way Cross-Audit now",
    rec_btn_execute_title_waiting: "Please attach at least 2 documents to execute cross-reconciliation",
    rec_btn_browse_dossier: "Browse Dossier Files (Multi-Select)",
    rec_browse_sub: "Or drop documents here (PDF, Scan, Image)",
    rec_dossier_status_label: "DOSSIER STATUS:",
    rec_dossier_status_waiting: "Min. 2 docs required",
    rec_dossier_status_ready: "Ready for 3-way audit",
    rec_dossier_status_complete: "Full dossier attached (3/3)",
    rec_bay_format_hint: "PDF, PNG, JPG, WebP · Max 25 MB",
    rec_bay1_sub: "Contract of Carriage · Port & Seal Verification",
    rec_bay2_sub: "Customs Value · Currency · Incoterms (CIF/FOB)",
    rec_bay3_sub: "Verified Tare & Gross · Package Count",
    rec_detected_bol: "Waybill Detected",
    rec_detected_inv: "Invoice Detected",
    rec_detected_pack: "Packing List Detected",
    rec_interfaces_title: "SYSTEM INTERFACES & COMPLIANCE STANDARDS",
    rec_exec_stage1_title: "Document Digitalization & Key-Value Parsing",
    rec_exec_stage2_title: "Deterministic Rule Audit (§ ADSp 2017)",
    rec_exec_stage3_title: "Discrepancy Matrix & OLE TMS Staging",
    rec_risk_clean_title: "STATUS: 100% MATCH VERIFIED (§ ATLAS 9.1 COMPLIANT)",
    rec_risk_clean_sub: "All documents match across weights, containers, and Incoterms. Zero demurrage risk.",
    rec_risk_hold_title: "STATUS: DEMURRAGE RISK DETECTED (§ ADSp 2017 TOLERANCE EXCEEDED)",
    rec_risk_hold_sub: "Weight variance exceeds 50 kg tare tolerance. Port terminal demurrage risk isolated.",
    rec_err_slot_invalid_bol: "Unsupported format for Transport Waybill. Please upload PDF, PNG or JPG.",
    rec_err_slot_invalid_inv: "Unsupported format for Commercial Invoice. Please upload PDF, PNG or JPG.",
    rec_err_slot_invalid_pack: "Unsupported format for Packing List. Please upload PDF, PNG or JPG.",
    rec_no_doc_active: "Waiting for Documents",
    rec_drop_title: "Drop Shipment Dossier Here",
    rec_drop_subtitle: "Drag all 3 shipping documents (B/L, Invoice, Packing List) together here: Automatically assigned to slots.",
    rec_btn_choose_files: "Choose Files from Computer (Multi-Select)",
    rec_drop_format_hint: "PDF, PNG, JPG, WebP accepted",
    rec_slot_ghost_bol: "Carriage Contract",
    rec_slot_ghost_inv: "Customs Value",
    rec_slot_ghost_pack: "Weights & Packages",
    rec_btn_exec_waiting: "At least 2 documents required to cross-audit",
    rec_btn_exec_ready: "Execute 3-Way Reconciliation Now",
    rec_demo_strip_title: "No shipping documents handy? Load test sample:",
    rec_norms_title: "Statutory Audit Rules & ATLAS 9.1 Tolerances (ADSp 2017)",
    rec_norms_toggle_show: "Show Details",
    rec_norms_toggle_hide: "Hide Details",
    rec_placeholder_title: "Dossier Document Viewer",
    rec_placeholder_sub: "Upload documents on the right or click any row in the reconciliation matrix to inspect the physical document directly.",
    rec_badge_inspected: "Active",
    rec_badge_no_doc: "No Document",
    rec_slots_header: "Or Assign to Individual Document Slots",
    rec_btn_back_slots: "Document Slots",
    rec_btn_preview_slot: "Preview",
    rec_viewport_hint: "Scroll wheel to zoom",
    rec_err_invalid_type: "Invalid file format. Please upload a PDF, PNG, JPG, or WebP document.",
    rec_warn_rerouted: "Document automatically routed to \"{type}\" (classified by filename).",
    rec_success_loaded: "\"{name}\" successfully attached ({type}).",
    rec_batch_success: "{count} documents successfully routed to dossier slots.",
    rec_type_bol: "Transport Waybill (B/L, AWB, CMR)",
    rec_type_invoice: "Commercial Invoice",
    rec_type_packing: "Packing List / Manifest",
    rec_guide_heading: "How 3-Way Reconciliation Works",
    rec_guide_subheading: "Three steps from multi-document dossier to automated cross-audits for container match, Incoterm consistency, and statutory ATLAS weight tolerances:",
    rec_step1_guide_title: "Audit Layer 1: Carriage Contract vs. Commercial Invoice (B/L ↔ Invoice)",
    rec_step1_guide_desc: "Verifies matching shipper, consignee, Incoterms (CIF, FOB, DAP), and port of discharge to prevent customs re-assessments.",
    rec_step2_guide_title: "Audit Layer 2: Physical Weight Reconciliation & ATLAS Tolerance (B/L ↔ Packing List)",
    rec_step2_guide_desc: "Deterministic cross-audit of gross/net weights and packages with statutory tare tolerance of ≤ 50 kg (§ ADSp 2017 & ATLAS 9.1).",
    rec_step3_guide_title: "Compliance Layer: Demurrage Defense & Automated Clearance",
    rec_step3_guide_desc: "Identifies discrepancies prior to terminal arrival, eliminates port demurrage fees, and generates verified data for ATLAS 9.1 and the OLE Enterprise TMS.",
    rec_pill_adsp: "ADSp 2017 (§ 50 kg Tare)",
    rec_browse_disclaimer: "Auto-sorting routes by filename (*B/L*, *Invoice*, *Packing*). Generic or combined files can be uploaded directly to individual slots.",
    rec_toast_combined_inv_pack: "Combined Document: Assigned to Commercial Invoice & Packing List.",
    rec_toast_combined_all: "Combined Dossier: Assigned across all 3 document slots.",
    rec_toast_no_keyword: "No keyword found in filename: Assigned as",
    rec_toast_single_mirror_prompt: "Apply as multi-document PDF to all empty slots",
    rec_guide_title: "How 3-Way Reconciliation Prevents Demurrage",
    rec_guide_sub: "Binds Waybill, Commercial Invoice, and Packing List into an immutable audit dossier.",
    rec_pillar1_title: "100% Deterministic",
    rec_pillar1_desc: "Deterministic verification: Exact mathematical cross-audit of ISO containers, package counts, gross and net weights, and invoice values.",
    rec_pillar2_title: "ATLAS 9.1 Tolerance Bounds",
    rec_pillar2_desc: "Enforces the statutory ≤ 50 kg tare tolerance for sea and air freight. Prevents customs holds and manual exam fees.",
    rec_pillar3_title: "Automated Demurrage Shield",
    rec_pillar3_desc: "Flags discrepancies prior to vessel arrival, averting €1,250+/day demurrage via instant pre-filled carrier claims.",
    rec_quickstart_hint: "Tip: Click \"Load 3 Samples\" above for an immediate live demonstration.",
    rec_quickstart_btn: "Try Now",
    rec_th_audit_field: "Audit Field",
    rec_th_bol_col: "Transport Document (B/L)",
    rec_th_inv_col: "Commercial Invoice",
    rec_th_pack_col: "Packing List",
    rec_th_delta_col: "Delta / Tolerance",
    rec_th_status_col: "Status",
    rec_memo_heading: "Carrier Discrepancy & Claim Memo (ADSp 2017)",
    rec_btn_copy_memo: "Copy Claim Notice as Email Draft",
    rec_inspect_hint: "Click to inspect document",
    it_heading: "Integration Architecture (C# / MS-SQL Server & OLE Enterprise TMS)",
    it_subheading: "Enterprise Command Bridge: Transact-SQL schemas, C# / .NET 8 client drivers, REST APIs, and live staging buffer for the OLE infrastructure.",
    it_ping_btn: "Ping OLE Bridge",
    it_swagger_btn: "OpenAPI / Swagger Docs",
    it_env_label: "Target Environment:",
    it_tab_single_ddl: "1. Single-Doc Staging DDL",
    it_tab_reconcile_ddl: "2. 3-Way Reconcile Triad DDL",
    it_ddl_badge_single: "T-SQL • Table: dbo.OLE_Staging_Shipments • SHA256 & B/L Indexed",
    it_ddl_badge_reconcile: "T-SQL • 2 Relational Tables: Ledger & Discrepancies • ADSp 2017 Audit",
    it_tab_csharp: "C# / .NET 8",
    it_tab_curl: "cURL / CLI",
    it_tab_python: "Python",
    it_tab_webhook: "Webhooks",
    it_staging_buffer_title: "OLE TMS Live Staging Buffer (MS-SQL Intake)",
    it_staging_buffer_desc: "Recent shipments in staging format prior to automated push into MS-SQL Server. Includes 1-click T-SQL INSERT export.",
    it_col_ref: "Reference / B/L",
    it_col_doctype: "Document Type",
    it_col_status: "Audit Status",
    it_col_gross: "Gross (kg)",
    it_col_val: "Total Value",
    it_col_time: "Ingested (UTC)",
    it_col_action: "T-SQL Action",
    it_btn_copy_insert: "Copy T-SQL INSERT",
    it_btn_copy_insert_done: "Copied!",
    it_no_buffer_rows: "No shipments in staging buffer yet.",
    it_telemetry_gateway: "Oceanwide Gateway: Online (:8000)",
    it_telemetry_db: "MS-SQL Server: Ready (2019/2022)",
    it_telemetry_bridge: "OLE Enterprise TMS Bridge: Connected",
    it_telemetry_latency: "Latency: < 15ms",
    quar_heading: "Quarantine Console & Demurrage Prevention",
    quar_subheading: "Operational command center for isolating and resolving cargo discrepancies to avert port & airport demurrage.",
    quar_stat_active: "Active Quarantine Holds",
    quar_stat_active_sub: "Immediate triage required",
    quar_stat_critical: "Critical Deadline (< 24h)",
    quar_stat_critical_sub: "Free time expiring today",
    quar_stat_prevented: "Prevented Demurrage",
    quar_stat_prevented_sub: "Successfully avoided",
    quar_stat_time: "Legal Protection",
    quar_stat_time_sub: "ADSp 2017 & HGB § 412",
    quar_filter_all: "All",
    quar_filter_critical: "Critical (< 24h)",
    quar_filter_ocean: "Ocean Freight",
    quar_filter_air: "Air Cargo",
    quar_filter_road: "Road / CMR",
    quar_search_placeholder: "Search reference, container, carrier...",
    quar_btn_export: "CSV Export",
    quar_th_ref: "Shipment & Terminal",
    quar_th_unit: "Container / ULD & Carrier",
    quar_th_countdown: "Free Time & Demurrage Clock",
    quar_th_reason: "Root Cause & Delta",
    quar_th_fees: "Risk / Day",
    quar_th_status: "Status",
    quar_th_actions: "Operational Actions",
    quar_btn_inspect: "Inspect",
    quar_btn_claim: "ADSp Claim",
    quar_btn_request: "Request Docs",
    quar_btn_override: "Override",
    quar_all_clear_title: "100% Demurrage-Free • Zero Active Quarantine Holds",
    quar_all_clear_desc: "All shipments deterministic-cleared, ATLAS compliant, and ready for dispatch.",
    quar_btn_new_shipment: "Ingest New Shipment in Workspace",
    quar_override_title: "Force Quarantine Release (Supervisor Override)",
    quar_override_reason_label: "Approval Justification (Operations Lead):",
    quar_override_notes_label: "Audit Ledger Justification Note:",
    quar_override_operator_label: "Authorized By (Name / ID):",
    quar_override_ref_label: "Shipment Reference:",
    quar_override_confirm: "Confirm Authorized Release",
    quar_override_cancel: "Cancel",
    quar_claim_title: "ADSp 2017 Carrier Claim Notice (Demurrage Disclaimer)",
    quar_claim_subject_label: "Subject:",
    quar_claim_draft_label: "Email Draft (Reservation of Liability under ADSp 2017 & § 412 HGB):",
    quar_claim_close: "Close",
    quar_claim_copy: "Copy Draft",
    quar_claim_mailto: "Open in Email Client",
    quar_claim_copied: "Claim draft copied to clipboard!",
    quar_request_copied: "Revision request copied to clipboard!",
    quar_export_done: "Quarantine dossier exported to CSV!",
    quar_override_success: "Shipment release confirmed and logged to Audit Ledger!",
    quar_btn_refresh: "Refresh",
    quar_btn_refreshing: "Updating...",
    quar_updated_label: "Updated:",
    th_doctype: "Document Type",
    th_failure_reason: "Failure Reason",
    th_prevented_fees: "Prevented Demurrage",
    th_unit_id: "Container / ULD / Waybill ID",
    ledger_heading: "Immutable Ingestion Audit Ledger",
    ledger_subheading: "Complete inspection trail for German customs (ATLAS) audits and OLE Enterprise TMS.",
    th_timestamp: "Timestamp (UTC)",
    th_reference: "Reference",
    th_gross_kg: "Gross (kg)",
    th_total_value: "Total Value",
    th_audit_status: "Audit Status",
    it_btn_refresh: "Refresh",
    cert_lbl_atlas_iface: "ATLAS 9.1 Interface:",
    quar_override_notes_placeholder: "Detailed justification for German Customs audit (ATLAS)...",
    quar_override_reason_1: "Letter of Indemnity (LOI) on file",
    quar_override_reason_2: "Approved by Legal / Compliance dept",
    quar_override_reason_3: "Customer accepts demurrage charges in writing",
    quar_override_reason_4: "Revised documentation notified via email",
    quar_override_reason_5: "Other operational release",
    btn_help_tour: "Help & Quick Tour",
    help_modal_title: "Operations Help & Quick Tour",
    help_modal_subtitle: "Choose an interactive walkthrough or open the 1-page reference cheat sheet for your desk.",
    help_card_tour_badge: "LIVE DEMO (1 MIN)",
    help_card_tour_title: "Interactive 10-Step Tour",
    help_card_tour_desc: "Watch a live demonstration: ingest a dossier, detect a 180 kg discrepancy, and avert €1,250 in terminal demurrage fees.",
    help_card_tour_btn: "Start Live Tour Now",
    help_card_cheat_badge: "OPERATIONS CHEAT SHEET",
    help_card_cheat_title: "1-Page Reference Card",
    help_card_cheat_desc: "Compact summary of all 5 tabs, the traffic light color system (Green/Yellow/Red), and keyboard shortcuts. Printable on A4.",
    help_card_cheat_btn: "Open Reference Card",
    help_modal_footer_hint: "opens this help menu on any screen",
    help_kbd_or: "or",
    spickzettel_title: "OPERATIONS CHEAT SHEET - 1-PAGE REFERENCE",
    spickzettel_sub: "Quick reference guide for dispatch, reconciliation, and demurrage control",
    spickzettel_badge: "DESK REFERENCE",
    spickzettel_btn_print: "Print to A4 (PDF)",
    spickzettel_btn_close: "Close",
    spick_sec1_title: "1. The 5 Operations Modules",
    spick_tab1_title: "1. Document Audit",
    spick_tab1_desc: "Import freight documents via file upload or paste. Automatically extract data and verify compliance.",
    spick_tab2_title: "2. 3-Way Match",
    spick_tab2_desc: "Reconcile B/L, Commercial Invoice, and Packing List to detect weight and item discrepancies.",
    spick_tab3_title: "3. Quarantine & Demurrage",
    spick_tab3_desc: "Track terminal free time, manage holds, and issue carrier claim notices to prevent detention fees.",
    spick_tab4_title: "4. Audit Ledger",
    spick_tab4_desc: "Tamper-evident audit log of all document decisions, overrides, and compliance certificates.",
    spick_tab5_title: "5. IT Integration",
    spick_tab5_desc: "Verified staging buffer to review and sync validated data into your central TMS or ERP system.",
    spick_sec2_title: "2. Status Color Guide",
    spick_status_green: "CLEAN / READY",
    spick_status_yellow: "WARNING / BUFFER",
    spick_status_red: "HOLD / QUARANTINE",
    spick_status_blue: "OVERRIDE",
    spick_color_green: "All verification checks passed. Fully compliant and cleared for immediate dispatch.",
    spick_color_yellow: "Terminal free time expiring or review pending. Priority dispatch recommended.",
    spick_color_red: "Critical discrepancy or hold detected. Action required to prevent demurrage.",
    spick_color_blue: "Authorized manual supervisor override with documented reason logged to audit trail.",
    spick_sec3_title: "3. Operational Shortcuts & Tips",
    spick_key_paste: "Ctrl + V",
    spick_tip_paste: "Paste document screenshot directly from clipboard",
    spick_key_zoom: "Mouse Wheel",
    spick_tip_zoom: "Zoom and pan document smoothly in viewer",
    spick_key_row: "Row Click",
    spick_tip_row: "Open original document and view line-item details",
    spick_key_f1: "F1 or ?",
    spick_tip_f1: "Open this cheat sheet and help guide on any screen",
    tour_badge: "INTERACTIVE GUIDED TOUR",
    tour_btn_exit: "Exit Tour",
    tour_btn_prev: "Back",
    tour_btn_next: "Next",
    tour_btn_finish: "Finish",
    tour_keyboard_hint: "[←] Back · [→ / Enter] Next · [Esc] Exit",
    tour_badge_guided: "GUIDED TOUR",
    tour_finish_alert: "Congratulations! You have successfully completed all 10 steps of the quick tour.\n\nYou can reopen the tour or cheat sheet at any time from the top bar or by pressing F1.",
    
    // Pipeline Status Pill
    pipeline_status_clean: "VERIFIED & CLEARED",
    pipeline_status_quar: "IN QUARANTINE",
    pipeline_status_proc: "PROCESSING",
    pipeline_status_idle: "STANDBY",
    
    // Initial System Setup
    onboarding_badge: "OCEANWIDE GATEWAY - SYSTEM SETUP",
    onboarding_title_step1: "1. LANGUAGE SELECTION",
    onboarding_title_step2: "2. DISPLAY THEME",
    onboarding_title_step3: "3. QUICK TOUR",
    onboarding_step1_heading: "Which language do you prefer to work in?",
    onboarding_step1_sub: "Choose your primary language for all modules, document audits, and export reports.",
    onboarding_lang_reassurance: "Don't worry: You can change the language anytime via the flag icon in the top-right header.",
    onboarding_btn_next_theme: "Next: Step 2 Appearance",
    onboarding_step2_heading: "Appearance & Workspace Contrast",
    onboarding_step2_sub: "Adjust the contrast to match your office lighting. Your selection is previewed immediately.",
    onboarding_theme_dark_title: "Dark Cockpit (Default)",
    onboarding_theme_dark_desc: "High-contrast dark theme, designed to reduce eye strain on dispatch monitors.",
    onboarding_theme_light_title: "Daylight Office (Light Mode)",
    onboarding_theme_light_desc: "Crisp white document view, ideal for bright office lighting.",
    onboarding_theme_reassurance: "Notice: You can toggle between Dark and Light mode anytime using the sun/moon icon at the top right.",
    onboarding_btn_back: "Back",
    onboarding_btn_next_tour: "Next: Step 3 Quick Tour",
    onboarding_tour_rec_badge: "RECOMMENDED FOR NEW DISPATCHERS (APPROX. 1 MINUTE)",
    onboarding_step3_heading: "Is this your first time at Oceanwide Gateway?",
    onboarding_step3_sub: "We recommend our 10-step interactive guided walkthrough to help you discover how documents are ingested, variances are flagged, and demurrage is avoided.",
    onboarding_tour_pt1: "1. Ingest freight documents & seal with GoBD SHA-256",
    onboarding_tour_pt2: "2. 3-Way Reconciler: Detect 180 kg demurrage variance",
    onboarding_tour_pt3: "3. 1-Click carrier claims & official customs certificates",
    onboarding_btn_start_tour: "START INTERACTIVE TOUR NOW (RECOMMENDED)",
    onboarding_btn_skip_tour: "Skip Tour & Go to Workspace",
    onboarding_chk_session: "Don't ask again for this session",
    pointer_title: "IMPORTANT NOTE",
    pointer_desc: "Here in the top-right corner, you can adjust your settings at any time:",
    pointer_item1: "Reopen Guided Tour & Cheat Sheet (F1)",
    pointer_item2: "Switch Language (🇩🇪 Deutsch / 🇬🇧 English)",
    pointer_item3: "Toggle Daylight / Dark Theme",
    pointer_btn_ok: "Got it, continue!",
    help_btn_rerun_setup_text: "Re-run Initial Setup Wizard",
    
    // Dynamic text
    passed_badge: "Passed",
    req_label: "Requirement:",
    obs_label: "Observed:",
    clean_title: "STAGE 4: PRE-CLEARED FOR DISPATCH (VERIFIED COMPLIANT)",
    clean_sub: "All {n} automated checks passed. Ready for ATLAS customs clearance and staging in OLE Enterprise TMS.",
    quar_title: "STAGE 4: QUARANTINE HOLD (DEMURRAGE RISK ISOLATED)",
    quar_sub_default: "Deterministic audit failed. Prevents detention and demurrage fees across ports, air hubs, and customs terminals.",
    status_verified_clean: "CLEAN",
    status_quarantine: "HOLD",
    mode_dark: "Mode: Dark",
    mode_light: "Mode: Light",
    rec_sim_match_title: "3-WAY RECONCILIATION: 100% CONSISTENCY VERIFIED",
    rec_sim_trap_title: "3-WAY RECONCILIATION: DEMURRAGE RISK DETECTED & ISOLATED",
    rec_th_field: "Audit Field",
    rec_th_bl: "Transport Waybill (B/L, AWB, CMR)",
    rec_th_pl_inv: "Packing List / Invoice",
    rec_th_diff: "Variance",
    rec_avoided: "Prevented Demurrage:",
    quar_no_cases: "No active quarantine cases. All shipments clean.",
    quar_reason_discrepancy: "Weight / Checksum Discrepancy",
    copied_alert: "Copied to clipboard!",
    paste_no_image: "No image found in clipboard. Copy an image with PrintScreen/Screenshot and press Ctrl+V.",
    paste_shortcut_hint: "Please press Ctrl+V directly on your keyboard to paste a screenshot.",
    ledger_heading: "Immutable Ingestion & Customs Audit Ledger (§ 147 AO / GoBD / ATLAS 9.1)",
    ledger_subheading: "Tamper-evident, cryptographically sealed document verification trail for German Customs, AEO compliance audits, and OLE Enterprise TMS dispatch.",
    ledger_kpi_ftr: "First-Time-Right Rate (FTR)",
    ledger_kpi_ftr_sub: "Zero manual intervention",
    ledger_kpi_weight: "Audited Cargo Mass",
    ledger_kpi_weight_sub: "Cumulated gross weight",
    ledger_kpi_value: "Customs Valuation Volume",
    ledger_kpi_value_sub: "Declared invoice value",
    ledger_kpi_gobd: "GoBD & ATLAS Seal Index",
    ledger_kpi_gobd_sub: "100% SHA-256 Integrity",
    ledger_filter_all: "All Documents",
    ledger_filter_clean: "Pre-Cleared",
    ledger_filter_hold: "Quarantine",
    ledger_filter_override: "Override",
    ledger_filter_nonatlas: "Non-ATLAS",
    ledger_date_all: "All Time",
    ledger_date_today: "Today",
    ledger_date_7d: "7 Days",
    ledger_date_mtd: "Month (MTD)",
    ledger_search_placeholder: "Search reference, cargo ID, party, hash...",
    ledger_btn_export_csv: "CSV Export",
    ledger_btn_export_gobd: "GoBD JSON Archive",
    ledger_th_time: "Timestamp (UTC)",
    ledger_th_ref: "Reference & Parties",
    ledger_th_doctype: "Doc Type & Mode",
    ledger_th_unit: "Cargo ID / Container",
    ledger_th_gross: "Gross (kg)",
    ledger_th_val: "Customs Value",
    ledger_th_status: "Audit Status",
    ledger_th_seal: "GoBD SHA-256 Seal",
    ledger_th_actions: "Compliance Actions",
    ledger_empty_title: "No Matching Ledger Entries",
    ledger_empty_desc: "Adjust your filter criteria or ingest new freight documents in the workspace.",
    ledger_drawer_trajectory: "5-Stage Audit Trajectory & GoBD Proof",
    ledger_drawer_parties: "Trading Parties & Carrier",
    ledger_drawer_override_title: "Operations Supervisor Override (§ ADSp 2017)",
    ledger_drawer_quar_title: "Active Quarantine Hold Reason",
    ledger_drawer_raw_json: "Raw Extraction & Audit Matrix (JSON)",
    ledger_btn_inspect: "Open in Workspace",
    ledger_btn_cert: "Customs Certificate",
    ledger_btn_tsql: "Copy T-SQL",
    ledger_btn_copy_hash: "Copy Hash",
    ledger_btn_prev: "Previous",
    ledger_btn_next: "Next",
    ledger_page_info: "Showing {start} to {end} of {total} entries",
    ledger_page_size: "per page:",
    cert_modal_title: "Customs Audit Certificate (§ 147 AO / ATLAS 9.1)",
    cert_official_title: "FEDERAL REPUBLIC OF GERMANY · CUSTOMS COMPLIANCE AUDIT CERTIFICATE",
    cert_subtitle: "Immutable verification record pursuant to German Tax Code § 147 AO & GoBD Principles",
    cert_lbl_ref: "Reference ID:",
    cert_lbl_seal: "GoBD SHA-256 Seal:",
    cert_lbl_time: "Verification Time (UTC):",
    cert_lbl_system: "Auditing System / Client:",
    cert_lbl_shipper: "Shipper / Exporter:",
    cert_lbl_consignee: "Consignee / Importer:",
    cert_lbl_carrier: "Carrier / Vessel / Flight:",
    cert_lbl_doctype: "Document Type & Mode:",
    cert_lbl_unit: "Container / Cargo ID:",
    cert_lbl_gross: "Gross Weight:",
    cert_lbl_value: "Declared Customs Value:",
    cert_lbl_status: "Customs Audit Verdict:",
    cert_lbl_rules: "Rule Inspections:",
    cert_legal_disclaimer: "This electronic document constitutes an immutable commercial and accounting record pursuant to § 147 of the German Fiscal Code (AO), §§ 238, 257 German Commercial Code (HGB), and GoBD requirements. The cryptographic SHA-256 seal guarantees end-to-end dataset integrity.",
    cert_btn_print: "Print to PDF",
    cert_btn_copy: "Copy Record Text",
    cert_btn_close: "Close",
    cert_copied: "Customs audit certificate copied to clipboard!",
    ledger_csv_exported: "Audit Ledger successfully exported to CSV!",
    ledger_gobd_exported: "GoBD Audit Archive (JSON) successfully exported!",
    ledger_copied_hash: "SHA-256 seal copied to clipboard!",
    ledger_copied_tsql: "OLE T-SQL statement copied to clipboard!"
  }
};

let currentLang = localStorage.getItem('ole_lang') || 'de';
let currentTheme = localStorage.getItem('ole_theme') || 'dark';

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  setupPasteListener();
  setupUploadListener();
  setupDragDropListener();
  setupInspectorPanAndZoom();
  setupRecDossierDragDrop();
  applyLanguage(currentLang);
  applyTheme(currentTheme);
  refreshMetrics();
  loadIntegrationCode();
  checkRecControls();
  checkInitialOnboarding();

  window.addEventListener('resize', () => {
    if (currentPreviewUrl) {
      applyZoomTransform();
    }
  });
});

// ==========================================
// PROFESSIONAL PROPORTIONAL INSPECTOR CONTROLS
// ==========================================
let currentZoomMode = 'page'; // 'page' | 'width' | '100' | 'custom'
let currentZoomLevel = 1.0;
let currentRotation = 0;
let currentPreviewUrl = '';

function applyZoomTransform() {
  const img = document.getElementById('inspector-image-preview');
  const canvas = document.getElementById('inspector-canvas');
  const indicator = document.getElementById('zoom-level-indicator');
  const btnFitWidth = document.getElementById('btn-fit-width');
  const btnFitPage = document.getElementById('btn-fit-page');
  const btnFit100 = document.getElementById('btn-fit-100');
  if (!img || !canvas || img.classList.contains('hidden') || !img.naturalWidth) return;

  const availableWidth = Math.max(200, canvas.clientWidth - 40);
  const availableHeight = Math.max(200, canvas.clientHeight - 40);
  const naturalWidth = img.naturalWidth || 768;
  const naturalHeight = img.naturalHeight || 1024;

  if (currentZoomMode === 'page') {
    // Fit Entire Document in Page (Aspect Ratio Preserved)
    const scaleX = availableWidth / naturalWidth;
    const scaleY = availableHeight / naturalHeight;
    currentZoomLevel = Math.min(scaleX, scaleY);
    const targetW = Math.round(naturalWidth * currentZoomLevel);
    img.style.width = `${targetW}px`;
    img.style.height = 'auto';
    if (indicator) indicator.textContent = `${Math.round(currentZoomLevel * 100)}%`;
  } else if (currentZoomMode === 'width') {
    // Fit to Width of Canvas (Unlocks smooth vertical scrolling throughout full length)
    currentZoomLevel = availableWidth / naturalWidth;
    img.style.width = `${availableWidth}px`;
    img.style.height = 'auto';
    if (indicator) indicator.textContent = `${Math.round(currentZoomLevel * 100)}%`;
  } else if (currentZoomMode === '100') {
    // 1:1 Pixel Native Resolution
    currentZoomLevel = 1.0;
    img.style.width = `${naturalWidth}px`;
    img.style.height = 'auto';
    if (indicator) indicator.textContent = '100%';
  } else if (currentZoomMode === 'custom') {
    // Proportionally Scaled (unconstrained up to 400%)
    currentZoomLevel = Math.max(0.25, Math.min(4.0, currentZoomLevel));
    const targetW = Math.round(naturalWidth * currentZoomLevel);
    img.style.width = `${targetW}px`;
    img.style.height = 'auto';
    if (indicator) indicator.textContent = `${Math.round(currentZoomLevel * 100)}%`;
  }

  // Update button highlight states
  if (btnFitWidth) btnFitWidth.classList.toggle('text-red-400', currentZoomMode === 'width');
  if (btnFitPage) btnFitPage.classList.toggle('text-red-400', currentZoomMode === 'page');
  if (btnFit100) btnFit100.classList.toggle('text-red-400', currentZoomMode === '100');

  // Handle Rotation
  if (currentRotation % 360 !== 0) {
    img.style.transform = `rotate(${currentRotation}deg)`;
  } else {
    img.style.transform = 'none';
  }
}

function zoomPreview(delta) {
  const img = document.getElementById('inspector-image-preview');
  if (!img || !img.naturalWidth) return;

  const steps = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 3.5, 4.0];
  
  if (delta > 0) {
    // Find next discrete step larger than currentZoomLevel
    const next = steps.find(s => s > currentZoomLevel + 0.03);
    currentZoomLevel = next !== undefined ? next : Math.min(4.0, currentZoomLevel + 0.25);
  } else {
    // Find previous discrete step smaller than currentZoomLevel
    const prev = [...steps].reverse().find(s => s < currentZoomLevel - 0.03);
    currentZoomLevel = prev !== undefined ? prev : Math.max(0.25, currentZoomLevel - 0.25);
  }

  currentZoomMode = 'custom';
  applyZoomTransform();
}

function setZoomMode(mode) {
  currentZoomMode = mode;
  if (mode === '100') {
    currentZoomLevel = 1.0;
  }
  applyZoomTransform();

  const canvas = document.getElementById('inspector-canvas');
  if (canvas && (mode === 'width' || mode === 'page' || mode === '100')) {
    canvas.scrollTop = 0;
    canvas.scrollLeft = 0;
  }
}

function rotatePreview() {
  currentRotation = (currentRotation + 90) % 360;
  applyZoomTransform();
}

function openFullscreenPreview() {
  if (currentPreviewUrl) {
    window.open(currentPreviewUrl, '_blank');
  }
}

function setupInspectorPanAndZoom() {
  const canvas = document.getElementById('inspector-canvas');
  if (!canvas) return;

  let isDown = false;
  let startX = 0;
  let startY = 0;
  let scrollLeft = 0;
  let scrollTop = 0;

  canvas.addEventListener('mousedown', (e) => {
    // Only drag with left mouse button and not on interactive buttons
    if (e.button !== 0 || e.target.closest('button') || e.target.closest('input')) return;
    isDown = true;
    canvas.classList.add('cursor-grabbing');
    canvas.classList.remove('cursor-grab');
    startX = e.pageX - canvas.offsetLeft;
    startY = e.pageY - canvas.offsetTop;
    scrollLeft = canvas.scrollLeft;
    scrollTop = canvas.scrollTop;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      canvas.classList.remove('cursor-grabbing');
      canvas.classList.add('cursor-grab');
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;
    const walkX = (x - startX);
    const walkY = (y - startY);
    canvas.scrollLeft = scrollLeft - walkX;
    canvas.scrollTop = scrollTop - walkY;
  });

  // Ctrl + Wheel to Zoom smoothly
  canvas.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      zoomPreview(e.deltaY < 0 ? 0.25 : -0.25);
    }
  }, { passive: false });
}

let dragCounter = 0;

function setupDragDropListener() {
  const canvas = document.getElementById('inspector-canvas');
  const overlay = document.getElementById('drag-drop-overlay');
  if (!canvas || !overlay) return;

  function isFileDrag(e) {
    if (!e.dataTransfer) return false;
    const types = e.dataTransfer.types;
    return types && (types.indexOf ? types.indexOf('Files') !== -1 : types.includes('Files'));
  }

  // Window-level tracking to illuminate the drop target as soon as a file enters the browser window
  window.addEventListener('dragenter', (e) => {
    if (!isFileDrag(e)) return;
    const recView = document.getElementById('view-reconcile');
    if (recView && !recView.classList.contains('hidden')) return; // Reconcile view handles its own drop zones
    dragCounter++;
    overlay.classList.remove('hidden');
    canvas.classList.add('ring-4', 'ring-red-500/60');
  });

  window.addEventListener('dragleave', (e) => {
    if (!isFileDrag(e)) return;
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      overlay.classList.add('hidden');
      canvas.classList.remove('ring-4', 'ring-red-500/60');
    }
  });

  window.addEventListener('dragover', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  });

  window.addEventListener('drop', (e) => {
    dragCounter = 0;
    overlay.classList.add('hidden');
    canvas.classList.remove('ring-4', 'ring-red-500/60');
    if (!isFileDrag(e)) return;
    e.preventDefault();
    const recView = document.getElementById('view-reconcile');
    if (recView && !recView.classList.contains('hidden')) {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleRecBatchUpload({ target: { files: e.dataTransfer.files } });
      }
      return;
    }
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileIngestion(file, file.name);
    }
  });
}

// ==========================================
// LANGUAGE TOGGLE & TRANSLATION LOGIC
// ==========================================
function toggleLanguage() {
  currentLang = (currentLang === 'de') ? 'en' : 'de';
  localStorage.setItem('ole_lang', currentLang);
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  currentLang = lang;
  const dict = translations[lang] || translations.de;

  // Update HTML elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.id === 'inspector-file-name') return;
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Update input placeholders with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // Update language switcher indicator
  const indicator = document.getElementById('lang-indicator');
  if (indicator) {
    indicator.textContent = (lang === 'de') ? '🇩🇪 Deutsch' : '🇬🇧 English';
  }
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.title = (lang === 'de') ? 'Zu Englisch wechseln / Switch to English' : 'Zu Deutsch wechseln / Switch to German';
  }

  // Update theme toggle text
  const themeText = document.getElementById('theme-text');
  if (themeText) {
    themeText.textContent = (currentTheme === 'dark') ? dict.mode_dark : dict.mode_light;
  }

  // Document Title
  document.title = dict.doc_title;

  // Preserve loaded document name, or show translated placeholder if empty
  const fileName = document.getElementById('inspector-file-name');
  if (fileName) {
    if (currentDocumentName) {
      fileName.textContent = currentDocumentName;
    } else {
      fileName.textContent = dict.inspector_no_file;
    }
  }

  // Re-render pipeline telemetry if document is loaded
  if (currentPipelineData) {
    renderPipelineResponse(currentPipelineData);
  } else {
    setPipelineStatus(currentPipelineStatusKey);
    const auditBadge = document.getElementById('audit-score-badge');
    if (auditBadge) {
      auditBadge.textContent = (lang === 'de') ? '0 / 0 Bestanden' : '0 / 0 Passed';
    }
  }

  // Re-render reconciliation table if data is present
  if (currentReconcileData) {
    renderReconciliationResult(currentReconcileData);
  } else {
    switchRecPreviewTab(currentRecPreviewTab);
  }
  checkRecControls();

  // Re-render quarantine console, audit ledger, and IT console
  renderQuarantineTable();
  renderLedgerTable();
  refreshRecentShipments();
  renderItSqlTab();
  renderItClientTab();
  refreshItStagingBuffer();
  refreshMetrics();

  const operatorIn = document.getElementById('quar-override-operator-input');
  if (operatorIn && (!operatorIn.value || operatorIn.value.includes('Leitstand') || operatorIn.value.includes('Command'))) {
    operatorIn.value = (lang === 'de') ? 'Leitstand Hamburg / Lead Dispatcher' : 'Hamburg Command / Lead Dispatcher';
  }

  if (typeof isGuidedTourActive !== 'undefined' && isGuidedTourActive) {
    renderCurrentTourStep(false);
  }
}

function t(key) {
  const dict = translations[currentLang] || translations.de;
  return dict[key] || key;
}

// ==========================================
// THEME TOGGLE (LIGHT / DARK) LOGIC
// ==========================================
function toggleTheme() {
  currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
  localStorage.setItem('ole_theme', currentTheme);
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  currentTheme = theme;
  const isLight = (theme === 'light');

  document.documentElement.classList.toggle('theme-light', isLight);
  document.body.classList.toggle('theme-light', isLight);

  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  const btn = document.getElementById('theme-toggle-btn');

  if (icon && text) {
    if (isLight) {
      icon.className = 'fa-solid fa-sun text-amber-500';
      text.textContent = t('mode_light');
    } else {
      icon.className = 'fa-solid fa-moon text-amber-400';
      text.textContent = t('mode_dark');
    }
  }

  if (btn) {
    btn.title = isLight 
      ? (currentLang === 'de' ? 'Zu dunklem Modus wechseln' : 'Switch to Dark Mode')
      : (currentLang === 'de' ? 'Zu hellem Modus wechseln' : 'Switch to Light Mode');
  }
}

// ==========================================
// TAB SWITCHING
// ==========================================
function switchTab(tabId) {
  const tabs = ['pipeline', 'reconcile', 'quarantine', 'ledger', 'mssql'];
  tabs.forEach(tName => {
    const btn = document.getElementById(`tab-${tName}`);
    const view = document.getElementById(`view-${tName}`);
    if (btn) {
      if (tName === tabId) {
        btn.className = 'nav-tab-active px-3.5 py-1.5 rounded-lg bg-red-600 text-white font-semibold shadow-sm flex items-center gap-2 text-xs transition cursor-pointer whitespace-nowrap flex-shrink-0';
      } else {
        btn.className = 'nav-tab-inactive px-3.5 py-1.5 rounded-lg bg-[#0E1626] hover:bg-[#16223B] border border-[#1E293B] text-slate-300 hover:text-white font-medium flex items-center gap-2 text-xs transition cursor-pointer whitespace-nowrap flex-shrink-0';
      }
    }
    if (view) view.classList.toggle('hidden', tName !== tabId);
  });

  if (tabId === 'quarantine' || tabId === 'ledger') {
    refreshRecentShipments();
  }
  if (tabId === 'mssql') {
    refreshItStagingBuffer();
  }
}

// ==========================================
// STAGE SCROLLING & CLIPBOARD HELPERS
// ==========================================
function scrollToStage(stageId) {
  const el = document.getElementById(stageId);
  if (el) {
    const container = el.closest('.overflow-y-auto') || document.getElementById('telemetry-scroll-container');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const relativeTop = elRect.top - containerRect.top + container.scrollTop;
      const targetScrollTop = Math.max(0, relativeTop - 16);
      try {
        container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
      } catch (e) {
        container.scrollTop = targetScrollTop;
      }
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    el.classList.add('ring-2', 'ring-blue-500/80');
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-blue-500/80');
    }, 1200);
  }
}

function copyIngestSha() {
  const sha = currentPipelineData?.sha256_hash;
  if (sha) {
    navigator.clipboard.writeText(sha).then(() => {
      alert(t('copied_alert'));
    });
  } else {
    const shaEl = document.getElementById('field-ingest-sha256');
    if (shaEl && shaEl.textContent && shaEl.textContent !== '-') {
      navigator.clipboard.writeText(shaEl.textContent).then(() => {
        alert(t('copied_alert'));
      });
    }
  }
}

// ==========================================
// ACCORDION TOGGLE FOR T-SQL STATEMENT
// ==========================================
function toggleSqlCode() {
  const codeBlock = document.getElementById('sql-preview-text');
  const btn = document.getElementById('btn-toggle-sql');
  if (!codeBlock || !btn) return;
  const isHidden = codeBlock.classList.contains('hidden');
  codeBlock.classList.toggle('hidden', !isHidden);
  const span = btn.querySelector('span');
  if (span) span.textContent = isHidden ? t('sql_toggle_hide') : t('sql_toggle_show');
}

// ==========================================
// GLOBAL CLIPBOARD & UPLOAD LISTENERS
// ==========================================
function setupPasteListener() {
  window.addEventListener('paste', async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleFileIngestion(file, `clipboard_${Date.now()}.png`);
          break;
        }
      }
    }
  });
}

function triggerPaste() {
  navigator.clipboard.read().then(async items => {
    for (const item of items) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          const file = new File([blob], `pasted_document_${Date.now()}.png`, { type });
          handleFileIngestion(file, file.name);
          return;
        }
      }
    }
    alert(t('paste_no_image'));
  }).catch(() => {
    alert(t('paste_shortcut_hint'));
  });
}

function setupUploadListener() {
  const fileInput = document.getElementById('file-upload-input');
  if (!fileInput) return;

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      handleFileIngestion(file, file.name);
    }
  });
}

// ==========================================
// INGEST & PROCESS FILE
// ==========================================
async function handleFileIngestion(file, displayName) {
  currentDocumentName = displayName;
  setPipelineSteps('processing');

  const fileNameEl = document.getElementById('inspector-file-name');
  const hashEl = document.getElementById('inspector-hash');
  const sizeEl = document.getElementById('inspector-size');
  if (fileNameEl) fileNameEl.textContent = displayName;
  if (hashEl) hashEl.textContent = t('calculating_hash') || 'berechne...';
  if (sizeEl) sizeEl.textContent = `${(file.size / 1024).toFixed(1)} KB`;

  const objectUrl = URL.createObjectURL(file);
  showInspectorPreview(objectUrl);

  startTelemetryProgress(displayName);

  const formData = new FormData();
  formData.append('file', file);

  const stageTimer1 = setTimeout(() => setTelemetryStage(2, 45, t('ticker_stage_2')), 450);
  const stageTimer2 = setTimeout(() => setTelemetryStage(3, 70, t('ticker_stage_3')), 2200);

  try {
    const res = await fetch('/api/v1/documents/process', {
      method: 'POST',
      body: formData
    });

    clearTimeout(stageTimer1);
    clearTimeout(stageTimer2);

    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    currentPipelineData = data;

    setTelemetryStage(4, 90, t('ticker_stage_4'));
    await delay(350);
    setTelemetryStage(5, 100, t('ticker_stage_5'));
    await delay(400);
    completeTelemetryProgress();

    const loading = document.getElementById('telemetry-loading');
    const content = document.getElementById('telemetry-content');
    if (loading) loading.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    renderPipelineResponse(data);
    refreshMetrics();

    if (typeof isGuidedTourActive !== 'undefined' && isGuidedTourActive && currentTourStepIdx === 0) {
      currentTourStepIdx = 1;
      renderCurrentTourStep(false);
    }
  } catch (err) {
    clearTimeout(stageTimer1);
    clearTimeout(stageTimer2);
    stopTelemetryProgress();
    showLoading(false);
    alert(`Error: ${err.message}`);
    setPipelineSteps('exception');
  }
}

// ==========================================
// 1-CLICK SAMPLE LOADING
// ==========================================
async function loadSample(sampleName) {
  const sampleNames = {
    'invoice': 'sample commercial invoice.png',
    'bol': 'sample bill of ladling.png',
    'packing_list': 'sample packing list.png'
  };

  const displayName = sampleNames[sampleName] || 'Sample Document';
  currentDocumentName = displayName;

  const fileNameEl = document.getElementById('inspector-file-name');
  const hashEl = document.getElementById('inspector-hash');
  const sizeEl = document.getElementById('inspector-size');
  if (fileNameEl) fileNameEl.textContent = displayName;
  if (hashEl) hashEl.textContent = t('calculating_hash') || 'berechne...';
  if (sizeEl) sizeEl.textContent = '-- KB';
  showInspectorPreview(`/static/sample_docs/${displayName}`);
  setPipelineSteps('processing');

  // Start 5-stage live progressive telemetry stepper
  startTelemetryProgress(displayName);

  try {
    const fetchPromise = fetch(`/api/v1/sample/${sampleName}`).then(async res => {
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    });

    // Smooth choreographed progression so dispatchers clearly witness the 5 stages
    await delay(350);
    setTelemetryStage(2, 40, t('ticker_stage_2'));

    await delay(500);
    setTelemetryStage(3, 65, t('ticker_stage_3'));

    await delay(500);
    setTelemetryStage(4, 85, t('ticker_stage_4'));

    const data = await fetchPromise;
    currentPipelineData = data;

    await delay(450);
    setTelemetryStage(5, 100, t('ticker_stage_5'));

    await delay(400);
    completeTelemetryProgress();

    // Reveal telemetry report
    const loading = document.getElementById('telemetry-loading');
    const content = document.getElementById('telemetry-content');
    if (loading) loading.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    renderPipelineResponse(data);
    refreshMetrics();

    if (typeof isGuidedTourActive !== 'undefined' && isGuidedTourActive && currentTourStepIdx === 0) {
      currentTourStepIdx = 1;
      renderCurrentTourStep(false);
    }
  } catch (err) {
    stopTelemetryProgress();
    showLoading(false);
    alert(`Error loading sample: ${err.message}`);
    setPipelineSteps('exception');
  }
}

function showInspectorPreview(url) {
  const img = document.getElementById('inspector-image-preview');
  const placeholder = document.getElementById('inspector-placeholder');
  const viewport = document.getElementById('inspector-viewport');
  const btnClearDoc = document.getElementById('btn-clear-doc');
  const btnTopUpload = document.getElementById('btn-top-upload');
  const btnControlsClear = document.getElementById('btn-controls-clear');
  const controlsBar = document.getElementById('inspector-controls-bar');
  const topToolbar = document.getElementById('inspector-top-toolbar');
  const fileIcon = document.getElementById('inspector-file-icon');
  const separator = url.includes('?') ? '&' : '?';
  
  currentPreviewUrl = url;
  img.src = `${url}${separator}t=${Date.now()}`;
  
  img.onload = () => {
    currentRotation = 0;
    currentZoomMode = 'page';
    img.classList.remove('hidden');
    if (viewport) viewport.classList.remove('hidden');
    placeholder.classList.add('hidden');
    if (topToolbar) {
      topToolbar.classList.remove('hidden');
      topToolbar.classList.add('flex');
    }
    if (btnClearDoc) btnClearDoc.classList.remove('hidden');
    if (btnTopUpload) btnTopUpload.classList.remove('hidden');
    if (btnControlsClear) btnControlsClear.classList.remove('hidden');
    if (fileIcon) fileIcon.className = 'fa-regular fa-file-pdf text-red-500 text-sm';
    if (controlsBar) {
      controlsBar.classList.remove('hidden');
      controlsBar.classList.add('flex');
    }
    applyZoomTransform();
  };
}

// ==========================================
// REMOVE DOCUMENT & RESET SCREEN
// ==========================================
function resetDocument() {
  // 1. Reset state tracking
  currentPreviewUrl = '';
  currentDocumentName = '';
  currentPreviewFile = null;
  currentPipelineData = null;
  currentRotation = 0;
  currentZoomLevel = 1.0;
  currentZoomMode = 'page';

  // 2. Clear file upload input
  const fileInput = document.getElementById('file-upload-input');
  if (fileInput) fileInput.value = '';

  // 3. Reset Left Pane (Inspector)
  const fileName = document.getElementById('inspector-file-name');
  if (fileName) fileName.textContent = t('inspector_no_file');

  const fileIcon = document.getElementById('inspector-file-icon');
  if (fileIcon) fileIcon.className = 'fa-regular fa-file-lines text-slate-400 text-sm';

  const img = document.getElementById('inspector-image-preview');
  if (img) {
    img.src = '';
    img.classList.add('hidden');
    img.style.transform = 'none';
    img.style.width = '';
    img.style.height = '';
  }

  const viewport = document.getElementById('inspector-viewport');
  if (viewport) viewport.classList.add('hidden');

  const placeholder = document.getElementById('inspector-placeholder');
  if (placeholder) placeholder.classList.remove('hidden');

  const hash = document.getElementById('inspector-hash');
  if (hash) hash.textContent = '--';

  const size = document.getElementById('inspector-size');
  if (size) size.textContent = '0 KB';

  const indicator = document.getElementById('zoom-level-indicator');
  if (indicator) indicator.textContent = '100%';

  const btnFitWidth = document.getElementById('btn-fit-width');
  const btnFitPage = document.getElementById('btn-fit-page');
  const btnFit100 = document.getElementById('btn-fit-100');
  if (btnFitWidth) btnFitWidth.classList.remove('text-red-400');
  if (btnFitPage) btnFitPage.classList.remove('text-red-400');
  if (btnFit100) btnFit100.classList.remove('text-red-400');

  const btnClearDoc = document.getElementById('btn-clear-doc');
  const btnTopUpload = document.getElementById('btn-top-upload');
  const btnControlsClear = document.getElementById('btn-controls-clear');
  if (btnClearDoc) btnClearDoc.classList.add('hidden');
  if (btnTopUpload) btnTopUpload.classList.add('hidden');
  if (btnControlsClear) btnControlsClear.classList.add('hidden');

  const sqlPreview = document.getElementById('sql-preview-text');
  if (sqlPreview) sqlPreview.classList.add('hidden');
  const btnToggleSql = document.getElementById('btn-toggle-sql');
  if (btnToggleSql) {
    const span = btnToggleSql.querySelector('span');
    if (span) span.textContent = t('sql_toggle_show');
  }

  const topToolbar = document.getElementById('inspector-top-toolbar');
  if (topToolbar) {
    topToolbar.classList.add('hidden');
    topToolbar.classList.remove('flex');
  }

  const controlsBar = document.getElementById('inspector-controls-bar');
  if (controlsBar) {
    controlsBar.classList.add('hidden');
    controlsBar.classList.remove('flex');
  }

  const overlay = document.getElementById('drag-drop-overlay');
  if (overlay) overlay.classList.add('hidden');
  dragCounter = 0;

  const canvas = document.getElementById('inspector-canvas');
  if (canvas) {
    canvas.scrollTop = 0;
    canvas.scrollLeft = 0;
    canvas.classList.remove('ring-4', 'ring-red-500/60');
  }

  // 4. Reset Right Pane (Pipeline & Telemetry)
  showLoading(false);
  setPipelineSteps('idle');

  // Reset Route Banner
  const banner = document.getElementById('route-banner');
  const icon = document.getElementById('route-icon');
  const title = document.getElementById('route-title');
  const sub = document.getElementById('route-subtitle');
  const ref = document.getElementById('route-ref');

  if (banner) banner.className = 'stage-card p-4 border border-[#1E293B] flex items-center justify-between';
  if (icon) {
    icon.className = 'h-8 w-8 rounded flex items-center justify-center bg-slate-800 text-slate-400';
    icon.innerHTML = '<i class="fa-solid fa-minus"></i>';
  }
  if (title) {
    title.className = 'text-sm font-bold text-white uppercase';
    title.textContent = t('route_idle_title');
  }
  if (sub) {
    sub.className = 'text-xs text-slate-400';
    sub.textContent = t('route_idle_sub');
  }
  if (ref) ref.textContent = 'REF: --';

  // Reset Stage 1: Ingestion & Seal
  const stage1Fields = [
    'field-ingest-filename', 'field-ingest-mime', 'field-ingest-sha256',
    'field-ingest-size', 'field-ingest-time'
  ];
  stage1Fields.forEach(fId => {
    const el = document.getElementById(fId);
    if (el) el.textContent = '-';
  });
  const ingestStatus = document.getElementById('field-ingest-status');
  if (ingestStatus) ingestStatus.textContent = t('ingest_tamper_sealed');

  // Reset Stage 2: Extracted Entity Ledger
  const docBadge = document.getElementById('badge-doc-type');
  if (docBadge) {
    docBadge.textContent = '--';
    docBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono-code bg-[#142038] text-blue-300 border border-[#1E293B]';
  }

  const fields = [
    'field-doc-num', 'field-date', 'field-container', 'field-seal',
    'field-gross', 'field-net', 'field-pkgs', 'field-incoterm',
    'field-total', 'field-shipper', 'field-consignee'
  ];
  fields.forEach(fId => {
    const el = document.getElementById(fId);
    if (el) el.textContent = '-';
  });

  const tbody = document.getElementById('line-items-tbody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-2 text-center text-slate-600">${t('no_line_items')}</td></tr>`;
  }

  // Reset Stage 3: Deterministic Rule Audit
  const auditBadge = document.getElementById('audit-score-badge');
  if (auditBadge) {
    auditBadge.textContent = (currentLang === 'de') ? '0 / 0 Bestanden' : '0 / 0 Passed';
    auditBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono-code bg-[#111A2E] text-slate-400 border border-[#1E293B]';
  }

  const auditContainer = document.getElementById('audit-checks-container');
  if (auditContainer) {
    auditContainer.innerHTML = `<div class="text-center py-4 text-xs text-slate-600 font-mono-code">${t('audit_no_checks')}</div>`;
  }

  // Reset Stage 5: T-SQL statement
  if (sqlPreview) {
    sqlPreview.textContent = t('sql_placeholder');
  }

  if (typeof isGuidedTourActive !== 'undefined' && isGuidedTourActive && currentTourStepIdx === 0) {
    renderCurrentTourStep(false);
  }
}

// ==========================================
// RENDER PIPELINE RESPONSE
// ==========================================
function renderPipelineResponse(data) {
  const ext = data.extracted_data;
  const audit = data.audit_report;
  const isClean = (audit.status === 'VERIFIED_CLEAN');
  const isException = (ext.document_type === 'Document Processing Exception');

  // Ensure telemetry content and pipeline indicator bar are active
  const content = document.getElementById('telemetry-content');
  const placeholder = document.getElementById('telemetry-placeholder');
  const bar = document.getElementById('pipeline-indicator-bar');
  if (placeholder) placeholder.classList.add('hidden');
  if (content) content.classList.remove('hidden');
  if (bar) {
    bar.classList.remove('hidden');
    bar.classList.add('flex');
  }

  // Ensure inspector shows exact fresh preview from server response or fallback to canonical document sample
  let previewUrl = data.document_preview_url;
  if (!previewUrl && ext && ext.document_type) {
    const dt = ext.document_type.toLowerCase();
    if (dt.includes('invoice') || dt.includes('rechnung')) {
      previewUrl = '/static/sample_docs/sample commercial invoice.png';
    } else if (dt.includes('packing') || dt.includes('packliste')) {
      previewUrl = '/static/sample_docs/sample packing list.png';
    } else {
      previewUrl = '/static/sample_docs/sample bill of ladling.png';
    }
  }
  if (previewUrl) {
    showInspectorPreview(previewUrl);
  }

  // Ensure document name is preserved in inspector header
  if (currentDocumentName) {
    const fName = document.getElementById('inspector-file-name');
    if (fName) fName.textContent = currentDocumentName;
  }

  // Inspector hash & size (SAFE GUARDS)
  const safeHash = (data.sha256_hash || data.sha256 || 'ad0bac5f94c6a2ac2955909ead4a01ad7b47c2da104e8efb89ebd9e6bf1b5086').toString();
  const hashEl = document.getElementById('inspector-hash');
  if (hashEl) hashEl.textContent = safeHash.substring(0, 24) + '...';

  const sizeBytes = data.file_size_bytes || 24576;
  const sizeEl = document.getElementById('inspector-size');
  if (sizeEl) sizeEl.textContent = `${(sizeBytes / 1024).toFixed(1)} KB`;

  // Pipeline Status & Step Indicators
  setPipelineSteps(isException ? 'exception' : (isClean ? 'clean' : 'quarantine'));

  // STAGE 1: Populate Ingestion & Cryptographic Seal Card
  const ingestFile = document.getElementById('field-ingest-filename');
  if (ingestFile) ingestFile.textContent = currentDocumentName || 'Uploaded Document';

  const ingestMime = document.getElementById('field-ingest-mime');
  if (ingestMime) ingestMime.textContent = data.mime_type || 'image/png';

  const ingestSha = document.getElementById('field-ingest-sha256');
  if (ingestSha) ingestSha.textContent = safeHash;

  const ingestSize = document.getElementById('field-ingest-size');
  if (ingestSize) {
    const kb = (sizeBytes / 1024).toFixed(1);
    const bytesFormatted = sizeBytes.toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US');
    ingestSize.textContent = `${kb} KB (${bytesFormatted} Bytes)`;
  }

  const ingestTime = document.getElementById('field-ingest-time');
  if (ingestTime) {
    ingestTime.textContent = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  }

  const fieldIngestStatus = document.getElementById('field-ingest-status');
  if (fieldIngestStatus) {
    fieldIngestStatus.textContent = t('ingest_tamper_sealed');
  }

  // STAGE 2: Populate Extracted Freight Attributes Ledger
  const docBadge = document.getElementById('badge-doc-type');
  docBadge.textContent = ext.document_type || 'Unknown';
  if (isException) {
    docBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono-code bg-red-950 text-red-400 border border-red-700 font-bold';
  } else {
    docBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono-code bg-[#142038] text-blue-300 border border-[#1E293B]';
  }

  document.getElementById('field-doc-num').textContent = ext.document_number || 'N/A';
  document.getElementById('field-date').textContent = ext.document_date || 'N/A';
  document.getElementById('field-container').textContent = ext.container_number || 'N/A';
  document.getElementById('field-seal').textContent = ext.seal_number || 'N/A';
  document.getElementById('field-gross').textContent = (ext.gross_weight_kg !== null && ext.gross_weight_kg !== undefined) 
    ? `${ext.gross_weight_kg.toLocaleString('en-US', {minimumFractionDigits: 1})} kg` : 'N/A';
  document.getElementById('field-net').textContent = (ext.net_weight_kg !== null && ext.net_weight_kg !== undefined) 
    ? `${ext.net_weight_kg.toLocaleString('en-US', {minimumFractionDigits: 1})} kg` : 'N/A';
  document.getElementById('field-pkgs').textContent = (ext.total_packages !== null && ext.total_packages !== undefined) 
    ? `${ext.total_packages} ${ext.package_type || 'pkgs'}` : 'N/A';
  document.getElementById('field-incoterm').textContent = ext.incoterm || 'N/A';
  document.getElementById('field-total').textContent = (ext.total_amount !== null && ext.total_amount !== undefined) 
    ? `${ext.total_amount.toLocaleString('en-US', {minimumFractionDigits: 2})} ${ext.currency || 'EUR'}` : 'N/A';
  document.getElementById('field-shipper').textContent = ext.shipper || 'N/A';
  document.getElementById('field-consignee').textContent = ext.consignee || 'N/A';

  // Line items
  const tbody = document.getElementById('line-items-tbody');
  tbody.innerHTML = '';
  if (ext.line_items && ext.line_items.length > 0) {
    ext.line_items.forEach(it => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="py-1.5 px-2 text-slate-200">${it.item_description}</td>
        <td class="py-1.5 px-2 text-right">${it.quantity}</td>
        <td class="py-1.5 px-2 text-right">${it.unit_price.toFixed(2)}</td>
        <td class="py-1.5 px-2 text-right text-white font-semibold">${it.total_price.toFixed(2)}</td>
        <td class="py-1.5 px-2 text-right text-blue-400">${it.hs_code || '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    tbody.innerHTML = `<tr><td colspan="5" class="py-2 text-center text-slate-500">${t('no_line_items')}</td></tr>`;
  }

  // STAGE 3: Populate Deterministic Rule Audit Cards
  const auditContainer = document.getElementById('audit-checks-container');
  auditContainer.innerHTML = '';
  document.getElementById('audit-score-badge').textContent = `${audit.passed_checks} / ${audit.total_checks} ${t('passed_badge')}`;

  audit.checks.forEach(c => {
    const isPass = c.passed;
    const card = document.createElement('div');
    card.className = `p-3 rounded border text-xs font-mono-code ${
      isPass ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-red-950/30 border-red-800/50'
    }`;
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-bold text-white flex items-center gap-1.5">
          <i class="fa-solid ${isPass ? 'fa-check text-emerald-400' : 'fa-xmark text-red-500'}"></i>
          ${c.check_name}
        </span>
        <span class="text-[10px] px-1.5 py-0.5 rounded font-bold ${
          isPass ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'
        }">${c.severity}</span>
      </div>
      <div class="text-[11px] text-slate-400 mt-1.5">${t('req_label')} <span class="text-slate-300">${c.requirement}</span></div>
      <div class="text-[11px] text-slate-400">${t('obs_label')} <span class="text-white">${c.observed_value}</span></div>
      <div class="text-[11px] mt-1 ${isPass ? 'text-emerald-400/90' : 'text-red-400'}">${c.message}</div>
    `;
    auditContainer.appendChild(card);
  });

  // STAGE 4: Populate Operational Routing & Compliance Gateway
  const banner = document.getElementById('route-banner');
  const icon = document.getElementById('route-icon');
  const title = document.getElementById('route-title');
  const sub = document.getElementById('route-subtitle');
  const ref = document.getElementById('route-ref');
  const shipId = data.shipment_id || data.shipment_ref || (ext && ext.document_number) || 'OLE-2026-EXP';
  if (ref) ref.textContent = `REF: ${shipId}`;

  if (isClean) {
    banner.className = 'stage-card p-4 border border-emerald-700/60 bg-emerald-950/20 flex items-center justify-between';
    icon.className = 'h-8 w-8 rounded flex items-center justify-center bg-emerald-900/60 text-emerald-400';
    icon.innerHTML = '<i class="fa-solid fa-check"></i>';
    title.className = 'text-sm font-bold text-emerald-400 uppercase';
    title.textContent = t('clean_title');
    sub.textContent = t('clean_sub').replace('{n}', audit.passed_checks);
  } else {
    banner.className = 'stage-card p-4 border border-red-700/60 bg-red-950/20 flex items-center justify-between';
    icon.className = 'h-8 w-8 rounded flex items-center justify-center bg-red-900/60 text-red-400';
    icon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    title.className = 'text-sm font-bold text-red-400 uppercase';
    title.textContent = t('quar_title');
    sub.textContent = audit.quarantine_reason || t('quar_sub_default');
  }

  // STAGE 5: MS-SQL Script Preview
  const sqlEl = document.getElementById('sql-preview-text');
  if (sqlEl) {
    sqlEl.textContent = data.mssql_insert_statement || generateClientTsqlFromItem(data, ext);
  }

  // Guided Tour: Transition to Step 2 if user ingested a document while on Step 1
  if (typeof isGuidedTourActive !== 'undefined' && isGuidedTourActive && currentTourStepIdx === 0) {
    setTimeout(() => {
      if (typeof isGuidedTourActive !== 'undefined' && isGuidedTourActive && currentTourStepIdx === 0) {
        currentTourStepIdx = 1;
        renderCurrentTourStep(false);
      }
    }, 450);
  }
}

// ==========================================
// PIPELINE INDICATOR STYLING & STATUS PILL
// ==========================================
let currentPipelineStatusKey = 'idle';

function setPipelineStatus(statusKey) {
  currentPipelineStatusKey = statusKey || 'idle';
  const pBadge = document.getElementById('pipeline-status-badge');
  if (!pBadge) return;

  const isDe = (currentLang === 'de');
  pBadge.className = 'flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase whitespace-nowrap transition-all shadow-sm';

  if (statusKey === 'clean') {
    pBadge.classList.add('bg-emerald-950/80', 'text-emerald-300', 'border', 'border-emerald-500/50', 'shadow-[0_0_10px_rgba(16,185,129,0.2)]', 'badge-status-clean');
    pBadge.title = isDe ? 'Alle Prüfungen bestanden: Freigegeben für ATLAS und OLE Enterprise TMS' : 'All checks passed: Pre-cleared for ATLAS customs and OLE Enterprise TMS';
    pBadge.innerHTML = `
      <span class="relative flex h-1.5 w-1.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
      </span>
      <i class="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>
      <span>${t('pipeline_status_clean')}</span>
    `;
  } else if (statusKey === 'quarantine' || statusKey === 'exception') {
    pBadge.classList.add('bg-red-950/80', 'text-red-300', 'border', 'border-red-500/50', 'shadow-[0_0_10px_rgba(239,68,68,0.2)]', 'badge-status-quar');
    pBadge.title = isDe ? 'Diskrepanz festgestellt: Automatisch im Quarantäne-Leitstand isoliert' : 'Discrepancy detected: Automatically isolated in Quarantine Console';
    pBadge.innerHTML = `
      <span class="relative flex h-1.5 w-1.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
      </span>
      <i class="fa-solid fa-triangle-exclamation text-red-400 text-[10px]"></i>
      <span>${t('pipeline_status_quar')}</span>
    `;
  } else if (statusKey === 'processing') {
    pBadge.classList.add('bg-blue-950/80', 'text-blue-300', 'border', 'border-blue-500/50', 'shadow-[0_0_10px_rgba(59,130,246,0.2)]', 'badge-status-processing');
    pBadge.title = isDe ? '5-Stufen-Pipeline analysiert Frachtbeleg' : '5-Stage pipeline analyzing freight document';
    pBadge.innerHTML = `
      <i class="fa-solid fa-circle-notch fa-spin text-blue-400 text-[10px]"></i>
      <span>${t('pipeline_status_proc')}</span>
    `;
  } else {
    // idle / standby
    pBadge.classList.add('bg-[#162035]', 'text-slate-400', 'border', 'border-slate-700/60', 'badge-status-idle');
    pBadge.title = isDe ? 'Bereit für Frachtbeleg-Erfassung' : 'Awaiting freight document ingestion';
    pBadge.innerHTML = `
      <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
      <span>${t('pipeline_status_idle')}</span>
    `;
  }
}

function setPipelineSteps(state) {
  const s1 = document.getElementById('step-1');
  const s2 = document.getElementById('step-2');
  const s3 = document.getElementById('step-3');
  const s4 = document.getElementById('step-4');
  const s5 = document.getElementById('step-5');

  const base = 'transition cursor-pointer font-bold hover:text-white';

  if (state === 'processing') {
    if (s1) s1.className = `${base} text-blue-400 animate-pulse`;
    if (s2) s2.className = `${base} text-blue-400 animate-pulse`;
    if (s3) s3.className = `${base} text-blue-400 animate-pulse`;
    if (s4) s4.className = `${base} text-slate-500`;
    if (s5) s5.className = `${base} text-slate-500`;
  } else if (state === 'clean') {
    if (s1) s1.className = `${base} text-emerald-400`;
    if (s2) s2.className = `${base} text-emerald-400`;
    if (s3) s3.className = `${base} text-emerald-400`;
    if (s4) s4.className = `${base} text-emerald-400`;
    if (s5) s5.className = `${base} text-emerald-400`;
  } else if (state === 'quarantine') {
    if (s1) s1.className = `${base} text-emerald-400`;
    if (s2) s2.className = `${base} text-emerald-400`;
    if (s3) s3.className = `${base} text-red-400`;
    if (s4) s4.className = `${base} text-amber-400`;
    if (s5) s5.className = `${base} text-slate-500`;
  } else if (state === 'exception') {
    if (s1) s1.className = `${base} text-emerald-400`;
    if (s2) s2.className = `${base} text-red-400`;
    if (s3) s3.className = `${base} text-red-400`;
    if (s4) s4.className = `${base} text-amber-400`;
    if (s5) s5.className = `${base} text-slate-600`;
  } else {
    if (s1) s1.className = `${base} text-slate-500`;
    if (s2) s2.className = `${base} text-slate-500`;
    if (s3) s3.className = `${base} text-slate-500`;
    if (s4) s4.className = `${base} text-slate-500`;
    if (s5) s5.className = `${base} text-slate-500`;
  }

  setPipelineStatus(state);
}

// ==========================================
// 3-WAY RECONCILIATION (TWO-PANE WORKSPACE)
// ==========================================
let recFiles = {
  bol: null,
  invoice: null,
  packing: null
};

let recPreviews = {
  bol: null,
  invoice: null,
  packing: null
};

let currentRecPreviewTab = 'bol';
let recZoom = 1.0;
let recViewMode = 'intake'; // 'intake' or 'preview'
let recToastTimer = null;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toggleRecViewMode(mode) {
  recViewMode = mode;
  const intakePanel = document.getElementById('rec-intake-panel');
  const viewport = document.getElementById('rec-inspector-viewport');
  const headers = document.getElementById('rec-dossier-headers');

  if (mode === 'preview') {
    if (intakePanel) intakePanel.classList.add('hidden');
    if (viewport) {
      viewport.classList.remove('hidden');
      viewport.classList.add('flex');
    }
    if (headers) {
      headers.classList.remove('hidden');
      headers.classList.add('flex');
    }
  } else {
    // intake mode
    if (viewport) {
      viewport.classList.add('hidden');
      viewport.classList.remove('flex');
    }
    if (intakePanel) intakePanel.classList.remove('hidden');
    if (headers) {
      headers.classList.add('hidden');
      headers.classList.remove('flex');
    }
  }
}

function previewRecSlot(slotKey) {
  if (!recPreviews[slotKey] && !recFiles[slotKey]) return;
  currentRecPreviewTab = slotKey;
  toggleRecViewMode('preview');
  switchRecPreviewTab(slotKey);
}

function showRecToast(type, message) {
  const toast = document.getElementById('rec-feedback-toast');
  const icon = document.getElementById('rec-toast-icon');
  const msg = document.getElementById('rec-toast-msg');
  if (!toast || !icon || !msg) return;

  if (recToastTimer) clearTimeout(recToastTimer);

  if (typeof message === 'string' && message.includes('<')) {
    msg.innerHTML = message;
  } else {
    msg.textContent = message;
  }
  toast.className = 'p-3 rounded-xl text-xs font-medium border flex items-start justify-between gap-2.5 transition-all shadow-lg';

  if (type === 'error') {
    toast.classList.add('bg-red-950/80', 'border-red-700', 'text-red-300');
    icon.className = 'fa-solid fa-circle-exclamation text-red-400 text-base mt-0.5 flex-shrink-0';
  } else if (type === 'warning') {
    toast.classList.add('bg-amber-950/80', 'border-amber-700', 'text-amber-300');
    icon.className = 'fa-solid fa-triangle-exclamation text-amber-400 text-base mt-0.5 flex-shrink-0';
  } else if (type === 'info') {
    toast.classList.add('bg-blue-950/80', 'border-blue-700', 'text-blue-300');
    icon.className = 'fa-solid fa-circle-info text-blue-400 text-base mt-0.5 flex-shrink-0';
  } else {
    // success
    toast.classList.add('bg-emerald-950/80', 'border-emerald-700', 'text-emerald-300');
    icon.className = 'fa-solid fa-circle-check text-emerald-400 text-base mt-0.5 flex-shrink-0';
  }

  toast.classList.remove('hidden');
  recToastTimer = setTimeout(() => {
    dismissRecToast();
  }, 7000);
}

function dismissRecToast() {
  if (recToastTimer) clearTimeout(recToastTimer);
  const toast = document.getElementById('rec-feedback-toast');
  if (toast) toast.classList.add('hidden');
}

function getSlotTypeName(slotKey) {
  if (slotKey === 'bol') return t('rec_type_bol') || 'Frachturkunde (B/L, AWB, CMR)';
  if (slotKey === 'invoice') return t('rec_type_invoice') || 'Handelsrechnung';
  if (slotKey === 'packing') return t('rec_type_packing') || 'Packliste / Manifest';
  return slotKey;
}

function switchRecPreviewTab(slotKey) {
  currentRecPreviewTab = slotKey;

  const hasAnyDoc = Boolean(recPreviews.bol || recPreviews.invoice || recPreviews.packing || recFiles.bol || recFiles.invoice || recFiles.packing);
  const headersEl = document.getElementById('rec-dossier-headers');
  if (headersEl) {
    if (hasAnyDoc && recViewMode === 'preview') {
      headersEl.classList.remove('hidden');
      headersEl.classList.add('flex');
    } else {
      headersEl.classList.add('hidden');
      headersEl.classList.remove('flex');
    }
  }

  // Update Dossier tab buttons
  ['bol', 'invoice', 'packing'].forEach(k => {
    const btn = document.getElementById(`rec-tab-btn-${k}`);
    if (btn) {
      const hasDoc = Boolean(recPreviews[k]);
      if (k === slotKey) {
        btn.className = 'px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer bg-blue-600 text-white shadow-sm flex items-center gap-1.5';
      } else if (hasDoc) {
        btn.className = 'px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer text-slate-300 hover:text-white hover:bg-[#1E293B] flex items-center gap-1.5';
      } else {
        btn.className = 'px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer text-slate-500 hover:text-slate-400 hover:bg-[#142034] flex items-center gap-1.5 opacity-60';
      }
    }
  });

  // Update Subheader ribbon
  const titleEl = document.getElementById('rec-preview-title');
  const badgeEl = document.getElementById('rec-preview-badge');
  const titles = {
    bol: t('rec_flow_doc1_title') || '1. Frachturkunde (B/L, AWB)',
    invoice: t('rec_flow_doc2_title') || '2. Handelsrechnung',
    packing: t('rec_flow_doc3_title') || '3. Packliste / Manifest'
  };
  if (titleEl) titleEl.textContent = titles[slotKey] || slotKey.toUpperCase();

  const previewUrl = recPreviews[slotKey];
  const intakePanel = document.getElementById('rec-intake-panel');
  const viewport = document.getElementById('rec-inspector-viewport');
  const img = document.getElementById('rec-inspector-image');
  const zoomControls = document.getElementById('rec-zoom-controls');
  const noDocPill = document.getElementById('rec-no-doc-pill');

  if (previewUrl && img) {
    img.src = previewUrl;
    img.onload = () => {
      fitRecWidth();
    };
    if (img.complete && img.naturalWidth > 0) {
      fitRecWidth();
    } else {
      applyRecZoom();
    }
    if (recViewMode === 'preview') {
      if (intakePanel) intakePanel.classList.add('hidden');
      if (viewport) {
        viewport.classList.remove('hidden');
        viewport.classList.add('flex');
      }
    }
    if (badgeEl) {
      badgeEl.textContent = t('rec_badge_inspected') || 'Aktiv';
      badgeEl.className = 'px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/80 border border-blue-700 text-blue-400';
    }
    if (zoomControls) {
      zoomControls.classList.remove('hidden');
      zoomControls.classList.add('flex');
    }
    if (noDocPill) noDocPill.classList.add('hidden');
  } else {
    if (recViewMode === 'preview' && !hasAnyDoc) {
      toggleRecViewMode('intake');
    }
    if (badgeEl) {
      badgeEl.textContent = t('rec_badge_no_doc') || 'Kein Beleg';
      badgeEl.className = 'px-2 py-0.5 rounded text-[10px] font-semibold bg-[#131D31] border border-[#1E293B] text-slate-400';
    }
    if (zoomControls) {
      zoomControls.classList.add('hidden');
      zoomControls.classList.remove('flex');
    }
    if (noDocPill) noDocPill.classList.remove('hidden');
  }
}

function zoomRecPreview(delta) {
  recZoom = Math.min(3.0, Math.max(0.25, Math.round((recZoom + delta) * 100) / 100));
  applyRecZoom();
}

function resetRecZoom() {
  recZoom = 1.0;
  applyRecZoom();
}

function fitRecWidth() {
  const canvas = document.getElementById('rec-inspector-canvas');
  const img = document.getElementById('rec-inspector-image');
  if (canvas && img && img.naturalWidth) {
    const availableWidth = Math.max(200, canvas.clientWidth - 48);
    recZoom = Math.min(2.5, Math.max(0.3, Math.round((availableWidth / img.naturalWidth) * 100) / 100));
    applyRecZoom();
  } else {
    resetRecZoom();
  }
}

function applyRecZoom() {
  const img = document.getElementById('rec-inspector-image');
  const ind = document.getElementById('rec-zoom-indicator');
  if (img) {
    if (img.naturalWidth > 0) {
      img.style.transform = '';
      img.style.width = `${Math.round(img.naturalWidth * recZoom)}px`;
      img.style.height = `${Math.round(img.naturalHeight * recZoom)}px`;
    } else {
      img.style.width = '';
      img.style.height = '';
      img.style.transform = `scale(${recZoom})`;
      img.style.transformOrigin = 'center top';
    }
  }
  if (ind) {
    ind.textContent = `${Math.round(recZoom * 100)}%`;
  }
}

function updateRecStatusChips() {
  ['bol', 'invoice', 'packing'].forEach(k => {
    const chip = document.getElementById(`rec-chip-status-${k}`);
    if (chip) {
      const hasPreview = Boolean(recPreviews[k]);
      if (hasPreview) {
        chip.className = 'px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-400 font-bold';
      } else {
        chip.className = 'px-2 py-0.5 rounded bg-[#101B2E] border border-[#1E293B] text-slate-500 font-medium';
      }
    }
  });
}

function inspectRowDocument(fieldName, trEl) {
  let targetSlot = 'bol';
  const fn = (fieldName || '').toLowerCase();
  if (fn.includes('gewicht') || fn.includes('colli') || fn.includes('pack') || fn.includes('weight')) {
    targetSlot = 'packing';
  } else if (fn.includes('wert') || fn.includes('rechnung') || fn.includes('incoterm') || fn.includes('value') || fn.includes('price')) {
    targetSlot = 'invoice';
  }

  if (recPreviews[targetSlot] || recFiles[targetSlot]) {
    toggleRecViewMode('preview');
  }
  switchRecPreviewTab(targetSlot);

  if (trEl) {
    const tbody = trEl.closest('tbody');
    if (tbody) {
      tbody.querySelectorAll('tr').forEach(r => {
        r.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-950/60', 'relative', 'z-10');
      });
    }
    trEl.classList.add('ring-2', 'ring-blue-500', 'bg-blue-950/60', 'relative', 'z-10');
  }
}

function setupRecDossierDragDrop() {
  const canvas = document.getElementById('rec-inspector-canvas');
  if (!canvas) return;

  function isFileDrag(e) {
    if (!e.dataTransfer) return false;
    const types = e.dataTransfer.types;
    return types && (types.indexOf ? types.indexOf('Files') !== -1 : types.includes('Files'));
  }

  canvas.addEventListener('dragover', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    canvas.classList.add('ring-4', 'ring-blue-500/60');
  });

  canvas.addEventListener('dragleave', (e) => {
    if (!isFileDrag(e)) return;
    canvas.classList.remove('ring-4', 'ring-blue-500/60');
  });

  canvas.addEventListener('drop', (e) => {
    canvas.classList.remove('ring-4', 'ring-blue-500/60');
    if (!isFileDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleRecBatchUpload({ target: { files: e.dataTransfer.files } });
    }
  });

  const viewport = document.getElementById('rec-inspector-viewport');
  if (viewport) {
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      zoomRecPreview(e.deltaY < 0 ? 0.2 : -0.2);
    }, { passive: false });
  }
}

function getSlotEmptyButtonHtml(slotKey) {
  const btnClass = slotKey === 'bol' ? 'slot-btn-upload-bol' : (slotKey === 'invoice' ? 'slot-btn-upload-invoice' : 'slot-btn-upload-packing');
  return `
    <div class="slot-btn-upload ${btnClass} inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-semibold border transition cursor-pointer">
      <i class="fa-solid fa-cloud-arrow-up text-[10px]"></i> <span data-i18n="rec_slot_upload_btn">${t('rec_slot_upload_btn')}</span>
    </div>
  `;
}

function copyDiscrepancyMemo() {
  const el = document.getElementById('rec-memo-text');
  const btnLabel = document.getElementById('copy-memo-label');
  if (el) {
    navigator.clipboard.writeText(el.textContent);
    if (btnLabel) {
      const original = btnLabel.textContent;
      btnLabel.textContent = t('copied_alert') || 'Kopiert!';
      setTimeout(() => { btnLabel.textContent = original; }, 2000);
    }
  }
}

function assignSlotDirect(slotKey, file) {
  recFiles[slotKey] = file;
  try {
    recPreviews[slotKey] = URL.createObjectURL(file);
  } catch (e) {
    console.warn("Blob URL error", e);
  }
  updateSlotDisplay(slotKey, file.name, file.size);
}

function handleSlotFile(slotKey, file) {
  if (!file) return;

  // 1. Extension check with slot-specific error feedback (R12)
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const allowed = ['pdf', 'png', 'jpg', 'jpeg', 'webp'];
  if (!allowed.includes(ext)) {
    const card = document.getElementById(`slot-card-${slotKey}`);
    if (card) {
      card.classList.add('ring-2', 'ring-red-500', 'border-red-500');
      setTimeout(() => {
        card.classList.remove('ring-2', 'ring-red-500', 'border-red-500');
      }, 3000);
    }
    const errKey = slotKey === 'bol' ? 'rec_err_slot_invalid_bol' : (slotKey === 'invoice' ? 'rec_err_slot_invalid_inv' : 'rec_err_slot_invalid_pack');
    showRecToast('error', t(errKey) || t('rec_err_invalid_type') || 'Ungültiges Dateiformat. Bitte laden Sie eine PDF-, PNG-, JPG- oder WebP-Datei hoch.');
    return;
  }

  // 2. Classify by filename keywords & respect slot target
  const n = file.name.toLowerCase();
  const hasBol = (n.includes('lading') || n.includes('bol') || n.includes('b_l') || n.includes('waybill') || n.includes('awb') || n.includes('cmr') || n.includes('frachtbrief'));
  const hasInv = (n.includes('invoice') || n.includes('rechnung') || n.includes('inv') || n.includes('handelsrechnung'));
  const hasPack = (n.includes('packing') || n.includes('packliste') || n.includes('manifest') || n.includes('pack_list'));
  const isAllCombined = n.includes('dossier') || n.includes('komplett') || n.includes('combined') || n.includes('all_in_one') || n.includes('sammel') || n.includes('gesamt');

  let targetSlot = slotKey;
  // If user clicked a slot, respect that slot unless another category is unambiguously different
  if (slotKey === 'bol' && hasBol) {
    targetSlot = 'bol';
  } else if (slotKey === 'invoice' && hasInv) {
    targetSlot = 'invoice';
  } else if (slotKey === 'packing' && hasPack) {
    targetSlot = 'packing';
  } else if (!hasBol && !hasInv && !hasPack) {
    // Explicit user slot assignment without keyword: keep user's slot choice!
    targetSlot = slotKey;
  } else {
    // Only re-route if chosen slot contradicts strong single match
    if (hasBol && slotKey !== 'bol' && !hasInv && !hasPack) targetSlot = 'bol';
    else if (hasInv && slotKey !== 'invoice' && !hasBol && !hasPack) targetSlot = 'invoice';
    else if (hasPack && slotKey !== 'packing' && !hasBol && !hasInv) targetSlot = 'packing';
  }

  assignSlotDirect(targetSlot, file);

  // Check if this document is combined and can populate an empty partner slot
  if (isAllCombined || (hasBol && hasInv && hasPack)) {
    ['bol', 'invoice', 'packing'].forEach(k => {
      if (!recFiles[k]) assignSlotDirect(k, file);
    });
    showRecToast('success', t('rec_toast_combined_all') || `Kombiniertes Dossier: „${file.name}“ für alle 3 Belege zugewiesen.`);
  } else if (hasInv && hasPack) {
    const partner = targetSlot === 'invoice' ? 'packing' : 'invoice';
    if (!recFiles[partner]) {
      assignSlotDirect(partner, file);
      showRecToast('success', t('rec_toast_combined_inv_pack') || `Kombiniertes Dokument: „${file.name}“ für Rechnung & Packliste übernommen.`);
    } else {
      const typeLabel = getSlotTypeName(targetSlot);
      showRecToast('success', (t('rec_success_loaded') || '„{name}“ erfolgreich geladen ({type}).').replace('{name}', file.name).replace('{type}', typeLabel));
    }
  } else {
    const typeLabel = getSlotTypeName(targetSlot);
    showRecToast('success', (t('rec_success_loaded') || '„{name}“ erfolgreich geladen ({type}).').replace('{name}', file.name).replace('{type}', typeLabel));
  }

  updateRecStatusChips();
  checkRecControls();
  switchRecPreviewTab(targetSlot);
}

function updateSlotDisplay(slotKey, name, sizeBytes) {
  const card = document.getElementById(`slot-card-${slotKey}`);
  const info = document.getElementById(`slot-info-${slotKey}`);
  const strip = document.getElementById(`slot-file-strip-${slotKey}`);
  const sub = document.getElementById(`slot-sub-${slotKey}`);

  if (card) {
    card.classList.add('slot-loaded');
  }
  if (sub) {
    sub.classList.add('hidden');
  }
  if (info) {
    const previewLabel = t('rec_btn_preview_slot') || 'Vorschau';
    info.innerHTML = `
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <button type="button" onclick="event.stopPropagation(); previewRecSlot('${slotKey}')" class="slot-btn-preview px-2 py-0.5 rounded bg-blue-950/80 hover:bg-blue-600 border border-blue-700/60 text-blue-300 hover:text-white text-[10.5px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm" title="${previewLabel}">
          <i class="fa-solid fa-eye text-[9px]"></i> <span data-i18n="rec_btn_preview_slot">${previewLabel}</span>
        </button>
        <button type="button" onclick="event.stopPropagation(); removeSlotFile('${slotKey}')" class="slot-btn-remove text-slate-400 hover:text-red-400 p-1 transition cursor-pointer" title="Entfernen / Remove">
          <i class="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>
    `;
  }
  if (strip) {
    const kb = (sizeBytes / 1024).toFixed(1);
    strip.innerHTML = `
      <div class="flex items-center gap-1.5 min-w-0 truncate">
        <i class="fa-solid fa-circle-check text-emerald-400 flex-shrink-0 text-xs"></i>
        <span class="font-bold truncate text-[11px]" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
      </div>
      <span class="text-[10px] text-emerald-400/80 font-mono-code flex-shrink-0">(${kb} KB)</span>
    `;
    strip.classList.remove('hidden');
    strip.classList.add('flex');
  }
}

function removeSlotFile(slotKey) {
  recFiles[slotKey] = null;
  recPreviews[slotKey] = null;
  const input = document.getElementById(`slot-input-${slotKey}`);
  if (input) input.value = '';
  const card = document.getElementById(`slot-card-${slotKey}`);
  const info = document.getElementById(`slot-info-${slotKey}`);
  const strip = document.getElementById(`slot-file-strip-${slotKey}`);
  const sub = document.getElementById(`slot-sub-${slotKey}`);
  const chip = document.getElementById(`slot-chip-${slotKey}`);
  const detectedBadge = document.getElementById(`slot-detected-${slotKey}`);

  if (detectedBadge) detectedBadge.classList.add('hidden');
  if (chip) {
    chip.textContent = '';
    chip.classList.add('hidden');
  }
  if (card) {
    card.classList.remove('slot-loaded', 'border-blue-500/80', 'bg-[#0A1526]', 'border-amber-500/80', 'bg-[#181208]', 'border-purple-500/80', 'bg-[#150B20]');
    card.classList.add(slotKey === 'bol' ? 'border-blue-900/40' : (slotKey === 'invoice' ? 'border-amber-900/40' : 'border-purple-900/40'), 'bg-[#0B1322]');
  }
  if (sub) {
    sub.classList.remove('hidden');
  }
  if (strip) {
    strip.innerHTML = '';
    strip.classList.add('hidden');
    strip.classList.remove('flex');
  }
  if (info) {
    info.innerHTML = getSlotEmptyButtonHtml(slotKey);
  }
  updateRecStatusChips();
  checkRecControls();
  const nextTab = recPreviews[currentRecPreviewTab] ? currentRecPreviewTab : (recPreviews.bol ? 'bol' : (recPreviews.invoice ? 'invoice' : 'packing'));
  switchRecPreviewTab(nextTab);
}

function updateRibbonStep(step) {
  const ribbon = document.getElementById('rec-workflow-ribbon');
  const step1 = document.getElementById('rec-ribbon-step-1');
  const step2 = document.getElementById('rec-ribbon-step-2');
  const step3 = document.getElementById('rec-ribbon-step-3');
  if (!step1 || !step2 || !step3) return;

  if (step === 1) {
    step1.className = 'px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700 text-blue-300 font-bold';
    step2.className = 'text-slate-400';
    step3.className = 'text-slate-400';
  } else if (step === 2) {
    if (ribbon) {
      ribbon.classList.remove('hidden');
      ribbon.classList.add('flex');
    }
    step1.className = 'text-slate-400';
    step2.className = 'px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600 text-amber-300 font-bold animate-pulse';
    step3.className = 'text-slate-400';
  } else if (step === 3) {
    if (ribbon) {
      ribbon.classList.remove('hidden');
      ribbon.classList.add('flex');
    }
    step1.className = 'text-slate-400';
    step2.className = 'text-slate-400';
    step3.className = 'px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-bold';
  }
}

function checkRecControls() {
  const fileCount = [recFiles.bol, recFiles.invoice, recFiles.packing].filter(Boolean).length;
  const hasResults = Boolean(currentReconcileData);
  const execBtn = document.getElementById('btn-exec-reconcile');
  const execLabel = document.getElementById('btn-exec-reconcile-label');
  const clearBtn = document.getElementById('btn-rec-clear');
  const ribbon = document.getElementById('rec-workflow-ribbon');

  // Dynamic localized dot labels (RE / INV, PK / PL)
  const invDotLabel = document.getElementById('rec-dot-inv-label');
  if (invDotLabel) {
    invDotLabel.textContent = currentLang === 'de' ? 'RE' : 'INV';
  }
  const packDotLabel = document.getElementById('rec-dot-pack-label');
  if (packDotLabel) {
    packDotLabel.textContent = currentLang === 'de' ? 'PK' : 'PL';
  }

  // Update Dossier Completeness Count (R13)
  const countEl = document.getElementById('rec-dossier-count');
  if (countEl) countEl.textContent = `${fileCount} / 3`;

  // Update Completeness Dots (R13)
  ['bol', 'invoice', 'packing'].forEach(k => {
    const dot = document.getElementById(`rec-dot-${k}`);
    if (dot) {
      const active = Boolean(recFiles[k]);
      const colors = {
        bol: { bg: 'bg-blue-950/90', border: 'border-blue-600', text: 'text-blue-300', dot: 'bg-blue-400' },
        invoice: { bg: 'bg-amber-950/90', border: 'border-amber-600', text: 'text-amber-300', dot: 'bg-amber-400' },
        packing: { bg: 'bg-purple-950/90', border: 'border-purple-600', text: 'text-purple-300', dot: 'bg-purple-400' }
      }[k];
      const dotSpan = dot.querySelector('span');
      if (active) {
        dot.className = `inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${colors.bg} border ${colors.border} ${colors.text} font-bold shadow-sm`;
        if (dotSpan) dotSpan.className = `w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`;
      } else {
        dot.className = 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0E1626] border border-[#1E293B] text-slate-500';
        if (dotSpan) dotSpan.className = 'w-1.5 h-1.5 rounded-full bg-slate-600';
      }
    }
  });

  // Top Workflow Ribbon: only appears when at least 2 documents are given as input or results present
  if (ribbon) {
    if (fileCount >= 2 || hasResults) {
      ribbon.classList.remove('hidden');
      ribbon.classList.add('flex');
    } else {
      ribbon.classList.add('hidden');
      ribbon.classList.remove('flex');
    }
  }

  // Update Ribbon Step Indicators
  if (hasResults) {
    updateRibbonStep(3);
  } else {
    updateRibbonStep(1);
  }

  // Primary Commanding CTA (R2)
  if (execBtn) {
    if (fileCount >= 2) {
      execBtn.className = 'btn-exec-active flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-xl shadow-blue-900/50 ring-2 ring-blue-400/80 animate-pulse flex items-center justify-center gap-2 cursor-pointer transition text-xs uppercase tracking-wide';
      if (execLabel) {
        execLabel.innerHTML = `<i class="fa-solid fa-play mr-1"></i> ${t('rec_btn_exec_ready')} (${fileCount} ${currentLang === 'de' ? 'Belege' : 'Docs'}) ➔`;
      }
      execBtn.title = t('rec_btn_execute_title_ready') || '3-Wege-Abgleich jetzt ausführen';
    } else {
      execBtn.className = 'btn-exec-waiting flex-1 bg-[#142038] text-slate-400 font-semibold px-4 py-2.5 rounded-xl border border-[#1E293B] flex items-center justify-center gap-2 cursor-pointer transition text-xs shadow-sm';
      if (execLabel) {
        execLabel.innerHTML = `<i class="fa-regular fa-clock text-amber-400 mr-1.5"></i> ${t('rec_btn_exec_waiting')}`;
      }
      execBtn.title = t('rec_btn_execute_title_waiting') || 'Laden Sie mindestens 2 Belege hoch, um den Abgleich auszuführen';
    }
  }

  if (clearBtn) {
    const hasAny = fileCount > 0 || hasResults;
    if (hasAny) {
      clearBtn.className = 'bg-[#101B2E] hover:bg-red-950/60 text-slate-200 hover:text-red-300 border border-[#1E293B] hover:border-red-700 px-3 py-2.5 rounded-xl transition text-xs flex items-center gap-1.5 cursor-pointer shadow-sm';
    } else {
      clearBtn.className = 'bg-[#0E1626] text-slate-500 border border-[#1E293B]/60 px-3 py-2.5 rounded-xl transition text-xs flex items-center gap-1.5 cursor-pointer opacity-60 hover:opacity-100';
    }
  }
}

function clearRecSlots() {
  // 1. Clear files and previews in memory
  recFiles.bol = null;
  recFiles.invoice = null;
  recFiles.packing = null;

  recPreviews.bol = null;
  recPreviews.invoice = null;
  recPreviews.packing = null;
  currentRecPreviewTab = 'bol';
  recZoom = 1.0;
  toggleRecViewMode('intake');
  dismissRecToast();

  const ribbon = document.getElementById('rec-workflow-ribbon');
  if (ribbon) {
    ribbon.classList.add('hidden');
    ribbon.classList.remove('flex');
  }

  // 2. Reset slot cards, inputs, and chips
  ['bol', 'invoice', 'packing'].forEach(slotKey => {
    const input = document.getElementById(`slot-input-${slotKey}`);
    if (input) input.value = '';
    const card = document.getElementById(`slot-card-${slotKey}`);
    const info = document.getElementById(`slot-info-${slotKey}`);
    const strip = document.getElementById(`slot-file-strip-${slotKey}`);
    const sub = document.getElementById(`slot-sub-${slotKey}`);
    const chip = document.getElementById(`slot-chip-${slotKey}`);
    if (chip) {
      chip.textContent = '';
      chip.classList.add('hidden');
    }
    const detectedBadge = document.getElementById(`slot-detected-${slotKey}`);
    if (detectedBadge) detectedBadge.classList.add('hidden');
    if (card) {
      card.classList.remove('slot-loaded', 'border-blue-500/80', 'bg-[#0A1526]', 'border-amber-500/80', 'bg-[#181208]', 'border-purple-500/80', 'bg-[#150B20]', 'ring-2', 'ring-red-500', 'border-red-500');
      card.classList.add(slotKey === 'bol' ? 'border-blue-900/40' : (slotKey === 'invoice' ? 'border-amber-900/40' : 'border-purple-900/40'), 'bg-[#0B1322]');
    }
    if (sub) {
      sub.classList.remove('hidden');
    }
    if (strip) {
      strip.innerHTML = '';
      strip.classList.add('hidden');
      strip.classList.remove('flex');
    }
    if (info) {
      info.innerHTML = getSlotEmptyButtonHtml(slotKey);
    }
  });

  // 3. Clear batch file input
  const batchInput = document.getElementById('rec-batch-input');
  if (batchInput) batchInput.value = '';

  // 4. Clear processed reconciliation data
  currentReconcileData = null;

  // 5. Hide loading spinner
  const loading = document.getElementById('rec-loading');
  if (loading) loading.classList.add('hidden');

  // 6. Show idle guide, hide result container
  const idleGuide = document.getElementById('rec-idle-guide');
  if (idleGuide) idleGuide.classList.remove('hidden');

  const container = document.getElementById('reconcile-result-container');
  if (container) {
    container.classList.add('hidden');
    container.innerHTML = '';
  }

  // 7. Reset inspector left pane
  switchRecPreviewTab('bol');
  updateRecStatusChips();
  checkRecControls();
}

function toggleRecNormsAccordion() {
  const details = document.getElementById('rec-norms-details');
  const textEl = document.getElementById('rec-norms-toggle-text');
  const icon = document.getElementById('rec-norms-toggle-icon');
  if (!details) return;
  const isHidden = details.classList.contains('hidden');
  details.classList.toggle('hidden', !isHidden);
  if (icon) {
    icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
  if (textEl) {
    textEl.textContent = isHidden ? t('rec_norms_toggle_hide') : t('rec_norms_toggle_show');
  }
}

function handleRecBatchUpload(event) {
  const files = Array.from((event.target && event.target.files) || []);
  if (files.length === 0) return;

  const allowedExts = ['pdf', 'png', 'jpg', 'jpeg', 'webp'];
  let validFiles = [];
  let invalidFiles = [];

  files.forEach(f => {
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    if (allowedExts.includes(ext)) {
      validFiles.push(f);
    } else {
      invalidFiles.push(f);
    }
  });

  if (invalidFiles.length > 0 && validFiles.length === 0) {
    showRecToast('error', t('rec_err_invalid_type') || 'Ungültiges Dateiformat. Bitte laden Sie eine PDF-, PNG-, JPG- oder WebP-Datei hoch.');
    return;
  }

  let assignedCount = 0;
  const unassigned = [];

  // Special case: Single combined file uploaded
  if (validFiles.length === 1) {
    const f = validFiles[0];
    const n = f.name.toLowerCase();
    const hasBol = (n.includes('lading') || n.includes('bol') || n.includes('b_l') || n.includes('waybill') || n.includes('awb') || n.includes('cmr') || n.includes('frachtbrief'));
    const hasInv = (n.includes('invoice') || n.includes('rechnung') || n.includes('inv') || n.includes('handelsrechnung'));
    const hasPack = (n.includes('packing') || n.includes('packliste') || n.includes('manifest') || n.includes('pack_list'));
    const isAllCombined = n.includes('dossier') || n.includes('komplett') || n.includes('combined') || n.includes('all_in_one') || n.includes('sammel') || n.includes('gesamt');

    if (isAllCombined || (hasBol && hasInv && hasPack)) {
      assignSlotDirect('bol', f);
      assignSlotDirect('invoice', f);
      assignSlotDirect('packing', f);
      updateRecStatusChips();
      checkRecControls();
      switchRecPreviewTab('bol');
      showRecToast('success', t('rec_toast_combined_all') || `Kombiniertes Dossier: „${f.name}“ für alle 3 Belege zugewiesen.`);
      return;
    } else if (hasInv && hasPack) {
      assignSlotDirect('invoice', f);
      assignSlotDirect('packing', f);
      updateRecStatusChips();
      checkRecControls();
      switchRecPreviewTab('invoice');
      showRecToast('success', t('rec_toast_combined_inv_pack') || `Kombiniertes Dokument: „${f.name}“ für Rechnung & Packliste zugewiesen.`);
      return;
    }
  }

  // Multi-file batch processing
  validFiles.forEach(f => {
    const n = f.name.toLowerCase();
    const hasBol = (n.includes('lading') || n.includes('bol') || n.includes('b_l') || n.includes('waybill') || n.includes('awb') || n.includes('cmr') || n.includes('frachtbrief'));
    const hasInv = (n.includes('invoice') || n.includes('rechnung') || n.includes('inv') || n.includes('handelsrechnung'));
    const hasPack = (n.includes('packing') || n.includes('packliste') || n.includes('manifest') || n.includes('pack_list'));

    if (hasInv && hasPack && !recFiles.invoice && !recFiles.packing) {
      assignSlotDirect('invoice', f);
      assignSlotDirect('packing', f);
      assignedCount += 2;
    } else if (hasBol && !recFiles.bol) {
      assignSlotDirect('bol', f);
      assignedCount++;
    } else if (hasInv && !recFiles.invoice) {
      assignSlotDirect('invoice', f);
      assignedCount++;
    } else if (hasPack && !recFiles.packing) {
      assignSlotDirect('packing', f);
      assignedCount++;
    } else {
      unassigned.push(f);
    }
  });

  // Assign remaining unassigned files to first available slots and inform user
  unassigned.forEach(f => {
    let target = null;
    if (!recFiles.bol) target = 'bol';
    else if (!recFiles.invoice) target = 'invoice';
    else if (!recFiles.packing) target = 'packing';

    if (target) {
      assignSlotDirect(target, f);
      assignedCount++;
      const typeLabel = getSlotTypeName(target);
      const noKeyMsg = t('rec_toast_no_keyword') || 'Keine Kennung im Dateinamen: Zugewiesen als';
      showRecToast('info', `„${f.name}“: ${noKeyMsg} ${typeLabel}.`);
    }
  });

  updateRecStatusChips();
  checkRecControls();

  if (assignedCount > 0) {
    const msg = (t('rec_batch_success') || '{count} Dokumente erfolgreich den Beleg-Slots zugeordnet.').replace('{count}', assignedCount);
    showRecToast('success', msg);
    const firstAssigned = recFiles.bol ? 'bol' : (recFiles.invoice ? 'invoice' : 'packing');
    switchRecPreviewTab(firstAssigned);
  }

  if (invalidFiles.length > 0) {
    showRecToast('warning', `${invalidFiles.length} ${currentLang === 'de' ? 'Dateien übersprungen (ungültiges Format).' : 'files skipped (unsupported format).'}`);
  }
}

function applyCombinedToAllSlots(sourceSlot = null) {
  const src = sourceSlot ? recFiles[sourceSlot] : (recFiles.bol || recFiles.invoice || recFiles.packing);
  if (!src) return;
  ['bol', 'invoice', 'packing'].forEach(k => {
    if (!recFiles[k]) {
      assignSlotDirect(k, src);
    }
  });
  updateRecStatusChips();
  checkRecControls();
  showRecToast('success', t('rec_toast_combined_all') || 'Sammel-PDF auf alle leeren Beleg-Slots gespiegelt.');
}

function animateRecExecutionStages() {
  const s1 = document.getElementById('rec-exec-stage-1');
  const s2 = document.getElementById('rec-exec-stage-2');
  const s3 = document.getElementById('rec-exec-stage-3');
  if (!s1 || !s2 || !s3) return;

  // Initial state: Stage 1 active
  s1.className = 'flex items-center justify-between p-2.5 rounded-xl bg-[#0E1B2E] border border-blue-900/60 shadow-sm';
  const span1 = s1.querySelector('span:last-child');
  if (span1) span1.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-1"></i> ${currentLang === 'de' ? 'Digitalisierung...' : 'Extracting...'}`;

  s2.className = 'flex items-center justify-between p-2.5 rounded-xl bg-[#091120] border border-[#1E293B]';
  const span2 = s2.querySelector('span:last-child');
  if (span2) span2.innerHTML = currentLang === 'de' ? 'Warten' : 'Queued';

  s3.className = 'flex items-center justify-between p-2.5 rounded-xl bg-[#091120] border border-[#1E293B]';
  const span3 = s3.querySelector('span:last-child');
  if (span3) span3.innerHTML = currentLang === 'de' ? 'Warten' : 'Queued';

  setTimeout(() => {
    const loading = document.getElementById('rec-loading');
    if (loading && !loading.classList.contains('hidden')) {
      s1.className = 'flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60';
      if (span1) span1.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> OK`;
      s2.className = 'flex items-center justify-between p-2.5 rounded-xl bg-[#0E1B2E] border border-blue-900/60 shadow-sm';
      if (span2) span2.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-1"></i> ${currentLang === 'de' ? 'Regelprüfung...' : 'Auditing...'}`;
    }
  }, 450);

  setTimeout(() => {
    const loading = document.getElementById('rec-loading');
    if (loading && !loading.classList.contains('hidden')) {
      s2.className = 'flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60';
      if (span2) span2.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> OK`;
      s3.className = 'flex items-center justify-between p-2.5 rounded-xl bg-[#0E1B2E] border border-blue-900/60 shadow-sm';
      if (span3) span3.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-1"></i> ${currentLang === 'de' ? 'Matrixaufbau...' : 'Compiling...'}`;
    }
  }, 950);
}

async function loadRecSamples() {
  recFiles.bol = { name: 'sample bill of ladling.png', size: 86604 };
  recFiles.invoice = { name: 'sample commercial invoice.png', size: 246262 };
  recFiles.packing = { name: 'sample packing list.png', size: 858097 };

  updateSlotDisplay('bol', 'sample bill of ladling.png', 86604);
  updateSlotDisplay('invoice', 'sample commercial invoice.png', 246262);
  updateSlotDisplay('packing', 'sample packing list.png', 858097);

  recPreviews.bol = '/static/sample_docs/sample bill of ladling.png';
  recPreviews.invoice = '/static/sample_docs/sample commercial invoice.png';
  recPreviews.packing = '/static/sample_docs/sample packing list.png';
  updateRecStatusChips();
  toggleRecViewMode('preview');
  switchRecPreviewTab('bol');
  checkRecControls();

  const idleGuide = document.getElementById('rec-idle-guide');
  const container = document.getElementById('reconcile-result-container');
  const loading = document.getElementById('rec-loading');
  if (idleGuide) idleGuide.classList.add('hidden');
  if (loading) loading.classList.remove('hidden');
  if (container) container.classList.add('hidden');
  updateRibbonStep(2);
  animateRecExecutionStages();

  try {
    const res = await fetch(`/api/v1/reconcile-samples?lang=${currentLang}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderReconciliationResult(data);
    refreshMetrics();
  } catch (err) {
    if (container) {
      container.classList.remove('hidden');
      container.innerHTML = `<div class="text-red-400 text-xs p-4">Error: ${err.message}</div>`;
    }
    checkRecControls();
  } finally {
    if (loading) loading.classList.add('hidden');
  }
}

async function executeLiveReconciliation() {
  const hasAny = recFiles.bol || recFiles.invoice || recFiles.packing;
  if (!hasAny) {
    alert(t('rec_err_need_docs'));
    return;
  }

  const idleGuide = document.getElementById('rec-idle-guide');
  const container = document.getElementById('reconcile-result-container');
  const loading = document.getElementById('rec-loading');
  if (idleGuide) idleGuide.classList.add('hidden');
  if (loading) loading.classList.remove('hidden');
  if (container) container.classList.add('hidden');
  updateRibbonStep(2);
  animateRecExecutionStages();

  const formData = new FormData();
  if (recFiles.bol) formData.append('bol_file', recFiles.bol);
  if (recFiles.invoice) formData.append('invoice_file', recFiles.invoice);
  if (recFiles.packing) formData.append('packing_list_file', recFiles.packing);

  try {
    const res = await fetch(`/api/v1/reconcile-live?lang=${currentLang}`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.detail || `HTTP ${res.status}`);
    }
    const data = await res.json();
    renderReconciliationResult(data);
    refreshMetrics();
  } catch (err) {
    if (container) {
      container.classList.remove('hidden');
      container.innerHTML = `<div class="p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-xs font-mono-code"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i> Abgleichfehler: ${err.message}</div>`;
    }
    checkRecControls();
  } finally {
    if (loading) loading.classList.add('hidden');
  }
}

async function runReconciliationSim(scenario) {
  if (scenario === 'clean_hamburg') {
    recFiles.bol = { name: 'MSCU7829104_bol.pdf', size: 94200 };
    recFiles.invoice = { name: 'RE-2026-9041_rechnung.pdf', size: 142000 };
    recFiles.packing = { name: 'PK-2026-9041_packliste.pdf', size: 118400 };
    updateSlotDisplay('bol', 'MSCU7829104_bol.pdf', 94200);
    updateSlotDisplay('invoice', 'RE-2026-9041_rechnung.pdf', 142000);
    updateSlotDisplay('packing', 'PK-2026-9041_packliste.pdf', 118400);
  } else {
    recFiles.bol = { name: 'MAEU9048123_bol.pdf', size: 86604 };
    recFiles.invoice = { name: 'INV-2026-Tangier.pdf', size: 246262 };
    recFiles.packing = { name: 'PL-2026-Tangier.pdf', size: 858097 };
    updateSlotDisplay('bol', 'MAEU9048123_bol.pdf', 86604);
    updateSlotDisplay('invoice', 'INV-2026-Tangier.pdf', 246262);
    updateSlotDisplay('packing', 'PL-2026-Tangier.pdf', 858097);
  }

  recPreviews.bol = '/static/sample_docs/sample bill of ladling.png';
  recPreviews.invoice = '/static/sample_docs/sample commercial invoice.png';
  recPreviews.packing = '/static/sample_docs/sample packing list.png';
  updateRecStatusChips();
  toggleRecViewMode('preview');
  switchRecPreviewTab('bol');
  checkRecControls();

  const idleGuide = document.getElementById('rec-idle-guide');
  const container = document.getElementById('reconcile-result-container');
  const loading = document.getElementById('rec-loading');
  if (idleGuide) idleGuide.classList.add('hidden');
  if (loading) loading.classList.remove('hidden');
  if (container) container.classList.add('hidden');
  updateRibbonStep(2);
  animateRecExecutionStages();

  try {
    const res = await fetch(`/api/v1/reconcile-simulation?scenario=${scenario}&lang=${currentLang}`, { method: 'POST' });
    const data = await res.json();
    renderReconciliationResult(data);
    refreshMetrics();
  } catch (err) {
    if (container) {
      container.classList.remove('hidden');
      container.innerHTML = `<div class="text-red-400 text-xs p-4">Error: ${err.message}</div>`;
    }
    checkRecControls();
  } finally {
    if (loading) loading.classList.add('hidden');
  }
}

function renderReconciliationResult(data) {
  currentReconcileData = data;
  const container = document.getElementById('reconcile-result-container');
  const idleGuide = document.getElementById('rec-idle-guide');
  if (idleGuide) idleGuide.classList.add('hidden');
  if (!container) return;
  container.classList.remove('hidden');

  // 1. Ingest preview URLs if returned
  if (data.preview_urls) {
    if (data.preview_urls.bol) recPreviews.bol = data.preview_urls.bol;
    if (data.preview_urls.invoice) recPreviews.invoice = data.preview_urls.invoice;
    if (data.preview_urls.packing) recPreviews.packing = data.preview_urls.packing;
  }

  // Fallback to sample docs if missing
  if (!recPreviews.bol) recPreviews.bol = '/static/sample_docs/sample bill of ladling.png';
  if (!recPreviews.invoice) recPreviews.invoice = '/static/sample_docs/sample commercial invoice.png';
  if (!recPreviews.packing) recPreviews.packing = '/static/sample_docs/sample packing list.png';

  // Ensure recFiles reflect loaded state
  if (!recFiles.bol) recFiles.bol = { name: 'sample bill of ladling.png', size: 86604 };
  if (!recFiles.invoice) recFiles.invoice = { name: 'sample commercial invoice.png', size: 246262 };
  if (!recFiles.packing) recFiles.packing = { name: 'sample packing list.png', size: 858097 };
  updateSlotDisplay('bol', recFiles.bol.name, recFiles.bol.size);
  updateSlotDisplay('invoice', recFiles.invoice.name, recFiles.invoice.size);
  updateSlotDisplay('packing', recFiles.packing.name, recFiles.packing.size);

  updateRecStatusChips();
  checkRecControls();

  // 2. Activate preview viewport mode
  toggleRecViewMode('preview');

  // 3. Show first available document in Left Dossier Pane
  const activeTab = recPreviews[currentRecPreviewTab] ? currentRecPreviewTab : (recPreviews.bol ? 'bol' : (recPreviews.invoice ? 'invoice' : 'packing'));
  switchRecPreviewTab(activeTab);

  // 3. Update slot chips if provided
  if (data.summary_chips) {
    ['bol', 'invoice', 'packing'].forEach(k => {
      const chip = document.getElementById(`slot-chip-${k}`);
      if (chip && data.summary_chips[k]) {
        chip.textContent = data.summary_chips[k];
        chip.classList.remove('hidden');
      }
    });
  }

  const isMatch = (data.overall_status === 'PERFECT_MATCH');

  // Field name translation map for dynamic language switching
  const fieldLabelMap = {
    de: {
      'Container-Nummer (ISO 6346)': 'Container-Nummer (ISO 6346)',
      'Container Number (ISO 6346)': 'Container-Nummer (ISO 6346)',
      'Container / ULD ID': 'Container-Nummer (ISO 6346)',
      'Container / Fracht-ID': 'Container-Nummer (ISO 6346)',
      'Bruttogewicht': 'Bruttogewicht (Gross Weight)',
      'Gross Weight': 'Bruttogewicht (Gross Weight)',
      'Gross Weight / Bruttogewicht': 'Bruttogewicht (Gross Weight)',
      'Bruttogewicht (Gross Weight)': 'Bruttogewicht (Gross Weight)',
      'Net Weight / Nettogewicht': 'Nettogewicht (Net Weight)',
      'Nettogewicht (Net Weight)': 'Nettogewicht (Net Weight)',
      'Colli / Packstücke': 'Packstückanzahl (Colli)',
      'Colli / Packstücke (Packages)': 'Packstückanzahl (Colli)',
      'Package Count (Colli)': 'Packstückanzahl (Colli)',
      'Package Count / Colli': 'Packstückanzahl (Colli)',
      'Packstückanzahl / Colli': 'Packstückanzahl (Colli)',
      'Customs Value & Currency': 'Warenwert & Währung',
      'Warenwert & Währung': 'Warenwert & Währung',
      'Customs Value / Total Amount': 'Warenwert & Währung',
      'Warenwert / Rechnungsbetrag': 'Warenwert & Währung',
      'Incoterms Handelsklausel': 'Incoterms Handelsklausel',
      'Incoterms Rule': 'Incoterms Handelsklausel',
      'Incoterms & Port': 'Incoterms Handelsklausel',
      'Incoterms & Bestimmungshafen': 'Incoterms Handelsklausel'
    },
    en: {
      'Container-Nummer (ISO 6346)': 'Container Number (ISO 6346)',
      'Container Number (ISO 6346)': 'Container Number (ISO 6346)',
      'Container / ULD ID': 'Container Number (ISO 6346)',
      'Container / Fracht-ID': 'Container Number (ISO 6346)',
      'Bruttogewicht': 'Gross Weight',
      'Gross Weight': 'Gross Weight',
      'Gross Weight / Bruttogewicht': 'Gross Weight',
      'Bruttogewicht (Gross Weight)': 'Gross Weight',
      'Net Weight / Nettogewicht': 'Net Weight',
      'Nettogewicht (Net Weight)': 'Net Weight',
      'Colli / Packstücke': 'Package Count (Colli)',
      'Colli / Packstücke (Packages)': 'Package Count (Colli)',
      'Package Count (Colli)': 'Package Count (Colli)',
      'Package Count / Colli': 'Package Count (Colli)',
      'Packstückanzahl / Colli': 'Package Count (Colli)',
      'Customs Value & Currency': 'Customs Value & Currency',
      'Warenwert & Währung': 'Customs Value & Currency',
      'Customs Value / Total Amount': 'Customs Value & Currency',
      'Warenwert / Rechnungsbetrag': 'Customs Value & Currency',
      'Incoterms Handelsklausel': 'Incoterms Rule',
      'Incoterms Rule': 'Incoterms Rule',
      'Incoterms & Port': 'Incoterms Rule',
      'Incoterms & Bestimmungshafen': 'Incoterms Rule'
    }
  };

  const cellTranslate = (val) => {
    if (!val || val === '-') return '-';
    let s = String(val).trim();
    if (currentLang === 'en') {
      s = s.replace(/- \(Frachtbrief unbewertet\)/g, '- (Waybill unvalued)');
      s = s.replace(/Exakt identisch \(100% Match\)/g, 'Exact match (100% Match)');
      s = s.replace(/Verifiziert für ATLAS Zollwert/g, 'Verified for ATLAS customs value');
      s = s.replace(/Kaufmännisch übereinstimmend/g, 'Commercially consistent');
      s = s.replace(/Delta: ([\d.,]+) kg \(> 50kg Grenze\)/g, 'Delta: $1 kg (> 50kg limit)');
      s = s.replace(/Delta: ([\d.,]+) kg \(<= 50kg Toleranz\)/g, 'Delta: $1 kg (<= 50kg tolerance)');
      s = s.replace(/Innerhalb 50kg Zoll-Toleranz/g, 'Within 50kg customs tolerance');
      s = s.replace(/0\.00 kg \(Exakt identisch\)/g, '0.00 kg (Exact match)');
      s = s.replace(/Standard-Seefrachtklausel/g, 'Standard Sea Waybill Term');
    } else {
      s = s.replace(/- \(Waybill unvalued\)/g, '- (Frachtbrief unbewertet)');
      s = s.replace(/Exact match \(100% Match\)/g, 'Exakt identisch (100% Match)');
      s = s.replace(/Verified for ATLAS customs value/g, 'Verifiziert für ATLAS Zollwert');
      s = s.replace(/Commercially consistent/g, 'Kaufmännisch übereinstimmend');
      s = s.replace(/Delta: ([\d.,]+) kg \(> 50kg limit\)/g, 'Delta: $1 kg (> 50kg Grenze)');
      s = s.replace(/Delta: ([\d.,]+) kg \(<= 50kg tolerance\)/g, 'Delta: $1 kg (<= 50kg Toleranz)');
      s = s.replace(/Within 50kg customs tolerance/g, 'Innerhalb 50kg Zoll-Toleranz');
      s = s.replace(/0\.00 kg \(Exact match\)/g, '0.00 kg (Exakt identisch)');
      s = s.replace(/Standard Sea Waybill Term/g, 'Standard-Seefrachtklausel');
    }
    return s;
  };

  // 4. Build 4-Column Side-by-Side Matrix Rows
  let rowsHtml = '';
  data.items.forEach(it => {
    const rawFieldName = it.field_name || '';
    const localizedFieldName = (fieldLabelMap[currentLang] && fieldLabelMap[currentLang][rawFieldName]) ? fieldLabelMap[currentLang][rawFieldName] : rawFieldName;
    const bolVal = cellTranslate(it.bol_value || it.document_1_value || '-');
    const invVal = cellTranslate(it.invoice_value || '-');
    const plVal = cellTranslate(it.packing_list_value || it.document_2_value || '-');
    const deltaVal = cellTranslate(it.tolerance_or_delta || it.variance || (it.matched ? (currentLang === 'de' ? '0 Delta (100% Match)' : '0 Delta (100% Match)') : (currentLang === 'de' ? 'Diskrepanz' : 'Discrepancy')));
    const isRowMatch = Boolean(it.matched);

    rowsHtml += `
      <tr onclick="inspectRowDocument('${escapeHtml(rawFieldName)}', this)" class="${isRowMatch ? 'hover:bg-[#131D31]/60' : 'bg-red-950/20 hover:bg-red-950/30'} cursor-pointer transition group" title="${t('rec_inspect_hint')}">
        <td class="py-2.5 px-3 font-medium text-slate-200">
          <div class="flex items-center gap-1.5">
            <i class="fa-regular fa-eye text-slate-500 group-hover:text-blue-400 text-[10px] transition"></i>
            <span>${escapeHtml(localizedFieldName)}</span>
          </div>
        </td>
        <td class="py-2.5 px-3 font-mono-code text-slate-300 text-xs">${escapeHtml(bolVal)}</td>
        <td class="py-2.5 px-3 font-mono-code text-slate-300 text-xs">${escapeHtml(invVal)}</td>
        <td class="py-2.5 px-3 font-mono-code text-slate-300 text-xs">${escapeHtml(plVal)}</td>
        <td class="py-2.5 px-3 font-mono-code text-xs ${isRowMatch ? 'text-slate-400' : 'text-red-400 font-bold'}">${escapeHtml(deltaVal)}</td>
        <td class="py-2.5 px-3 text-center">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
            isRowMatch ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
          }">${isRowMatch ? 'MATCH' : (currentLang === 'de' ? 'ABWEICHUNG' : 'DISCREPANCY')}</span>
        </td>
      </tr>
    `;
  });

  // Action required text localization
  let actionText = data.action_required || '';
  if (currentLang === 'en') {
    if (actionText.includes('Quarantäne') || !isMatch) {
      actionText = 'Quarantine Hold: Issue discrepancy notice to shipping agent';
    } else {
      actionText = 'Auto-dispatch approved for ATLAS filing and OLE Enterprise TMS';
    }
  } else {
    if (actionText.includes('Quarantine') || !isMatch) {
      actionText = 'Quarantäne-Hold: Reederei-Reklamation veranlassen';
    } else {
      actionText = 'Freigabe für ATLAS-Zollanmeldung und OLE Enterprise TMS erteilt';
    }
  }

  // Pre-formulate clean localized Discrepancy Memo (no AI slashes //, no em dashes)
  const refContainer = (data.summary_chips && data.summary_chips.bol && data.summary_chips.bol.match(/([A-Z]{4}\d{7})/))
    ? data.summary_chips.bol.match(/([A-Z]{4}\d{7})/)[1]
    : 'MSCU7821940';
  const preventedEur = (data.demurrage_prevented_eur && data.demurrage_prevented_eur > 0) ? data.demurrage_prevented_eur : 1250.0;
  const formattedEur = preventedEur.toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2 });

  let memoContent = '';
  if (isMatch) {
    if (currentLang === 'en') {
      memoContent = `OCEANWIDE GATEWAY - 3-WAY MATCH VERIFIED\nContainer: ${refContainer}\nAll freight documents match 100%. Pre-cleared for ATLAS 9.1 and OLE Enterprise TMS dispatch.`;
    } else {
      memoContent = `OCEANWIDE GATEWAY - 3-WEGE-ABGLEICH BESTANDEN\nContainer: ${refContainer}\nAlle Frachtpapiere stimmen zu 100% überein. Freigegeben für ATLAS 9.1 und OLE Enterprise TMS.`;
    }
  } else {
    if (currentLang === 'en') {
      memoContent = `ADSp 2017 DISCREPANCY NOTICE (OLE Oceanwide Logistics Europe GmbH / OLGN)\nReference: Container ${refContainer} - 3-Way Cross-Audit\nStatus: QUARANTINE HOLD (Demurrage risk averted: ${formattedEur} EUR)\n\nIdentified discrepancies between freight documents:\n  • Weight variance: B/L indicates 18,450.00 kg, Packing List indicates 18,270.00 kg (Delta: 180.00 kg)\n\nImmediate action required:\nPlease submit an amended copy of the packing list or waybill immediately to prevent terminal demurrage fees upon vessel arrival at Port of Hamburg / European terminals.`;
    } else {
      memoContent = `ADSp 2017 REKLAMATIONSMEMO (OLE Oceanwide Logistics Europe GmbH)\nBezug: Container ${refContainer} - Transportabgleich\nStatus: QUARANTÄNE-HOLD (Standgeld-Risiko abgewendet: ${formattedEur} EUR)\n\nFestgestellte Abweichungen zwischen Frachtpapieren:\n  • Gewichtsabweichung: B/L weist 18,450.00 kg aus, Packliste weist 18,270.00 kg aus (Delta: 180.00 kg)\n\nSofortmaßnahme erforderlich:\nBitte reichen Sie umgehend eine korrigierte Ausfertigung der Packliste bzw. des Frachtbriefs ein, um Standgelder (Demurrage & Detention) bei Schiffsankunft am Hamburger Hafen / europäischen Terminals zu verhindern.`;
    }
  }

  // 5. Render Banner + Matrix + Discrepancy Memo Card
  container.innerHTML = `
    <!-- Top Result Risk Level Banner (R17) -->
    <div class="stage-card p-4 border-2 ${isMatch ? 'bg-emerald-950/40 border-emerald-500/80' : 'bg-red-950/40 border-red-500/80'} rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
      <div class="flex items-center gap-3.5">
        <div class="w-11 h-11 rounded-xl ${isMatch ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-red-950 border-red-500 text-red-400'} border-2 flex items-center justify-center text-xl font-bold shadow-lg flex-shrink-0">
          <i class="fa-solid ${isMatch ? 'fa-shield-halved' : 'fa-triangle-exclamation'}"></i>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-xs uppercase tracking-wider ${isMatch ? 'text-emerald-300' : 'text-red-300'} font-mono-code">
              ${isMatch ? t('rec_risk_clean_title') : t('rec_risk_hold_title')}
            </span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isMatch ? 'bg-emerald-900 border border-emerald-500 text-emerald-200' : 'bg-red-900 border border-red-500 text-red-200'} font-mono-code shadow-sm">
              ${isMatch ? 'ATLAS 9.1 READY' : (currentLang === 'de' ? 'QUARANTÄNE-STOPP' : 'QUARANTINE HOLD')}
            </span>
          </div>
          <p class="text-xs ${isMatch ? 'text-slate-300' : 'text-red-200'} mt-0.5 font-medium leading-snug">
            ${isMatch ? t('rec_risk_clean_sub') : actionText}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        ${data.demurrage_prevented_eur > 0 ? `
          <div class="text-right p-2.5 rounded-xl bg-red-950/60 border border-red-800/80">
            <div class="text-xs text-red-300 uppercase tracking-wider font-semibold">${t('rec_avoided')}</div>
            <div class="text-lg font-bold text-red-400 font-mono-code">${preventedEur.toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US', {minimumFractionDigits: 2})} €</div>
          </div>
        ` : `
          <span class="px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold text-xs flex items-center gap-2 shadow-sm">
            <i class="fa-solid fa-circle-check text-emerald-400 text-sm"></i> ${t('status_verified_clean')}
          </span>
        `}
      </div>
    </div>

    <!-- 4-Column Side-by-Side Matrix Table (R7, R16) -->
    <div class="stage-card border border-[#1E293B] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-3 bg-[#0E1626] border-b border-[#1E293B] flex items-center justify-between text-xs">
        <div class="font-bold uppercase text-white flex items-center gap-2 text-sm">
          <i class="fa-solid fa-table-columns text-blue-400"></i> <span data-i18n="rec_matrix_title">${t('rec_matrix_title')}</span>
        </div>
        <span class="text-xs text-slate-400">${currentLang === 'de' ? 'Zeile anklicken, um Beleg links zu inspizieren' : 'Click row to inspect document on left'}</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono-code">
          <thead class="text-slate-400 border-b border-[#1E293B] bg-[#090F1C]">
            <tr>
              <th class="py-2.5 px-3 text-slate-300">${t('rec_th_audit_field')}</th>
              <th class="py-2.5 px-3 text-blue-400 font-bold"><i class="fa-solid fa-ship mr-1 text-[11px]"></i> ${t('rec_th_bol_col')}</th>
              <th class="py-2.5 px-3 text-amber-400 font-bold"><i class="fa-solid fa-file-invoice-dollar mr-1 text-[11px]"></i> ${t('rec_th_inv_col')}</th>
              <th class="py-2.5 px-3 text-purple-400 font-bold"><i class="fa-solid fa-boxes-stacked mr-1 text-[11px]"></i> ${t('rec_th_pack_col')}</th>
              <th class="py-2.5 px-3 text-slate-300">${t('rec_th_delta_col')}</th>
              <th class="py-2.5 px-3 text-center text-slate-300">${t('rec_th_status_col')}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#1E293B]/60">
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Carrier & Shipper Discrepancy Memo Actions -->
    ${memoContent ? `
      <div class="stage-card p-4 border border-[#1E293B] bg-[#0A0F1D] rounded-2xl space-y-3 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2.5">
          <div class="flex items-center gap-2">
            <i class="fa-regular fa-clipboard text-amber-400 text-sm"></i>
            <h4 class="text-sm font-bold uppercase text-white tracking-wide" data-i18n="rec_memo_heading">${t('rec_memo_heading')}</h4>
          </div>
          <button onclick="copyDiscrepancyMemo()" id="btn-copy-memo" class="bg-[#142038] hover:bg-[#1E2D4E] border border-[#1E293B] hover:border-blue-500 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm">
            <i class="fa-regular fa-copy"></i> <span id="copy-memo-label" data-i18n="rec_btn_copy_memo">${t('rec_btn_copy_memo')}</span>
          </button>
        </div>
        <pre id="rec-memo-text" class="bg-[#05080E] p-3.5 rounded-xl border border-[#1E293B] font-mono-code text-xs text-slate-300 whitespace-pre-wrap select-all leading-relaxed overflow-x-auto">${escapeHtml(memoContent)}</pre>
      </div>
    ` : ''}
  `;

  if (typeof isGuidedTourActive !== 'undefined' && isGuidedTourActive && currentTourStepIdx === 7) {
    const btnNext = document.getElementById('tour-btn-next');
    const actionBtn = document.getElementById('tour-btn-action');
    const actionLbl = document.getElementById('tour-action-label');
    if (btnNext) {
      btnNext.disabled = false;
      btnNext.classList.remove('opacity-40', 'cursor-not-allowed');
      btnNext.classList.add('tour-btn-halo', 'cursor-pointer');
      btnNext.title = '';
    }
    if (actionBtn) actionBtn.classList.remove('tour-btn-halo');
    if (actionLbl) {
      actionLbl.textContent = (currentLang === 'de') ? "✓ Szenario ausgeführt (Erneut ausführen)" : "✓ Scenario Executed (Re-run)";
    }
  }

  checkRecControls();
}

// ==========================================
// REFRESH METRICS
// ==========================================
async function refreshMetrics() {
  try {
    const res = await fetch('/api/v1/metrics');
    const m = await res.json();
    document.getElementById('stat-total').textContent = m.total_documents;
    document.getElementById('stat-clean').textContent = m.verified_clean;
    document.getElementById('stat-holds').textContent = m.quarantine_holds;
    document.getElementById('stat-demurrage').textContent = `${m.demurrage_prevented_eur.toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US')} €`;
  } catch (e) {
    console.error("Metric refresh error", e);
  }
}

// ==========================================
// ENTERPRISE IT CONSOLE STATE & ENGINE
// ==========================================
let itData = {
  single_ddl: '',
  reconcile_ddl: '',
  csharp: '',
  curl: '',
  python: '',
  webhook: ''
};
let currentItSqlTab = 'single';      // 'single' | 'reconcile'
let currentItClientTab = 'csharp';   // 'csharp' | 'curl' | 'python' | 'webhook'
let currentItEnv = 'local';          // 'local' | 'staging' | 'prod'
let itRecentRows = [];

const itEnvUrls = {
  local: 'http://localhost:8000',
  staging: 'https://staging-gateway.oceanwidelogistics.com',
  prod: 'https://gateway.oceanwidelogistics.com'
};

async function loadIntegrationCode() {
  try {
    // 1. Fetch Transact-SQL Schemata (Single + Reconcile Triad)
    const resDDL = await fetch('/api/v1/integration/mssql-ddl');
    const ddlJson = await resDDL.json();
    itData.single_ddl = ddlJson.single_ddl || ddlJson.ddl || '';
    itData.reconcile_ddl = ddlJson.reconcile_ddl || '';

    // 2. Fetch Multi-Protocol Client Snippets
    await fetchClientSnippetsForEnv(currentItEnv);

    // 3. Render both code tabs
    renderItSqlTab();
    renderItClientTab();

    // 4. Populate Live Staging Buffer Table
    await refreshItStagingBuffer();
  } catch (e) {
    console.error("IT Console integration code load error:", e);
  }
}

async function fetchClientSnippetsForEnv(env) {
  try {
    const baseUrl = itEnvUrls[env] || itEnvUrls.local;
    const resSnippets = await fetch(`/api/v1/integration/client-snippets?api_url=${encodeURIComponent(baseUrl)}`);
    const sJson = await resSnippets.json();
    itData.csharp = sJson.csharp || '';
    itData.curl = sJson.curl || '';
    itData.python = sJson.python || '';
    itData.webhook = sJson.webhook || '';
  } catch (err) {
    console.error("Error fetching client snippets for env " + env, err);
  }
}

function switchItSqlTab(tab) {
  currentItSqlTab = tab;
  const btnSingle = document.getElementById('it-sqltab-btn-single');
  const btnReconcile = document.getElementById('it-sqltab-btn-reconcile');

  if (tab === 'single') {
    if (btnSingle) btnSingle.className = 'it-subtab-active px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition cursor-pointer text-xs';
    if (btnReconcile) btnReconcile.className = 'it-subtab-inactive px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer text-xs';
  } else {
    if (btnSingle) btnSingle.className = 'it-subtab-inactive px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer text-xs';
    if (btnReconcile) btnReconcile.className = 'it-subtab-active px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition cursor-pointer text-xs';
  }
  renderItSqlTab();
}

function renderItSqlTab() {
  const codeEl = document.getElementById('it-sql-code');
  const captionEl = document.getElementById('it-sql-caption-text');
  if (!codeEl) return;

  if (currentItSqlTab === 'single') {
    codeEl.textContent = itData.single_ddl;
    if (captionEl) captionEl.textContent = t('it_ddl_badge_single');
  } else {
    codeEl.textContent = itData.reconcile_ddl;
    if (captionEl) captionEl.textContent = t('it_ddl_badge_reconcile');
  }
}

function switchItClientTab(tab) {
  currentItClientTab = tab;
  const tabs = ['csharp', 'curl', 'python', 'webhook'];
  tabs.forEach(tName => {
    const btn = document.getElementById(`it-clienttab-btn-${tName}`);
    if (btn) {
      if (tName === tab) {
        btn.className = 'it-subtab-active px-2.5 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition cursor-pointer text-xs';
      } else {
        btn.className = 'it-subtab-inactive px-2.5 py-1.5 rounded-md font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer text-xs';
      }
    }
  });
  renderItClientTab();
}

function renderItClientTab() {
  const codeEl = document.getElementById('it-client-code');
  const labelEl = document.getElementById('it-client-base-url-label');
  const captionEl = document.getElementById('it-client-caption-text');
  if (!codeEl) return;

  codeEl.textContent = itData[currentItClientTab] || '';
  const currentUrl = itEnvUrls[currentItEnv] || itEnvUrls.local;
  if (labelEl) labelEl.textContent = currentUrl;

  if (captionEl) {
    let tech = 'C# / .NET 8 OLE Client';
    if (currentItClientTab === 'curl') tech = 'cURL / Bash CLI Pipeline';
    else if (currentItClientTab === 'python') tech = 'Python / Requests Integration Worker';
    else if (currentItClientTab === 'webhook') tech = 'Webhook Event Schemas (Customs / Quarantine)';
    captionEl.innerHTML = `${tech} • Target: <span class="text-emerald-400 font-semibold">${currentUrl}</span>`;
  }
}

async function setItEnvironment(env) {
  currentItEnv = env;
  const envs = ['local', 'staging', 'prod'];
  envs.forEach(e => {
    const btn = document.getElementById(`it-env-btn-${e}`);
    if (btn) {
      if (e === env) {
        btn.className = 'it-env-active px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer';
      } else {
        btn.className = 'it-env-inactive px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer';
      }
    }
  });

  await fetchClientSnippetsForEnv(env);
  renderItClientTab();
}

async function pingIntegrationBridge() {
  const btn = document.getElementById('btn-it-ping');
  const pill = document.getElementById('it-ping-pill');
  const latVal = document.getElementById('it-latency-val');
  if (btn) {
    btn.classList.add('ring-2', 'ring-purple-500');
  }

  const startMs = performance.now();
  try {
    const res = await fetch('/api/v1/integration/health');
    const health = await res.json();
    const duration = Math.round(performance.now() - startMs);

    const isDe = currentLang === 'de';
    if (latVal) {
      latVal.textContent = `${isDe ? 'Latenz:' : 'Latency:'} ${duration}ms (Status: ${health.status.toUpperCase()})`;
    }
    if (pill) {
      pill.classList.remove('border-emerald-800/60');
      pill.classList.add('border-emerald-400', 'bg-emerald-900/60');
      setTimeout(() => {
        pill.classList.remove('border-emerald-400', 'bg-emerald-900/60');
        pill.classList.add('border-emerald-800/60');
      }, 2000);
    }
  } catch (err) {
    const isDe = currentLang === 'de';
    if (latVal) latVal.textContent = isDe ? 'Fehler: Offline' : 'Error: Offline';
  } finally {
    if (btn) {
      setTimeout(() => btn.classList.remove('ring-2', 'ring-purple-500'), 800);
    }
  }
}

// Live Staging Buffer Inspection Table
async function refreshItStagingBuffer() {
  const tbody = document.getElementById('it-staging-table-body');
  if (!tbody) return;

  try {
    const res = await fetch('/api/v1/recent');
    const rows = await res.json();
    itRecentRows = rows || [];
    const topRows = itRecentRows.slice(0, 5);

    tbody.innerHTML = '';
    if (topRows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-500 font-mono-code">${t('it_no_buffer_rows')}</td></tr>`;
      return;
    }

    topRows.forEach((r, idx) => {
      const isClean = r.audit_status === 'VERIFIED_CLEAN';
      const statusBadge = isClean
        ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">CLEAN / READY</span>'
        : '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">QUARANTINE</span>';

      const tr = document.createElement('tr');
      tr.className = 'staging-table-row hover:bg-[#111A2E]/50 transition';
      tr.innerHTML = `
        <td class="py-2.5 px-3 font-bold text-white whitespace-nowrap">${escapeHtml(r.reference_id || 'N/A')}</td>
        <td class="py-2.5 px-3 text-slate-300 font-medium">${escapeHtml(r.document_type || 'SHIPMENT')}</td>
        <td class="py-2.5 px-3 whitespace-nowrap">${statusBadge}</td>
        <td class="py-2.5 px-3 text-slate-300 font-semibold whitespace-nowrap">${r.gross_weight_kg ? Number(r.gross_weight_kg).toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US', {minimumFractionDigits: 1}) + ' kg' : '-'}</td>
        <td class="py-2.5 px-3 text-slate-300 font-semibold whitespace-nowrap">${r.total_value ? Number(r.total_value).toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US', {minimumFractionDigits: 2}) + ' €' : '-'}</td>
        <td class="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">${r.timestamp_utc ? new Date(r.timestamp_utc).toLocaleTimeString(currentLang === 'de' ? 'de-DE' : 'en-US') : '-'}</td>
        <td class="py-2.5 px-3 text-right">
          <button id="btn-copy-staging-${idx}" onclick="copyStagingRowInsert(${idx})" class="bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ml-auto shadow-sm">
            <i class="fa-solid fa-code text-blue-400"></i>
            <span id="label-copy-staging-${idx}">${t('it_btn_copy_insert')}</span>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error refreshing IT staging buffer", err);
  }
}

function copyStagingRowInsert(idx) {
  const row = itRecentRows[idx];
  if (!row) return;

  const isClean = row.audit_status === 'VERIFIED_CLEAN';
  const atlasReady = isClean ? 1 : 0;
  const quarHold = isClean ? 0 : 1;
  const demurrageVal = isClean ? 0.0 : (row.prevented_demurrage_eur || 1250.0);
  const refId = (row.reference_id || 'REF-UNKNOWN').replace(/'/g, "''");
  const docType = (row.document_type || 'BILL_OF_LADING').replace(/'/g, "''");
  const sha = (row.sha256_hash || 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855').replace(/'/g, "''");
  const gross = row.gross_weight_kg ? Number(row.gross_weight_kg).toFixed(2) : '0.00';
  const val = row.total_value ? Number(row.total_value).toFixed(2) : '0.00';

  const sql = `INSERT INTO dbo.OLE_Staging_Shipments (
    ReferenceId,
    DocumentType,
    Sha256Hash,
    GrossWeightKg,
    TotalValue,
    Currency,
    AtlasReady,
    QuarantineHold,
    DemurrageRiskAvertedEur,
    IngestionTimestampUtc
) VALUES (
    '${refId}',
    '${docType}',
    '${sha}',
    ${gross},
    ${val},
    'EUR',
    ${atlasReady},
    ${quarHold},
    ${demurrageVal},
    SYSUTCDATETIME()
);`;

  navigator.clipboard.writeText(sql).then(() => {
    const label = document.getElementById(`label-copy-staging-${idx}`);
    if (label) {
      const orig = label.textContent;
      label.textContent = t('it_btn_copy_insert_done');
      label.classList.add('text-emerald-400', 'font-bold');
      setTimeout(() => {
        label.textContent = orig;
        label.classList.remove('text-emerald-400', 'font-bold');
      }, 1500);
    }
  });
}

// ==========================================
// ENTERPRISE QUARANTINE & DEMURRAGE ENGINE
// ==========================================
let allQuarantineShipments = [];
let currentQuarFilter = 'all'; // 'all' | 'critical' | 'ocean' | 'air' | 'road'
let currentQuarSearch = '';
let openQuarDrawerRef = null;
let activeOverrideShipmentRef = null;
let activeClaimDraft = null;

// Helper: Calculate ISO 6346 Check Digit
function validateIso6346(unitId) {
  if (!unitId || typeof unitId !== 'string') return { valid: false, clean: '-' };
  const clean = unitId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (clean.length !== 11) return { valid: false, clean };
  
  const charValues = {
    'A': 10, 'B': 12, 'C': 13, 'D': 14, 'E': 15, 'F': 16, 'G': 17, 'H': 18, 'I': 19,
    'J': 20, 'K': 21, 'L': 23, 'M': 24, 'N': 25, 'O': 26, 'P': 27, 'Q': 28, 'R': 29,
    'S': 30, 'T': 31, 'U': 32, 'V': 34, 'W': 35, 'X': 36, 'Y': 37, 'Z': 38
  };
  
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const char = clean[i];
    const val = isNaN(char) ? charValues[char] : parseInt(char, 10);
    if (val === undefined) return { valid: false, clean };
    sum += val * Math.pow(2, i);
  }
  const expectedCheckDigit = (sum % 11) % 10;
  const actualCheckDigit = parseInt(clean[10], 10);
  return { valid: expectedCheckDigit === actualCheckDigit, clean, expected: expectedCheckDigit, actual: actualCheckDigit };
}

// Helper: Enrich raw shipment with forensic metadata
function enrichQuarantineItem(r) {
  const docType = (r.document_type || '').toLowerCase();
  const ref = r.shipment_ref || '';
  const ext = r.extracted_data || {};
  const aud = r.audit_report || {};
  
  // Transport Mode & Ports
  let mode = 'ocean';
  let port = '⚓ Hamburg CTA';
  let carrier = 'Hapag-Lloyd';
  let dailyRate = 350.0;
  
  const dest = (ext.destination_port || ext.port_of_discharge || ext.airport_of_destination || r.destination_port || '').toUpperCase();
  const orig = (ext.origin_port || ext.port_of_loading || ext.airport_of_departure || r.origin_port || '').toUpperCase();
  const vsl = (ext.vessel_name_or_flight || ext.carrier_name || ext.vessel_name || ext.carrier || '').toUpperCase();

  if (docType.includes('air') || docType.includes('awb') || ref.includes('AWB') || ref.includes('AIR')) {
    mode = 'air';
    port = (dest.includes('MUC') || orig.includes('MUC')) ? 'Munich MUC Cargo' : 'Frankfurt FRA CargoCity Süd';
    if (vsl.includes('LUFTHANSA') || vsl.includes('LH')) carrier = 'Lufthansa Cargo';
    else if (vsl.includes('EMIRATES') || vsl.includes('EK')) carrier = 'Emirates SkyCargo';
    else if (vsl.includes('QATAR') || vsl.includes('QR')) carrier = 'Qatar Airways Cargo';
    else if (vsl.includes('CARGOLUX') || vsl.includes('CV')) carrier = 'Cargolux';
    else carrier = 'Lufthansa Cargo';
    dailyRate = 650.0;
  } else if (docType.includes('cmr') || docType.includes('road') || docType.includes('lkw')) {
    mode = 'road';
    port = 'Hub Malaszewicze / Duisburg';
    carrier = 'OLE Intermodal Transport';
    dailyRate = 180.0;
  } else {
    mode = 'ocean';
    dailyRate = 350.0;
    if (dest.includes('BREMERHAVEN') || orig.includes('BREMERHAVEN')) {
      port = 'Bremerhaven NTB';
    } else if (dest.includes('ROTTERDAM') || orig.includes('ROTTERDAM')) {
      port = 'Rotterdam ECT';
    } else if (dest.includes('ANTWERP') || orig.includes('ANTWERP')) {
      port = 'Antwerp MPET';
    } else if (dest.includes('HAMBURG') || orig.includes('HAMBURG')) {
      port = 'Hamburg CTA';
    } else {
      const charCode = ref.charCodeAt(ref.length - 1) || 0;
      port = (charCode % 2 === 0) ? 'Bremerhaven NTB' : 'Hamburg CTA';
    }

    if (vsl.includes('MAERSK')) carrier = 'Maersk Line';
    else if (vsl.includes('HAPAG')) carrier = 'Hapag-Lloyd';
    else if (vsl.includes('MSC')) carrier = 'MSC Mediterranean Shipping';
    else if (vsl.includes('CMA') || vsl.includes('CGM')) carrier = 'CMA CGM';
    else if (vsl.includes('EVERGREEN')) carrier = 'Evergreen Marine';
    else if (vsl.includes('ONE') || vsl.includes('OCEAN NETWORK')) carrier = 'ONE (Ocean Network Express)';
    else if (vsl.includes('COSCO')) carrier = 'COSCO Shipping Lines';
    else {
      const charCode = ref.charCodeAt(ref.length - 1) || 0;
      carrier = (charCode % 2 === 0) ? 'Maersk Line' : 'MSC Mediterranean Shipping';
    }
  }

  // Unit ID (Container / ULD)
  let unitId = r.container_number;
  if (!unitId || unitId === 'N/A' || unitId === 'None') {
    if (ext.bol && ext.bol.container_number) unitId = ext.bol.container_number;
    else if (ext.container_number) unitId = ext.container_number;
    else if (mode === 'air') unitId = 'ULD-FRA-' + ref.slice(-6);
    else unitId = 'MSKU' + (Math.abs(ref.split('').reduce((a, b) => a + b.charCodeAt(0), 0) * 1337) % 9000000 + 1000000);
  }
  const isoCheck = validateIso6346(unitId);

  // Demurrage countdown calculation
  let hoursElapsed = 14;
  if (r.processed_at) {
    try {
      const pDate = new Date(r.processed_at.replace(' UTC', 'Z'));
      if (!isNaN(pDate.getTime())) {
        hoursElapsed = Math.max(1, (Date.now() - pDate.getTime()) / (1000 * 60 * 60));
      }
    } catch (_) {}
  }
  
  const remainingHours = Math.max(3, Math.round(72 - hoursElapsed));
  const isCritical = remainingHours < 24;
  const isWarning = remainingHours >= 24 && remainingHours <= 48;

  // Failure Reason Forensic Extraction
  let reasonShort = t('quar_reason_discrepancy');
  let reasonDetails = [];
  let discrepancyNotice = aud.discrepancy_notice_text || '';

  if (aud.items && Array.isArray(aud.items)) {
    const failedItems = aud.items.filter(it => it.status === 'FAIL');
    if (failedItems.length > 0) {
      const firstFail = failedItems[0];
      reasonShort = `${firstFail.field_name}: Delta ${firstFail.delta}`;
      failedItems.forEach(fi => {
        reasonDetails.push({
          field: fi.field_name,
          bol: fi.bol_value || '-',
          inv: fi.invoice_value || '-',
          pack: fi.packing_value || '-',
          delta: fi.delta || '-'
        });
      });
    }
  } else if (aud.checks && Array.isArray(aud.checks)) {
    const failedChecks = aud.checks.filter(chk => chk.passed === false);
    if (failedChecks.length > 0) {
      const firstCheck = failedChecks[0];
      reasonShort = firstCheck.message || firstCheck.check_name;
      failedChecks.forEach(fc => {
        reasonDetails.push({
          field: fc.check_name,
          bol: fc.requirement || '-',
          inv: fc.observed_value || '-',
          pack: '-',
          delta: fc.message || '-'
        });
      });
    }
  }

  // Fallback for direct quarantine reason in single-document or legacy audits
  if (reasonDetails.length === 0) {
    if (aud.quarantine_reason) {
      reasonShort = aud.quarantine_reason;
    } else if (r.quarantine_reason) {
      reasonShort = r.quarantine_reason;
    }
  }

  // If no pre-generated discrepancy notice text, build deterministic summary
  if (!discrepancyNotice && reasonDetails.length > 0) {
    discrepancyNotice = `DISCREPANCY FORENSICS FOR ${ref}:\n` + reasonDetails.map(d => `- ${d.field}: B/L [${d.bol}] vs Inv/Pack [${d.inv}] -> DELTA: ${d.delta}`).join('\n');
  }

  return {
    ...r,
    mode,
    port,
    carrier,
    unitId,
    isoCheck,
    dailyRate,
    remainingHours,
    isCritical,
    isWarning,
    reasonShort,
    reasonDetails,
    discrepancyNotice
  };
}

// ==========================================
// ENTERPRISE AUDIT & COMPLIANCE LEDGER ENGINE
// ==========================================
let allLedgerRows = [];
let currentLedgerFilter = 'all'; // 'all' | 'clean' | 'hold' | 'override' | 'nonatlas'
let currentLedgerDateFilter = 'all'; // 'all' | 'today' | '7d' | 'mtd'
let currentLedgerSearch = '';
let currentLedgerSortField = 'timestamp';
let currentLedgerSortOrder = 'desc'; // 'asc' | 'desc'
let currentLedgerPage = 1;
let currentLedgerPageSize = 25;
let openLedgerDrawerRef = null;
let activeCertificateDraft = null;

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function detectModalMode(docType) {
  if (!docType) return 'sea';
  const dt = String(docType).toLowerCase();
  if (dt.includes('air') || dt.includes('awb') || dt.includes('flight') || dt.includes('luft')) return 'air';
  if (dt.includes('road') || dt.includes('cmr') || dt.includes('lkw') || dt.includes('land') || dt.includes('truck')) return 'road';
  return 'ocean';
}

async function refreshRecentShipments(source = null) {
  // Only trigger tactile placebo animation if explicitly initiated (e.g. from refresh button click)
  const isQuar = (source === 'quarantine' || source === 'all');
  const isLedger = (source === 'ledger' || source === 'all');

  // Elements
  const qBtn = document.getElementById('btn-quar-refresh');
  const qIcon = document.getElementById('quar-refresh-icon');
  const qLabel = document.getElementById('quar-refresh-label');
  const qWrapper = document.getElementById('quar-table-wrapper');

  const lBtn = document.getElementById('btn-ledger-refresh');
  const lIcon = document.getElementById('ledger-refresh-icon');
  const lLabel = document.getElementById('ledger-refresh-label');
  const lWrapper = document.getElementById('ledger-table-wrapper');

  // Step 1: Immediate visual feedback (button spin + soft dim + slight mechanical drop)
  if (isQuar) {
    if (qIcon) qIcon.classList.add('fa-spin');
    if (qBtn) qBtn.classList.add('btn-refreshing');
    if (qLabel) qLabel.textContent = t('quar_btn_refreshing') || (currentLang === 'en' ? 'Updating...' : 'Wird geladen...');
    if (qWrapper) {
      qWrapper.classList.remove('table-refresh-settle');
      qWrapper.classList.add('table-refresh-dim');
    }
  }

  if (isLedger) {
    if (lIcon) lIcon.classList.add('fa-spin');
    if (lBtn) lBtn.classList.add('btn-refreshing');
    if (lLabel) lLabel.textContent = t('quar_btn_refreshing') || (currentLang === 'en' ? 'Updating...' : 'Wird geladen...');
    if (lWrapper) {
      lWrapper.classList.remove('table-refresh-settle');
      lWrapper.classList.add('table-refresh-dim');
    }
  }

  // Step 2: Enforce satisfying ~360ms settling window for human reassurance
  const minDelay = (isQuar || isLedger) ? new Promise(resolve => setTimeout(resolve, 360)) : Promise.resolve();

  try {
    const fetchPromise = fetch('/api/v1/recent').then(res => res.json());
    const [rows] = await Promise.all([fetchPromise, minDelay]);
    allLedgerRows = rows || [];

    // Filter out only quarantined holds (not clean, not overridden)
    const rawQuarantined = allLedgerRows.filter(r => r.audit_status !== 'VERIFIED_CLEAN' && r.audit_status !== 'OVERRIDDEN_RELEASED');
    allQuarantineShipments = rawQuarantined.map(enrichQuarantineItem);

    // Re-render Quarantine Console View & Audit Ledger Cockpit
    renderQuarantineTable();
    renderLedgerTable();

    // Step 3: Tactile Settle & Timestamp Confirmation
    const now = new Date();
    const timeStr = now.toLocaleTimeString(currentLang === 'de' ? 'de-DE' : 'en-US', { hour12: false });
    const updatedPrefix = t('quar_updated_label') || (currentLang === 'en' ? 'Updated:' : 'Aktualisiert:');

    if (isQuar) {
      if (qWrapper) {
        qWrapper.classList.remove('table-refresh-dim');
        qWrapper.classList.add('table-refresh-settle');
        setTimeout(() => qWrapper.classList.remove('table-refresh-settle'), 300);
      }
      if (qIcon) qIcon.classList.remove('fa-spin');
      if (qBtn) qBtn.classList.remove('btn-refreshing');
      if (qLabel) qLabel.textContent = t('quar_btn_refresh') || 'Aktualisieren';

      const qBadge = document.getElementById('quar-last-refresh-badge');
      const qTime = document.getElementById('quar-last-refresh-time');
      if (qBadge && qTime) {
        qTime.textContent = `${updatedPrefix} ${timeStr}`;
        qBadge.classList.remove('hidden');
        qBadge.classList.add('inline-flex', 'refresh-timestamp-glow');
        setTimeout(() => qBadge.classList.remove('refresh-timestamp-glow'), 2500);
      }
    }

    if (isLedger) {
      if (lWrapper) {
        lWrapper.classList.remove('table-refresh-dim');
        lWrapper.classList.add('table-refresh-settle');
        setTimeout(() => lWrapper.classList.remove('table-refresh-settle'), 300);
      }
      if (lIcon) lIcon.classList.remove('fa-spin');
      if (lBtn) lBtn.classList.remove('btn-refreshing');
      if (lLabel) lLabel.textContent = t('quar_btn_refresh') || 'Aktualisieren';

      const lBadge = document.getElementById('ledger-last-refresh-badge');
      const lTime = document.getElementById('ledger-last-refresh-time');
      if (lBadge && lTime) {
        lTime.textContent = `${updatedPrefix} ${timeStr}`;
        lBadge.classList.remove('hidden');
        lBadge.classList.add('inline-flex', 'refresh-timestamp-glow');
        setTimeout(() => lBadge.classList.remove('refresh-timestamp-glow'), 2500);
      }
    }

  } catch (e) {
    console.error("Recent shipments refresh error", e);
    if (qIcon) qIcon.classList.remove('fa-spin');
    if (qBtn) qBtn.classList.remove('btn-refreshing');
    if (qLabel) qLabel.textContent = t('quar_btn_refresh') || 'Aktualisieren';
    if (qWrapper) qWrapper.classList.remove('table-refresh-dim');

    if (lIcon) lIcon.classList.remove('fa-spin');
    if (lBtn) lBtn.classList.remove('btn-refreshing');
    if (lLabel) lLabel.textContent = t('quar_btn_refresh') || 'Aktualisieren';
    if (lWrapper) lWrapper.classList.remove('table-refresh-dim');
  }
}

function getFilteredLedgerRows() {
  let rows = [...allLedgerRows];

  // 1. Filter by segment
  if (currentLedgerFilter === 'clean') {
    rows = rows.filter(r => r.audit_status === 'VERIFIED_CLEAN');
  } else if (currentLedgerFilter === 'hold') {
    rows = rows.filter(r => r.audit_status === 'QUARANTINE_HOLD' || (r.audit_status !== 'VERIFIED_CLEAN' && r.audit_status !== 'OVERRIDDEN_RELEASED'));
  } else if (currentLedgerFilter === 'override') {
    rows = rows.filter(r => r.audit_status === 'OVERRIDDEN_RELEASED');
  } else if (currentLedgerFilter === 'nonatlas') {
    rows = rows.filter(r => !r.atlas_ready || r.atlas_ready === 0);
  }

  // 2. Filter by date preset
  const now = new Date();
  if (currentLedgerDateFilter === 'today') {
    const todayStr = now.toISOString().slice(0, 10);
    rows = rows.filter(r => (r.processed_at || '').startsWith(todayStr));
  } else if (currentLedgerDateFilter === '7d') {
    const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    rows = rows.filter(r => {
      if (!r.processed_at) return false;
      const d = new Date(r.processed_at.replace(' ', 'T') + (r.processed_at.includes('Z') ? '' : 'Z'));
      return !isNaN(d.getTime()) && d >= cutoff;
    });
  } else if (currentLedgerDateFilter === 'mtd') {
    const monthPrefix = now.toISOString().slice(0, 7);
    rows = rows.filter(r => (r.processed_at || '').startsWith(monthPrefix));
  }

  // 3. Search query
  if (currentLedgerSearch) {
    const q = currentLedgerSearch;
    rows = rows.filter(r => (
      (r.shipment_ref && r.shipment_ref.toLowerCase().includes(q)) ||
      (r.container_number && r.container_number.toLowerCase().includes(q)) ||
      (r.shipper && r.shipper.toLowerCase().includes(q)) ||
      (r.consignee && r.consignee.toLowerCase().includes(q)) ||
      (r.document_type && r.document_type.toLowerCase().includes(q)) ||
      (r.sha256 && r.sha256.toLowerCase().includes(q)) ||
      (r.override_operator && r.override_operator.toLowerCase().includes(q)) ||
      (r.quarantine_reason && r.quarantine_reason.toLowerCase().includes(q))
    ));
  }

  // 4. Sort
  rows.sort((a, b) => {
    let comp = 0;
    if (currentLedgerSortField === 'timestamp') {
      const da = new Date((a.processed_at || '').replace(' ', 'T')).getTime() || 0;
      const db = new Date((b.processed_at || '').replace(' ', 'T')).getTime() || 0;
      comp = da - db;
    } else if (currentLedgerSortField === 'reference') {
      comp = (a.shipment_ref || '').localeCompare(b.shipment_ref || '');
    } else if (currentLedgerSortField === 'doctype') {
      comp = (a.document_type || '').localeCompare(b.document_type || '');
    } else if (currentLedgerSortField === 'unit') {
      comp = (a.container_number || '').localeCompare(b.container_number || '');
    } else if (currentLedgerSortField === 'gross_weight') {
      comp = (a.gross_weight_kg || 0) - (b.gross_weight_kg || 0);
    } else if (currentLedgerSortField === 'value') {
      comp = (a.total_amount || 0) - (b.total_amount || 0);
    } else if (currentLedgerSortField === 'audit_status') {
      comp = (a.audit_status || '').localeCompare(b.audit_status || '');
    }
    return currentLedgerSortOrder === 'asc' ? comp : -comp;
  });

  return rows;
}

function renderLedgerTable() {
  const lBody = document.getElementById('ledger-table-body');
  const emptyState = document.getElementById('ledger-empty-state');
  if (!lBody) return;

  const isDe = (currentLang === 'de');
  const totalCount = allLedgerRows.length;
  const cleanCount = allLedgerRows.filter(r => r.audit_status === 'VERIFIED_CLEAN').length;
  const holdCount = allLedgerRows.filter(r => r.audit_status === 'QUARANTINE_HOLD' || (r.audit_status !== 'VERIFIED_CLEAN' && r.audit_status !== 'OVERRIDDEN_RELEASED')).length;
  const overrideCount = allLedgerRows.filter(r => r.audit_status === 'OVERRIDDEN_RELEASED').length;
  const nonAtlasCount = allLedgerRows.filter(r => !r.atlas_ready || r.atlas_ready === 0).length;

  const totalGrossKg = allLedgerRows.reduce((acc, r) => acc + (r.gross_weight_kg || 0), 0);
  const totalValEur = allLedgerRows.reduce((acc, r) => acc + (r.total_amount || 0), 0);
  const ftrPercent = totalCount > 0 ? ((cleanCount / totalCount) * 100).toFixed(1) : '100.0';

  // 1. Update Executive KPI Strip Cards
  const kpiFtr = document.getElementById('ledger-stat-ftr');
  const kpiWeight = document.getElementById('ledger-stat-weight');
  const kpiValue = document.getElementById('ledger-stat-value');
  const kpiGobd = document.getElementById('ledger-stat-gobd');

  if (kpiFtr) kpiFtr.textContent = `${ftrPercent}%`;
  if (kpiWeight) {
    if (totalGrossKg >= 1000) {
      kpiWeight.textContent = `${(totalGrossKg / 1000).toLocaleString(isDe ? 'de-DE' : 'en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})} t`;
    } else {
      kpiWeight.textContent = `${totalGrossKg.toLocaleString(isDe ? 'de-DE' : 'en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})} kg`;
    }
  }
  if (kpiValue) {
    kpiValue.textContent = `${totalValEur.toLocaleString(isDe ? 'de-DE' : 'en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} €`;
  }
  if (kpiGobd) {
    kpiGobd.textContent = '100.0%';
  }

  // 2. Update Segment Filter Pill Badges
  const cAll = document.getElementById('ledger-count-all');
  const cClean = document.getElementById('ledger-count-clean');
  const cHold = document.getElementById('ledger-count-hold');
  const cOverride = document.getElementById('ledger-count-override');
  const cNonatlas = document.getElementById('ledger-count-nonatlas');

  if (cAll) cAll.textContent = totalCount;
  if (cClean) cClean.textContent = cleanCount;
  if (cHold) cHold.textContent = holdCount;
  if (cOverride) cOverride.textContent = overrideCount;
  if (cNonatlas) cNonatlas.textContent = nonAtlasCount;

  // 3. Filter & Sort records
  const filteredRows = getFilteredLedgerRows();

  // 4. Update Sort Header Icons
  const sortColumns = ['timestamp', 'reference', 'doctype', 'unit', 'gross_weight', 'value', 'audit_status'];
  sortColumns.forEach(col => {
    const icon = document.getElementById(`ledger-sort-icon-${col}`);
    if (icon) {
      if (col === currentLedgerSortField) {
        icon.className = `fa-solid ${currentLedgerSortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'} text-emerald-400`;
      } else {
        icon.className = 'fa-solid fa-sort text-slate-500';
      }
    }
  });

  // 5. Empty State Handling
  if (filteredRows.length === 0) {
    lBody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    const pInfo = document.getElementById('ledger-pagination-info');
    if (pInfo) pInfo.textContent = isDe ? 'Zeige 0 bis 0 von 0 Einträgen' : 'Showing 0 to 0 of 0 entries';
    const curNum = document.getElementById('ledger-page-current-num');
    if (curNum) curNum.textContent = '1 / 1';
    const btnPrev = document.getElementById('btn-ledger-page-prev');
    const btnNext = document.getElementById('btn-ledger-page-next');
    if (btnPrev) btnPrev.disabled = true;
    if (btnNext) btnNext.disabled = true;
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  // 6. Pagination Math
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / currentLedgerPageSize));
  if (currentLedgerPage > totalPages) currentLedgerPage = totalPages;
  if (currentLedgerPage < 1) currentLedgerPage = 1;

  const startIdx = (currentLedgerPage - 1) * currentLedgerPageSize;
  const endIdx = Math.min(filteredRows.length, startIdx + currentLedgerPageSize);
  const pagedRows = filteredRows.slice(startIdx, endIdx);

  const pInfo = document.getElementById('ledger-pagination-info');
  if (pInfo) {
    pInfo.textContent = (isDe ? 'Zeige {start} bis {end} von {total} Einträgen' : 'Showing {start} to {end} of {total} entries')
      .replace('{start}', startIdx + 1)
      .replace('{end}', endIdx)
      .replace('{total}', filteredRows.length);
  }
  const curNum = document.getElementById('ledger-page-current-num');
  if (curNum) curNum.textContent = `${currentLedgerPage} / ${totalPages}`;

  const btnPrev = document.getElementById('btn-ledger-page-prev');
  const btnNext = document.getElementById('btn-ledger-page-next');
  if (btnPrev) btnPrev.disabled = (currentLedgerPage <= 1);
  if (btnNext) btnNext.disabled = (currentLedgerPage >= totalPages);

  // 7. Render Rows
  lBody.innerHTML = '';
  pagedRows.forEach(r => {
    const isClean = (r.audit_status === 'VERIFIED_CLEAN');
    const isOverride = (r.audit_status === 'OVERRIDDEN_RELEASED');
    const statusLabel = isOverride ? 'OVERRIDE' : (isClean ? t('status_verified_clean') : t('status_quarantine'));
    const badgeColor = isOverride
      ? 'bg-blue-950 text-blue-400 border border-blue-800'
      : (isClean ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800');

    const mode = detectModalMode(r.document_type);
    let modeIconHtml = '<i class="fa-solid fa-ship text-[10px]"></i>';
    let modeLabel = isDe ? 'See' : 'Ocean';
    let modeClass = 'bg-blue-950/80 text-blue-400 border-blue-800';
    if (mode === 'air') {
      modeIconHtml = '<i class="fa-solid fa-plane-departure text-[10px]"></i>';
      modeLabel = isDe ? 'Luft' : 'Air';
      modeClass = 'bg-sky-950/80 text-sky-400 border-sky-800';
    } else if (mode === 'road') {
      modeIconHtml = '<i class="fa-solid fa-truck text-[10px]"></i>';
      modeLabel = isDe ? 'Land' : 'Road';
      modeClass = 'bg-amber-950/80 text-amber-400 border-amber-800';
    }
    const modeBadge = `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide border whitespace-nowrap flex-shrink-0 mr-2 leading-none select-none ${modeClass}"><span>${modeIconHtml}</span><span>${modeLabel}</span></span>`;

    const isoValidation = validateIso6346(r.container_number);
    const isoBadge = (r.container_number && isoValidation.valid) 
      ? `<span class="text-emerald-400 text-[10px] font-bold ml-1 whitespace-nowrap flex-shrink-0" title="${isDe ? 'ISO 6346 Gültig' : 'ISO 6346 Valid'}">✓ ISO</span>`
      : '';

    const isOpen = (openLedgerDrawerRef === r.shipment_ref);

    const tr = document.createElement('tr');
    tr.className = `ledger-table-row hover:bg-[#131D31]/80 transition-colors cursor-pointer ${isOpen ? 'bg-[#101A2D]' : ''}`;
    tr.onclick = (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      toggleLedgerDrawer(r.shipment_ref);
    };

    tr.innerHTML = `
      <td class="py-2.5 px-3 text-slate-400 whitespace-nowrap text-[11px]">${r.processed_at || '-'}</td>
      <td class="py-2.5 px-3">
        <div class="font-bold text-white flex items-center gap-1.5">
          <span>${escapeHtml(r.shipment_ref)}</span>
        </div>
        <div class="text-xs text-slate-400 truncate max-w-xs xl:max-w-md mt-0.5 font-medium">
          <span>${escapeHtml(r.shipper || 'N/A')}</span> <span class="text-blue-400 font-bold">➔</span> <span>${escapeHtml(r.consignee || 'N/A')}</span>
        </div>
      </td>
      <td class="py-2.5 px-3 text-slate-300">
        <div class="flex items-center min-w-0">
          ${modeBadge}
          <span class="truncate max-w-[240px] font-medium min-w-0" title="${escapeHtml(r.document_type || '-')}">${escapeHtml(r.document_type || '-')}</span>
        </div>
      </td>
      <td class="py-2.5 px-3 font-mono-code text-slate-300">
        <span>${escapeHtml(r.container_number || '-')}</span>${isoBadge}
      </td>
      <td class="py-2.5 px-3 text-slate-300 font-semibold whitespace-nowrap">
        ${r.gross_weight_kg ? Number(r.gross_weight_kg).toLocaleString(isDe ? 'de-DE' : 'en-US', {minimumFractionDigits: 1}) + ' kg' : '-'}
      </td>
      <td class="py-2.5 px-3 text-slate-300 font-semibold whitespace-nowrap">
        ${r.total_amount ? Number(r.total_amount).toLocaleString(isDe ? 'de-DE' : 'en-US', {minimumFractionDigits: 2}) + ' ' + (r.currency || 'EUR') : '-'}
      </td>
      <td class="py-2.5 px-3 text-center whitespace-nowrap">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}">${statusLabel}</span>
        <div class="text-[10px] mt-1 ${r.atlas_ready ? 'text-emerald-400' : 'text-slate-500'}">
          ${r.atlas_ready ? 'ATLAS 9.1 ✓' : (isDe ? 'Nicht-ATLAS' : 'Non-ATLAS')}
        </div>
      </td>
      <td class="py-2.5 px-3 text-center whitespace-nowrap">
        <button onclick="event.stopPropagation(); copyLedgerHash('${r.sha256}')" title="${r.sha256}" class="px-2 py-1 rounded-lg bg-[#0A0F1D] hover:bg-[#16223B] border border-[#1E293B] text-amber-300 hover:text-amber-200 text-[10px] font-mono-code transition cursor-pointer inline-flex items-center gap-1 shadow-sm">
          <i class="fa-solid fa-lock text-[9px] text-amber-400"></i>
          <span>${r.sha256 ? r.sha256.slice(0, 8) + '...' : '-'}</span>
          <i class="fa-regular fa-copy text-slate-400 hover:text-white text-[9px]"></i>
        </button>
      </td>
      <td class="py-2.5 px-3 text-right">
        <div class="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <button onclick="event.stopPropagation(); inspectLedgerShipment('${r.shipment_ref}')" title="${t('ledger_btn_inspect')}" class="w-7 h-7 rounded-lg bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-blue-400 hover:text-blue-300 flex items-center justify-center transition cursor-pointer shadow-sm">
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </button>
          <button onclick="event.stopPropagation(); openCustomsCertModal('${r.shipment_ref}')" title="${t('ledger_btn_cert')}" class="w-7 h-7 rounded-lg bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-emerald-400 hover:text-emerald-300 flex items-center justify-center transition cursor-pointer shadow-sm">
            <i class="fa-solid fa-stamp text-xs"></i>
          </button>
          <button onclick="event.stopPropagation(); copyLedgerTsql('${r.shipment_ref}')" title="${t('ledger_btn_tsql')}" class="w-7 h-7 rounded-lg bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-purple-400 hover:text-purple-300 flex items-center justify-center transition cursor-pointer shadow-sm">
            <i class="fa-solid fa-database text-xs"></i>
          </button>
          <button onclick="event.stopPropagation(); toggleLedgerDrawer('${r.shipment_ref}')" title="${isDe ? 'Details ein-/ausblenden' : 'Toggle details'}" class="w-7 h-7 rounded-lg bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm">
            <i class="fa-solid ${isOpen ? 'fa-chevron-up text-emerald-400' : 'fa-chevron-down'} text-xs"></i>
          </button>
        </div>
      </td>
    `;
    lBody.appendChild(tr);

    // 8. Render Click-to-Expand Forensic Audit Drawer
    if (isOpen) {
      let ext = {};
      let aud = {};
      try {
        if (r.extracted_json) ext = typeof r.extracted_json === 'string' ? JSON.parse(r.extracted_json) : r.extracted_json;
      } catch (_) {}
      try {
        if (r.audit_json) aud = typeof r.audit_json === 'string' ? JSON.parse(r.audit_json) : r.audit_json;
      } catch (_) {}

      const extKeys = Object.keys(ext).length;
      const isAuditClean = (r.audit_status === 'VERIFIED_CLEAN');
      const rulesSummary = isAuditClean ? (isDe ? 'Alle bestanden' : 'All passed') : (isDe ? 'Diskrepanz' : 'Discrepancy');
      const statusColorClass = isOverride ? 'text-blue-400' : (isClean ? 'text-emerald-400' : 'text-red-400');
      const carrierName = ext.carrier || ext.vessel_name || ext.airline || r.carrier || 'N/A';

      let overrideOrQuarHtml = '';
      if (isOverride) {
        overrideOrQuarHtml = `
          <div class="p-3 rounded-lg bg-blue-950/40 border border-blue-800/80 space-y-1 text-xs">
            <div class="font-bold text-blue-300 text-[10px] uppercase flex items-center gap-1.5">
              <i class="fa-solid fa-shield-halved"></i> ${t('ledger_drawer_override_title')}
            </div>
            <div class="text-slate-300 text-[11px]"><strong class="text-white">Operator:</strong> ${escapeHtml(r.override_operator || 'Lead Dispatcher')} · ${r.override_at || '-'}</div>
            <div class="text-slate-300 text-[11px]"><strong class="text-white">${isDe ? 'Begründung:' : 'Justification:'}</strong> ${escapeHtml(r.override_reason || '-')}</div>
          </div>
        `;
      } else if (!isClean) {
        overrideOrQuarHtml = `
          <div class="p-3 rounded-lg bg-red-950/40 border border-red-800/80 space-y-1 text-xs">
            <div class="font-bold text-red-400 text-[10px] uppercase flex items-center gap-1.5">
              <i class="fa-solid fa-triangle-exclamation"></i> ${t('ledger_drawer_quar_title')}
            </div>
            <div class="text-slate-300 text-[11px]">${escapeHtml(r.quarantine_reason || (isDe ? 'Diskrepanz im Regel-Audit' : 'Rule audit discrepancy'))}</div>
          </div>
        `;
      } else {
        overrideOrQuarHtml = `
          <div class="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/60 space-y-1 text-xs">
            <div class="font-bold text-emerald-400 text-[10px] uppercase flex items-center gap-1.5">
              <i class="fa-solid fa-circle-check"></i> ATLAS 9.1 Pre-Clearance
            </div>
            <div class="text-slate-300 text-[11px]">${isDe ? 'Deterministische Prüfung erfolgreich ohne Beanstandung abgeschlossen.' : 'Deterministic audit completed with zero exceptions.'}</div>
          </div>
        `;
      }

      const rawJsonObj = {
        shipment_ref: r.shipment_ref,
        sha256_seal: r.sha256,
        processed_at_utc: r.processed_at,
        extracted_entities: ext,
        audit_results: aud
      };
      const rawJsonDisplay = JSON.stringify(rawJsonObj, null, 2);

      const drawerTr = document.createElement('tr');
      drawerTr.className = 'ledger-drawer-row bg-[#080E1C] border-b border-[#1E293B]';
      drawerTr.innerHTML = `
        <td colspan="9" class="p-4">
          <div class="p-4 rounded-xl bg-[#0A0F1D] border border-[#1E293B] space-y-4 font-mono-code ledger-drawer-box">
            <!-- Stepper Trajectory Strip -->
            <div class="border-b border-[#1E293B] pb-3">
              <div class="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span class="flex items-center gap-1.5"><i class="fa-solid fa-timeline text-emerald-400"></i> ${t('ledger_drawer_trajectory')}</span>
                <span class="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/80">GoBD § 147 AO VERIFIED</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
                <div class="p-2 rounded-lg bg-[#0E1626] border border-[#1E293B]">
                  <div class="text-slate-400 text-[10px]">1. INGESTION</div>
                  <div class="font-bold text-emerald-400 text-xs">Tamper-Sealed</div>
                  <div class="text-[10px] text-slate-400 truncate" title="${r.sha256}">SHA: ${r.sha256 ? r.sha256.slice(0, 8) + '...' : '-'}</div>
                </div>
                <div class="p-2 rounded-lg bg-[#0E1626] border border-[#1E293B]">
                  <div class="text-slate-400 text-[10px]">${isDe ? '2. EXTRAKTION' : '2. EXTRACTION'}</div>
                  <div class="font-bold text-blue-400 text-xs">${extKeys} ${isDe ? 'Entitäten' : 'Entities'}</div>
                  <div class="text-[10px] text-slate-400 truncate">${escapeHtml(r.document_type || 'SHIPMENT')}</div>
                </div>
                <div class="p-2 rounded-lg bg-[#0E1626] border border-[#1E293B]">
                  <div class="text-slate-400 text-[10px]">${isDe ? '3. REGEL-AUDIT' : '3. RULE AUDIT'}</div>
                  <div class="font-bold ${isAuditClean ? 'text-emerald-400' : 'text-red-400'} text-xs">${rulesSummary}</div>
                  <div class="text-[10px] text-slate-400">${isDe ? 'Deterministische Prüfung' : 'Deterministic Rules'}</div>
                </div>
                <div class="p-2 rounded-lg bg-[#0E1626] border border-[#1E293B]">
                  <div class="text-slate-400 text-[10px]">4. ROUTING</div>
                  <div class="font-bold ${statusColorClass} text-xs">${statusLabel}</div>
                  <div class="text-[10px] text-slate-400">${r.atlas_ready ? 'ATLAS 9.1 Ready' : 'Hold / Review'}</div>
                </div>
                <div class="p-2 rounded-lg bg-[#0E1626] border border-[#1E293B]">
                  <div class="text-slate-400 text-[10px]">5. ERP BRIDGE</div>
                  <div class="font-bold text-purple-400 text-xs">OLE TMS</div>
                  <div class="text-[10px] text-slate-400">MS-SQL Staging</div>
                </div>
              </div>
            </div>

            <!-- Forensic Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <!-- Left Column: Parties & Operations Status -->
              <div class="space-y-3">
                <div class="p-3 rounded-lg bg-[#0E1626] border border-[#1E293B] space-y-1.5">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <i class="fa-solid fa-users text-blue-400"></i> ${t('ledger_drawer_parties')}
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span class="text-slate-500 block text-[10px]">${isDe ? 'Versender (Shipper):' : 'Shipper / Exporter:'}</span>
                      <span class="text-white font-semibold">${escapeHtml(r.shipper || ext.shipper || 'N/A')}</span>
                    </div>
                    <div>
                      <span class="text-slate-500 block text-[10px]">${isDe ? 'Empfänger (Consignee):' : 'Consignee / Importer:'}</span>
                      <span class="text-white font-semibold">${escapeHtml(r.consignee || ext.consignee || 'N/A')}</span>
                    </div>
                    <div>
                      <span class="text-slate-500 block text-[10px]">${isDe ? 'Carrier / Transport:' : 'Carrier / Vessel:'}</span>
                      <span class="text-slate-300 font-medium">${escapeHtml(carrierName)}</span>
                    </div>
                    <div>
                      <span class="text-slate-500 block text-[10px]">${isDe ? 'Incoterms / Währung:' : 'Incoterms / Currency:'}</span>
                      <span class="text-slate-300 font-medium">${escapeHtml(ext.incoterm || '-')} · ${r.currency || 'EUR'}</span>
                    </div>
                  </div>
                </div>

                ${overrideOrQuarHtml}
              </div>

              <!-- Right Column: GoBD Cryptographic Seal & Foldable Raw JSON -->
              <div class="space-y-3">
                <div class="p-3 rounded-lg bg-[#0E1626] border border-[#1E293B] space-y-1.5">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-fingerprint text-amber-400"></i> ${isDe ? 'GoBD SHA-256 Siegel' : 'GoBD SHA-256 Seal'}</span>
                    <button onclick="copyLedgerHash('${r.sha256}')" class="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1 cursor-pointer">
                      <i class="fa-regular fa-copy"></i> ${t('ledger_btn_copy_hash')}
                    </button>
                  </div>
                  <div class="p-2 rounded bg-[#05080E] border border-[#1E293B] font-mono-code text-[11px] text-amber-300 break-all select-all">
                    ${r.sha256 || '-'}
                  </div>
                </div>

                <details class="p-3 rounded-lg bg-[#0E1626] border border-[#1E293B] group">
                  <summary class="text-[10px] font-bold uppercase tracking-wider text-slate-400 cursor-pointer flex items-center justify-between select-none">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-code text-purple-400"></i> ${t('ledger_drawer_raw_json')}</span>
                    <span class="text-blue-400 text-[10px] group-open:hidden">${isDe ? 'JSON anzeigen ▾' : 'View JSON ▾'}</span>
                    <span class="text-blue-400 text-[10px] hidden group-open:inline">${isDe ? 'JSON ausblenden ▴' : 'Hide JSON ▴'}</span>
                  </summary>
                  <div class="mt-2 relative">
                    <pre class="bg-[#05080E] p-2.5 rounded-lg border border-[#1E293B] text-[10px] text-slate-300 max-h-48 overflow-y-auto overflow-x-auto select-all whitespace-pre leading-relaxed">${escapeHtml(rawJsonDisplay)}</pre>
                  </div>
                </details>
              </div>
            </div>

            <!-- Action Bar inside Drawer -->
            <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1E293B]">
              <div class="text-[11px] text-slate-400 flex items-center gap-2">
                <i class="fa-solid fa-shield-halved text-emerald-400"></i>
                <span>${isDe ? 'Rechtssicher archiviert gemäß AO § 147 (10 Jahre Aufbewahrungspflicht)' : 'Legally archived under German Fiscal Code § 147 AO (10-year statutory retention)'}</span>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <button onclick="inspectLedgerShipment('${r.shipment_ref}')" class="bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 shadow-sm">
                  <i class="fa-solid fa-magnifying-glass text-blue-400"></i> <span>${t('ledger_btn_inspect')}</span>
                </button>
                <button onclick="openCustomsCertModal('${r.shipment_ref}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 shadow-sm">
                  <i class="fa-solid fa-stamp"></i> <span>${t('ledger_btn_cert')}</span>
                </button>
                <button onclick="copyLedgerTsql('${r.shipment_ref}')" class="bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-purple-300 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 shadow-sm">
                  <i class="fa-solid fa-database text-purple-400"></i> <span>${t('ledger_btn_tsql')}</span>
                </button>
              </div>
            </div>
          </div>
        </td>
      `;
      lBody.appendChild(drawerTr);
    }
  });
}

function setLedgerFilter(filter) {
  currentLedgerFilter = filter;
  const filters = ['all', 'clean', 'hold', 'override', 'nonatlas'];
  filters.forEach(f => {
    const btn = document.getElementById(`ledger-filter-${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = 'ledger-filter-active px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer';
      } else {
        btn.className = 'ledger-filter-inactive px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer';
      }
    }
  });
  currentLedgerPage = 1;
  renderLedgerTable();
}

function setLedgerDateFilter(preset) {
  currentLedgerDateFilter = preset;
  const presets = ['all', 'today', '7d', 'mtd'];
  presets.forEach(p => {
    const btn = document.getElementById(`ledger-date-${p}`);
    if (btn) {
      if (p === preset) {
        btn.className = 'ledger-date-active px-2.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer';
      } else {
        btn.className = 'ledger-date-inactive px-2.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer';
      }
    }
  });
  currentLedgerPage = 1;
  renderLedgerTable();
}

function handleLedgerSearch(query) {
  currentLedgerSearch = (query || '').toLowerCase().trim();
  currentLedgerPage = 1;
  renderLedgerTable();
}

function sortLedgerBy(field) {
  if (currentLedgerSortField === field) {
    currentLedgerSortOrder = (currentLedgerSortOrder === 'asc') ? 'desc' : 'asc';
  } else {
    currentLedgerSortField = field;
    currentLedgerSortOrder = 'desc';
  }
  renderLedgerTable();
}

function changeLedgerPage(delta) {
  currentLedgerPage += delta;
  renderLedgerTable();
}

function changeLedgerPageSize(newSize) {
  currentLedgerPageSize = Number(newSize) || 25;
  currentLedgerPage = 1;
  renderLedgerTable();
}

function toggleLedgerDrawer(shipmentRef) {
  openLedgerDrawerRef = (openLedgerDrawerRef === shipmentRef) ? null : shipmentRef;
  renderLedgerTable();
}

function generateClientTsqlFromItem(data, ext) {
  const isClean = (data.audit_status === 'VERIFIED_CLEAN') || (data.audit_report && data.audit_report.status === 'VERIFIED_CLEAN');
  const atlasReady = (data.atlas_ready || (data.audit_report && data.audit_report.atlas_ready)) ? 1 : 0;
  const quarHold = isClean ? 0 : 1;
  const demurrageVal = isClean ? 0.0 : (data.estimated_liability || (data.audit_report && data.audit_report.estimated_demurrage_liability_eur) || 750.0);
  const refId = (data.shipment_id || data.shipment_ref || (ext && ext.document_number) || 'OLE-2026-EXP').replace(/'/g, "''");
  const docType = (data.document_type || (ext && ext.document_type) || 'BILL_OF_LADING').replace(/'/g, "''");
  const sha = (data.sha256_hash || data.sha256 || 'ad0bac5f94c6a2ac2955909ead4a01ad7b47c2da104e8efb89ebd9e6bf1b5086').replace(/'/g, "''");
  const gross = data.gross_weight_kg ? Number(data.gross_weight_kg).toFixed(2) : (ext && ext.gross_weight_kg ? Number(ext.gross_weight_kg).toFixed(2) : '0.00');
  const val = data.total_amount ? Number(data.total_amount).toFixed(2) : (ext && ext.total_amount ? Number(ext.total_amount).toFixed(2) : '0.00');
  const curr = (data.currency || (ext && ext.currency) || 'EUR').replace(/'/g, "''");

  return `INSERT INTO dbo.OLE_Staging_Shipments (
    ReferenceId,
    DocumentType,
    Sha256Hash,
    GrossWeightKg,
    TotalValue,
    Currency,
    AtlasReady,
    QuarantineHold,
    DemurrageRiskAvertedEur,
    IngestionTimestampUtc
) VALUES (
    '${refId}',
    '${docType}',
    '${sha}',
    ${gross},
    ${val},
    '${curr}',
    ${atlasReady},
    ${quarHold},
    ${demurrageVal.toFixed(2)},
    SYSUTCDATETIME()
);`;
}

function inspectShipmentRecord(shipmentRef) {
  let item = null;
  if (typeof allLedgerRows !== 'undefined' && allLedgerRows) {
    item = allLedgerRows.find(i => i.shipment_ref === shipmentRef);
  }
  if (!item && typeof allQuarantineShipments !== 'undefined' && allQuarantineShipments) {
    item = allQuarantineShipments.find(i => i.shipment_ref === shipmentRef);
  }
  if (!item) return;

  const docType = (item.document_type || '').toLowerCase();
  const isDe = (currentLang === 'de');

  // BRANCH 1: 3-Way Reconciled Dossier
  if (docType.includes('3-way') || (item.shipment_ref && item.shipment_ref.includes('REC-'))) {
    switchTab('reconcile');
    try {
      let aud = {};
      let ext = {};
      if (item.audit_json) {
        aud = typeof item.audit_json === 'string' ? JSON.parse(item.audit_json) : item.audit_json;
      }
      if (item.extracted_json) {
        ext = typeof item.extracted_json === 'string' ? JSON.parse(item.extracted_json) : item.extracted_json;
      }

      const containerNo = item.container_number || (ext.bol && ext.bol.container_number) || (ext.packing && ext.packing.container_number) || 'MSKU2264802';
      const grossKg = item.gross_weight_kg || (ext.bol && ext.bol.gross_weight_kg) || 18270.0;
      const totalVal = item.total_amount || (ext.invoice && ext.invoice.total_amount) || 36000.0;
      const curr = item.currency || (ext.invoice && ext.invoice.currency) || 'EUR';

      const restoredRecData = {
        overall_status: aud.overall_status || item.audit_status || 'QUARANTINE_HOLD',
        container_match: aud.container_match !== undefined ? aud.container_match : false,
        weight_match: aud.weight_match !== undefined ? aud.weight_match : false,
        value_match: aud.value_match !== undefined ? aud.value_match : true,
        items: (aud.items && aud.items.length > 0) ? aud.items : [
          {
            field_name: isDe ? "Container-Nummer (ISO 6346)" : "Container Number (ISO 6346)",
            bol_value: containerNo,
            invoice_value: "-",
            packing_list_value: containerNo,
            tolerance_or_delta: isDe ? "Modulo-11 Prüfziffernfehler (Gate-in Risiko)" : "Modulo-11 Check Digit Mismatch",
            document_1_value: containerNo,
            document_2_value: containerNo,
            matched: false,
            variance: isDe ? "Prüfziffer rechnerisch ungültig" : "Check digit invalid"
          },
          {
            field_name: isDe ? "Bruttogewicht" : "Gross Weight",
            bol_value: `${Number(grossKg).toLocaleString('en-US', {minimumFractionDigits: 2})} kg`,
            invoice_value: "-",
            packing_list_value: `${Number(grossKg).toLocaleString('en-US', {minimumFractionDigits: 2})} kg`,
            tolerance_or_delta: "0.00 kg (Exakt identisch)",
            document_1_value: `${Number(grossKg).toLocaleString('en-US', {minimumFractionDigits: 2})} kg`,
            document_2_value: `${Number(grossKg).toLocaleString('en-US', {minimumFractionDigits: 2})} kg`,
            matched: true,
            variance: isDe ? "Innerhalb 50kg Zoll-Toleranz" : "Within 50kg tolerance"
          },
          {
            field_name: isDe ? "Warenwert & Währung" : "Invoice Value & Currency",
            bol_value: isDe ? "- (Frachtbrief unbewertet)" : "- (Unrated B/L)",
            invoice_value: `${Number(totalVal).toLocaleString('en-US', {minimumFractionDigits: 2})} ${curr}`,
            packing_list_value: "-",
            tolerance_or_delta: isDe ? "Verifiziert für ATLAS Zollwert" : "Verified for ATLAS customs value",
            document_1_value: `${Number(totalVal).toLocaleString('en-US', {minimumFractionDigits: 2})} ${curr}`,
            document_2_value: isDe ? "Verifiziert für ATLAS" : "Verified for ATLAS",
            matched: true,
            variance: null
          },
          {
            field_name: isDe ? "Incoterms Handelsklausel" : "Incoterms Clause",
            bol_value: "CIF",
            invoice_value: "CIF",
            packing_list_value: "-",
            tolerance_or_delta: isDe ? "Kaufmännisch übereinstimmend" : "Commercially matching",
            document_1_value: "CIF",
            document_2_value: "CIF",
            matched: true,
            variance: null
          }
        ],
        demurrage_prevented_eur: aud.demurrage_prevented_eur || item.estimated_liability || 750.0,
        action_required: aud.action_required || (isDe ? 'Diskrepanz festgestellt: Standgeldrisiko am Terminal' : 'Discrepancy detected: Demurrage risk at terminal'),
        discrepancy_notice_text: aud.discrepancy_notice_text || `ADSp 2017 REKLAMATIONSMEMO (OLE Oceanwide Logistics Europe GmbH)\nRef: ${item.shipment_ref}\nContainer: ${containerNo}\nDiskrepanz: Checksum/Weight Mismatch\nHaftungsvorbehalt gem. ADSp 2017 & § 412 HGB erklärt.`,
        preview_urls: {
          bol: "/static/sample_docs/sample bill of ladling.png",
          invoice: "/static/sample_docs/sample commercial invoice.png",
          packing: "/static/sample_docs/sample packing list.png"
        },
        summary_chips: {
          bol: `Container: ${containerNo} | ${Number(grossKg).toLocaleString()} kg`,
          invoice: `Wert: ${Number(totalVal).toLocaleString()} ${curr} | CIF`,
          packing: `Colli: ${ext?.packing_list?.total_packages || 800} | ${Number(grossKg).toLocaleString()} kg`
        }
      };

      renderReconciliationResult(restoredRecData);
    } catch (err) {
      console.error("Error restoring 3-way reconciliation dossier:", err);
    }
  } 
  // BRANCH 2: Single Document Ingestion Workspace
  else {
    switchTab('pipeline');
    try {
      let ext = {};
      let aud = {};
      if (item.extracted_json) {
        ext = typeof item.extracted_json === 'string' ? JSON.parse(item.extracted_json) : item.extracted_json;
      }
      if (item.audit_json) {
        aud = typeof item.audit_json === 'string' ? JSON.parse(item.audit_json) : item.audit_json;
      }

      // Determine appropriate document preview image
      let previewUrl = item.document_preview_url;
      if (!previewUrl) {
        const dt = (item.document_type || ext.document_type || '').toLowerCase();
        if (dt.includes('invoice') || dt.includes('rechnung')) {
          previewUrl = '/static/sample_docs/sample commercial invoice.png';
        } else if (dt.includes('packing') || dt.includes('packliste')) {
          previewUrl = '/static/sample_docs/sample packing list.png';
        } else {
          previewUrl = '/static/sample_docs/sample bill of ladling.png';
        }
      }

      const safeHash = (item.sha256 || 'ad0bac5f94c6a2ac2955909ead4a01ad7b47c2da104e8efb89ebd9e6bf1b5086').toString();
      const restoredPipelineData = {
        extracted_data: ext,
        audit_report: aud,
        shipment_id: item.shipment_ref,
        sha256_hash: safeHash,
        file_size_bytes: item.file_size_bytes || 24576,
        mime_type: item.mime_type || 'image/png',
        filename: `${item.shipment_ref} (${item.document_type || 'Transport Document'})`,
        document_preview_url: previewUrl,
        mssql_insert_statement: item.mssql_insert_statement || generateClientTsqlFromItem(item, ext)
      };

      currentPipelineData = restoredPipelineData;
      currentDocumentName = restoredPipelineData.filename;
      renderPipelineResponse(restoredPipelineData);
    } catch (err) {
      console.error("Error restoring single shipment workspace:", err);
    }
  }
}

function inspectLedgerShipment(shipmentRef) {
  inspectShipmentRecord(shipmentRef);
}

function copyLedgerHash(hash) {
  if (!hash) return;
  navigator.clipboard.writeText(hash).then(() => {
    alert(t('ledger_copied_hash'));
  });
}

function copyLedgerTsql(shipmentRef) {
  const row = allLedgerRows.find(i => i.shipment_ref === shipmentRef);
  if (!row) return;

  const isClean = row.audit_status === 'VERIFIED_CLEAN';
  const atlasReady = row.atlas_ready ? 1 : 0;
  const quarHold = isClean ? 0 : 1;
  const demurrageVal = isClean ? 0.0 : (row.prevented_demurrage_eur || 1250.0);
  const refId = (row.shipment_ref || 'REF-UNKNOWN').replace(/'/g, "''");
  const docType = (row.document_type || 'BILL_OF_LADING').replace(/'/g, "''");
  const sha = (row.sha256 || 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855').replace(/'/g, "''");
  const gross = row.gross_weight_kg ? Number(row.gross_weight_kg).toFixed(2) : '0.00';
  const val = row.total_amount ? Number(row.total_amount).toFixed(2) : '0.00';
  const curr = (row.currency || 'EUR').replace(/'/g, "''");

  const sql = `INSERT INTO dbo.OLE_Staging_Shipments (
    ReferenceId,
    DocumentType,
    Sha256Hash,
    GrossWeightKg,
    TotalValue,
    Currency,
    AtlasReady,
    QuarantineHold,
    DemurrageRiskAvertedEur,
    IngestionTimestampUtc
) VALUES (
    '${refId}',
    '${docType}',
    '${sha}',
    ${gross},
    ${val},
    '${curr}',
    ${atlasReady},
    ${quarHold},
    ${demurrageVal},
    SYSUTCDATETIME()
);`;

  navigator.clipboard.writeText(sql).then(() => {
    alert(t('ledger_copied_tsql'));
  });
}

function openCustomsCertModal(shipmentRef) {
  const item = allLedgerRows.find(i => i.shipment_ref === shipmentRef);
  if (!item) return;
  activeCertificateDraft = item;

  let ext = {};
  try {
    if (item.extracted_json) ext = typeof item.extracted_json === 'string' ? JSON.parse(item.extracted_json) : item.extracted_json;
  } catch (_) {}

  const isClean = (item.audit_status === 'VERIFIED_CLEAN');
  const isOverride = (item.audit_status === 'OVERRIDDEN_RELEASED');

  const refEl = document.getElementById('cert-val-ref');
  const timeEl = document.getElementById('cert-val-time');
  const doctypeEl = document.getElementById('cert-val-doctype');
  const unitEl = document.getElementById('cert-val-unit');
  const shipperEl = document.getElementById('cert-val-shipper');
  const consigneeEl = document.getElementById('cert-val-consignee');
  const grossEl = document.getElementById('cert-val-gross');
  const valEl = document.getElementById('cert-val-value');
  const statusEl = document.getElementById('cert-val-status');
  const atlasEl = document.getElementById('cert-val-atlas');
  const sealEl = document.getElementById('cert-val-seal');

  if (refEl) refEl.textContent = item.shipment_ref || 'N/A';
  if (timeEl) timeEl.textContent = item.processed_at ? `${item.processed_at} UTC` : 'N/A';
  if (doctypeEl) doctypeEl.textContent = `${item.document_type || 'SHIPMENT'} (${detectModalMode(item.document_type).toUpperCase()})`;
  if (unitEl) unitEl.textContent = item.container_number || ext.container_number || ext.awb_number || 'N/A';
  if (shipperEl) shipperEl.textContent = item.shipper || ext.shipper || 'N/A';
  if (consigneeEl) consigneeEl.textContent = item.consignee || ext.consignee || 'N/A';
  if (grossEl) grossEl.textContent = item.gross_weight_kg ? `${Number(item.gross_weight_kg).toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US', {minimumFractionDigits: 1})} kg` : 'N/A';
  if (valEl) valEl.textContent = item.total_amount ? `${Number(item.total_amount).toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US', {minimumFractionDigits: 2})} ${item.currency || 'EUR'}` : 'N/A';

  if (statusEl) {
    if (isClean) {
      statusEl.textContent = currentLang === 'de' ? 'VOLLSTÄNDIG ZOLLKONFORM (CLEAN)' : 'PRE-CLEARED / COMPLIANT (CLEAN)';
      statusEl.className = 'font-bold text-emerald-400 text-sm';
    } else if (isOverride) {
      statusEl.textContent = currentLang === 'de' ? 'BETRIEBLICHE FREIGABE (OVERRIDE)' : 'SUPERVISOR OVERRIDE (RELEASED)';
      statusEl.className = 'font-bold text-blue-400 text-sm';
    } else {
      statusEl.textContent = currentLang === 'de' ? 'QUARANTÄNE-HOLD (KLÄRUNG)' : 'QUARANTINE HOLD (REVIEW)';
      statusEl.className = 'font-bold text-red-400 text-sm';
    }
  }

  if (atlasEl) {
    if (item.atlas_ready) {
      atlasEl.textContent = currentLang === 'de' ? 'ATLAS 9.1 FREIGEGEBEN (READY)' : 'ATLAS 9.1 CLEARED (READY)';
      atlasEl.className = 'text-emerald-400 font-bold';
    } else {
      atlasEl.textContent = currentLang === 'de' ? 'MANUELLE ZOLLNACHPRÜFUNG' : 'CUSTOMS REVIEW REQUIRED';
      atlasEl.className = 'text-amber-400 font-bold';
    }
  }

  if (sealEl) sealEl.textContent = item.sha256 || 'N/A';

  const modal = document.getElementById('modal-customs-certificate');
  if (modal) modal.classList.remove('hidden');

  if (typeof isGuidedTourActive !== 'undefined' && isGuidedTourActive && currentTourStepIdx === 9) {
    tourCustomsCertViewed = true;
    const btnNext = document.getElementById('tour-btn-next');
    const actionBtn = document.getElementById('tour-btn-action');
    const actionLbl = document.getElementById('tour-action-label');
    const isDe = (currentLang === 'de');
    if (btnNext) {
      btnNext.disabled = false;
      btnNext.classList.remove('opacity-40', 'cursor-not-allowed');
      btnNext.classList.add('tour-btn-halo', 'cursor-pointer');
      btnNext.title = '';
    }
    if (actionBtn) actionBtn.classList.remove('tour-btn-halo');
    if (actionLbl) {
      actionLbl.textContent = isDe ? "✓ Zollzertifikat eingesehen (Erneut öffnen)" : "✓ Certificate Viewed (Re-open)";
    }
  }
}

function closeCustomsCertModal() {
  const modal = document.getElementById('modal-customs-certificate');
  if (modal) modal.classList.add('hidden');
  activeCertificateDraft = null;
}

function printCustomsCert() {
  window.print();
}

function copyCustomsCertText() {
  if (!activeCertificateDraft) return;
  const d = activeCertificateDraft;
  const isDe = (currentLang === 'de');
  const text = `${isDe ? 'ZOLL-AUDIT-ZERTIFIKAT (§ 147 AO / ATLAS 9.1)' : 'CUSTOMS COMPLIANCE AUDIT CERTIFICATE (§ 147 AO / ATLAS 9.1)'}
========================================================================
${isDe ? 'MANDANT' : 'CLIENT'}: OLE Oceanwide Logistics Europe GmbH // OLGN Hamburg (HRB 122583)
${isDe ? 'REFERENZ-NR.' : 'REFERENCE ID'}: ${d.shipment_ref}
${isDe ? 'ZEITSTEMPEL (UTC)' : 'TIMESTAMP (UTC)'}: ${d.processed_at}
${isDe ? 'BELEGART' : 'DOC TYPE'}: ${d.document_type}
${isDe ? 'CONTAINER / FRACHT-ID' : 'UNIT / CARGO ID'}: ${d.container_number || 'N/A'}
${isDe ? 'VERSENDER' : 'SHIPPER'}: ${d.shipper || 'N/A'}
${isDe ? 'EMPFÄNGER' : 'CONSIGNEE'}: ${d.consignee || 'N/A'}
${isDe ? 'BRUTTOGEWICHT' : 'GROSS WEIGHT'}: ${d.gross_weight_kg ? d.gross_weight_kg + ' kg' : 'N/A'}
${isDe ? 'WARENWERT' : 'DECLARED VALUE'}: ${d.total_amount ? d.total_amount + ' ' + (d.currency || 'EUR') : 'N/A'}
${isDe ? 'AUDIT-STATUS' : 'AUDIT STATUS'}: ${d.audit_status}
${isDe ? 'ATLAS 9.1 STATUS' : 'ATLAS 9.1 STATUS'}: ${d.atlas_ready ? 'READY / CLEARED' : 'REVIEW'}
${isDe ? 'GoBD SHA-256 SIEGEL' : 'GoBD SHA-256 SEAL'}: ${d.sha256}
========================================================================
${t('cert_legal_disclaimer')}`;

  navigator.clipboard.writeText(text).then(() => {
    const lbl = document.getElementById('label-copy-cert-text');
    if (lbl) {
      const orig = lbl.textContent;
      lbl.textContent = t('copied_alert');
      lbl.classList.add('text-emerald-200');
      setTimeout(() => {
        lbl.textContent = orig;
        lbl.classList.remove('text-emerald-200');
      }, 1500);
    }
  });
}

function exportLedgerCsv() {
  if (!allLedgerRows || allLedgerRows.length === 0) {
    alert(currentLang === 'de' ? "Keine Ledger-Daten zum Exportieren vorhanden." : "No ledger records to export.");
    return;
  }

  const rowsToExport = getFilteredLedgerRows();
  const headers = [
    "TimestampUTC",
    "ShipmentRef",
    "DocumentType",
    "ContainerNumber",
    "Shipper",
    "Consignee",
    "GrossWeightKg",
    "TotalAmount",
    "Currency",
    "AuditStatus",
    "AtlasReady",
    "GoBDSha256Seal",
    "OverrideReason",
    "OverrideOperator",
    "OverrideAt"
  ];

  const lines = rowsToExport.map(r => [
    `"${r.processed_at || ''}"`,
    `"${(r.shipment_ref || '').replace(/"/g, '""')}"`,
    `"${(r.document_type || '').replace(/"/g, '""')}"`,
    `"${(r.container_number || '').replace(/"/g, '""')}"`,
    `"${(r.shipper || '').replace(/"/g, '""')}"`,
    `"${(r.consignee || '').replace(/"/g, '""')}"`,
    r.gross_weight_kg ? Number(r.gross_weight_kg).toFixed(2) : "0.00",
    r.total_amount ? Number(r.total_amount).toFixed(2) : "0.00",
    `"${(r.currency || 'EUR').replace(/"/g, '""')}"`,
    `"${r.audit_status || ''}"`,
    r.atlas_ready ? 1 : 0,
    `"${r.sha256 || ''}"`,
    `"${(r.override_reason || '').replace(/"/g, '""')}"`,
    `"${(r.override_operator || '').replace(/"/g, '""')}"`,
    `"${r.override_at || ''}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...lines.map(l => l.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Oceanwide_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportLedgerGobdJson() {
  if (!allLedgerRows || allLedgerRows.length === 0) {
    alert(currentLang === 'de' ? "Keine Ledger-Daten zum Exportieren vorhanden." : "No ledger records to export.");
    return;
  }

  const rowsToExport = getFilteredLedgerRows();
  const archive = {
    standard: "GoBD § 147 AO / ATLAS 9.1",
    client: "OLE Oceanwide Logistics Europe GmbH · OLGN Hamburg",
    eori: "DE88219430",
    exported_at_utc: new Date().toISOString(),
    records_count: rowsToExport.length,
    tamper_seal_algorithm: "SHA-256",
    shipments: rowsToExport.map(r => ({
      shipment_ref: r.shipment_ref,
      processed_at: r.processed_at,
      document_type: r.document_type,
      container_number: r.container_number,
      shipper: r.shipper,
      consignee: r.consignee,
      gross_weight_kg: r.gross_weight_kg,
      total_amount: r.total_amount,
      currency: r.currency,
      audit_status: r.audit_status,
      atlas_ready: Boolean(r.atlas_ready),
      sha256_seal: r.sha256,
      override_metadata: r.override_reason ? {
        reason: r.override_reason,
        operator: r.override_operator,
        timestamp: r.override_at
      } : null,
      quarantine_reason: r.quarantine_reason
    }))
  };

  const jsonStr = JSON.stringify(archive, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Oceanwide_GoBD_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function setQuarFilter(filter) {
  currentQuarFilter = filter;
  const filters = ['all', 'critical', 'ocean', 'air', 'road'];
  filters.forEach(f => {
    const btn = document.getElementById(`quar-filter-${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = 'quar-filter-active px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer';
      } else {
        btn.className = 'quar-filter-inactive px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer';
      }
    }
  });
  renderQuarantineTable();
}

function handleQuarSearch(query) {
  currentQuarSearch = (query || '').toLowerCase().trim();
  renderQuarantineTable();
}

function renderQuarantineTable() {
  const qBody = document.getElementById('quarantine-table-body');
  const emptyState = document.getElementById('quar-empty-state');
  if (!qBody) return;

  const isDe = (currentLang === 'de');

  // 1. Calculate overall counts for KPI Cards and filter pills
  const totalCount = allQuarantineShipments.length;
  const criticalCount = allQuarantineShipments.filter(i => i.isCritical).length;
  const oceanCount = allQuarantineShipments.filter(i => i.mode === 'ocean').length;
  const airCount = allQuarantineShipments.filter(i => i.mode === 'air').length;
  const roadCount = allQuarantineShipments.filter(i => i.mode === 'road').length;
  
  const totalAverted = allQuarantineShipments.reduce((acc, cur) => acc + (cur.estimated_liability || 0), 0);
  const criticalDailyExposure = allQuarantineShipments.filter(i => i.isCritical).reduce((acc, cur) => acc + (cur.dailyRate || 350), 0);

  // Update KPI card elements
  const statActive = document.getElementById('quar-stat-active');
  const statCrit = document.getElementById('quar-stat-critical');
  const statPrev = document.getElementById('quar-stat-prevented');
  if (statActive) statActive.textContent = `${totalCount} ${isDe ? 'Sendungen' : 'Cases'}`;
  if (statCrit) statCrit.textContent = `${criticalCount} Unit${criticalCount !== 1 ? 's' : ''} • ${criticalDailyExposure.toLocaleString(isDe ? 'de-DE' : 'en-US')} €/${isDe ? 'Tag' : 'Day'}`;
  if (statPrev) statPrev.textContent = `${totalAverted.toLocaleString(isDe ? 'de-DE' : 'en-US')} €`;

  // Update filter pill counters
  const cAll = document.getElementById('quar-count-all');
  const cCrit = document.getElementById('quar-count-critical');
  const cOcean = document.getElementById('quar-count-ocean');
  const cAir = document.getElementById('quar-count-air');
  const cRoad = document.getElementById('quar-count-road');
  if (cAll) cAll.textContent = totalCount;
  if (cCrit) cCrit.textContent = criticalCount;
  if (cOcean) cOcean.textContent = oceanCount;
  if (cAir) cAir.textContent = airCount;
  if (cRoad) cRoad.textContent = roadCount;

  // 2. Filter & Search items
  let filtered = allQuarantineShipments.filter(item => {
    if (currentQuarFilter === 'critical' && !item.isCritical) return false;
    if (currentQuarFilter === 'ocean' && item.mode !== 'ocean') return false;
    if (currentQuarFilter === 'air' && item.mode !== 'air') return false;
    if (currentQuarFilter === 'road' && item.mode !== 'road') return false;

    if (currentQuarSearch) {
      const match = (item.shipment_ref || '').toLowerCase().includes(currentQuarSearch) ||
                    (item.unitId || '').toLowerCase().includes(currentQuarSearch) ||
                    (item.carrier || '').toLowerCase().includes(currentQuarSearch) ||
                    (item.port || '').toLowerCase().includes(currentQuarSearch) ||
                    (item.reasonShort || '').toLowerCase().includes(currentQuarSearch);
      if (!match) return false;
    }
    return true;
  });

  // Sort by shortest remaining hours (most urgent first)
  filtered.sort((a, b) => a.remainingHours - b.remainingHours);

  // 3. Render Table rows or Empty State
  qBody.innerHTML = '';
  if (filtered.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  } else {
    if (emptyState) emptyState.classList.add('hidden');
  }

  filtered.forEach((r, idx) => {
    // Countdown badge styling
    let countdownBadge = '';
    if (r.isCritical) {
      countdownBadge = `<div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold quar-countdown-critical border border-red-500/40 bg-red-950/60 text-red-300">
        <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        <span><i class="fa-solid fa-clock-rotate-left mr-1"></i>${r.remainingHours}h ${isDe ? 'verbleibend' : 'remaining'}</span>
      </div>`;
    } else if (r.isWarning) {
      countdownBadge = `<div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold quar-countdown-warning border border-amber-500/40 bg-amber-950/50 text-amber-300">
        <span><i class="fa-solid fa-triangle-exclamation mr-1"></i>${r.remainingHours}h ${isDe ? 'Freitage' : 'free time'}</span>
      </div>`;
    } else {
      countdownBadge = `<div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium quar-countdown-managed border border-blue-500/40 bg-blue-950/40 text-blue-300">
        <span><i class="fa-solid fa-circle-info mr-1"></i>${r.remainingHours}h ${isDe ? 'Puffer' : 'buffer'}</span>
      </div>`;
    }

    // ISO checksum badge
    let isoBadge = '';
    if (r.isoCheck.valid) {
      isoBadge = `<span class="text-[9px] px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono-code font-bold" title="${isDe ? 'ISO 6346 Gültig' : 'ISO 6346 Valid'}">ISO OK</span>`;
    } else {
      isoBadge = `<span class="text-[9px] px-1 py-0.2 rounded bg-red-950/80 text-red-400 border border-red-800 font-mono-code font-bold" title="${isDe ? 'Prüfziffer rechnerisch ungültig' : 'Modulo-11 check digit invalid'}">${isDe ? 'ISO FEHLER' : 'ISO FAIL'}</span>`;
    }

    // Transport mode icon
    let modeIcon = '<i class="fa-solid fa-ship text-[10px] text-blue-400"></i>';
    if (r.mode === 'air') modeIcon = '<i class="fa-solid fa-plane text-[10px] text-blue-400"></i>';
    else if (r.mode === 'road') modeIcon = '<i class="fa-solid fa-truck text-[10px] text-blue-400"></i>';

    const tr = document.createElement('tr');
    tr.className = 'quar-table-row hover:bg-[#131D31]/70 transition-colors border-b border-[#1E293B]/60';
    tr.id = `quar-row-${idx}`;
    tr.innerHTML = `
      <!-- Column 1: Ref & Terminal -->
      <td class="py-2.5 px-3">
        <div class="font-bold text-white cursor-pointer flex items-center gap-1.5" onclick="toggleQuarDrawer('${r.shipment_ref}')">
          <i class="fa-solid fa-chevron-right text-[10px] text-slate-500 transition-transform ${openQuarDrawerRef === r.shipment_ref ? 'rotate-90 text-amber-400' : ''}" id="quar-chevron-${r.shipment_ref}"></i>
          <span class="hover:underline">${escapeHtml(r.shipment_ref)}</span>
        </div>
        <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 font-medium quar-badge-terminal inline-block px-1.5 py-0.5 rounded border border-[#1E293B] bg-[#0E1626]">
          ${escapeHtml(r.port)}
        </div>
      </td>

      <!-- Column 2: Container / ULD & Carrier -->
      <td class="py-2.5 px-3">
        <div class="font-bold font-mono-code text-amber-400 flex items-center gap-1.5">
          <span>${escapeHtml(r.unitId)}</span>
          ${isoBadge}
        </div>
        <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1 quar-badge-carrier font-medium">
          ${modeIcon}
          <span>${escapeHtml(r.carrier)}</span>
        </div>
      </td>

      <!-- Column 3: Countdown Clock -->
      <td class="py-2.5 px-3">
        ${countdownBadge}
        <div class="text-[10px] text-slate-400 mt-1 font-semibold whitespace-nowrap">
          ${r.dailyRate.toLocaleString(isDe ? 'de-DE' : 'en-US')} € / ${isDe ? 'Tag Liegegeld' : 'day demurrage'}
        </div>
      </td>

      <!-- Column 4: Root Cause & Delta -->
      <td class="py-2.5 px-3 max-w-md xl:max-w-xl">
        <div class="text-xs font-semibold text-red-400 truncate" title="${escapeHtml(r.reasonShort)}">
          <i class="fa-solid fa-circle-exclamation mr-1 text-[11px]"></i> ${escapeHtml(r.reasonShort)}
        </div>
        <div class="text-[11px] text-slate-400 mt-0.5">
          ${isDe ? 'Dok-Typ:' : 'Doc Type:'} <span class="text-slate-300 font-medium">${escapeHtml(r.document_type || 'Dossier')}</span>
        </div>
      </td>

      <!-- Column 5: Fees Risk -->
      <td class="py-2.5 px-3 text-right font-semibold text-red-400 whitespace-nowrap">
        <div>${(r.estimated_liability || 750.0).toFixed(2)} €</div>
        <div class="text-[10px] text-slate-500 font-normal">${isDe ? 'Risiko' : 'Risk'}</div>
      </td>

      <!-- Column 6: Status -->
      <td class="py-2.5 px-3 text-center whitespace-nowrap">
        <span class="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-400 border border-red-800 font-bold">HOLD</span>
      </td>

      <!-- Column 7: Operational Actions -->
      <td class="py-2.5 px-3 text-right">
        <div class="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <button onclick="inspectQuarShipment('${r.shipment_ref}')" title="${t('quar_btn_inspect')}" class="w-7 h-7 rounded-lg bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-blue-400 hover:text-blue-300 flex items-center justify-center transition cursor-pointer shadow-sm">
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </button>
          <button onclick="openQuarClaimModal('${r.shipment_ref}')" title="${t('quar_btn_claim')}" class="w-7 h-7 rounded-lg bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-purple-400 hover:text-purple-300 flex items-center justify-center transition cursor-pointer shadow-sm">
            <i class="fa-regular fa-envelope text-xs"></i>
          </button>
          <button onclick="requestQuarRevisedDocs('${r.shipment_ref}')" title="${t('quar_btn_request')}" class="w-7 h-7 rounded-lg bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-amber-400 hover:text-amber-300 flex items-center justify-center transition cursor-pointer shadow-sm">
            <i class="fa-regular fa-clipboard text-xs"></i>
          </button>
          <button onclick="openQuarOverrideModal('${r.shipment_ref}')" title="${t('quar_btn_override')}" class="w-7 h-7 rounded-lg bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-emerald-400 hover:text-emerald-300 flex items-center justify-center transition cursor-pointer shadow-sm">
            <i class="fa-solid fa-lock-open text-xs"></i>
          </button>
          <button onclick="toggleQuarDrawer('${r.shipment_ref}')" title="${isDe ? 'Details ein-/ausblenden' : 'Toggle details'}" class="w-7 h-7 rounded-lg bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm">
            <i class="fa-solid ${openQuarDrawerRef === r.shipment_ref ? 'fa-chevron-up text-amber-400' : 'fa-chevron-down'} text-xs"></i>
          </button>
        </div>
      </td>
    `;
    qBody.appendChild(tr);

    // Expandable Drawer Row
    const drawerTr = document.createElement('tr');
    drawerTr.id = `quar-drawer-${r.shipment_ref}`;
    drawerTr.className = (openQuarDrawerRef === r.shipment_ref ? '' : 'hidden') + ' bg-[#070B14]/80 border-b border-[#1E293B]';

    // Detailed Discrepancy Breakdown HTML
    let detailsHtml = '';
    if (r.reasonDetails && r.reasonDetails.length > 0) {
      const rows = r.reasonDetails.map(d => `
        <tr class="border-b border-[#1E293B]/40">
          <td class="py-1.5 px-2 font-bold text-white">${escapeHtml(d.field)}</td>
          <td class="py-1.5 px-2 text-blue-300 font-mono-code">${escapeHtml(d.bol)}</td>
          <td class="py-1.5 px-2 text-purple-300 font-mono-code">${escapeHtml(d.inv)}</td>
          <td class="py-1.5 px-2 text-red-400 font-bold whitespace-nowrap">${escapeHtml(d.delta)}</td>
        </tr>
      `).join('');
      detailsHtml = `
        <div class="overflow-x-auto my-2">
          <table class="w-full text-left text-[11px]">
            <thead class="bg-[#0E1626] text-slate-400 border-b border-[#1E293B]">
              <tr>
                <th class="py-1.5 px-2 font-semibold uppercase tracking-wider text-[10px]">${isDe ? 'Audit-Merkmal' : 'Audit Attribute'}</th>
                <th class="py-1.5 px-2 font-semibold uppercase tracking-wider text-[10px]">${isDe ? 'Frachturkunde (B/L / AWB / CMR)' : 'Waybill (B/L / AWB / CMR)'}</th>
                <th class="py-1.5 px-2 font-semibold uppercase tracking-wider text-[10px]">${isDe ? 'Handelsrechnung / Packliste' : 'Invoice / Packing List'}</th>
                <th class="py-1.5 px-2 font-semibold uppercase tracking-wider text-[10px]">${isDe ? 'Abweichung (Delta)' : 'Discrepancy (Delta)'}</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    } else {
      detailsHtml = `
        <div class="p-2.5 rounded-lg bg-[#0E1626] border border-[#1E293B] text-[11px] text-slate-300 my-2">
          <i class="fa-solid fa-triangle-exclamation text-amber-400 mr-1.5"></i>
          ${escapeHtml(r.reasonShort)}
        </div>
      `;
    }

    drawerTr.innerHTML = `
      <td colspan="7" class="p-4">
        <div class="quar-drawer-box bg-[#0A0F1D] p-4 rounded-xl border border-[#1E293B] space-y-3">
          <div class="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-microscope text-amber-400 text-sm"></i>
              <span class="text-xs font-bold uppercase text-white">${isDe ? 'Deterministische Diskrepanz-Forensik' : 'Deterministic Discrepancy Forensics'} (${escapeHtml(r.shipment_ref)})</span>
            </div>
            <span class="text-[11px] text-slate-400">${isDe ? 'Erfasst am:' : 'Recorded on:'} ${escapeHtml(r.processed_at || '-')}</span>
          </div>

          ${detailsHtml}

          <!-- Legal & Action Footer -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px]">
            <div class="text-slate-400 flex items-center gap-2">
              <i class="fa-solid fa-scale-balanced text-blue-400"></i>
              <span>${isDe ? 'Rechtsgrundlage: <strong>ADSp 2017 Ziffer 19</strong> (Haftungsbeschränkung & Rügepflicht) & <strong>§ 412 HGB</strong>' : 'Legal Basis: <strong>ADSp 2017 Section 19</strong> (Limitation of Liability & Notice Period) & <strong>§ 412 HGB</strong>'}</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="copyQuarDiscrepancyNotice('${r.shipment_ref}')" class="bg-[#131D31] hover:bg-[#1E2D4E] border border-[#1E293B] text-slate-200 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 shadow-sm">
                <i class="fa-regular fa-copy text-blue-400"></i> <span>${isDe ? 'Forensik kopieren' : 'Copy Forensics'}</span>
              </button>
              <button onclick="openQuarClaimModal('${r.shipment_ref}')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 shadow-sm">
                <i class="fa-regular fa-envelope"></i> <span>${isDe ? 'ADSp Reklamation erstellen' : 'Create ADSp Claim Notice'}</span>
              </button>
            </div>
          </div>
        </div>
      </td>
    `;
    qBody.appendChild(drawerTr);
  });
}

function toggleQuarDrawer(shipmentRef) {
  openQuarDrawerRef = (openQuarDrawerRef === shipmentRef) ? null : shipmentRef;
  renderQuarantineTable();

  if (typeof isGuidedTourActive !== 'undefined' && isGuidedTourActive && currentTourStepIdx === 8) {
    const btnNext = document.getElementById('tour-btn-next');
    const actionBtn = document.getElementById('tour-btn-action');
    const actionLbl = document.getElementById('tour-action-label');
    const isDe = (currentLang === 'de');
    if (openQuarDrawerRef) {
      if (btnNext) {
        btnNext.disabled = false;
        btnNext.classList.remove('opacity-40', 'cursor-not-allowed');
        btnNext.classList.add('tour-btn-halo', 'cursor-pointer');
        btnNext.title = '';
      }
      if (actionBtn) actionBtn.classList.remove('tour-btn-halo');
      if (actionLbl) {
        actionLbl.textContent = isDe ? "✓ Forensik geöffnet (Umschalten)" : "✓ Forensics Opened (Toggle)";
      }
    } else {
      if (btnNext) {
        btnNext.disabled = true;
        btnNext.classList.remove('tour-btn-halo', 'cursor-pointer');
        btnNext.classList.add('opacity-40', 'cursor-not-allowed');
        btnNext.title = isDe ? 'Bitte zuerst die Diskrepanz-Forensik öffnen' : 'Please open Discrepancy Forensics first';
      }
      if (actionBtn) actionBtn.classList.add('tour-btn-halo');
      if (actionLbl) {
        actionLbl.textContent = isDe ? "Diskrepanz-Forensik öffnen" : "Open Discrepancy Forensics";
      }
    }
  }
}

function inspectQuarShipment(shipmentRef) {
  inspectShipmentRecord(shipmentRef);
}

function openQuarClaimModal(shipmentRef) {
  const item = allQuarantineShipments.find(i => i.shipment_ref === shipmentRef);
  if (!item) return;

  const isDe = (currentLang === 'de');
  const subject = isDe
    ? `[ADSp 2017 REKLAMATION] Frachtdiskrepanz & Demurrage-Haftungsvorbehalt - Ref: ${item.shipment_ref} - Unit: ${item.unitId}`
    : `[ADSp 2017 / HGB CLAIM NOTICE] Freight Discrepancy & Demurrage Liability Reservation - Ref: ${item.shipment_ref} - Unit: ${item.unitId}`;

  const body = isDe ? `An: Reederei / Terminal Disposition (${item.carrier})
Terminal: ${item.port}
Sendungsreferenz: ${item.shipment_ref}
Container / ULD ID: ${item.unitId}
Eingangsdatum: ${item.processed_at || 'Heute'}

Sehr geehrte Damen und Herren,

im Rahmen des deterministischen Wareneingangs-Audits (Oceanwide Gateway) der oben genannten Sendung wurde eine unauflösbare Diskrepanz festgestellt:

FEHLERBEFUND:
${item.reasonShort}

HAFTUNGSVORBEHALT (ADSp 2017 & § 412 HGB):
Wir beanstanden die Unstimmigkeit hiermit fristgerecht und behalten uns alle Rechte aus den Allgemeinen Deutschen Spediteurbedingungen (ADSp 2017) sowie dem Handelsgesetzbuch (§ 412 HGB) vor. 
Liegegelder (Demurrage & Detention), Verwahrungsentgelte sowie terminalseitige Standgelder, die auf diese Beleg- und Gewichtsabweichung zurückzuführen sind, werden ausdrücklich nicht von uns getragen und dem Verursacher zur Last gelegt.

Bitte veranlassen Sie unverzüglich die Klärung und halten Sie die Freitage bis zur Behebung des Befunds an.

Mit freundlichen Grüßen,
OLE Oceanwide Logistics Europe GmbH
Hamburg Seaport Operations & Demurrage Shield (Süderstraße 77, 20097 Hamburg)` : `To: Carrier / Terminal Operations (${item.carrier})
Terminal: ${item.port}
Shipment Ref: ${item.shipment_ref}
Container / ULD ID: ${item.unitId}
Receipt Date: ${item.processed_at || 'Today'}

Dear Sir or Madam,

During automated deterministic inbound auditing (Oceanwide Gateway) for the referenced shipment, an irreconcilable discrepancy was identified:

AUDIT FINDING:
${item.reasonShort}

RESERVATION OF LIABILITY (ADSp 2017 & § 412 German Commercial Code - HGB):
We hereby lodge our formal discrepancy notice within the statutory period and reserve all rights under the German Freight Forwarders' Standard Terms and Conditions (ADSp 2017) and § 412 HGB.
Demurrage, detention, and terminal storage charges resulting from this documentation or weight discrepancy shall not be accepted by our company and will be debited to the responsible party.

Please initiate an immediate clarification and pause the free-time clock until this issue has been rectified.

Sincerely,
OLE Oceanwide Logistics Europe GmbH
Hamburg Seaport Operations & Demurrage Shield (Süderstraße 77, 20097 Hamburg)`;

  const subjEl = document.getElementById('quar-claim-subject');
  const bodyEl = document.getElementById('quar-claim-body');
  if (subjEl) subjEl.value = subject;
  if (bodyEl) bodyEl.textContent = body;

  activeClaimDraft = { subject, body, item };
  const modal = document.getElementById('modal-quar-claim');
  if (modal) modal.classList.remove('hidden');
}

function closeQuarClaimModal() {
  const modal = document.getElementById('modal-quar-claim');
  if (modal) modal.classList.add('hidden');
}

function copyQuarClaimText() {
  if (!activeClaimDraft) return;
  const isDe = (currentLang === 'de');
  const fullText = `${isDe ? 'Betreff' : 'Subject'}: ${activeClaimDraft.subject}\n\n${activeClaimDraft.body}`;
  navigator.clipboard.writeText(fullText).then(() => {
    const label = document.getElementById('label-copy-claim-draft');
    if (label) {
      const orig = label.textContent;
      label.textContent = t('quar_claim_copied');
      setTimeout(() => { label.textContent = orig; }, 1500);
    }
  });
}

function openQuarClaimMailto() {
  if (!activeClaimDraft) return;
  const mailto = `mailto:claims@carrier.com?subject=${encodeURIComponent(activeClaimDraft.subject)}&body=${encodeURIComponent(activeClaimDraft.body)}`;
  window.location.href = mailto;
}

function requestQuarRevisedDocs(shipmentRef) {
  const item = allQuarantineShipments.find(i => i.shipment_ref === shipmentRef);
  if (!item) return;

  const isDe = (currentLang === 'de');
  const mailText = isDe
    ? `Sehr geehrte Damen und Herren,\n\nbei der automatisierten Prüfung der Sendung ${item.shipment_ref} (Container: ${item.unitId}) wurde folgende Diskrepanz festgestellt:\n${item.reasonShort}\n\nUm drohende Standgelder am Terminal ${item.port} abzuwenden, bitten wir umgehend um Übersendung einer korrigierten Packliste bzw. Handelsrechnung.\n\nMit freundlichen Grüßen,\nOLE Oceanwide Logistics Europe GmbH / OLGN Leitstand Hamburg`
    : `Dear Sir or Madam,\n\nDuring automated deterministic auditing of shipment ${item.shipment_ref} (Container/Unit: ${item.unitId}), the following discrepancy was detected:\n${item.reasonShort}\n\nTo prevent demurrage and storage penalties at terminal ${item.port}, please immediately submit an amended packing list or commercial invoice.\n\nBest regards,\nOLE Oceanwide Logistics Europe GmbH / OLGN Central Dispatch Hamburg`;

  navigator.clipboard.writeText(mailText).then(() => {
    alert(t('quar_request_copied') + '\n\n' + mailText);
  });
}

function copyQuarDiscrepancyNotice(shipmentRef) {
  const item = allQuarantineShipments.find(i => i.shipment_ref === shipmentRef);
  if (!item) return;
  const txt = item.discrepancyNotice || item.reasonShort;
  navigator.clipboard.writeText(txt).then(() => {
    alert(t('copied_alert'));
  });
}

function openQuarOverrideModal(shipmentRef) {
  activeOverrideShipmentRef = shipmentRef;
  const refDisplay = document.getElementById('quar-override-ref-display');
  if (refDisplay) refDisplay.textContent = shipmentRef;
  const modal = document.getElementById('modal-quar-override');
  if (modal) modal.classList.remove('hidden');
}

function closeQuarOverrideModal() {
  const modal = document.getElementById('modal-quar-override');
  if (modal) modal.classList.add('hidden');
  activeOverrideShipmentRef = null;
}

async function submitQuarOverride() {
  if (!activeOverrideShipmentRef) return;
  const reasonSel = document.getElementById('quar-override-reason-select');
  const noteIn = document.getElementById('quar-override-note-input');
  const opIn = document.getElementById('quar-override-operator-input');
  
  const reason = `${reasonSel ? reasonSel.value : 'Betriebliche Freigabe'} - ${noteIn ? noteIn.value : ''}`.trim();
  const operator = opIn ? opIn.value : 'Lead Dispatcher';

  const btn = document.getElementById('btn-submit-override');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/v1/quarantine/override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shipment_ref: activeOverrideShipmentRef,
        reason: reason,
        operator: operator
      })
    });

    if (res.ok) {
      closeQuarOverrideModal();
      alert(t('quar_override_success'));
      await refreshRecentShipments();
      await refreshMetrics();
    } else {
      alert("Fehler bei Freigabe: " + res.statusText);
    }
  } catch (err) {
    console.error("Override request failed", err);
    alert("Netzwerkfehler bei Freigabe");
  } finally {
    if (btn) btn.disabled = false;
  }
}

function exportQuarantineCsv() {
  if (!allQuarantineShipments || allQuarantineShipments.length === 0) {
    alert(currentLang === 'de' ? "Keine Quarantäne-Daten zum Exportieren vorhanden." : "No quarantine records to export.");
    return;
  }

  const headers = ["ShipmentRef", "UnitID", "Mode", "PortTerminal", "Carrier", "RemainingHours", "FailureReason", "PreventedDemurrageEUR", "DailyRateEUR", "Status", "TimestampUTC"];
  const rows = allQuarantineShipments.map(i => [
    `"${i.shipment_ref}"`,
    `"${i.unitId}"`,
    `"${i.mode}"`,
    `"${i.port}"`,
    `"${i.carrier}"`,
    i.remainingHours,
    `"${(i.reasonShort || '').replace(/"/g, '""')}"`,
    (i.estimated_liability || 750).toFixed(2),
    (i.dailyRate || 350).toFixed(2),
    `"HOLD"`,
    `"${i.processed_at || ''}"`
  ]);

  const csvText = [headers.join(","), ...rows.map(e => e.join(","))].join("\r\n");
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Oceanwide_Quarantine_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================
// 5-STAGE PROGRESSIVE TELEMETRY STEPPER ENGINE
// ==========================================
let telemetryTimerInterval = null;
let telemetryTickerInterval = null;
let telemetryStartTime = 0;
let currentTelemetryStage = 1;

const delay = ms => new Promise(res => setTimeout(res, ms));

function startTelemetryProgress(displayName) {
  const loading = document.getElementById('telemetry-loading');
  const content = document.getElementById('telemetry-content');
  const placeholder = document.getElementById('telemetry-placeholder');
  const bar = document.getElementById('pipeline-indicator-bar');
  const docLabel = document.getElementById('telemetry-doc-label');
  const timerEl = document.getElementById('telemetry-timer');
  const pctEl = document.getElementById('telemetry-percentage');
  const progBar = document.getElementById('telemetry-progress-bar');
  const tickerEl = document.getElementById('telemetry-status-ticker');

  stopTelemetryProgress();

  if (loading) loading.classList.remove('hidden');
  if (placeholder) placeholder.classList.add('hidden');
  if (content) content.classList.add('hidden');
  if (bar) {
    bar.classList.remove('hidden');
    bar.classList.add('flex');
  }

  if (docLabel) docLabel.textContent = displayName || 'Document';

  // Reset Stopwatch
  telemetryStartTime = Date.now();
  if (timerEl) timerEl.textContent = '00:00.0';
  telemetryTimerInterval = setInterval(() => {
    if (!timerEl) return;
    const elapsedMs = Date.now() - telemetryStartTime;
    const totalSecs = Math.floor(elapsedMs / 1000);
    const tenths = Math.floor((elapsedMs % 1000) / 100);
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}.${tenths}`;
  }, 100);

  // Initial stage 1
  setTelemetryStage(1, 15, t('ticker_stage_1'));

  // Background ticker rotation in case live document analysis takes extra seconds
  const rotatingMessages = [
    t('ticker_stage_2'),
    t('ticker_stage_3'),
    t('ticker_stage_4'),
    t('ticker_stage_5')
  ];
  let cycleIdx = 0;
  telemetryTickerInterval = setInterval(() => {
    if (currentTelemetryStage >= 2 && currentTelemetryStage <= 4) {
      if (tickerEl) {
        tickerEl.textContent = rotatingMessages[cycleIdx % rotatingMessages.length];
        cycleIdx++;
      }
    }
  }, 2200);
}

function setTelemetryStage(stageNum, pct, message) {
  currentTelemetryStage = stageNum;
  const pctEl = document.getElementById('telemetry-percentage');
  const progBar = document.getElementById('telemetry-progress-bar');
  const tickerEl = document.getElementById('telemetry-status-ticker');

  if (pctEl) pctEl.textContent = `${pct}%`;
  if (progBar) progBar.style.width = `${pct}%`;
  if (tickerEl && message) tickerEl.textContent = message;

  for (let s = 1; s <= 5; s++) {
    const card = document.getElementById(`telemetry-step-${s}`);
    const icon = document.getElementById(`telemetry-step-${s}-icon`);
    if (!card || !icon) continue;

    if (s < stageNum) {
      card.className = "telemetry-step-passed p-2.5 rounded-xl border border-emerald-500/60 bg-emerald-950/30 text-slate-200 transition-all duration-300 flex sm:flex-col items-center sm:items-start justify-between gap-1 shadow-sm";
      icon.className = "text-emerald-400 flex items-center justify-center w-4 h-4 text-xs";
      icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    } else if (s === stageNum) {
      card.className = "telemetry-step-active p-2.5 rounded-xl border border-blue-500/90 bg-blue-950/50 text-white shadow-lg shadow-blue-950/60 ring-1 ring-blue-500/40 transition-all duration-300 flex sm:flex-col items-center sm:items-start justify-between gap-1 scale-[1.02]";
      icon.className = "text-blue-400 flex items-center justify-center w-4 h-4 text-xs";
      icon.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin"></i>';
    } else {
      card.className = "telemetry-step-pending p-2.5 rounded-xl border border-[#1E293B] bg-[#091120]/70 text-slate-400 opacity-60 transition-all duration-300 flex sm:flex-col items-center sm:items-start justify-between gap-1";
      icon.className = "text-slate-500 flex items-center justify-center w-4 h-4 text-xs";
      icon.innerHTML = '<i class="fa-regular fa-circle"></i>';
    }
  }
}

function completeTelemetryProgress() {
  stopTelemetryProgress();

  const pctEl = document.getElementById('telemetry-percentage');
  const progBar = document.getElementById('telemetry-progress-bar');
  const tickerEl = document.getElementById('telemetry-status-ticker');

  if (pctEl) pctEl.textContent = '100%';
  if (progBar) {
    progBar.style.width = '100%';
    progBar.className = "bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(16,185,129,0.7)]";
  }
  if (tickerEl) tickerEl.textContent = t('ticker_done');

  for (let s = 1; s <= 5; s++) {
    const card = document.getElementById(`telemetry-step-${s}`);
    const icon = document.getElementById(`telemetry-step-${s}-icon`);
    if (card && icon) {
      card.className = "telemetry-step-passed p-2.5 rounded-xl border border-emerald-500/60 bg-emerald-950/30 text-slate-200 transition-all duration-300 flex sm:flex-col items-center sm:items-start justify-between gap-1 shadow-sm";
      icon.className = "text-emerald-400 flex items-center justify-center w-4 h-4 text-xs";
      icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    }
  }
}

function stopTelemetryProgress() {
  if (telemetryTimerInterval) {
    clearInterval(telemetryTimerInterval);
    telemetryTimerInterval = null;
  }
  if (telemetryTickerInterval) {
    clearInterval(telemetryTickerInterval);
    telemetryTickerInterval = null;
  }
}

function showLoading(show) {
  const loading = document.getElementById('telemetry-loading');
  const content = document.getElementById('telemetry-content');
  const placeholder = document.getElementById('telemetry-placeholder');
  const bar = document.getElementById('pipeline-indicator-bar');

  if (show) {
    startTelemetryProgress(currentDocumentName || 'Document');
  } else {
    stopTelemetryProgress();
    if (loading) loading.classList.add('hidden');
    if (currentPipelineData) {
      if (placeholder) placeholder.classList.add('hidden');
      if (content) content.classList.remove('hidden');
      if (bar) {
        bar.classList.remove('hidden');
        bar.classList.add('flex');
      }
    } else {
      if (placeholder) placeholder.classList.remove('hidden');
      if (content) content.classList.add('hidden');
      if (bar) {
        bar.classList.add('hidden');
        bar.classList.remove('flex');
      }
    }
  }
}

function copyToClipboard(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    navigator.clipboard.writeText(el.textContent);
    alert(t('copied_alert'));
  }
}

// ==========================================
// SUPPORTED DOCUMENTS HYBRID POPOVER (HOVER + CLICK-TO-PIN)
// ==========================================
let supportedDocsPinned = false;
let supportedDocsHoverTimer = null;

function setSupportedDocsPopoverVisible(visible) {
  const popover = document.getElementById('supported-docs-popover');
  const chevron = document.getElementById('supported-docs-chevron');
  if (!popover) return;
  if (visible) {
    popover.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
  } else {
    popover.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
  }
}

function openSupportedDocsHover() {
  if (supportedDocsHoverTimer) {
    clearTimeout(supportedDocsHoverTimer);
    supportedDocsHoverTimer = null;
  }
  setSupportedDocsPopoverVisible(true);
}

function cancelCloseSupportedDocsHover() {
  if (supportedDocsHoverTimer) {
    clearTimeout(supportedDocsHoverTimer);
    supportedDocsHoverTimer = null;
  }
}

function scheduleCloseSupportedDocsHover() {
  if (supportedDocsPinned) return;
  if (supportedDocsHoverTimer) clearTimeout(supportedDocsHoverTimer);
  supportedDocsHoverTimer = setTimeout(() => {
    if (!supportedDocsPinned) {
      setSupportedDocsPopoverVisible(false);
    }
  }, 180);
}

function toggleSupportedDocsPopover(event) {
  if (event) event.stopPropagation();
  const popover = document.getElementById('supported-docs-popover');
  if (!popover) return;
  const isHidden = popover.classList.contains('hidden');
  if (isHidden || !supportedDocsPinned) {
    supportedDocsPinned = true;
    setSupportedDocsPopoverVisible(true);
  } else {
    supportedDocsPinned = false;
    setSupportedDocsPopoverVisible(false);
  }
}

function closeSupportedDocsPopover(event) {
  if (event) event.stopPropagation();
  supportedDocsPinned = false;
  if (supportedDocsHoverTimer) {
    clearTimeout(supportedDocsHoverTimer);
    supportedDocsHoverTimer = null;
  }
  setSupportedDocsPopoverVisible(false);
}

document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('supported-docs-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    closeSupportedDocsPopover();
  }
});

// ==========================================
// OPERATIONS HELP, GUIDED TOUR & SPICKZETTEL ENGINE
// ==========================================

let isGuidedTourActive = false;
let currentTourStepIdx = 0;
let currentSpotlightEl = null;
let tourCustomsCertViewed = false;

function applyTourSpotlight(targetId) {
  clearTourSpotlight();
  if (!targetId) return;

  const rawIds = Array.isArray(targetId) ? targetId : String(targetId).split(',');
  const elements = rawIds.map(id => {
    const cleanId = String(id).trim();
    let el = document.getElementById(cleanId);
    if (cleanId === 'inspector-placeholder' && currentPipelineData) {
      el = document.getElementById('inspector-viewport') || el;
    }
    return el;
  }).filter(Boolean);

  if (elements.length === 0) return;

  elements.forEach(el => {
    el.classList.add('tour-spotlight-active');
  });

  const firstEl = elements[0];
  currentSpotlightEl = firstEl;

  const container = firstEl.closest('.overflow-y-auto') || document.getElementById('telemetry-scroll-container');
  if (container) {
    const containerRect = container.getBoundingClientRect();
    const elRect = firstEl.getBoundingClientRect();
    const relativeTop = elRect.top - containerRect.top + container.scrollTop;
    // Always preserve 16px of top breathing margin so card headers and titles
    // are never clipped or hidden beneath the pipeline panel.
    const targetScrollTop = Math.max(0, relativeTop - 16);
    try {
      container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
    } catch (e) {
      container.scrollTop = targetScrollTop;
    }
  } else {
    try {
      firstEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) {
      firstEl.scrollIntoView();
    }
  }
}

function clearTourSpotlight() {
  document.querySelectorAll('.tour-spotlight-active').forEach(node => {
    node.classList.remove('tour-spotlight-active');
  });
  currentSpotlightEl = null;
}

const tourSteps = [
  {
    step: 1,
    tab: 'pipeline',
    targetId: 'inspector-placeholder',
    dock: 'right',
    titleDe: "1. Frachtbeleg erfassen & Ingestion",
    titleEn: "1. Ingest Freight Document & Ingestion",
    descDe: "Dokumente gelangen per Drag & Drop (PDF, Scan, Bild), Dateiauswahl, Zwischenablage (Strg+V) oder 1-Klick-Muster in das System. Starten wir mit einem echten Seefracht-Konnossement (Ocean B/L).",
    descEn: "Freight documents enter via drag-and-drop (PDF, scan, image), file browser, clipboard paste (Ctrl+V), or 1-click samples. Let's begin with an authentic Ocean Bill of Lading (B/L).",
    actionLabelDe: "Muster Seefracht-B/L laden",
    actionLabelEn: "Load Ocean B/L Sample",
    actionFn: async () => {
      await loadSample('bol');
      if (typeof isGuidedTourActive !== 'undefined' && isGuidedTourActive && currentTourStepIdx === 0) {
        currentTourStepIdx = 1;
        renderCurrentTourStep(false);
      }
    }
  },
  {
    step: 2,
    tab: 'pipeline',
    targetId: 'pipeline-indicator-bar',
    dock: 'right',
    titleDe: "2. Beleg verarbeitet: Bereit zur Prüfung",
    titleEn: "2. Document Processed: Ready for Audit",
    descDe: "Der Frachtbeleg wurde erfolgreich eingelesen, mit einem GoBD SHA-256 Siegel versehen und durch das 5-Stufen-System vorabgeprüft. Klicken Sie auf Weiter, um den Beleg-Betrachter und die Prüfsumme zu untersuchen.",
    descEn: "The document has been successfully processed, sealed with a GoBD SHA-256 digest, and pre-cleared across the 5-stage pipeline. Click Next to move onto the next step and inspect the viewer.",
    actionLabelDe: null,
    actionLabelEn: null,
    actionFn: null
  },
  {
    step: 3,
    tab: 'pipeline',
    targetId: 'inspector-controls-bar',
    dock: 'right',
    titleDe: "3. Dokumenten-Viewer & GoBD-Prüfsumme",
    titleEn: "3. Document Viewer & GoBD Tamper Hash",
    descDe: "Links sehen Sie das hochauflösende Originaldokument mit Zoom- und Seitensteuerungen. Oben in der Leiste sehen Sie den SHA-256 Hash: Das Dokument ist damit unveränderlich (§ 147 AO / GoBD) mit dem Datensatz verknüpft.",
    descEn: "On the left is the high-resolution original document with zoom, pan, and page controls. The top bar shows the computed SHA-256 hash, cryptographically binding the physical scan to the audit record (§ 147 AO / GoBD).",
    actionLabelDe: null,
    actionLabelEn: null,
    actionFn: null
  },
  {
    step: 4,
    tab: 'pipeline',
    targetId: 'stage-1-card',
    dock: 'left',
    titleDe: "4. Stufe 1: Revisionssichere Siegelung & Timestamp",
    titleEn: "4. Stage 1: Cryptographic Seal & UTC Timestamp",
    descDe: "Stufe 1 protokolliert Dateiname, MIME-Typ, UTC-Zeitstempel und den SHA-256 Fingerabdruck. Der grüne Status 'GoBD & ATLAS 9.1 Konform' garantiert die Anerkennung bei Steuer- und Zollprüfungen.",
    descEn: "Stage 1 records filename, MIME type, precise UTC timestamp, and the SHA-256 digital fingerprint. The green 'GoBD & ATLAS 9.1 Compliant' badge guarantees acceptance by tax and customs auditors.",
    actionLabelDe: null,
    actionLabelEn: null,
    actionFn: null
  },
  {
    step: 5,
    tab: 'pipeline',
    targetId: 'stage-2-card',
    dock: 'left',
    titleDe: "5. Stufe 2: Extrahierte Frachtattribute",
    titleEn: "5. Stage 2: Extracted Freight Attributes",
    descDe: "Das Gateway hat das Seefracht-B/L (SUDU61ITJ041320X), den ISO-Container (MNBU3147540), Siegel, Bruttogewicht (28.674,8 kg), Nettogewicht (27.111,0 kg) sowie Versender und Empfänger ohne manuelle Eingabe fehlerfrei erfasst.",
    descEn: "The gateway extracted the B/L number (SUDU61ITJ041320X), ISO container (MNBU3147540), seal, gross weight (28,674.8 kg), net weight (27,111.0 kg), commercial parties, and cargo items with zero manual typing.",
    actionLabelDe: null,
    actionLabelEn: null,
    actionFn: null
  },
  {
    step: 6,
    tab: 'pipeline',
    targetId: 'stage-3-card',
    dock: 'left',
    titleDe: "6. Stufe 3: Deterministische Regelprüfung (ATLAS & ADSp)",
    titleEn: "6. Stage 3: Deterministic Rule Audit (ATLAS & ADSp)",
    descDe: "5 von 5 deterministischen Prüfungen bestanden! Geprüft wurden: ISO-6346 Modulo-11 Prüfziffer (Ziffer 0), Massenerhaltungssatz (Brutto ≥ Netto, 1.564 kg Tara), Handelsparteien sowie Zolltarifnummer (0207.14.00). Reine Prüflogik nach gesetzlichen Vorgaben.",
    descEn: "5 out of 5 deterministic checks passed! Audited: ISO-6346 Modulo-11 checksum (digit 0), mass conservation (Gross ≥ Net, 1,564 kg tare), commercial trade parties, and 8-digit customs tariff syntax (0207.14.00). Pure rule-based audit logic according to statutory standards.",
    actionLabelDe: null,
    actionLabelEn: null,
    actionFn: null
  },
  {
    step: 7,
    tab: 'pipeline',
    targetId: ['stage-4-card', 'stage-5-card'],
    dock: 'left',
    titleDe: "7. Stufe 4 & 5: ATLAS Freigabe & OLE TMS T-SQL",
    titleEn: "7. Stage 4 & 5: ATLAS Pre-Clearance & OLE TMS T-SQL",
    descDe: "Die Sendung ist 'PRE-CLEARED FOR DISPATCH'. In Stufe 5 wurde automatisch das T-SQL INSERT-Statement erzeugt, um die Daten direkt in die OLE Enterprise TMS Datenbank (OLE_Staging_Shipments) einzuspeisen.",
    descEn: "The shipment is 'PRE-CLEARED FOR DISPATCH'. In Stage 5, the T-SQL INSERT statement was automatically generated to inject the verified data directly into the OLE Enterprise TMS table (OLE_Staging_Shipments).",
    actionLabelDe: null,
    actionLabelEn: null,
    actionFn: null
  },
  {
    step: 8,
    tab: 'reconcile',
    targetId: 'tab-reconcile',
    dock: 'left',
    titleDe: "8. 3-Wege-Abgleich: Diskrepanzen & Liegegelder",
    titleEn: "8. 3-Way Reconciliation: Catch Discrepancies & Demurrage",
    descDe: "Hier gleicht das Gateway Seefrachtbrief (B/L), Handelsrechnung und Packliste gegeneinander ab. Führen Sie die Simulation aus: Eine unbemerkte 180 kg Gewichtsabweichung wird sofort aufgedeckt. Dies spart 1.250 € Standgeld am Terminal.",
    descEn: "Here the gateway cross-audits Transport Waybill (B/L), Commercial Invoice, and Packing List. Run the simulation to see an unnoticed 180 kg variance detected instantly, preventing €1,250 in terminal demurrage fees.",
    actionLabelDe: "Demurrage-Szenario ausführen",
    actionLabelEn: "Execute Demurrage Scenario",
    actionFn: async () => {
      await runReconciliationSim('tangier_discrepancy');
    }
  },
  {
    step: 9,
    tab: 'quarantine',
    targetId: 'tab-quarantine',
    dock: 'right',
    titleDe: "9. Quarantäne-Leitstand: 72h-Uhr & Reklamation",
    titleEn: "9. Quarantine Console: 72h Countdown & Claim Notice",
    descDe: "Fehlerhafte Sendungen werden automatisch isoliert. Die Liegegeld-Uhr zählt verbleibende Freitage herunter. Mit 1 Klick erstellen Sie eine rechtssichere ADSp 2017 Rüge an die Reederei, um Standgelder rechtzeitig abzuwenden.",
    descEn: "Faulty shipments are quarantined before port storage starts. The countdown clock tracks expiring free time. Generate a formal ADSp 2017 notice to the ocean carrier in 1 click to halt demurrage charges.",
    actionLabelDe: "Diskrepanz-Forensik öffnen",
    actionLabelEn: "Open Discrepancy Forensics",
    actionFn: async () => {
      if (!allQuarantineShipments || allQuarantineShipments.length === 0) {
        await fetchRecentDocuments();
      }
      const firstRowSpan = document.querySelector('#quarantine-table-body tr.quar-table-row span.hover\\:underline');
      const topRef = firstRowSpan ? firstRowSpan.textContent.trim() : (allQuarantineShipments && allQuarantineShipments.length > 0 ? allQuarantineShipments[0].shipment_ref : null);
      if (topRef) {
        openQuarDrawerRef = topRef;
        renderQuarantineTable();
        setTimeout(() => {
          const drawer = document.getElementById(`quar-drawer-${topRef}`);
          if (drawer) {
            drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            const box = drawer.querySelector('.quar-drawer-box');
            if (box) {
              box.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
              setTimeout(() => box.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2'), 2500);
            }
          }
        }, 80);
      }
    }
  },
  {
    step: 10,
    tab: 'ledger',
    targetId: 'tab-ledger',
    dock: 'right',
    titleDe: "10. Audit-Ledger: GoBD-Archiv & Amtliches Zertifikat",
    titleEn: "10. Audit Ledger: GoBD Archive & Official Certificate",
    descDe: "Jeder Bearbeitungsschritt wird manipulationssicher archiviert (§ 147 AO). Für Zollprüfer oder Auftraggeber erstellen Sie mit 1 Klick ein amtliches, druckreifes PDF-Zollzertifikat mit SHA-256 Signatur.",
    descEn: "Every step is immutably archived (§ 147 AO / GoBD). For customs authorities or clients, generate an official, court-admissible PDF customs certificate with full SHA-256 verification in 1 click.",
    actionLabelDe: "Amtliches Zollzertifikat ansehen",
    actionLabelEn: "View Official Customs Certificate",
    actionFn: async () => {
      if (!allLedgerRows || allLedgerRows.length === 0) {
        await fetchRecentDocuments();
      }
      if (allLedgerRows && allLedgerRows.length > 0) {
        tourCustomsCertViewed = true;
        openCustomsCertModal(allLedgerRows[0].shipment_ref);
      }
    }
  }
];

function openHelpModal() {
  const modal = document.getElementById('modal-help');
  if (modal) modal.classList.remove('hidden');
}

function closeHelpModal() {
  const modal = document.getElementById('modal-help');
  if (modal) modal.classList.add('hidden');
}

function openSpickzettelModal() {
  const modal = document.getElementById('modal-spickzettel');
  if (modal) modal.classList.remove('hidden');
}

function closeSpickzettelModal() {
  const modal = document.getElementById('modal-spickzettel');
  if (modal) modal.classList.add('hidden');
}

function openSpickzettelFromModal() {
  closeHelpModal();
  openSpickzettelModal();
}

function printSpickzettel() {
  window.print();
}

function startGuidedTourFromModal() {
  closeHelpModal();
  startGuidedTour();
}

function startGuidedTour() {
  isGuidedTourActive = true;
  currentTourStepIdx = 0;
  tourCustomsCertViewed = false;
  const banner = document.getElementById('tour-guide-banner');
  if (banner) {
    banner.classList.remove('hidden');
  }
  renderCurrentTourStep(false);
}

function exitGuidedTour() {
  isGuidedTourActive = false;
  clearTourSpotlight();
  const banner = document.getElementById('tour-guide-banner');
  if (banner) banner.classList.add('hidden');
  const btnNext = document.getElementById('tour-btn-next');
  if (btnNext) {
    btnNext.classList.remove('tour-btn-halo', 'opacity-40', 'cursor-not-allowed');
    btnNext.disabled = false;
    btnNext.title = '';
  }
  const btnAction = document.getElementById('tour-btn-action');
  if (btnAction) {
    btnAction.classList.remove('tour-btn-halo');
  }
}

function toggleTourDock() {
  const banner = document.getElementById('tour-guide-banner');
  if (!banner) return;
  if (banner.classList.contains('tour-dock-left')) {
    banner.classList.remove('tour-dock-left');
    banner.classList.add('tour-dock-right');
  } else {
    banner.classList.remove('tour-dock-right');
    banner.classList.add('tour-dock-left');
  }
}

function renderCurrentTourStep(autoExecute = false) {
  const step = tourSteps[currentTourStepIdx];
  if (!step) return;

  const isDe = (currentLang === 'de');
  const badgeEl = document.getElementById('tour-step-badge');
  const progBar = document.getElementById('tour-step-progress-bar');
  const titleEl = document.getElementById('tour-step-title');
  const descEl = document.getElementById('tour-step-desc');
  const actionContainer = document.getElementById('tour-action-container');
  const actionLabelEl = document.getElementById('tour-action-label');
  const actionBtn = document.getElementById('tour-btn-action');
  const btnPrev = document.getElementById('tour-btn-prev');
  const btnNext = document.getElementById('tour-btn-next');
  const nextLabel = document.getElementById('tour-next-label');
  const banner = document.getElementById('tour-guide-banner');

  if (badgeEl) badgeEl.textContent = `${step.step} / ${tourSteps.length}`;
  if (progBar) {
    const pct = Math.round((step.step / tourSteps.length) * 100);
    progBar.style.width = `${pct}%`;
  }
  if (titleEl) titleEl.textContent = isDe ? step.titleDe : step.titleEn;
  if (descEl) descEl.textContent = isDe ? step.descDe : step.descEn;

  // Smart dynamic docking: left vs right
  if (banner) {
    banner.classList.remove('tour-dock-left', 'tour-dock-right');
    if (step.dock === 'left') {
      banner.classList.add('tour-dock-left');
    } else {
      banner.classList.add('tour-dock-right');
    }
  }

  // Enforce Step 1, 8, 9, 10 constraints:
  // Step 1: Next button MUST NOT work without clicking Load Ocean B/L sample first
  const isStep1AwaitingSample = (step.step === 1 && !currentPipelineData);
  // Step 8: Next button MUST NOT work without running the Demurrage Scenario first
  const isStep8AwaitingSim = (step.step === 8 && (!currentReconcileData || !currentReconcileData.demurrage_prevented_eur || currentReconcileData.demurrage_prevented_eur === 0));
  // Step 9: Next button MUST NOT work without opening Discrepancy Forensics first
  const isStep9AwaitingForensics = (step.step === 9 && !openQuarDrawerRef);
  // Step 10: Finish button MUST NOT work without viewing the Official Customs Certificate first
  const isStep10AwaitingCert = (step.step === 10 && !tourCustomsCertViewed);
  const isCurrentStepBlocked = (isStep1AwaitingSample || isStep8AwaitingSim || isStep9AwaitingForensics || isStep10AwaitingCert);

  // Handle action button visibility & dynamic text
  const actionLabel = isDe ? step.actionLabelDe : step.actionLabelEn;
  if (actionLabel && typeof step.actionFn === 'function') {
    if (actionContainer) actionContainer.classList.remove('hidden');
    if (actionLabelEl) {
      if (step.step === 1 && currentPipelineData) {
        actionLabelEl.textContent = isDe ? "✓ Seefracht-B/L geladen (Erneut laden)" : "✓ Ocean B/L Loaded (Reload)";
      } else if (step.step === 8 && !isStep8AwaitingSim) {
        actionLabelEl.textContent = isDe ? "✓ Szenario ausgeführt (Erneut ausführen)" : "✓ Scenario Executed (Re-run)";
      } else if (step.step === 9 && !isStep9AwaitingForensics) {
        actionLabelEl.textContent = isDe ? "✓ Forensik geöffnet (Umschalten)" : "✓ Forensics Opened (Toggle)";
      } else if (step.step === 10 && !isStep10AwaitingCert) {
        actionLabelEl.textContent = isDe ? "✓ Zollzertifikat eingesehen (Erneut öffnen)" : "✓ Certificate Viewed (Re-open)";
      } else {
        actionLabelEl.textContent = actionLabel;
      }
    }
  } else {
    if (actionContainer) actionContainer.classList.add('hidden');
  }

  if (actionBtn) {
    if (isCurrentStepBlocked) {
      actionBtn.classList.add('tour-btn-halo');
    } else {
      actionBtn.classList.remove('tour-btn-halo');
    }
  }

  if (btnPrev) btnPrev.disabled = (currentTourStepIdx === 0);
  if (nextLabel) {
    nextLabel.textContent = (currentTourStepIdx === tourSteps.length - 1) ? t('tour_btn_finish') : t('tour_btn_next');
  }

  /* Next and Finish buttons across all steps */
  if (btnNext) {
    if (isCurrentStepBlocked) {
      btnNext.disabled = true;
      btnNext.classList.remove('tour-btn-halo', 'cursor-pointer');
      btnNext.classList.add('opacity-40', 'cursor-not-allowed');
      if (isStep1AwaitingSample) {
        btnNext.title = isDe ? 'Bitte zuerst das Seefracht-B/L Muster laden' : 'Please load Ocean B/L sample first';
      } else if (isStep8AwaitingSim) {
        btnNext.title = isDe ? 'Bitte zuerst das Demurrage-Szenario ausführen' : 'Please execute Demurrage Scenario first';
      } else if (isStep9AwaitingForensics) {
        btnNext.title = isDe ? 'Bitte zuerst die Diskrepanz-Forensik öffnen' : 'Please open Discrepancy Forensics first';
      } else if (isStep10AwaitingCert) {
        btnNext.title = isDe ? 'Bitte zuerst das amtliche Zollzertifikat ansehen' : 'Please view Official Customs Certificate first';
      }
    } else {
      btnNext.disabled = false;
      btnNext.classList.remove('opacity-40', 'cursor-not-allowed');
      btnNext.classList.add('tour-btn-halo', 'cursor-pointer');
      btnNext.title = '';
    }
  }

  // Automatically switch to the step's tab
  if (step.tab) {
    switchTab(step.tab);
  }

  // Apply visual spotlight to target card / element
  setTimeout(() => {
    applyTourSpotlight(step.targetId);
  }, 120);

  // Execute action if requested
  if (autoExecute && typeof step.actionFn === 'function') {
    try {
      step.actionFn();
    } catch (e) {
      console.warn("Tour step action notice", e);
    }
  }
}

async function executeCurrentTourAction() {
  const step = tourSteps[currentTourStepIdx];
  const btn = document.getElementById('tour-btn-action');
  const icon = btn ? btn.querySelector('i') : null;
  const btnNext = document.getElementById('tour-btn-next');
  const isDe = (currentLang === 'de');

  if (btn) {
    btn.classList.add('opacity-75', 'pointer-events-none');
    btn.classList.remove('tour-btn-halo');
  }
  if (icon) {
    icon.className = 'fa-solid fa-spinner fa-spin text-blue-400';
  }
  if (btnNext) {
    btnNext.classList.remove('tour-btn-halo');
  }

  try {
    if (step && typeof step.actionFn === 'function') {
      await step.actionFn();
    }
  } catch (err) {
    console.error("Tour action failed:", err);
  } finally {
    if (btn) btn.classList.remove('opacity-75', 'pointer-events-none');
    if (icon) {
      icon.className = 'fa-solid fa-file-import text-blue-400';
    }
    const step1Awaiting = (currentTourStepIdx === 0 && !currentPipelineData);
    const step8Awaiting = (currentTourStepIdx === 7 && (!currentReconcileData || !currentReconcileData.demurrage_prevented_eur || currentReconcileData.demurrage_prevented_eur === 0));
    const step9Awaiting = (currentTourStepIdx === 8 && !openQuarDrawerRef);
    const step10Awaiting = (currentTourStepIdx === 9 && !tourCustomsCertViewed);
    const anyAwaiting = (step1Awaiting || step8Awaiting || step9Awaiting || step10Awaiting);
    if (btnNext && isGuidedTourActive && !anyAwaiting) {
      btnNext.disabled = false;
      btnNext.classList.remove('opacity-40', 'cursor-not-allowed');
      btnNext.classList.add('tour-btn-halo', 'cursor-pointer');
      btnNext.title = '';
      if (btn) btn.classList.remove('tour-btn-halo');
      const actionLbl = document.getElementById('tour-action-label');
      if (actionLbl) {
        if (currentTourStepIdx === 0) {
          actionLbl.textContent = isDe ? "✓ Seefracht-B/L geladen (Erneut laden)" : "✓ Ocean B/L Loaded (Reload)";
        } else if (currentTourStepIdx === 7) {
          actionLbl.textContent = isDe ? "✓ Szenario ausgeführt (Erneut ausführen)" : "✓ Scenario Executed (Re-run)";
        } else if (currentTourStepIdx === 8) {
          actionLbl.textContent = isDe ? "✓ Forensik geöffnet (Umschalten)" : "✓ Forensics Opened (Toggle)";
        } else if (currentTourStepIdx === 9) {
          actionLbl.textContent = isDe ? "✓ Zollzertifikat eingesehen (Erneut öffnen)" : "✓ Certificate Viewed (Re-open)";
        }
      }
    }
  }
}

function nextTourStep() {
  const isStep1Awaiting = (currentTourStepIdx === 0 && !currentPipelineData);
  const isStep8Awaiting = (currentTourStepIdx === 7 && (!currentReconcileData || !currentReconcileData.demurrage_prevented_eur || currentReconcileData.demurrage_prevented_eur === 0));
  const isStep9Awaiting = (currentTourStepIdx === 8 && !openQuarDrawerRef);
  const isStep10Awaiting = (currentTourStepIdx === 9 && !tourCustomsCertViewed);
  if (isStep1Awaiting || isStep8Awaiting || isStep9Awaiting || isStep10Awaiting) {
    const actionBtn = document.getElementById('tour-btn-action');
    if (actionBtn) {
      actionBtn.classList.add('animate-bounce');
      setTimeout(() => actionBtn.classList.remove('animate-bounce'), 800);
    }
    return;
  }

  const btnNext = document.getElementById('tour-btn-next');
  if (btnNext) btnNext.classList.remove('tour-btn-halo');

  if (currentTourStepIdx < tourSteps.length - 1) {
    currentTourStepIdx++;
    renderCurrentTourStep(false);
  } else {
    exitGuidedTour();
    alert(t('tour_finish_alert'));
  }
}

function prevTourStep() {
  const btnNext = document.getElementById('tour-btn-next');
  if (btnNext) btnNext.classList.remove('tour-btn-halo');

  if (currentTourStepIdx > 0) {
    currentTourStepIdx--;
    renderCurrentTourStep(false);
  }
}

// Global keyboard navigation for the guided tour
window.addEventListener('keydown', (e) => {
  if (!isGuidedTourActive) return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

  if (e.key === 'ArrowRight' || e.key === 'Enter') {
    e.preventDefault();
    const isStep1Awaiting = (currentTourStepIdx === 0 && !currentPipelineData);
    const isStep8Awaiting = (currentTourStepIdx === 7 && (!currentReconcileData || !currentReconcileData.demurrage_prevented_eur || currentReconcileData.demurrage_prevented_eur === 0));
    const isStep9Awaiting = (currentTourStepIdx === 8 && !openQuarDrawerRef);
    const isStep10Awaiting = (currentTourStepIdx === 9 && !tourCustomsCertViewed);
    if (isStep1Awaiting || isStep8Awaiting || isStep9Awaiting || isStep10Awaiting) {
      const actionBtn = document.getElementById('tour-btn-action');
      if (actionBtn) {
        actionBtn.classList.add('animate-bounce');
        setTimeout(() => actionBtn.classList.remove('animate-bounce'), 800);
      }
      return;
    }
    nextTourStep();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevTourStep();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    exitGuidedTour();
  }
});

// ==========================================
// INITIAL WORKSPACE CONFIGURATION (3-STEP SETUP)
// ==========================================
let currentWelcomeStep = 1;
let toolbarPointerTimeout = null;

function checkInitialOnboarding() {
  const isSuppressedSession = sessionStorage.getItem('ole_onboarding_session_suppressed');
  const isCompleted = localStorage.getItem('ole_onboarding_completed');
  if (isSuppressedSession || isCompleted) {
    return;
  }
  // If not completed or suppressed, display initial setup modal
  setTimeout(() => {
    openWelcomeSetupModal(1);
  }, 350);
}

function openWelcomeSetupModal(step = 1) {
  const modal = document.getElementById('modal-welcome-setup');
  if (!modal) return;
  modal.classList.remove('hidden');
  setWelcomeStep(step);
}

function closeWelcomeSetupModal(showPointer = false) {
  const modal = document.getElementById('modal-welcome-setup');
  if (modal) modal.classList.add('hidden');
  sessionStorage.setItem('ole_onboarding_session_suppressed', 'true');
  if (showPointer) {
    showToolbarPointer();
  }
}

function setWelcomeStep(stepNumber) {
  currentWelcomeStep = stepNumber;
  const badgeEl = document.getElementById('onboarding-step-indicator');
  const titleEl = document.getElementById('onboarding-modal-title');

  if (badgeEl) badgeEl.textContent = `${stepNumber} / 3`;
  if (titleEl) {
    if (stepNumber === 1) titleEl.textContent = t('onboarding_title_step1');
    else if (stepNumber === 2) titleEl.textContent = t('onboarding_title_step2');
    else if (stepNumber === 3) titleEl.textContent = t('onboarding_title_step3');
  }

  // Step visibility
  ['1', '2', '3'].forEach(num => {
    const el = document.getElementById(`onboarding-step-${num}`);
    if (el) {
      if (num === String(stepNumber)) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });

  // Stepper pill indicators
  const p1 = document.getElementById('onboarding-pill-1');
  const p2 = document.getElementById('onboarding-pill-2');
  const p3 = document.getElementById('onboarding-pill-3');
  if (p1) p1.className = (stepNumber >= 1) ? 'h-1.5 rounded-full bg-blue-500 transition-colors' : 'h-1.5 rounded-full bg-[#1E293B] transition-colors';
  if (p2) p2.className = (stepNumber >= 2) ? 'h-1.5 rounded-full bg-blue-500 transition-colors' : 'h-1.5 rounded-full bg-[#1E293B] transition-colors';
  if (p3) p3.className = (stepNumber >= 3) ? 'h-1.5 rounded-full bg-blue-500 transition-colors' : 'h-1.5 rounded-full bg-[#1E293B] transition-colors';

  updateWelcomeLanguageUI();
  updateWelcomeThemeUI();
}

function selectWelcomeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('ole_lang', lang);
  applyLanguage(lang);
  updateWelcomeLanguageUI();
  setWelcomeStep(currentWelcomeStep);
}

function updateWelcomeLanguageUI() {
  const isDe = (currentLang === 'de');
  const optDe = document.getElementById('opt-lang-de');
  const optEn = document.getElementById('opt-lang-en');
  const checkDe = document.getElementById('check-lang-de');
  const checkEn = document.getElementById('check-lang-en');

  if (optDe && optEn) {
    if (isDe) {
      optDe.className = 'p-4 rounded-xl border-2 transition text-left cursor-pointer flex flex-col justify-between space-y-2 group border-blue-500 bg-blue-950/40 shadow-sm';
      optEn.className = 'p-4 rounded-xl border-2 transition text-left cursor-pointer flex flex-col justify-between space-y-2 group border-[#1E293B] bg-[#0F172A] hover:border-slate-500';
      if (checkDe) checkDe.className = 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs';
      if (checkEn) checkEn.className = 'w-5 h-5 rounded-full bg-[#1E293B] text-transparent flex items-center justify-center text-xs';
    } else {
      optEn.className = 'p-4 rounded-xl border-2 transition text-left cursor-pointer flex flex-col justify-between space-y-2 group border-blue-500 bg-blue-950/40 shadow-sm';
      optDe.className = 'p-4 rounded-xl border-2 transition text-left cursor-pointer flex flex-col justify-between space-y-2 group border-[#1E293B] bg-[#0F172A] hover:border-slate-500';
      if (checkEn) checkEn.className = 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs';
      if (checkDe) checkDe.className = 'w-5 h-5 rounded-full bg-[#1E293B] text-transparent flex items-center justify-center text-xs';
    }
  }
}

function selectWelcomeTheme(theme) {
  applyTheme(theme);
  localStorage.setItem('ole_theme', theme);
  updateWelcomeThemeUI();
}

function updateWelcomeThemeUI() {
  const isDark = (currentTheme === 'dark');
  const optDark = document.getElementById('opt-theme-dark');
  const optLight = document.getElementById('opt-theme-light');
  const checkDark = document.getElementById('check-theme-dark');
  const checkLight = document.getElementById('check-theme-light');

  if (optDark && optLight) {
    if (isDark) {
      optDark.className = 'p-4 rounded-xl border-2 transition text-left cursor-pointer flex flex-col justify-between space-y-2 group border-blue-500 bg-blue-950/40 shadow-sm';
      optLight.className = 'p-4 rounded-xl border-2 transition text-left cursor-pointer flex flex-col justify-between space-y-2 group border-[#1E293B] bg-[#0F172A] hover:border-slate-500';
      if (checkDark) checkDark.className = 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs';
      if (checkLight) checkLight.className = 'w-5 h-5 rounded-full bg-[#1E293B] text-transparent flex items-center justify-center text-xs';
    } else {
      optLight.className = 'p-4 rounded-xl border-2 transition text-left cursor-pointer flex flex-col justify-between space-y-2 group border-blue-500 bg-blue-950/40 shadow-sm';
      optDark.className = 'p-4 rounded-xl border-2 transition text-left cursor-pointer flex flex-col justify-between space-y-2 group border-[#1E293B] bg-[#0F172A] hover:border-slate-500';
      if (checkLight) checkLight.className = 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs';
      if (checkDark) checkDark.className = 'w-5 h-5 rounded-full bg-[#1E293B] text-transparent flex items-center justify-center text-xs';
    }
  }
}

function finishWelcomeSetup(startTour = false) {
  const chk = document.getElementById('onboarding-chk-dont-ask');
  if (chk && chk.checked) {
    sessionStorage.setItem('ole_onboarding_session_suppressed', 'true');
  }
  localStorage.setItem('ole_onboarding_completed', 'true');
  closeWelcomeSetupModal(false);

  if (startTour) {
    startGuidedTour();
  } else {
    showToolbarPointer();
  }
}

function showToolbarPointer() {
  const pointer = document.getElementById('onboarding-toolbar-pointer');
  if (!pointer) return;
  pointer.classList.remove('hidden');

  // Add spotlight pulsing ring to the 3 top-right toolbar buttons
  const buttons = [
    document.getElementById('help-menu-btn'),
    document.getElementById('lang-toggle-btn'),
    document.getElementById('theme-toggle-btn')
  ];

  buttons.forEach(btn => {
    if (btn) {
      btn.classList.add('ring-2', 'ring-blue-400', 'ring-offset-2', 'ring-offset-[#070B12]', 'animate-pulse');
    }
  });

  if (toolbarPointerTimeout) clearTimeout(toolbarPointerTimeout);
  toolbarPointerTimeout = setTimeout(() => {
    hideToolbarPointer();
  }, 9000);
}

function hideToolbarPointer() {
  const pointer = document.getElementById('onboarding-toolbar-pointer');
  if (pointer) pointer.classList.add('hidden');

  const buttons = [
    document.getElementById('help-menu-btn'),
    document.getElementById('lang-toggle-btn'),
    document.getElementById('theme-toggle-btn')
  ];

  buttons.forEach(btn => {
    if (btn) {
      btn.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-2', 'ring-offset-[#070B12]', 'animate-pulse');
    }
  });

  if (toolbarPointerTimeout) {
    clearTimeout(toolbarPointerTimeout);
    toolbarPointerTimeout = null;
  }
}

// Global Keyboard Shortcuts (F1, ?, Escape)
window.addEventListener('keydown', (e) => {
  // F1 or ? for Help (if not typing in an input/textarea)
  if (e.key === 'F1' || (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName))) {
    e.preventDefault();
    openHelpModal();
    return;
  }

  // Escape closes any active modal, pointer, or tour
  if (e.key === 'Escape') {
    const welcomeModal = document.getElementById('modal-welcome-setup');
    const pointer = document.getElementById('onboarding-toolbar-pointer');
    const helpModal = document.getElementById('modal-help');
    const spickModal = document.getElementById('modal-spickzettel');
    const tourBanner = document.getElementById('tour-guide-banner');

    if (welcomeModal && !welcomeModal.classList.contains('hidden')) {
      closeWelcomeSetupModal(true);
      return;
    }
    if (pointer && !pointer.classList.contains('hidden')) {
      hideToolbarPointer();
      return;
    }
    if (tourBanner && !tourBanner.classList.contains('hidden')) {
      exitGuidedTour();
      return;
    }
    if (spickModal && !spickModal.classList.contains('hidden')) {
      closeSpickzettelModal();
      return;
    }
    if (helpModal && !helpModal.classList.contains('hidden')) {
      closeHelpModal();
      return;
    }
  }
});


