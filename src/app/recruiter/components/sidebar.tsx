'use client';

interface SidebarProps {
  activeTab: 'dashboard' | 'my-jobs';
  setActiveTab: (tab: 'dashboard' | 'my-jobs') => void;
  onPostJob: () => void;
  onLogout: () => void;
  loggingOut: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, onPostJob, onLogout, loggingOut }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col justify-between bg-[#2f63d8] p-4 shadow-[8px_0_28px_-14px_rgba(30,64,175,0.45)]">
      <div>
        <div className="border-b border-white/15 px-3 pb-6 pt-3">
          <h2 className="text-base font-bold leading-none tracking-tight text-white">Recruiter Portal</h2>
          <p className="mt-1.5 text-xs font-medium text-blue-100/80">University Career Hub</p>
        </div>

        <nav className="mt-5 space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#2455c5] shadow-[0_5px_12px_-7px_rgba(15,23,42,0.45)]'
                : 'text-blue-50/90 hover:bg-white/12 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
            </svg>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('my-jobs')}
            className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === 'my-jobs'
                ? 'bg-white text-[#2455c5] shadow-[0_5px_12px_-7px_rgba(15,23,42,0.45)]'
                : 'text-blue-50/90 hover:bg-white/12 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <span>My Jobs</span>
          </button>
        </nav>
      </div>

      <div className="space-y-2 border-t border-white/15 pt-5">
        <button
          onClick={onPostJob}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-[#2455c5] shadow-[0_6px_14px_-8px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-px hover:bg-blue-50 hover:shadow-lg active:translate-y-0"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Post New Job</span>
        </button>

        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="group flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-blue-100/90 transition-all duration-200 hover:bg-white/12 hover:text-white"
        >
          <svg className="w-5 h-5 shrink-0 text-blue-200 transition group-hover:text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}
