import { useCallback, useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

// --- Constants ---

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_MS = 5 * 60 * 1000; // Warn 5 minutes before

// --- Hook ---

/**
 * Signs out the user after 30 minutes of inactivity.
 * Activity is tracked by calling `resetTimer()` on user interactions
 * and by monitoring AppState transitions.
 *
 * @param onWarning Called 5 minutes before timeout — show UI warning
 * @param onTimeout Called when timeout occurs — cleanup before sign out
 */
export function useIdleTimeout(onWarning?: () => void, onTimeout?: () => void) {
  const { signOut, session } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActiveRef = useRef(Date.now());

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
  }, []);

  const handleTimeout = useCallback(async () => {
    onTimeout?.();
    await signOut();
  }, [onTimeout, signOut]);

  const resetTimer = useCallback(() => {
    lastActiveRef.current = Date.now();
    clearTimers();

    if (!session) return;

    // Set warning timer (fires 5 min before timeout)
    warningTimerRef.current = setTimeout(() => {
      onWarning?.();
    }, IDLE_TIMEOUT_MS - WARNING_BEFORE_MS);

    // Set timeout timer
    timerRef.current = setTimeout(() => {
      handleTimeout();
    }, IDLE_TIMEOUT_MS);
  }, [session, clearTimers, handleTimeout, onWarning]);

  // Start/reset timer when session changes
  useEffect(() => {
    if (session) {
      resetTimer();
    } else {
      clearTimers();
    }

    return clearTimers;
  }, [session, resetTimer, clearTimers]);

  // Track AppState changes — reset on foreground, check elapsed on return
  useEffect(() => {
    if (!session) return;

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        const elapsed = Date.now() - lastActiveRef.current;
        if (elapsed >= IDLE_TIMEOUT_MS) {
          handleTimeout();
        } else {
          resetTimer();
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [session, resetTimer, handleTimeout]);

  // Web: track visibility changes
  useEffect(() => {
    if (Platform.OS !== 'web' || !session) return;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastActiveRef.current;
        if (elapsed >= IDLE_TIMEOUT_MS) {
          handleTimeout();
        } else {
          resetTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, [session, resetTimer, handleTimeout]);

  return { resetTimer };
}
