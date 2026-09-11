'use client'
import { BriefcaseBusiness, FileText, GraduationCap, LayoutDashboard, LogOut, Send, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export      default function Layout({children}: {children: React.ReactNode}) {

    const isActive = (href: string) => 
    {
        const pathname = usePathname();
        if(href =='/student')
        {
            return pathname == href;
        }
        return pathname?.startsWith(href);
    }
  return (
    <div className=" bg-[#f7f7ff] text-[#20243a] min-h-screen">

        <aside className='fixed left-0 top-0 h-screen w-[260px] border-r border-[#dedff0] bg-[#f1f2ff]'>
            <div id="logo" className='px-6 py-7'>
                <Link href="/student" className="text-xl font-bold tracking-tight text-[#4134d8] flex items-center gap-2">
                    <GraduationCap size={29}/>
                    UniCareer
                </Link>
            </div>

            <div className='flex items-center gap-3 px-7 pb-8' id="profile">
                <div className='h-10 w-10 rounded-full bg-[#d9d8ff] text-[#4134d8] flex items-center justify-center'>
                    <UserRound size={20} />
                </div>

                <div >
                    <p className="font-semibold text-sm text-[#292d43]">Student Portal</p>
                    <p className='text-xs text-[#777b91]'>University Career Hub</p>
                </div>
            </div>

            <nav id="navigation" className='px-4'>
                <ul className='space-y-2'>

                    <li>
                        <Link href="/student" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                            isActive('/student')
                            ? 'bg-[#5145e5] text-white'
                            : 'text-[#555a72] hover:bg-white hover:text-[#4134d8]'
                        }`}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/student/jobs" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                            isActive('/student/jobs')
                            ? 'bg-[#5145e5] text-white'
                            : 'text-[#555a72] hover:bg-white hover:text-[#4134d8]'
                        }`}>
                            <BriefcaseBusiness size={19} />
                            <span>Browse Jobs</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/student/applications" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                            isActive('/student/applications')
                            ? 'bg-[#5145e5] text-white'
                            : 'text-[#555a72] hover:bg-white hover:text-[#4134d8]'
                        }`}>
                            <FileText size={19} />
                            <span>My Applications</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/student/resume" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                            isActive('/student/resume')
                            ? 'bg-[#5145e5] text-white'
                            : 'text-[#555a72] hover:bg-white hover:text-[#4134d8]'
                        }`}>
                            <FileText size={19} />
                            <span>My Resume</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/student/profile" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                            isActive('/student/profile')
                            ? 'bg-[#5145e5] text-white'
                            : 'text-[#555a72] hover:bg-white hover:text-[#4134d8]'
                        }`}>
                            <UserRound size={19} />
                            <span>Profile</span>
                        </Link>
                    </li>

                </ul>
            </nav>

            <div id="botton-secton" className='bottom-0 absolute left-0 w-full px-5 pb-5'>
                <Link href="/student/jobs" className='flex items-center gap-2 rounded-lg bg-[#4134d8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3529bd]'>
                    <Send size={16} />
                    Submit Application
                </Link>
                <div className='mt-6 border-t border-[#d8d9eb] pt-4'>
                    <button className='flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#65697d] transition hover:bg-white hover:text-[#4134d8]'>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
                
            </div>

        </aside>

        <main className="ml-[260px] min-h-screen border-2 border-amber-50">
            <div className="border-2 border-amber-700 max-w-[1500px] mx-auto px-10 py-8 ">
                {children}
            </div>
        </main>
    </div>
  )
}
