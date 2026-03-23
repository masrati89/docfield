-- Migration: 011_create_storage_buckets
-- Description: Storage buckets for photos, signatures, logos
-- Dependencies: none (uses storage schema)

-- ===========================================
-- BUCKET: defect-photos (private)
-- Structure: {org_id}/{report_id}/{defect_id}/{filename}
-- ===========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'defect-photos',
    'defect-photos',
    false,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- ===========================================
-- BUCKET: signatures (private)
-- Structure: {org_id}/{report_id}/{signer_type}_{uuid}.png
-- ===========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'signatures',
    'signatures',
    false,
    5242880, -- 5MB
    ARRAY['image/png', 'image/webp']
);

-- ===========================================
-- BUCKET: org-logos (public — logos visible to anyone with link)
-- Structure: {org_id}/logo.png
-- ===========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'org-logos',
    'org-logos',
    true,
    2097152, -- 2MB
    ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
);

-- ===========================================
-- STORAGE POLICIES: defect-photos
-- ===========================================

-- SELECT: users can view photos from their org
CREATE POLICY "defect_photos_storage_select" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'defect-photos'
        AND (storage.foldername(name))[1] = (
            SELECT organization_id::text FROM users WHERE id = auth.uid()
        )
    );

-- INSERT: users can upload to their org folder
CREATE POLICY "defect_photos_storage_insert" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'defect-photos'
        AND (storage.foldername(name))[1] = (
            SELECT organization_id::text FROM users WHERE id = auth.uid()
        )
    );

-- DELETE: users can delete photos from their org
CREATE POLICY "defect_photos_storage_delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'defect-photos'
        AND (storage.foldername(name))[1] = (
            SELECT organization_id::text FROM users WHERE id = auth.uid()
        )
    );

-- ===========================================
-- STORAGE POLICIES: signatures
-- ===========================================

CREATE POLICY "signatures_storage_select" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'signatures'
        AND (storage.foldername(name))[1] = (
            SELECT organization_id::text FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "signatures_storage_insert" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'signatures'
        AND (storage.foldername(name))[1] = (
            SELECT organization_id::text FROM users WHERE id = auth.uid()
        )
    );

-- No DELETE on signatures storage (immutable)

-- ===========================================
-- STORAGE POLICIES: org-logos
-- ===========================================

-- Public bucket: anyone can view (no SELECT policy needed)

-- Upload: admin only, to own org folder
CREATE POLICY "org_logos_storage_insert" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'org-logos'
        AND (storage.foldername(name))[1] = (
            SELECT organization_id::text FROM users WHERE id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update (replace logo): admin only
CREATE POLICY "org_logos_storage_update" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'org-logos'
        AND (storage.foldername(name))[1] = (
            SELECT organization_id::text FROM users WHERE id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );
