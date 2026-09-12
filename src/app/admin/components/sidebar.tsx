'use client';

interface SidebarProps {
  activeTab: 'dashboard' | 'users' | 'jobs' | 'applications';
  setActiveTab: (tab: 'dashboard' | 'users' | 'jobs' | 'applications') => void;
  onNewAdmin: () => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onNewAdmin, onLogout }: SidebarProps) {
  return (
    <aside className="flex w-64 h-full shrink-0 flex-col justify-between border-r border-slate-200/80 bg-[#f8faff] p-5">
      <div>
        <div className="px-3 pt-2 pb-6">
          <h2 className="text-base font-bold tracking-tight text-[#3b28c8] leading-none">Admin Portal</h2>
          <p className="mt-1 text-xs text-slate-500 font-normal">UniCareer HQ</p>
        </div>

        <nav className="space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex w-full items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#3b28c8] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
            </svg>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex w-full items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[#3b28c8] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <span>Users</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex w-full items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'jobs'
                ? 'bg-[#3b28c8] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v1.081m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <span>Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`flex w-full items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'applications'
                ? 'bg-[#3b28c8] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span>Applications</span>
          </button>
        </nav>
      </div>

      <div className="space-y-2 pt-4">
        <button
          onClick={onNewAdmin}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b28c8] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#3120ab] transition"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>+ New Admin</span>
        </button>

        <button
          onClick={onLogout}
          className="group flex w-full items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/50 transition"
        >
          <svg className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-red-600 transition" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}