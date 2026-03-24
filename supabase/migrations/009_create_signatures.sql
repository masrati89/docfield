-- Migration: 009_create_signatures
-- Description: Signatures (IMMUTABLE — no UPDATE or DELETE!)
-- Dependencies: delivery_reports
--
-- SECURITY: Signatures are legally binding. Once created, they cannot
-- be modified or deleted. There are NO UPDATE or DELETE policies.

-- ===========================================
-- TABLE: signatures
-- ===========================================
CREATE TABLE signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_report_id UUID NOT NULL REFERENCES delivery_reports(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    signer_type TEXT NOT NULL CHECK (signer_type IN ('inspector', 'tenant')),
    signer_name TEXT NOT NULL CHECK (char_length(signer_name) >= 1),
    image_url TEXT NOT NULL,
    signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_signatures_report ON signatures(delivery_report_id);

-- Prevent multiple signatures of same type per report
CREATE UNIQUE INDEX idx_signatures_unique_per_report
    ON signatures(delivery_report_id, signer_type);

-- RLS
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- SELECT: own org only
CREATE POLICY "signatures_select" ON signatures FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- INSERT: any authenticated user in same org
CREATE POLICY "signatures_insert" ON signatures FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- ⚠️ NO UPDATE POLICY — signatures are immutable
-- ⚠️ NO DELETE POLICY — signatures cannot be removed
-- This is intentional and enforced at the database level.
