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
      const userRes = await api.get('https://job-portal-backend-1-yib6.onrender.com/admin/users');
      const jobRes = await api.get('https://job-portal-backend-1-yib6.onrender.com/admin/jobs');

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
      const response = await api.get('https://job-portal-backend-1-yib6.onrender.com/admin/users');
      console.log('Users response:', response.data);
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
      await api.delete(`https://job-portal-backend-1-yib6.onrender.com/admin/users/${id}`);
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
      const response = await api.get('https://job-portal-backend-1-yib6.onrender.com/admin/jobs');
      console.log('Jobs response:', response.data);
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
      await api.delete(`https://job-portal-backend-1-yib6.onrender.com/admin/jobs/${id}`);
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
      const response = await api.get('https://job-portal-backend-1-yib6.onrender.com/admin/applications');
      console.log('Applications response:', response.data);
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
    <div className="flex min-h-screen bg-[#f3f5fa] text-gray-800">
      <aside className="flex w-64 flex-col justify-between border-r border-gray-100 bg-white p-5 shadow-sm">
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

      <main className="flex-1 p-8 overflow-y-auto">
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
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Manage Users</h2>
                {users.length === 0 ? (
                  <p className="text-sm text-gray-500">No users found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-700">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-mono">{user.id}</td>
                            <td className="p-3 font-medium text-gray-900">{user.fullName}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">
                              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 uppercase">
                                {user.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Manage Jobs</h2>
                {jobs.length === 0 ? (
                  <p className="text-sm text-gray-500">No jobs found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-700">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Title</th>
                          <th className="p-3">Company</th>
                          <th className="p-3">Salary</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job) => (
                          <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-mono">{job.id}</td>
                            <td className="p-3 font-medium text-gray-900">{job.title}</td>
                            <td className="p-3">{job.company}</td>
                            <td className="p-3">${job.salary}</td>
                            <td className="p-3">
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Job Applications</h2>
                {applications.length === 0 ? (
                  <p className="text-sm text-gray-500">No applications found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-700">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Job ID</th>
                          <th className="p-3">User ID</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => (
                          <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-mono">{app.id}</td>
                            <td className="p-3">{app.jobId}</td>
                            <td className="p-3">{app.userId}</td>
                            <td className="p-3">
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 uppercase">
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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