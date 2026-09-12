'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

import Sidebar from './components/sidebar';
import JobCard from './components/jobcard';
import ApplicationCard from './components/applicationcard';

interface DashboardMetrics {
  totalUsers: number;
  students: number;
  recruiters: number;
  totalJobs: number;
}
interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}
interface Job {
  id: number;
  title: string;
  company: string;
  salary: number;
  location?: string;
  description?: string;
}
interface Application {
  id: number;
  jobId: number;
  userId: number;
  status: string;
}
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'jobs' | 'applications'>('dashboard');
  const [loading, setLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    students: 0,
    recruiters: 0,
    totalJobs: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const userRes = await api.get('/admin/users');
      const jobRes = await api.get('/admin/jobs');
      const allUsers = userRes.data;
      setMetrics({
        totalUsers: allUsers.length,
        students: allUsers.filter((u: any) => u.role === 'student').length,
        recruiters: allUsers.filter((u: any) => u.role === 'recruiter').length,
        totalJobs: jobRes.data.length,
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to get users');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setSuccess('User deleted successfully');
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setTimeout(() => setSuccess(''), 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete user');
    }
  };
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/jobs');
      setJobs(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to get jobs');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteJob = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setSuccess('Job deleted successfully');
      setJobs((prev) => prev.filter((j) => j.id !== id));
      setTimeout(() => setSuccess(''), 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete job');
    }
  };
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/applications');
      setApplications(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to get applications');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setError('');
    setSuccess('');
    if (activeTab === 'dashboard') {
      fetchDashboard();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'jobs') {
      fetchJobs();
    } else if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };
  const maxMetric = Math.max(metrics.totalUsers, metrics.students, metrics.recruiters, metrics.totalJobs, 1);
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fb] text-slate-800 antialiased font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewAdmin={() => router.push('/registration')}
        onLogout={handleLogout}
      />
      <main className="flex-1 h-full overflow-y-auto p-8 lg:p-10">
        <div className="flex items-center justify-between pb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 capitalize">
              {activeTab} Overview
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-normal">
              Welcome back, Admin. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <button
            onClick={() => {
              if (activeTab === 'dashboard') fetchDashboard();
              if (activeTab === 'users') fetchUsers();
              if (activeTab === 'jobs') fetchJobs();
              if (activeTab === 'applications') fetchApplications();
            }}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            Refresh
          </button>
        </div>
        {success && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50/80 p-3.5 text-sm font-medium text-emerald-800 shadow-xs">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50/80 p-3.5 text-sm font-medium text-red-800 shadow-xs">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-lg border border-slate-100 bg-white shadow-xs">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3b28c8] border-t-transparent" />
            <p className="text-xs font-semibold text-slate-700">Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-slate-200/70 border-l-4 border-l-[#3b28c8] bg-white py-6 px-4 text-center shadow-xs">
                    <p className="text-3xl font-extrabold tracking-tight text-[#3b28c8]">
                      {metrics.totalUsers.toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-slate-600 uppercase">
                      TOTAL USERS
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200/70 border-l-4 border-l-purple-600 bg-white py-6 px-4 text-center shadow-xs">
                    <p className="text-3xl font-extrabold tracking-tight text-purple-600">
                      {metrics.students.toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-slate-600 uppercase">
                      STUDENTS
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200/70 border-l-4 border-l-blue-600 bg-white py-6 px-4 text-center shadow-xs">
                    <p className="text-3xl font-extrabold tracking-tight text-blue-600">
                      {metrics.recruiters.toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-slate-600 uppercase">
                      RECRUITERS
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200/70 border-l-4 border-l-emerald-600 bg-white py-6 px-4 text-center shadow-xs">
                    <p className="text-3xl font-extrabold tracking-tight text-emerald-600">
                      {metrics.totalJobs.toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-slate-600 uppercase">
                      TOTAL JOBS
                    </p>
                  </div>
                </div>
                <div className="mt-8 rounded-lg border border-slate-200/70 bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold tracking-tight text-slate-900">Platform Overview Chart</h2>
                  <p className="text-xs font-normal text-slate-400 mt-1">Comparison of total users, roles, and posted jobs</p>
                  <div className="mt-8 flex h-64 items-end justify-around border-b border-slate-100 pb-3 px-6">
                    <div className="flex flex-col items-center w-24">
                      <span className="mb-2 text-sm font-bold text-[#3b28c8]">{metrics.totalUsers}</span>
                      <div className="w-16 rounded-t-lg bg-slate-50 h-44 flex items-end">
                        <div
                          style={{ height: `${Math.round((metrics.totalUsers / maxMetric) * 100)}%` }}
                          className="w-full rounded-t-lg bg-[#3b28c8] transition-all duration-500"
                        />
                      </div>
                      <span className="mt-3 text-xs font-medium text-slate-600 text-center">Total Users</span>
                    </div>
                    <div className="flex flex-col items-center w-24">
                      <span className="mb-2 text-sm font-bold text-purple-700">{metrics.students}</span>
                      <div className="w-16 rounded-t-lg bg-slate-50 h-44 flex items-end">
                        <div
                          style={{ height: `${Math.round((metrics.students / maxMetric) * 100)}%` }}
                          className="w-full rounded-t-lg bg-purple-500 transition-all duration-500"
                        />
                      </div>
                      <span className="mt-3 text-xs font-medium text-slate-600 text-center">Students</span>
                    </div>
                    <div className="flex flex-col items-center w-24">
                      <span className="mb-2 text-sm font-bold text-blue-700">{metrics.recruiters}</span>
                      <div className="w-16 rounded-t-lg bg-slate-50 h-44 flex items-end">
                        <div
                          style={{ height: `${Math.round((metrics.recruiters / maxMetric) * 100)}%` }}
                          className="w-full rounded-t-lg bg-blue-500 transition-all duration-500"
                        />
                      </div>
                      <span className="mt-3 text-xs font-medium text-slate-600 text-center">Recruiters</span>
                    </div>
                    <div className="flex flex-col items-center w-24">
                      <span className="mb-2 text-sm font-bold text-emerald-600">{metrics.totalJobs}</span>
                      <div className="w-16 rounded-t-lg bg-slate-50 h-44 flex items-end">
                        <div
                          style={{ height: `${Math.round((metrics.totalJobs / maxMetric) * 100)}%` }}
                          className="w-full rounded-t-lg bg-emerald-500 transition-all duration-500"
                        />
                      </div>
                      <span className="mt-3 text-xs font-medium text-slate-600 text-center">Total Jobs</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between pb-5">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">Platform Users ({users.length})</h2>
                </div>
                {users.length === 0 ? (
                  <div className="rounded-lg border border-slate-200/70 bg-white p-12 text-center text-sm font-medium text-slate-400 shadow-xs">
                    No users found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col justify-between rounded-lg border border-slate-200/70 bg-white p-4 shadow-xs transition hover:shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-semibold text-slate-600">User #{user.id}</span>
                            <span
                              className={`rounded px-2.5 py-0.5 text-xs font-semibold uppercase ${
                                user.role === 'admin'
                                  ? 'bg-purple-50 text-purple-700'
                                  : user.role === 'recruiter'
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold tracking-tight text-slate-900 truncate">{user.fullName}</h3>
                              <p className="text-xs font-normal text-slate-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3.5 flex justify-end border-t border-slate-100 pt-3">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                          >
                            Delete User
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex items-center justify-between pb-5">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">Platform Jobs ({jobs.length})</h2>
                </div>
                {jobs.length === 0 ? (
                  <div className="rounded-lg border border-slate-200/70 bg-white p-12 text-center text-sm font-medium text-slate-400 shadow-xs">
                    No jobs found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} onDelete={handleDeleteJob} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'applications' && (
              <div>
                <div className="flex items-center justify-between pb-5">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">Applications ({applications.length})</h2>
                </div>
                {applications.length === 0 ? (
                  <div className="rounded-lg border border-slate-200/70 bg-white p-12 text-center text-sm font-medium text-slate-400 shadow-xs">
                    No applications found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {applications.map((app) => (
                      <ApplicationCard key={app.id} app={app} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}