-- Migration: 037_org_boq_rates_and_snapshots
-- Description: Add BOQ rate snapshot columns to delivery_reports (Iron Rule).
--   Rates are read from organizations.settings.boqRates at report creation time
--   and frozen into these columns. PDF reads from snapshots only.
--   Default org rates: { batzam: 0.10, supervision: 0.10, vat: 0.18 }
-- Dependencies: 005_create_delivery_reports

ALTER TABLE delivery_reports
    ADD COLUMN org_boq_batzam_rate_snapshot       NUMERIC(5, 4),
    ADD COLUMN org_boq_supervision_rate_snapshot   NUMERIC(5, 4),
    ADD COLUMN org_boq_vat_rate_snapshot           NUMERIC(5, 4);

COMMENT ON COLUMN delivery_reports.org_boq_batzam_rate_snapshot     IS 'Snapshot of org בצ"מ rate at report creation (default 0.10 = 10%)';
COMMENT ON COLUMN delivery_reports.org_boq_supervision_rate_snapshot IS 'Snapshot of org supervision rate at report creation (default 0.10 = 10%)';
COMMENT ON COLUMN delivery_reports.org_boq_vat_rate_snapshot         IS 'Snapshot of org VAT rate at report creation (default 0.18 = 18%)';
