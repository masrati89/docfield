import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { User } from '@infield/shared';

import { supabase } from '@/lib/supabase';

// --- Types ---

interface AuthContextValue {
  session: Session | null;
  user: SupabaseUser | null;
  profile: User | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
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
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'בעיית תקשורת. בדוק את החיבור לאינטרנט';
  }
  return 'אירעה שגיאה. נסה שוב מאוחר יותר';
}

// --- Provider ---

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from our users table
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }

      const userProfile: User = {
        id: data.id,
        organizationId: data.organization_id,
        email: data.email,
        fullName: data.full_name,
        role: data.role,
        phone: data.phone ?? undefined,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return userProfile;
    } catch {
      console.error('Unexpected error fetching profile');
      return null;
    }
  }, []);

  // Listen to auth state changes
  useEffect(() => {
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        const userProfile = await fetchProfile(newSession.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

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

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      signIn,
      signOut,
    }),
    [session, profile, isLoading, signIn, signOut]
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
