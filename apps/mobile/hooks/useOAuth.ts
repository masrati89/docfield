import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

import { supabase } from '@/lib/supabase';

// --- Setup ---

WebBrowser.maybeCompleteAuthSession();

// --- Types ---

type OAuthProvider = 'google' | 'apple';

interface OAuthResult {
  error: string | null;
  needsCompletion: boolean;
}

export interface UseOAuthReturn {
  signInWithGoogle: () => Promise<OAuthResult>;
  signInWithApple: () => Promise<OAuthResult>;
  isLoading: boolean;
  loadingProvider: OAuthProvider | null;
}

// --- Profile check helper ---

async function checkProfileExists(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();
  return !!data;
}

// --- Hook ---

export function useOAuth(): UseOAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(
    null
  );

  // --- Google OAuth ---

  const signInWithGoogle = useCallback(async (): Promise<OAuthResult> => {
    setIsLoading(true);
    setLoadingProvider('google');

    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'infield',
        path: 'auth/callback',
      });

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (oauthError || !data.url) {
        return {
          error: 'אירעה שגיאה בהתחברות עם Google. נסה שוב',
          needsCompletion: false,
        };
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
      );

      if (result.type !== 'success' || !result.url) {
        if (result.type === 'cancel' || result.type === 'dismiss') {
          return { error: null, needsCompletion: false };
        }
        return {
          error: 'ההתחברות עם Google בוטלה או נכשלה',
          needsCompletion: false,
        };
      }

      // Extract tokens from callback URL
      const callbackUrl = new URL(result.url);
      const accessToken =
        callbackUrl.searchParams.get('access_token') ??
        new URLSearchParams(callbackUrl.hash.slice(1)).get('access_token');
      const refreshToken =
        callbackUrl.searchParams.get('refresh_token') ??
        new URLSearchParams(callbackUrl.hash.slice(1)).get('refresh_token');

      if (!accessToken || !refreshToken) {
        return {
          error: 'לא התקבלו פרטי התחברות. נסה שוב',
          needsCompletion: false,
        };
      }

      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

      if (sessionError || !sessionData.user) {
        return {
          error: 'אירעה שגיאה בהגדרת הסשן. נסה שוב',
          needsCompletion: false,
        };
      }

      const hasProfile = await checkProfileExists(sessionData.user.id);
      return { error: null, needsCompletion: !hasProfile };
    } catch {
      return {
        error: 'בעיית תקשורת. בדוק את החיבור לאינטרנט',
        needsCompletion: false,
      };
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  }, []);

  // --- Apple OAuth (iOS only) ---

  const signInWithApple = useCallback(async (): Promise<OAuthResult> => {
    if (Platform.OS !== 'ios') {
      return {
        error: 'Apple Sign In זמין רק ב-iOS',
        needsCompletion: false,
      };
    }

    setIsLoading(true);
    setLoadingProvider('apple');

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = credential;

      if (!identityToken) {
        return {
          error: 'לא התקבל אסימון זהות מ-Apple. נסה שוב',
          needsCompletion: false,
        };
      }

      const { data, error: idTokenError } =
        await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: identityToken,
        });

      if (idTokenError || !data.user) {
        return {
          error: 'אירעה שגיאה בהתחברות עם Apple. נסה שוב',
          needsCompletion: false,
        };
      }

      const hasProfile = await checkProfileExists(data.user.id);
      return { error: null, needsCompletion: !hasProfile };
    } catch (err: unknown) {
      // User cancelled Apple sign-in — not a real error
      if (
        err instanceof Error &&
        (err as { code?: string }).code === 'ERR_REQUEST_CANCELED'
      ) {
        return { error: null, needsCompletion: false };
      }
      return {
        error: 'בעיית תקשורת. בדוק את החיבור לאינטרנט',
        needsCompletion: false,
      };
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  }, []);

  return {
    signInWithGoogle,
    signInWithApple,
    isLoading,
    loadingProvider,
  };
}
