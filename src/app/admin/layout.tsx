'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLayout from './components/AdminLayout';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading, isAuthenticated } = useAuth();
  
  // Don't wrap login page with admin layout
  const isLoginPage = pathname === '/admin/login';
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    // Redirect to login page
    window.location.href = '/admin/login';
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminContent>
          {children}
        </AdminContent>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}