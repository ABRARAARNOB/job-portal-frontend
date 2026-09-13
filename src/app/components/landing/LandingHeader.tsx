import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function LandingHeader() {
  return (
    <header className="border-b border-[#e1e1ef] bg-white">
      <div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-8">
        
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-[#4134d8]"
        >
          <GraduationCap size={24} />
          <span>UniCareer</span>
        </Link>

        <nav className="flex items-center gap-10">
          <Link
            href="/"
            className="border-b-2 border-[#5145e5] pb-2 text-sm font-semibold text-[#4134d8]"
          >
            Home
          </Link>

        </nav>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-[#4134d8] transition hover:text-[#3026b8]"
          >
            Login
          </Link>

          <Link
            href="/registration"
            className="rounded-md bg-[#4134d8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3529bd]"
          >
            Register
          </Link>
        </div>

      </div>
    </header>
  );
}