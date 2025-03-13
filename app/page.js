'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page on initial load
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
        <p className="mt-2 text-sm text-gray-500">Redirecting you to the login page</p>
      </div>
    </div>
  );
}