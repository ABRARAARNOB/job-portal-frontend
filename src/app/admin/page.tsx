'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

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
    <div className="flex h-screen overflow-hidden bg-[#f3f5fa] text-gray-800">
      <aside className="flex w-64 h-full shrink-0 flex-col justify-between border-r border-gray-100 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f27ce] text-base font-bold text-white shadow-sm">
              A
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Admin Portal</h2>
              <p className="text-xs text-gray-400">UniCareer HQ</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-[#3b28c8] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition ${
                activeTab === 'users'
                  ? 'bg-[#3b28c8] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Users
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition ${
                activeTab === 'jobs'
                  ? 'bg-[#3b28c8] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Jobs
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition ${
                activeTab === 'applications'
                  ? 'bg-[#3b28c8] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Applications
            </button>
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-100">
          <button
            onClick={() => router.push('/registration')}
            className="w-full rounded-xl bg-[#2f27ce] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#251eb0]"
          >
            + New Admin
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-8">
        <div className="flex items-center justify-between pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {activeTab} Overview
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, Admin. Platform overview.
            </p>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'dashboard') fetchDashboard();
              if (activeTab === 'users') fetchUsers();
              if (activeTab === 'jobs') fetchJobs();
              if (activeTab === 'applications') fetchApplications();
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl bg-white shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-sm font-extrabold text-gray-800">Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border-l-4 border-indigo-600 bg-white p-5 shadow-sm">
                    <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                      TOTAL USERS
                    </span>
                    <p className="mt-3 text-3xl font-extrabold text-gray-900">
                      {metrics.totalUsers}
                    </p>
                  </div>

                  <div className="rounded-2xl border-l-4 border-purple-500 bg-white p-5 shadow-sm">
                    <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                      STUDENTS
                    </span>
                    <p className="mt-3 text-3xl font-extrabold text-gray-900">
                      {metrics.students}
                    </p>
                  </div>

                  <div className="rounded-2xl border-l-4 border-slate-700 bg-white p-5 shadow-sm">
                    <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                      RECRUITERS
                    </span>
                    <p className="mt-3 text-3xl font-extrabold text-gray-900">
                      {metrics.recruiters}
                    </p>
                  </div>

                  <div className="rounded-2xl border-l-4 border-indigo-400 bg-white p-5 shadow-sm">
                    <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                      TOTAL JOBS
                    </span>
                    <p className="mt-3 text-3xl font-extrabold text-gray-900">
                      {metrics.totalJobs}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900">Platform Overview Chart</h2>
                  <p className="text-xs text-gray-500 mt-1">Comparison of total users, roles, and posted jobs</p>

                  <div className="mt-8 flex h-64 items-end justify-around border-b border-gray-200 pb-2 px-6">
                    <div className="flex flex-col items-center w-24">
                      <span className="mb-2 text-sm font-bold text-indigo-700">{metrics.totalUsers}</span>
                      <div className="w-16 rounded-t-lg bg-gray-100 h-44 flex items-end">
                        <div
                          style={{ height: `${Math.round((metrics.totalUsers / maxMetric) * 100)}%` }}
                          className="w-full rounded-t-lg bg-indigo-600"
                        />
                      </div>
                      <span className="mt-3 text-xs font-semibold text-gray-600 text-center">Total Users</span>
                    </div>

                    <div className="flex flex-col items-center w-24">
                      <span className="mb-2 text-sm font-bold text-purple-700">{metrics.students}</span>
                      <div className="w-16 rounded-t-lg bg-gray-100 h-44 flex items-end">
                        <div
                          style={{ height: `${Math.round((metrics.students / maxMetric) * 100)}%` }}
                          className="w-full rounded-t-lg bg-purple-500"
                        />
                      </div>
                      <span className="mt-3 text-xs font-semibold text-gray-600 text-center">Students</span>
                    </div>

                    <div className="flex flex-col items-center w-24">
                      <span className="mb-2 text-sm font-bold text-slate-800">{metrics.recruiters}</span>
                      <div className="w-16 rounded-t-lg bg-gray-100 h-44 flex items-end">
                        <div
                          style={{ height: `${Math.round((metrics.recruiters / maxMetric) * 100)}%` }}
                          className="w-full rounded-t-lg bg-slate-700"
                        />
                      </div>
                      <span className="mt-3 text-xs font-semibold text-gray-600 text-center">Recruiters</span>
                    </div>

                    <div className="flex flex-col items-center w-24">
                      <span className="mb-2 text-sm font-bold text-blue-600">{metrics.totalJobs}</span>
                      <div className="w-16 rounded-t-lg bg-gray-100 h-44 flex items-end">
                        <div
                          style={{ height: `${Math.round((metrics.totalJobs / maxMetric) * 100)}%` }}
                          className="w-full rounded-t-lg bg-blue-500"
                        />
                      </div>
                      <span className="mt-3 text-xs font-semibold text-gray-600 text-center">Total Jobs</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between pb-4">
                  <h2 className="text-lg font-bold text-gray-900">Platform Users ({users.length})</h2>
                </div>

                {users.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                    No users found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="font-semibold text-gray-600">User #{user.id}</span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700'
                                  : user.role === 'recruiter'
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-gray-900 line-clamp-1">{user.fullName}</h3>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex justify-end border-t border-gray-100 pt-3">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
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
                <div className="flex items-center justify-between pb-4">
                  <h2 className="text-lg font-bold text-gray-900">Platform Jobs ({jobs.length})</h2>
                </div>

                {jobs.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                    No jobs found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="font-semibold text-gray-600">Job #{job.id}</span>
                            {job.location && (
                              <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                                {job.location}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-2 text-base font-bold text-gray-900 line-clamp-1">{job.title}</h3>
                          <p className="text-xs font-medium text-gray-500">{job.company || 'N/A'}</p>

                          {job.description && (
                            <p className="mt-2 text-xs text-gray-600 line-clamp-2">{job.description}</p>
                          )}

                          <p className="mt-3 text-sm font-extrabold text-indigo-600">
                            {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
                          </p>
                        </div>

                        <div className="mt-4 flex justify-end border-t border-gray-100 pt-3">
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                          >
                            Delete Job
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <div className="flex items-center justify-between pb-4">
                  <h2 className="text-lg font-bold text-gray-900">Applications ({applications.length})</h2>
                </div>

                {applications.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                    No applications found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="font-semibold text-gray-600">Application #{app.id}</span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                app.status?.toLowerCase() === 'accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : app.status?.toLowerCase() === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>

                          <div className="mt-3 space-y-1">
                            <p className="text-xs text-gray-500">
                              Job ID: <span className="font-bold text-gray-800">#{app.jobId}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Applicant User ID: <span className="font-bold text-gray-800">#{app.userId}</span>
                            </p>
                          </div>
                        </div>
                      </div>
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