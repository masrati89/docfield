-- =====================================================================
-- 033_iron_rule_property_snapshots.sql
--
-- Iron Rule completion: freeze the remaining 3 property fields
-- (project_name, project_address, apartment_number) onto
-- delivery_reports so PDF generation reads them exclusively from
-- the snapshot — no live joins on projects / buildings / apartments.
--
-- After this migration, the `property_*` column set on
-- delivery_reports holds:
--   * property_type             (026)
--   * property_area              (026)
--   * property_floor              (026)
--   * property_description        (029)
--   * property_project_name       (033 — new)
--   * property_project_address    (033 — new)
--   * property_building_name      (033 — new)
--   * property_apartment_number   (033 — new)
--
-- No backfill. Existing test reports will be recreated via the
-- wizard. The mobile createReportWithSnapshot.ts path must be
-- extended to write these fields at INSERT time (next commit).
-- =====================================================================

ALTER TABLE delivery_reports
    ADD COLUMN property_project_name      TEXT,
    ADD COLUMN property_project_address   TEXT,
    ADD COLUMN property_building_name     TEXT,
    ADD COLUMN property_apartment_number  TEXT;

COMMENT ON COLUMN delivery_reports.property_project_name
  IS 'Snapshot of projects.name at report creation time (Iron Rule).';
COMMENT ON COLUMN delivery_reports.property_project_address
  IS 'Snapshot of projects.address at report creation time (Iron Rule).';
COMMENT ON COLUMN delivery_reports.property_building_name
  IS 'Snapshot of buildings.name at report creation time (Iron Rule).';
COMMENT ON COLUMN delivery_reports.property_apartment_number
  IS 'Snapshot of apartments.number at report creation time (Iron Rule).';
