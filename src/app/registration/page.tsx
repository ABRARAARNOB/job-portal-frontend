'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { api } from '@/lib/axios';

 
const registrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required')
      .min(3, 'Full name must be at least 3 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    role: z.enum(['student', 'recruiter', 'admin'], {
      error: 'Please select a valid role',
    }),
    graduationYear: z
      .string()
      .min(1, 'Graduation year is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 1950 && Number(val) <= 2100, {
        message: 'Graduation year must be a valid year (e.g. 2026)',
      }),
    bio: z
      .string()
      .max(250, 'Bio cannot exceed 250 characters')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

 
type RegistrationData = z.infer<typeof registrationSchema>;

export default function Registration() {
  const router = useRouter();

 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    graduationYear: '',
    bio: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

     
    const result = registrationSchema.safeParse(formData);

    if (!result.success) {
      
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      
      const validatedData = result.data;
      const payload = {
        fullName: validatedData.fullName,
        email: validatedData.email,
        password: validatedData.password,
        role: validatedData.role,
        graduationYear: Number(validatedData.graduationYear),
        ...(validatedData.bio?.trim() ? { bio: validatedData.bio.trim() } : {}),
      };

      const response = await api.post(
        'https://job-portal-backend-1-yib6.onrender.com/auth/register',
        payload
      );

      setSuccess(response.data?.message || 'Registration successful! Redirecting to login...');

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (Array.isArray(msg)) {
        setError(msg.join(', '));
      } else {
        setError(msg || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f8] px-4 py-8">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row">
        
        {/* Left Blue Panel */}
        <div className="flex flex-col justify-between bg-[#2f27ce] p-8 text-white md:w-5/12 md:p-10">
          <div>
            <h1 className="text-2xl font-bold leading-snug md:text-3xl">
              Build Your Career <br /> With UniCareer
            </h1>
            <p className="mt-4 text-xs leading-relaxed text-blue-100 md:text-sm">
              Connect with opportunities from university alumni and take the next step toward your career.
            </p>
          </div>

          <div className="mt-10 space-y-4 md:mt-0 text-sm font-medium">
            <p className="text-white/90">Discover relevant jobs</p>
            <p className="text-white/90">Connect with recruiters</p>
            <p className="text-white/90">Track your applications</p>
          </div>
        </div>

        {/* Right White Form Panel */}
        <div className="flex-1 bg-white p-8 md:p-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Join UniCareer and start your career journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Role & Graduation Year */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  I am a
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="student">Student</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2026"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* About You (Bio) */}
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <label className="font-semibold text-gray-700">
                  About You
                </label>
                <span className="text-gray-400">
                  {formData.bio.length}/250
                </span>
              </div>
              <textarea
                name="bio"
                rows={3}
                maxLength={250}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us briefly about yourself..."
                className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#2f27ce] py-3 text-sm font-semibold text-white shadow transition hover:bg-[#251eb0] disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Messages */}
          {success && (
            <p className="mt-3 text-center text-sm font-medium text-green-600">
              {success}
            </p>
          )}

          {error && (
            <p className="mt-3 text-center text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          {/* Sign In Link */}
          <p className="mt-4 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#2f27ce] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}