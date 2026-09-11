'use client';

import React, { useEffect, useState } from 'react';
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

    async function handleLogin(
        e: React.FormEvent<HTMLFormElement>,
        ) {
        e.preventDefault();

        setLoginResponse(null);
        setError('');

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
            setError(
            error.response?.data?.message || 'Login failed',
            );
        }
    }

    const handleRole = async () => {
        try {
            const res = await api.get('/auth/me');

            setUser(res.data);
        } catch (error: any) {
            console.error(
            'Failed to get user:',
            error.response?.data || error.message,
            );
        }
    };

useEffect(() => {
  if (loginResponse?.status && user?.role === 'recruiter') {
    router.push('/recruiter');
  }
  else if (loginResponse?.status && user?.role === 'student') {
    router.push('/student');
  }
}, [loginResponse, user?.role, router]);


    return (
        <div className="flex min-h-screen flex-col bg-[#f7f6fd] px-4 py-10">
            {/* Brand / wordmark */}
            <div className="text-center">
                <span className="text-2xl font-extrabold tracking-tight text-indigo-600">
                    UniCareer
                </span>
            </div>

            {/* Centered login card */}
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-md rounded-2xl border-l-4 border-indigo-600 bg-white p-8 shadow-[0_20px_45px_-15px_rgba(60,50,150,0.25)] sm:p-10">
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

                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-5 w-5 text-gray-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                        />
                                    </svg>
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="student@university.edu"
                                    required
                                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-gray-700 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        <div className="mb-2">
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-semibold text-gray-800"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-5 w-5 text-gray-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                        />
                                    </svg>
                                </span>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-gray-700 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
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
                            className="w-full rounded-lg bg-[#3b28c8] py-3 font-semibold text-white transition hover:bg-[#31209f]"
                        >
                            Login
                        </button>
                    </form>

                    {loginResponse?.message && (
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
