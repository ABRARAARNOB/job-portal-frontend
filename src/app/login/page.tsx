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
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-[#f8f9ff] to-violet-50 px-4 py-10">
            <div className="text-center">
                <span className="text-2xl font-extrabold tracking-tight text-indigo-600">
                    UniCareer
                </span>
            </div>

            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-md rounded-3xl border border-white/80 border-l-4 border-indigo-600 bg-white/95 p-8 shadow-[0_24px_60px_-20px_rgba(60,50,150,0.3)] backdrop-blur sm:p-10">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to continue your career journey.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8">
                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-semibold text-gray-800"
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
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 px-3.5 text-gray-700 placeholder-gray-400 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="mb-2">
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-semibold text-gray-800"
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
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 px-3.5 text-gray-700 placeholder-gray-400 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="mb-6 text-right">
                            <a
                                href="#"
                                className="text-sm font-medium text-indigo-600 hover:underline"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-[#3b28c8] to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-px hover:from-[#31209f] hover:to-indigo-700 hover:shadow-xl disabled:opacity-60"
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
