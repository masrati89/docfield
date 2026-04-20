-- Migration: 039_seed_default_checklist_template
-- Description: Add metadata JSONB column to checklist_items + seed the system
--              default delivery checklist template (14 rooms, 83 items) from
--              the hardcoded CHECKLIST_ROOMS constant.
-- Dependencies: 004_create_checklist_templates

-- ===========================================
-- 1. Add metadata column for bath-type and parent-child relationships
-- ===========================================
ALTER TABLE checklist_items
    ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}';

COMMENT ON COLUMN checklist_items.metadata IS
    'Optional item metadata: { bathType?: "shower"|"bath", parentId?: string, hasChildren?: boolean }';

-- ===========================================
-- 2. Insert global system default template
-- ===========================================
INSERT INTO checklist_templates (id, organization_id, name, report_type, is_global, is_active)
SELECT
    'a0000000-0000-4000-8000-000000000001'::uuid,
    NULL,
    'תבנית מסירה סטנדרטית',
    'delivery',
    true,
    true
WHERE NOT EXISTS (
    SELECT 1 FROM checklist_templates WHERE id = 'a0000000-0000-4000-8000-000000000001'
);

-- ===========================================
-- 3. Insert categories (rooms) — 14 rooms
-- ===========================================

-- entrance (sort_order=0)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000001'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'מבואת כניסה', 0
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000001');

-- hallway (sort_order=1)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000002'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'מסדרון', 1
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000002');

-- living (sort_order=2)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000003'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'סלון', 2
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000003');

-- kitchen (sort_order=3)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000004'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'מטבח', 3
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000004');

-- bedroom1 (sort_order=4)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000005'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'חדר שינה הורים', 4
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000005');

-- bedroom2 (sort_order=5)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000006'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'חדר שינה ילדים', 5
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000006');

-- mamad (sort_order=6)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000007'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'ממ"ד', 6
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000007');

-- bath_master (sort_order=7)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000008'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'חדר רחצה הורים', 7
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000008');

-- guest_wc (sort_order=8)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000009'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'שירותי אורחים', 8
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000009');

-- laundry (sort_order=9)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000010'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'חדר כביסה/שירות', 9
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000010');

-- laundry_cover (sort_order=10)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000011'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'מסתור כביסה', 10
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000011');

-- balcony (sort_order=11)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000012'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'מרפסת סלון', 11
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000012');

-- parking (sort_order=12)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000013'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'חניה', 12
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000013');

-- storage (sort_order=13)
INSERT INTO checklist_categories (id, template_id, name, sort_order)
SELECT 'a0000000-0000-4000-8001-000000000014'::uuid,
       'a0000000-0000-4000-8000-000000000001'::uuid,
       'מחסן', 13
WHERE NOT EXISTS (SELECT 1 FROM checklist_categories WHERE id = 'a0000000-0000-4000-8001-000000000014');

-- ===========================================
-- 4. Insert items — 83 items across 14 rooms
-- ===========================================

-- ---- entrance (category 001) — 6 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000001'::uuid,
       'a0000000-0000-4000-8001-000000000001'::uuid,
       'דלת כניסה מותקנת ותקינה?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000001');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000002'::uuid,
       'a0000000-0000-4000-8001-000000000001'::uuid,
       'אינטרקום/פעמון מותקן ותקין?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000002');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000003'::uuid,
       'a0000000-0000-4000-8001-000000000001'::uuid,
       'טיח וצבע תקינים?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000003');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000004'::uuid,
       'a0000000-0000-4000-8001-000000000001'::uuid,
       'ריצוף תקין?', 3, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000004');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000005'::uuid,
       'a0000000-0000-4000-8001-000000000001'::uuid,
       'ארון חשמל ראשי מותקן ומסומן?', 4, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000005');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000006'::uuid,
       'a0000000-0000-4000-8001-000000000001'::uuid,
       'תאורה תקינה?', 5, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000006');

-- ---- hallway (category 002) — 4 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000007'::uuid,
       'a0000000-0000-4000-8001-000000000002'::uuid,
       'טיח וצבע תקינים?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000007');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000008'::uuid,
       'a0000000-0000-4000-8001-000000000002'::uuid,
       'ריצוף תקין?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000008');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000009'::uuid,
       'a0000000-0000-4000-8001-000000000002'::uuid,
       'תאורה תקינה?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000009');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000010'::uuid,
       'a0000000-0000-4000-8001-000000000002'::uuid,
       'שקעי חשמל תקינים?', 3, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000010');

-- ---- living (category 003) — 6 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000011'::uuid,
       'a0000000-0000-4000-8001-000000000003'::uuid,
       'טיח וצבע תקינים?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000011');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000012'::uuid,
       'a0000000-0000-4000-8001-000000000003'::uuid,
       'ריצוף תקין?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000012');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000013'::uuid,
       'a0000000-0000-4000-8001-000000000003'::uuid,
       'שקעי חשמל תקינים?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000013');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000014'::uuid,
       'a0000000-0000-4000-8001-000000000003'::uuid,
       'הכנה לטלוויזיה?', 3, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000014');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000015'::uuid,
       'a0000000-0000-4000-8001-000000000003'::uuid,
       'הכנה למזגן כולל ניקוז?', 4, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000015');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000016'::uuid,
       'a0000000-0000-4000-8001-000000000003'::uuid,
       'חלון/וטרינה תקין?', 5, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000016');

-- ---- kitchen (category 004) — 6 items (with parent-child) ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000017'::uuid,
       'a0000000-0000-4000-8001-000000000004'::uuid,
       'מטבח מותקן?', 0, '{"hasChildren": true}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000017');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000018'::uuid,
       'a0000000-0000-4000-8001-000000000004'::uuid,
       'שיש מותקן ותקין?', 1, '{"parentId": "a0000000-0000-4000-8002-000000000017"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000018');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000019'::uuid,
       'a0000000-0000-4000-8001-000000000004'::uuid,
       'חיפוי קירות מותקן?', 2, '{"parentId": "a0000000-0000-4000-8002-000000000017"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000019');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000020'::uuid,
       'a0000000-0000-4000-8001-000000000004'::uuid,
       'כיור וברז מותקנים ותקינים?', 3, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000020');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000021'::uuid,
       'a0000000-0000-4000-8001-000000000004'::uuid,
       'הכנת גז תקינה?', 4, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000021');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000022'::uuid,
       'a0000000-0000-4000-8001-000000000004'::uuid,
       'חלון מטבח תקין?', 5, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000022');

-- ---- bedroom1 (category 005) — 5 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000023'::uuid,
       'a0000000-0000-4000-8001-000000000005'::uuid,
       'טיח וצבע תקינים?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000023');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000024'::uuid,
       'a0000000-0000-4000-8001-000000000005'::uuid,
       'ריצוף תקין?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000024');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000025'::uuid,
       'a0000000-0000-4000-8001-000000000005'::uuid,
       'שקעי חשמל תקינים?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000025');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000026'::uuid,
       'a0000000-0000-4000-8001-000000000005'::uuid,
       'הכנה למזגן כולל ניקוז?', 3, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000026');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000027'::uuid,
       'a0000000-0000-4000-8001-000000000005'::uuid,
       'חלון תקין?', 4, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000027');

-- ---- bedroom2 (category 006) — 5 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000028'::uuid,
       'a0000000-0000-4000-8001-000000000006'::uuid,
       'טיח וצבע תקינים?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000028');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000029'::uuid,
       'a0000000-0000-4000-8001-000000000006'::uuid,
       'ריצוף תקין?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000029');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000030'::uuid,
       'a0000000-0000-4000-8001-000000000006'::uuid,
       'שקעי חשמל תקינים?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000030');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000031'::uuid,
       'a0000000-0000-4000-8001-000000000006'::uuid,
       'הכנה למזגן כולל ניקוז?', 3, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000031');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000032'::uuid,
       'a0000000-0000-4000-8001-000000000006'::uuid,
       'חלון תקין?', 4, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000032');

-- ---- mamad (category 007) — 5 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000033'::uuid,
       'a0000000-0000-4000-8001-000000000007'::uuid,
       'דלת ממ"ד מותקנת ותקינה?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000033');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000034'::uuid,
       'a0000000-0000-4000-8001-000000000007'::uuid,
       'חלון ותריס פלדה תקינים?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000034');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000035'::uuid,
       'a0000000-0000-4000-8001-000000000007'::uuid,
       'טיח וצבע תקינים?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000035');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000036'::uuid,
       'a0000000-0000-4000-8001-000000000007'::uuid,
       'ריצוף תקין?', 3, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000036');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000037'::uuid,
       'a0000000-0000-4000-8001-000000000007'::uuid,
       'שקעי חשמל תקינים?', 4, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000037');

-- ---- bath_master (category 008) — 11 items (with bathType metadata) ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000038'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'אסלה מותקנת ותקינה?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000038');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000039'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'כיור וברז מותקנים ותקינים?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000039');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000040'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'אינטרפוץ מותקן ותקין?', 2, '{"bathType": "shower"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000040');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000041'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'מוט מקלחון מותקן?', 3, '{"bathType": "shower"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000041');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000042'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'מקלחון/מחיצה תקינה?', 4, '{"bathType": "shower"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000042');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000043'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'אמבטיה מותקנת ותקינה?', 5, '{"bathType": "bath"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000043');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000044'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'ברז אמבטיה מותקן ותקין?', 6, '{"bathType": "bath"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000044');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000045'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'מחיצת אמבטיה תקינה?', 7, '{"bathType": "bath"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000045');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000046'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'חיפוי קירות תקין?', 8, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000046');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000047'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'ריצוף תקין?', 9, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000047');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000048'::uuid,
       'a0000000-0000-4000-8001-000000000008'::uuid,
       'אוורור/וונטה תקין?', 10, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000048');

-- ---- guest_wc (category 009) — 5 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000049'::uuid,
       'a0000000-0000-4000-8001-000000000009'::uuid,
       'אסלה מותקנת ותקינה?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000049');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000050'::uuid,
       'a0000000-0000-4000-8001-000000000009'::uuid,
       'כיור וברז מותקנים ותקינים?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000050');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000051'::uuid,
       'a0000000-0000-4000-8001-000000000009'::uuid,
       'חיפוי קירות תקין?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000051');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000052'::uuid,
       'a0000000-0000-4000-8001-000000000009'::uuid,
       'ריצוף תקין?', 3, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000052');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000053'::uuid,
       'a0000000-0000-4000-8001-000000000009'::uuid,
       'אוורור/וונטה תקין?', 4, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000053');

-- ---- laundry (category 010) — 6 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000054'::uuid,
       'a0000000-0000-4000-8001-000000000010'::uuid,
       'הכנה לביוב מכונת כביסה?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000054');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000055'::uuid,
       'a0000000-0000-4000-8001-000000000010'::uuid,
       'נקודות מים למכונת כביסה?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000055');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000056'::uuid,
       'a0000000-0000-4000-8001-000000000010'::uuid,
       'שקע חשמל למכונת כביסה?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000056');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000057'::uuid,
       'a0000000-0000-4000-8001-000000000010'::uuid,
       'וונטה/אוורור תקין?', 3, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000057');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000058'::uuid,
       'a0000000-0000-4000-8001-000000000010'::uuid,
       'ריצוף תקין?', 4, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000058');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000059'::uuid,
       'a0000000-0000-4000-8001-000000000010'::uuid,
       'ניקוז רצפה תקין?', 5, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000059');

-- ---- laundry_cover (category 011) — 3 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000060'::uuid,
       'a0000000-0000-4000-8001-000000000011'::uuid,
       'דלת/תריס מותקן ותקין?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000060');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000061'::uuid,
       'a0000000-0000-4000-8001-000000000011'::uuid,
       'מתקן ייבוש/תליה מותקן?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000061');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000062'::uuid,
       'a0000000-0000-4000-8001-000000000011'::uuid,
       'ניקוז רצפה תקין?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000062');

-- ---- balcony (category 012) — 6 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000063'::uuid,
       'a0000000-0000-4000-8001-000000000012'::uuid,
       'ריצוף תקין?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000063');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000064'::uuid,
       'a0000000-0000-4000-8001-000000000012'::uuid,
       'מעקה/חיפוי מותקן ותקין?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000064');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000065'::uuid,
       'a0000000-0000-4000-8001-000000000012'::uuid,
       'ניקוז רצפה תקין?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000065');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000066'::uuid,
       'a0000000-0000-4000-8001-000000000012'::uuid,
       'שקע חשמל מותקן?', 3, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000066');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000067'::uuid,
       'a0000000-0000-4000-8001-000000000012'::uuid,
       'תאורה תקינה?', 4, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000067');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000068'::uuid,
       'a0000000-0000-4000-8001-000000000012'::uuid,
       'נקודת גז תקינה?', 5, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000068');

-- ---- parking (category 013) — 2 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000069'::uuid,
       'a0000000-0000-4000-8001-000000000013'::uuid,
       'חניה מסומנת ומזוהה?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000069');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000070'::uuid,
       'a0000000-0000-4000-8001-000000000013'::uuid,
       'שלט חניה/שער תקין?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000070');

-- ---- storage (category 014) — 3 items ----
INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000071'::uuid,
       'a0000000-0000-4000-8001-000000000014'::uuid,
       'מחסן מזוהה ונגיש?', 0, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000071');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000072'::uuid,
       'a0000000-0000-4000-8001-000000000014'::uuid,
       'דלת מחסן תקינה?', 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000072');

INSERT INTO checklist_items (id, category_id, description, sort_order, metadata)
SELECT 'a0000000-0000-4000-8002-000000000073'::uuid,
       'a0000000-0000-4000-8001-000000000014'::uuid,
       'תאורה מותקנת?', 2, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM checklist_items WHERE id = 'a0000000-0000-4000-8002-000000000073');
