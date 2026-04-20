-- Migration: 045_fix_checklist_templates_rls
-- Description: Fix infinite recursion in checklist_templates / categories / items RLS policies.
--   These policies (from 004) use `(SELECT organization_id FROM users WHERE id = auth.uid())`
--   which triggers the users table RLS causing infinite recursion.
--   Fix: use get_user_org_id() SECURITY DEFINER helper (created in migration 028).
-- Dependencies: 004_create_checklist_templates, 028_rls_recursion_fix

-- ===========================================
-- 1. checklist_templates policies
-- ===========================================

DROP POLICY IF EXISTS "checklist_templates_select" ON checklist_templates;
CREATE POLICY "checklist_templates_select" ON checklist_templates FOR SELECT USING (
    is_global = true
    OR organization_id = get_user_org_id()
);

DROP POLICY IF EXISTS "checklist_templates_insert" ON checklist_templates;
CREATE POLICY "checklist_templates_insert" ON checklist_templates FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
);

DROP POLICY IF EXISTS "checklist_templates_update" ON checklist_templates;
CREATE POLICY "checklist_templates_update" ON checklist_templates FOR UPDATE USING (
    organization_id = get_user_org_id()
    AND is_global = false
);

DROP POLICY IF EXISTS "checklist_templates_delete" ON checklist_templates;
CREATE POLICY "checklist_templates_delete" ON checklist_templates FOR DELETE USING (
    organization_id = get_user_org_id()
    AND is_global = false
);

-- ===========================================
-- 2. checklist_categories policies
-- ===========================================

DROP POLICY IF EXISTS "checklist_categories_select" ON checklist_categories;
CREATE POLICY "checklist_categories_select" ON checklist_categories FOR SELECT USING (
    template_id IN (
        SELECT id FROM checklist_templates
        WHERE is_global = true
        OR organization_id = get_user_org_id()
    )
);

DROP POLICY IF EXISTS "checklist_categories_insert" ON checklist_categories;
CREATE POLICY "checklist_categories_insert" ON checklist_categories FOR INSERT WITH CHECK (
    template_id IN (
        SELECT id FROM checklist_templates
        WHERE organization_id = get_user_org_id()
    )
);

DROP POLICY IF EXISTS "checklist_categories_update" ON checklist_categories;
CREATE POLICY "checklist_categories_update" ON checklist_categories FOR UPDATE USING (
    template_id IN (
        SELECT id FROM checklist_templates
        WHERE organization_id = get_user_org_id()
    )
);

DROP POLICY IF EXISTS "checklist_categories_delete" ON checklist_categories;
CREATE POLICY "checklist_categories_delete" ON checklist_categories FOR DELETE USING (
    template_id IN (
        SELECT id FROM checklist_templates
        WHERE organization_id = get_user_org_id()
    )
);

-- ===========================================
-- 3. checklist_items policies
-- ===========================================

DROP POLICY IF EXISTS "checklist_items_select" ON checklist_items;
CREATE POLICY "checklist_items_select" ON checklist_items FOR SELECT USING (
    category_id IN (
        SELECT cc.id FROM checklist_categories cc
        JOIN checklist_templates ct ON cc.template_id = ct.id
        WHERE ct.is_global = true
        OR ct.organization_id = get_user_org_id()
    )
);

DROP POLICY IF EXISTS "checklist_items_insert" ON checklist_items;
CREATE POLICY "checklist_items_insert" ON checklist_items FOR INSERT WITH CHECK (
    category_id IN (
        SELECT cc.id FROM checklist_categories cc
        JOIN checklist_templates ct ON cc.template_id = ct.id
        WHERE ct.organization_id = get_user_org_id()
    )
);

DROP POLICY IF EXISTS "checklist_items_update" ON checklist_items;
CREATE POLICY "checklist_items_update" ON checklist_items FOR UPDATE USING (
    category_id IN (
        SELECT cc.id FROM checklist_categories cc
        JOIN checklist_templates ct ON cc.template_id = ct.id
        WHERE ct.organization_id = get_user_org_id()
    )
);

DROP POLICY IF EXISTS "checklist_items_delete" ON checklist_items;
CREATE POLICY "checklist_items_delete" ON checklist_items FOR DELETE USING (
    category_id IN (
        SELECT cc.id FROM checklist_categories cc
        JOIN checklist_templates ct ON cc.template_id = ct.id
        WHERE ct.organization_id = get_user_org_id()
    )
);
