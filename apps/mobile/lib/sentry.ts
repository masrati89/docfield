import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initializeSentry() {
  if (!SENTRY_DSN) {
    console.warn(
      'Sentry DSN not configured. Error reporting disabled. Set EXPO_PUBLIC_SENTRY_DSN in .env'
    );
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    maxBreadcrumbs: 100,
    attachStacktrace: true,
    enableAutoSessionTracking: true,
    enableNativeFramesTracking: true,
    beforeSend(event, hint) {
      // Don't send non-critical events in development
      if (process.env.NODE_ENV !== 'production') {
        if (hint.originalException instanceof Error) {
          return event;
        }
        return null;
      }
      return event;
    },
    release: Constants.expoConfig?.version ?? '1.0.0',
    dist: `${Platform.OS}-${Constants.expoConfig?.version ?? '1.0.0'}`,
  });
}

export { Sentry };
