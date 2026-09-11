import { User } from 'lucide-react';

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  role: string;
}

export default function ProfileHeader({
  fullName,
  email,
  role,
}: ProfileHeaderProps) {
  return (
    <div className="rounded-xl border border-[#e1e1ee] bg-white p-7">
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eeedff] text-[#4134d8]">
          <User size={34} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#20243a]">
            {fullName || 'Student'}
          </h2>

          <p className="mt-1 text-sm text-[#777b91]">
            {email}
          </p>

          <span className="mt-3 inline-block rounded-full bg-[#eeedff] px-3 py-1 text-xs font-semibold text-[#4134d8]">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}