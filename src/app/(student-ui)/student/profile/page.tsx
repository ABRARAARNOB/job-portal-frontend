'use client';

import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import ProfileForm from './components/ProfileForm';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  graduationYear: number;
  bio: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get logged-in user
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/auth/me');

        setUser(response.data);
      } catch (error: any) {
        console.error(
          'Failed to load profile:',
          error.response?.data || error.message,
        );

        setError(
          error.response?.data?.message ||
            'Failed to load your profile',
        );
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // Update profile
  const handleSave = async (data: {
  fullName: string;
  graduationYear: string;
  bio: string;
}) => {
  if (!user) return;

  try {
    setSaving(true);
    setError('');
    setSuccess('');

    const response = await api.patch(
      `/user/${encodeURIComponent(user.email)}`,
      data,
    );

    setUser(response.data.data ?? response.data);

    setSuccess('Profile updated successfully.');
  } catch (error: any) {
    console.error(
      'Failed to update profile:',
      error.response?.data || error.message,
    );

    setError(
      error.response?.data?.message ||
        'Failed to update your profile',
    );
  } finally {
    setSaving(false);
  }
};

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#20243a]">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-[#777b91]">
          Manage your personal information and keep your profile
          up to date.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-[#e1e1ee] bg-white py-16 text-center">
          <p className="text-sm text-[#777b91]">
            Loading your profile...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Profile */}
      {!loading && user && (
        <div className="space-y-5">
          <ProfileHeader
            fullName={user.fullName}
            email={user.email}
            role={user.role}
          />

          <ProfileForm
            fullName={user.fullName}
            email={user.email}
            graduationYear={user.graduationYear}
            bio={user.bio}
            onSave={handleSave}
            saving={saving}
          />
        </div>
      )}
    </div>
  );
}
