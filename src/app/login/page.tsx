'use client';

import   { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

interface User {
    id: number;
    email: string;
    role: string;
}

interface LoginResponse {
    message: string;
    status: boolean;
    user: User;
}

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const userRole = user ? user.role : undefined;

    async function handleLogin(e :any) {
        e.preventDefault();

        setLoginResponse(null);
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
            email,
            password,
            });

            setLoginResponse(response.data);

            if (response.data.status) {
            await handleRole();
            }
        } catch (error: any) {
            const responseMessage = error && error.response && error.response.data
                ? error.response.data.message
                : undefined;
            setError(
            responseMessage || 'Login failed',
            );
        } finally {
            setLoading(false);
        }
    }

    const handleRole = async () => {
  try {
    const res = await api.get('/auth/me');

    console.log('called');
    console.log('User response:', res.data);

    setUser(res.data);
  } catch (error: any) {
        const responseData = error && error.response ? error.response.data : undefined;
        const errorMessage = error && error.message ? error.message : 'Unknown error';
    console.error(
      'Failed to get user:',
            responseData || errorMessage,
    );
  }
};

useEffect(() => {
    if (loginResponse && loginResponse.status && userRole === 'recruiter') {
    router.push('/recruiter');
  }
}, [loginResponse, userRole, router]);

useEffect(() => {
    if (loginResponse && loginResponse.status && userRole === 'admin') {
    router.push('/admin');
  }
}, [loginResponse, userRole, router]);


useEffect(() => {
    if (loginResponse && loginResponse.status && userRole === 'student') {
    router.push('/student');
  }
}, [loginResponse, userRole, router]);


    return (
        <div className="flex min-h-screen flex-col bg-[#f7f8fc] px-4 py-10">
            <div className="text-center">
                <span className="text-2xl font-extrabold tracking-[-0.04em] text-[#382dd2]">
                    UniCareer
                </span>
            </div>

            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-lg rounded-2xl border border-slate-100 border-l-[3px] border-l-[#4935e8] bg-white px-8 py-12 shadow-[0_20px_44px_-22px_rgba(30,41,59,0.28)] sm:px-12 sm:py-14">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-[-0.045em] text-slate-900">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-[15px] text-slate-500">
                            Sign in to continue your career journey.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-10">
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-slate-800"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="student@university.edu"
                                required
                                className="w-full rounded-xl border border-[#d7d8e4] bg-white px-4 py-3.5 text-[15px] text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-[#bfc0d2] focus:border-[#4935e8] focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-slate-800"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-xl border border-[#d7d8e4] bg-white px-4 py-3.5 text-[15px] text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-[#bfc0d2] focus:border-[#4935e8] focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#3e2ed8] py-3.5 font-semibold text-white shadow-[0_10px_20px_-10px_rgba(62,46,216,0.6)] transition-all duration-200 hover:-translate-y-px hover:bg-[#3122bf] hover:shadow-[0_16px_26px_-11px_rgba(62,46,216,0.62)] active:translate-y-0 disabled:opacity-60"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {loginResponse && loginResponse.message && (
                        <p className="mt-4 text-center text-sm text-green-600">
                            {loginResponse.message}
                        </p>
                    )}

                    {error && (
                        <p className="mt-4 text-center text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <a
                            href="/registration"
                            className="font-semibold text-indigo-600 hover:underline"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
