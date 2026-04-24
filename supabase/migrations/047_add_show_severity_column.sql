-- Add show_severity boolean to delivery_reports
-- Controls whether severity badges appear in the PDF and the severity picker in add-defect UI
ALTER TABLE delivery_reports
  ADD COLUMN IF NOT EXISTS show_severity BOOLEAN NOT NULL DEFAULT TRUE;

-- Add show_severity_default to checklist_templates
-- Sets the default value for new reports created with this template
ALTER TABLE checklist_templates
  ADD COLUMN IF NOT EXISTS show_severity_default BOOLEAN NOT NULL DEFAULT TRUE;
