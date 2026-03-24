import { Navigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { session, isLoading } = useAuth();

  // Skeleton loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-64">
          <div className="h-4 bg-cream-200 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-cream-200 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-cream-200 rounded w-2/3 mx-auto" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
