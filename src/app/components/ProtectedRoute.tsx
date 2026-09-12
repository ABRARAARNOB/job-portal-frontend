'use client';

import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ProtectedRole = 'student' | 'recruiter' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: ProtectedRole;
}

interface AuthUser {
  role?: string;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const verifyAccess = async () => {
      try {
        const response = await api.get<AuthUser>('/auth/me');
        const userRole = response.data?.role?.toLowerCase();

        if (userRole !== role) {
          localStorage.removeItem('access_token');
          router.replace('/login');
          return;
        }

        if (mounted) setChecking(false);
      } catch {
        localStorage.removeItem('access_token');
        router.replace('/login');
      }
    };

    verifyAccess();

    return () => {
      mounted = false;
    };
  }, [role, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7ff]">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#4134d8] border-t-transparent" />
          <p className="mt-3 text-sm font-medium text-slate-600">Checking access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}