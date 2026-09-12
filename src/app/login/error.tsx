'use client';

export default function LoginError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Login page error</h1>
        <p className="mt-2 text-sm text-slate-500">The login page could not load.</p>
        <button onClick={reset} className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Try again
        </button>
      </div>
    </main>
  );
}