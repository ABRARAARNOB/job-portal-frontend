import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="border-b border-[#dedff0] bg-[#f2f3ff]">
      <div className="mx-auto flex min-h-[285px] max-w-[900px] flex-col items-center justify-center px-6 text-center">
        
        <h1 className="text-3xl font-bold tracking-tight text-[#20243a]">
          Find Your Next Opportunity
        </h1>

        <p className="mt-3 max-w-[650px] text-sm leading-6 text-[#555a72]">
          Connect with top employers seeking university talent. Build your
          career path with tailored job matches.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-[#4134d8] px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3529bd]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-md bg-[#4134d8] px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3529bd]"
          >
            Register
          </Link>
        </div>

      </div>
    </section>
  );
}