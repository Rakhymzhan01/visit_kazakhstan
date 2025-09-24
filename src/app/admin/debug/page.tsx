'use client';

import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/lib/api';

export default function DebugPage() {
  const { user, isAuthenticated } = useAuth();
  
  const { data: blogsData, isLoading, error } = useQuery({
    queryKey: ['debugBlogs'],
    queryFn: () => blogApi.getBlogs({ limit: 5 }),
    enabled: isAuthenticated,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Authentication Status:</h2>
          <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user ? JSON.stringify(user, null, 2) : 'No user'}</p>
          <p>Token: {typeof window !== 'undefined' ? localStorage.getItem('admin_token') : 'No token'}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">API Call Status:</h2>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {error ? JSON.stringify(error, null, 2) : 'No error'}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Blogs Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(blogsData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}