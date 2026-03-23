-- Migration: 004_create_checklist_templates
-- Description: Checklist templates, categories, items
-- Dependencies: organizations

-- ===========================================
-- TABLE: checklist_templates
-- organizationId NULL = global template (available to all)
-- ===========================================
CREATE TABLE checklist_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name TEXT NOT NULL CHECK (char_length(name) >= 1),
    report_type TEXT NOT NULL
        CHECK (report_type IN ('delivery', 'bedek_bait', 'supervision', 'leak_detection', 'public_areas')),
    is_global BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklist_templates_org ON checklist_templates(organization_id);

CREATE TRIGGER set_checklist_templates_updated_at
    BEFORE UPDATE ON checklist_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;

-- SELECT: own org + global templates
CREATE POLICY "checklist_templates_select" ON checklist_templates FOR SELECT USING (
    is_global = true
    OR organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- INSERT/UPDATE/DELETE: admin only, own org
CREATE POLICY "checklist_templates_insert" ON checklist_templates FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "checklist_templates_update" ON checklist_templates FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "checklist_templates_delete" ON checklist_templates FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ===========================================
-- TABLE: checklist_categories
-- ===========================================
CREATE TABLE checklist_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(name) >= 1),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklist_categories_template ON checklist_categories(template_id);

ALTER TABLE checklist_categories ENABLE ROW LEVEL SECURITY;

-- SELECT: via template access (own org + global)
CREATE POLICY "checklist_categories_select" ON checklist_categories FOR SELECT USING (
    template_id IN (
        SELECT id FROM checklist_templates
        WHERE is_global = true
        OR organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    )
);

CREATE POLICY "checklist_categories_insert" ON checklist_categories FOR INSERT WITH CHECK (
    template_id IN (
        SELECT id FROM checklist_templates
        WHERE organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    )
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "checklist_categories_update" ON checklist_categories FOR UPDATE USING (
    template_id IN (
        SELECT id FROM checklist_templates
        WHERE organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    )
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "checklist_categories_delete" ON checklist_categories FOR DELETE USING (
    template_id IN (
        SELECT id FROM checklist_templates
        WHERE organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    )
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ===========================================
-- TABLE: checklist_items
-- ===========================================
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES checklist_categories(id) ON DELETE CASCADE,
    description TEXT NOT NULL CHECK (char_length(description) >= 2),
    default_severity TEXT NOT NULL DEFAULT 'medium'
        CHECK (default_severity IN ('critical', 'medium', 'low')),
    requires_photo BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklist_items_category ON checklist_items(category_id);

ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- SELECT: via category → template access
CREATE POLICY "checklist_items_select" ON checklist_items FOR SELECT USING (
    category_id IN (
        SELECT cc.id FROM checklist_categories cc
        JOIN checklist_templates ct ON cc.template_id = ct.id
        WHERE ct.is_global = true
        OR ct.organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    )
);

CREATE POLICY "checklist_items_insert" ON checklist_items FOR INSERT WITH CHECK (
    category_id IN (
        SELECT cc.id FROM checklist_categories cc
        JOIN checklist_templates ct ON cc.template_id = ct.id
        WHERE ct.organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    )
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "checklist_items_update" ON checklist_items FOR UPDATE USING (
    category_id IN (
        SELECT cc.id FROM checklist_categories cc
        JOIN checklist_templates ct ON cc.template_id = ct.id
        WHERE ct.organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    )
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "checklist_items_delete" ON checklist_items FOR DELETE USING (
    category_id IN (
        SELECT cc.id FROM checklist_categories cc
        JOIN checklist_templates ct ON cc.template_id = ct.id
        WHERE ct.organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    )
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);
