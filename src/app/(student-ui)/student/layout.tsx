'use client'
import { BriefcaseBusiness, FileText, GraduationCap, LayoutDashboard, LogOut, Send, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import ProtectedRoute from '@/app/components/ProtectedRoute'

export      default function Layout({children}: {children: React.ReactNode}) {

    const router = useRouter();

    const isActive = (href: string) => 
    {
        const pathname = usePathname();
        if(href =='/student')
        {
            return pathname == href;
        }
        return pathname?.startsWith(href);
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        router.replace('/login');
    };
  return (
        <ProtectedRoute role="student">
        <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#f7f8fc] to-indigo-50/60 text-[#20243a]">

        <aside className='fixed left-0 top-0 h-screen w-[260px] bg-[#2f63d8] p-4 shadow-[8px_0_28px_-14px_rgba(30,64,175,0.45)]'>
            <div id="logo" className='border-b border-white/15 px-3 pb-6 pt-3'>
                <Link href="/student" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
                    <GraduationCap size={29}/>
                    UniCareer
                </Link>
            </div>

            <div className='flex items-center gap-3 px-3 pb-6 pt-5' id="profile">
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20'>
                    <UserRound size={20} />
                </div>

                <div >
                    <p className="text-sm font-semibold text-white">Student Portal</p>
                    <p className='text-xs text-blue-100/80'>University Career Hub</p>
                </div>
            </div>

            <nav id="navigation" className='px-0'>
                <ul className='space-y-2'>

                    <li>
                        <Link href="/student" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            isActive('/student')
                        ? 'rounded-lg bg-white text-[#2455c5] shadow-[0_5px_12px_-7px_rgba(15,23,42,0.45)]'
                            : 'rounded-lg text-blue-50/90 hover:bg-white/12 hover:text-white'
                        }`}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/student/jobs" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            isActive('/student/jobs')
                        ? 'rounded-lg bg-white text-[#2455c5] shadow-[0_5px_12px_-7px_rgba(15,23,42,0.45)]'
                            : 'rounded-lg text-blue-50/90 hover:bg-white/12 hover:text-white'
                        }`}>
                            <BriefcaseBusiness size={19} />
                            <span>Browse Jobs</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/student/applications" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            isActive('/student/applications')
                        ? 'rounded-lg bg-white text-[#2455c5] shadow-[0_5px_12px_-7px_rgba(15,23,42,0.45)]'
                            : 'rounded-lg text-blue-50/90 hover:bg-white/12 hover:text-white'
                        }`}>
                            <FileText size={19} />
                            <span>My Applications</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/student/resume" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            isActive('/student/resume')
                        ? 'rounded-lg bg-white text-[#2455c5] shadow-[0_5px_12px_-7px_rgba(15,23,42,0.45)]'
                            : 'rounded-lg text-blue-50/90 hover:bg-white/12 hover:text-white'
                        }`}>
                            <FileText size={19} />
                            <span>My Resume</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/student/profile" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            isActive('/student/profile')
                        ? 'rounded-lg bg-white text-[#2455c5] shadow-[0_5px_12px_-7px_rgba(15,23,42,0.45)]'
                            : 'rounded-lg text-blue-50/90 hover:bg-white/12 hover:text-white'
                        }`}>
                            <UserRound size={19} />
                            <span>Profile</span>
                        </Link>
                    </li>

                </ul>
            </nav>

            <div id="botton-secton" className='absolute bottom-0 left-0 w-full border-t border-white/15 px-4 pb-5 pt-5'>
                <Link href="/student/jobs" className='flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#2455c5] shadow-[0_6px_14px_-8px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-px hover:bg-blue-50 hover:shadow-lg'>
                    <Send size={16} />
                    Submit Application
                </Link>
                <div className='mt-4 pt-1'>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className='flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-blue-100/90 transition-all duration-200 hover:bg-white/12 hover:text-white'
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
                
            </div>

        </aside>

        <main className="ml-[260px] min-h-screen">
            <div className="max-w-[1500px] mx-auto px-10 py-8">
                {children}
            </div>
        </main>
    </div>
        </ProtectedRoute>
  )
}
