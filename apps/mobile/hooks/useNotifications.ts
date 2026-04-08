import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// --- Types ---

export interface NotificationItem {
  id: string;
  type: 'app_update' | 'system_message' | 'reminder';
  title: string;
  body: string | null;
  isRead: boolean;
  sentAt: string;
}

// --- Query Keys ---

const notificationKeys = {
  all: ['notifications'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};

// --- Hook ---

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? '';

  // Unread count query — lightweight, polls every 60s
  const countQuery = useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // poll every 60s
    retry: 1,
  });

  // Full notification list
  const listQuery = useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, notification_type, title, body, is_read, sent_at')
        .eq('user_id', userId)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data ?? []).map((n: Record<string, unknown>) => ({
        id: n.id as string,
        type: n.notification_type as NotificationItem['type'],
        title: n.title as string,
        body: (n.body as string) ?? null,
        isRead: n.is_read as boolean,
        sentAt: n.sent_at as string,
      }));
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
    retry: 1,
  });

  // Mark single notification as read
  const markReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  // Mark all as read
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
  }, [queryClient]);

  return {
    unreadCount: countQuery.data ?? 0,
    notifications: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isCountLoading: countQuery.isLoading,
    markRead: markReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
    refetch,
  };
}
