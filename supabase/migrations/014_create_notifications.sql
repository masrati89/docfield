-- Migration: 014_create_notifications
-- Description: Notifications table for bell icon + future smart reminders
-- FLOW_SPEC §13: notification_type and sent_at required now, logic comes later
-- Dependencies: users

-- ===========================================
-- TABLE: notifications
-- ===========================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    user_id UUID NOT NULL REFERENCES users(id),
    notification_type TEXT NOT NULL CHECK (notification_type IN (
        'app_update',
        'system_message',
        'reminder'
    )),
    title TEXT NOT NULL,
    body TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB NOT NULL DEFAULT '{}',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read)
    WHERE is_read = false;
CREATE INDEX idx_notifications_org ON notifications(organization_id);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- SELECT: user sees own notifications only
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (
    user_id = auth.uid()
);

-- INSERT: admin/PM can create notifications for users in same org
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role IN ('admin', 'project_manager')
    )
);

-- UPDATE: user can mark own notifications as read
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (
    user_id = auth.uid()
);

-- DELETE: admin only
CREATE POLICY "notifications_delete" ON notifications FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);
