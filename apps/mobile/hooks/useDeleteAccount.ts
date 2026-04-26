import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface UseDeleteAccountReturn {
  isDeleting: boolean;
  error: string | null;
  deleteAccount: () => Promise<void>;
}

export function useDeleteAccount(): UseDeleteAccountReturn {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const deleteAccount = useCallback(async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Call the delete_user_account RPC function
      const { error: rpcError } = await supabase.rpc('delete_user_account');

      if (rpcError) {
        setError(rpcError.message || 'שגיאה בזמן מחיקת החשבון');
        setIsDeleting(false);
        return;
      }

      // Sign out the user to clear the session
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(signOutError.message || 'שגיאה בזמן התנתקות');
        setIsDeleting(false);
        return;
      }

      // Navigate back to login
      router.replace('/(auth)/login');
    } catch {
      setError('שגיאה לא צפויה בזמן מחיקת החשבון');
      setIsDeleting(false);
    }
  }, [router]);

  return {
    isDeleting,
    error,
    deleteAccount,
  };
}
