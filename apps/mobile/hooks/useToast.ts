import { useCallback, useRef, useState } from 'react';

// --- Types ---

export type ToastType = 'success' | 'error' | 'info';

export interface ToastData {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastActions {
  toast: ToastData | null;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

// --- Hook ---

let nextId = 0;

export function useToast(duration = 3000): ToastActions {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const id = ++nextId;
      setToast({ id, message, type });

      timerRef.current = setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
        timerRef.current = null;
      }, duration);
    },
    [duration]
  );

  return { toast, showToast, hideToast };
}
