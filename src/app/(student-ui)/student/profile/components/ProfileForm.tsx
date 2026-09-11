'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

interface ProfileFormProps {
  fullName: string;
  email: string;
  graduationYear: number;
  bio: string;

  onSave: (data: {
    fullName: string;
    graduationYear: number;
    bio: string;
  }) => Promise<void>;

  saving: boolean;
}

export default function ProfileForm({
  fullName,
  email,
  graduationYear,
  bio,
  onSave,
  saving,
}: ProfileFormProps) {
  const [name, setName] = useState(fullName);
  const [year, setYear] = useState(
    graduationYear?.toString() || '',
  );
  const [bioText, setBioText] = useState(bio || '');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await onSave({
      fullName: name,
      graduationYear: Number(year),
      bio: bioText,
    });
  };

  return (
    <div className="rounded-xl border border-[#e1e1ee] bg-white p-7">
      {/* Header */}
      <div className="mb-6 border-b border-[#eeeeF5] pb-5">
        <h2 className="text-lg font-semibold text-[#20243a]">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-[#777b91]">
          Update your personal information and academic details.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-[#20243a]"
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-[#dedff0] bg-white px-4 py-3 text-sm text-[#20243a] outline-none transition placeholder:text-[#aaaec0] focus:border-[#4134d8]"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#20243a]"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-[#dedff0] bg-[#f6f6f9] px-4 py-3 text-sm text-[#777b91] outline-none"
            />

            <p className="mt-1.5 text-xs text-[#999daf]">
              Email address cannot be changed here.
            </p>
          </div>

          {/* Graduation Year */}
          <div>
            <label
              htmlFor="graduationYear"
              className="mb-2 block text-sm font-medium text-[#20243a]"
            >
              Graduation Year
            </label>

            <input
              id="graduationYear"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              min="2000"
              max="2100"
              className="w-full rounded-lg border border-[#dedff0] bg-white px-4 py-3 text-sm text-[#20243a] outline-none transition placeholder:text-[#aaaec0] focus:border-[#4134d8]"
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-[#20243a]"
            >
              Role
            </label>

            <input
              id="role"
              type="text"
              value="STUDENT"
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-[#dedff0] bg-[#f6f6f9] px-4 py-3 text-sm font-medium text-[#777b91] outline-none"
            />

            <p className="mt-1.5 text-xs text-[#999daf]">
              Your account role cannot be changed.
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-5">
          <label
            htmlFor="bio"
            className="mb-2 block text-sm font-medium text-[#20243a]"
          >
            Bio
          </label>

          <textarea
            id="bio"
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            placeholder="Tell recruiters a little about yourself..."
            rows={5}
            className="w-full resize-none rounded-lg border border-[#dedff0] bg-white px-4 py-3 text-sm leading-6 text-[#20243a] outline-none transition placeholder:text-[#aaaec0] focus:border-[#4134d8]"
          />

          <p className="mt-1.5 text-xs text-[#999daf]">
            Write a short description about your skills, interests,
            and career goals.
          </p>
        </div>

        {/* Save */}
        <div className="mt-7 flex justify-end border-t border-[#eeeeF5] pt-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#4134d8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3529bd] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />

            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}