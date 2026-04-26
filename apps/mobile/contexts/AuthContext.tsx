import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { User, UserPreferences } from '@infield/shared';

import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// --- Types ---

interface AuthContextValue {
  session: Session | null;
  user: SupabaseUser | null;
  profile: User | null;
  isLoading: boolean;
  refreshProfile: () => Promise<User | null>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// --- Error messages (Hebrew) ---

function getAuthErrorMessage(errorMessage: string): string {
  if (errorMessage.includes('Invalid login credentials')) {
    return 'אימייל או סיסמה שגויים. נסה שוב';
  }
  if (errorMessage.includes('Email not confirmed')) {
    return 'האימייל לא אומת. בדוק את תיבת הדואר שלך';
  }
  if (errorMessage.includes('User already registered')) {
    return 'כתובת האימייל כבר רשומה במערכת';
  }
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'בעיית תקשורת. בדוק את החיבור לאינטרנט';
  }
  return 'אירעה שגיאה. נסה שוב מאוחר יותר';
}

// --- Provider ---

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from our users table
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(
          'id, organization_id, email, full_name, first_name, profession, role, phone, signature_url, stamp_url, avatar_url, provider, is_active, preferences, created_at, updated_at, organizations(name)'
        )
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[AuthContext] fetchProfile error:', error.message);
        return null;
      }

      // Map snake_case DB columns to camelCase TypeScript interface
      const orgRaw = data.organizations as unknown;
      const org = (Array.isArray(orgRaw) ? orgRaw[0] : orgRaw) as {
        name: string;
      } | null;
      const userProfile: User = {
        id: data.id,
        organizationId: data.organization_id,
        organizationName: org?.name ?? undefined,
        email: data.email,
        fullName: data.full_name,
        firstName: data.first_name ?? undefined,
        profession: data.profession ?? undefined,
        role: data.role,
        phone: data.phone ?? undefined,
        signatureUrl: data.signature_url ?? undefined,
        stampUrl: data.stamp_url ?? undefined,
        avatarUrl: data.avatar_url ?? undefined,
        provider: data.provider ?? 'email',
        isActive: data.is_active,
        preferences:
          ((data as Record<string, unknown>).preferences as UserPreferences) ??
          {},
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return userProfile;
    } catch (err) {
      console.error('[AuthContext] fetchProfile exception:', err);
      return null;
    }
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth
      .getSession()
      .then(async ({ data: { session: initialSession } }) => {
        setSession(initialSession);

        if (initialSession?.user) {
          const userProfile = await fetchProfile(initialSession.user.id);
          setProfile(userProfile);
        }

        setIsLoading(false);
      });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (__DEV__) {
        console.warn(
          '[AuthContext] onAuthStateChange:',
          _event,
          newSession?.user?.id
        );
      }
      setSession(newSession);

      if (newSession?.user) {
        const userProfile = await fetchProfile(newSession.user.id);
        if (__DEV__) {
          console.warn(
            '[AuthContext] profile loaded:',
            userProfile ? 'yes' : 'null',
            userProfile?.fullName
          );
        }
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Re-fetch profile (e.g. after preferences change). Returns the updated profile.
  const refreshProfile = useCallback(async (): Promise<User | null> => {
    const userId = session?.user?.id;
    if (!userId) return null;
    const updated = await fetchProfile(userId);
    if (updated) setProfile(updated);
    return updated;
  }, [session, fetchProfile]);

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: getAuthErrorMessage(error.message) };
      }

      return { error: null };
    } catch {
      return { error: 'בעיית תקשורת. בדוק את החיבור לאינטרנט' };
    }
  }, []);

  // Sign up new user
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      phone?: string
    ) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone },
          },
        });

        if (error) {
          return { error: getAuthErrorMessage(error.message) };
        }

        return { error: null };
      } catch {
        return { error: 'בעיית תקשורת. בדוק את החיבור לאינטרנט' };
      }
    },
    []
  );

  // Sign out — clear all cached data to prevent data leak between users
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      refreshProfile,
      signIn,
      signUp,
      signOut,
    }),
    [session, profile, isLoading, refreshProfile, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Hook ---

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
