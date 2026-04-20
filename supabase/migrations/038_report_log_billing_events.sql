-- Migration: 038_report_log_billing_events
-- Description: Extend report_log action CHECK with 3 billing event types:
--   report_created_billable, report_created_draft, report_finalized.
-- Dependencies: 013_create_report_log

ALTER TABLE report_log DROP CONSTRAINT report_log_action_check;
ALTER TABLE report_log ADD CONSTRAINT report_log_action_check
    CHECK (action IN (
        'pdf_generated',
        'status_completed',
        'status_draft',
        'status_in_progress',
        'defect_added',
        'defect_updated',
        'defect_deleted',
        'photos_updated',
        'whatsapp_sent',
        'report_created_billable',
        'report_created_draft',
        'report_finalized'
    ));
