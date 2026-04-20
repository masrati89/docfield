-- Migration 040: Add preferences JSONB to users
-- Stores user-level settings like default checklist template per report type.
-- Shape: { "defaultTemplateDelivery": "uuid", "defaultTemplateBedekBait": "uuid" }

ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB NOT NULL DEFAULT '{}';
