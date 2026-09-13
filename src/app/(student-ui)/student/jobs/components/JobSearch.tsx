'use client';

import { Search } from 'lucide-react';

interface JobSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobSearch({
  value,
  onChange,
}: JobSearchProps) {
  return (
    <div className="relative w-full max-w-xl">
      <Search
        size={19}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777b91]"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search jobs by title..."
        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-[#20243a] shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4134d8] focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}
