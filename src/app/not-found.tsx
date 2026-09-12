import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7ff] px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <p className="text-5xl font-black text-[#4134d8]">404</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">The address does not match an available page.</p>
        <Link href="/login" className="mt-6 inline-flex rounded-lg bg-gradient-to-r from-[#4134d8] to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#3529bd] hover:to-indigo-700">
          Back to login
        </Link>
      </section>
    </main>
  );
}