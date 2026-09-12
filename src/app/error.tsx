'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7ff] px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4134d8]">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">We could not load this page</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Please try again or return to the login page.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={() => reset()} className="rounded-lg bg-gradient-to-r from-[#4134d8] to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#3529bd] hover:to-indigo-700">
            Try again
          </button>
          <a href="/login" className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Login
          </a>
        </div>
      </section>
    </main>
  );
}