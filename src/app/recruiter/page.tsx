'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

interface Job {
  id: number;
  title: string;
  company?: string;
  salary?: number;
  location?: string;
  description?: string;
  status?: string;
}

export default function RecruiterDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'my-jobs'>('dashboard');
  const [loading, setLoading] = useState<boolean>(false);

  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    salary: '',
    location: '',
  });

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editJob, setEditJob] = useState({
    id: 0,
    title: '',
    company: '',
    description: '',
    salary: '',
    location: '',
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [myJobsRes, allJobsRes] = await Promise.all([
        api.get('/job/my-jobs'),
        api.get('/job'),
      ]);

      setMyJobs(Array.isArray(myJobsRes.data) ? myJobsRes.data : []);
      setAllJobs(Array.isArray(allJobsRes.data) ? allJobsRes.data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyJobsOnly = async () => {
    setLoading(true);
    try {
      const res = await api.get('/job/my-jobs');
      setMyJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load my jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = async (id: number) => {
    try {
      const response = await api.get(`/job/${id}`);
      setSelectedJob(response.data);
      setShowViewModal(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get job details');
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        title: newJob.title,
        company: newJob.company,
        description: newJob.description,
        salary: Number(newJob.salary),
        location: newJob.location,
      };

      await api.post('/job', payload);
      setSuccess('Job posted successfully');
      setShowCreateModal(false);
      setNewJob({ title: '', company: '', description: '', salary: '', location: '' });
      fetchDashboardData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  const openEditModal = (job: Job) => {
    setEditJob({
      id: job.id,
      title: job.title || '',
      company: job.company || '',
      description: job.description || '',
      salary: job.salary ? String(job.salary) : '',
      location: job.location || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        title: editJob.title,
        company: editJob.company,
        description: editJob.description,
        salary: Number(editJob.salary),
        location: editJob.location,
      };

      await api.patch(`/job/${editJob.id}`, payload);
      setSuccess('Job updated successfully');
      setShowEditModal(false);
      fetchDashboardData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update job');
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/job/${id}`);
      setSuccess('Job deleted successfully');
      setMyJobs((prev) => prev.filter((j) => j.id !== id));
      setAllJobs((prev) => prev.filter((j) => j.id !== id));
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete job');
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    } else if (activeTab === 'my-jobs') {
      fetchMyJobsOnly();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fb] text-slate-800 antialiased font-sans">
      <aside className="flex w-64 h-full shrink-0 flex-col justify-between border-r border-slate-200/80 bg-[#f8faff] p-5">
        <div>
          <div className="px-3 pt-2 pb-6">
            <h2 className="text-base font-bold tracking-tight text-[#3b28c8] leading-none">Recruiter Portal</h2>
            <p className="mt-1 text-xs text-slate-500 font-normal">University Career Hub</p>
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
              onClick={() => setActiveTab('my-jobs')}
              className={`flex w-full items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'my-jobs'
                  ? 'bg-[#3b28c8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              <span>My Jobs</span>
            </button>
          </nav>
        </div>

        <div className="space-y-2 pt-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b28c8] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#3120ab] transition"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Post New Job</span>
          </button>

          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/50 transition"
          >
            <svg className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-red-600 transition" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-8 lg:p-10">
        <div className="flex items-center justify-between pb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 capitalize">
              {activeTab === 'dashboard' ? 'Recruiter Dashboard' : 'My Jobs'}
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-normal">
              Welcome back. Here&apos;s an overview of your recruitment activities.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#3b28c8] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#3120ab] transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Post New Job</span>
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
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-slate-200/70 border-l-4 border-l-[#3b28c8] bg-white py-6 px-4 text-center shadow-xs">
                    <p className="text-3xl font-extrabold tracking-tight text-[#3b28c8]">{myJobs.length}</p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-slate-600 uppercase">
                      TOTAL JOBS
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200/70 border-l-4 border-l-purple-600 bg-white py-6 px-4 text-center shadow-xs">
                    <p className="text-3xl font-extrabold tracking-tight text-purple-600">{allJobs.length}</p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-slate-600 uppercase">
                      ACTIVE JOBS
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200/70 border-l-4 border-l-blue-600 bg-white py-6 px-4 text-center shadow-xs">
                    <p className="text-3xl font-extrabold tracking-tight text-blue-600">0</p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-slate-600 uppercase">
                      TOTAL APPLICATIONS
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200/70 border-l-4 border-l-emerald-600 bg-white py-6 px-4 text-center shadow-xs">
                    <p className="text-3xl font-extrabold tracking-tight text-emerald-600">0</p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-slate-600 uppercase">
                      ACCEPTED
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between pb-3">
                    <h2 className="text-base font-bold tracking-tight text-slate-900">My Posted Jobs</h2>
                    <button
                      onClick={() => setActiveTab('my-jobs')}
                      className="text-xs font-semibold text-[#3b28c8] hover:underline"
                    >
                      View All &rarr;
                    </button>
                  </div>

                  {myJobs.length === 0 ? (
                    <div className="rounded-lg border border-slate-200/60 bg-white p-8 text-center text-sm font-medium text-slate-400 shadow-xs">
                      No jobs posted yet. Click &quot;+ Post New Job&quot; above to create one.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {myJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex flex-col justify-between rounded-lg border border-slate-200/70 bg-white p-4 shadow-xs transition hover:shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="font-semibold text-slate-600">Job #{job.id}</span>
                              {job.location && (
                                <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                  {job.location}
                                </span>
                              )}
                            </div>

                            <h3 className="mt-2 text-sm font-bold tracking-tight text-slate-900 line-clamp-1">
                              {job.title}
                            </h3>
                            <p className="text-xs font-normal text-slate-500">{job.company || 'N/A'}</p>

                            <p className="mt-2 text-xs font-normal text-slate-600 line-clamp-2 leading-relaxed">
                              {job.description || 'No description provided.'}
                            </p>

                            <p className="mt-3 text-sm font-bold text-[#3b28c8]">
                              {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
                            </p>
                          </div>

                          <div className="mt-3.5 flex items-center gap-2 border-t border-slate-100 pt-3">
                            <button
                              onClick={() => handleViewJob(job.id)}
                              className="flex-1 rounded-md bg-slate-100 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEditModal(job)}
                              className="flex-1 rounded-md bg-indigo-50/80 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between pb-3">
                    <h2 className="text-base font-bold tracking-tight text-slate-900">All Platform Jobs</h2>
                    <span className="text-xs font-medium text-slate-400">{allJobs.length} Available</span>
                  </div>

                  {allJobs.length === 0 ? (
                    <div className="rounded-lg border border-slate-200/60 bg-white p-8 text-center text-sm font-medium text-slate-400 shadow-xs">
                      No platform jobs found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {allJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex flex-col justify-between rounded-lg border border-slate-200/70 bg-white p-4 shadow-xs transition hover:shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="font-semibold text-slate-600">Job #{job.id}</span>
                              {job.location && (
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                  {job.location}
                                </span>
                              )}
                            </div>

                            <h3 className="mt-2 text-sm font-bold tracking-tight text-slate-900 line-clamp-1">
                              {job.title}
                            </h3>
                            <p className="text-xs font-normal text-slate-500">{job.company || 'N/A'}</p>

                            <p className="mt-2 text-xs font-normal text-slate-600 line-clamp-2 leading-relaxed">
                              {job.description || 'No description provided.'}
                            </p>

                            <p className="mt-3 text-sm font-bold text-[#3b28c8]">
                              {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
                            </p>
                          </div>

                          <div className="mt-3.5 border-t border-slate-100 pt-3">
                            <button
                              onClick={() => handleViewJob(job.id)}
                              className="w-full rounded-md bg-[#3b28c8] py-1.5 text-xs font-medium text-white hover:bg-[#3120ab] transition"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'my-jobs' && (
              <div>
                <h2 className="text-base font-bold tracking-tight text-slate-900 mb-3">My Posted Jobs</h2>

                {myJobs.length === 0 ? (
                  <div className="rounded-lg border border-slate-200/60 bg-white p-8 text-center text-sm font-medium text-slate-400 shadow-xs">
                    No jobs found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {myJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col justify-between rounded-lg border border-slate-200/70 bg-white p-4 shadow-xs transition hover:shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-semibold text-slate-600">Job #{job.id}</span>
                            {job.location && (
                              <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                {job.location}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-2 text-sm font-bold tracking-tight text-slate-900 line-clamp-1">
                            {job.title}
                          </h3>
                          <p className="text-xs font-normal text-slate-500">{job.company || 'N/A'}</p>

                          <p className="mt-2 text-xs font-normal text-slate-600 line-clamp-2 leading-relaxed">
                            {job.description || 'No description provided.'}
                          </p>

                          <p className="mt-3 text-sm font-bold text-[#3b28c8]">
                            {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
                          </p>
                        </div>

                        <div className="mt-3.5 flex items-center gap-2 border-t border-slate-100 pt-3">
                          <button
                            onClick={() => handleViewJob(job.id)}
                            className="flex-1 rounded-md bg-slate-100 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditModal(job)}
                            className="flex-1 rounded-md bg-indigo-50/80 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {showViewModal && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-lg border border-slate-200/70 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold tracking-tight text-slate-900">Job Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-sm font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</span>
                  <p className="font-bold tracking-tight text-slate-900">{selectedJob.title}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</span>
                  <p className="text-slate-700 font-medium">{selectedJob.company || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</span>
                  <p className="text-slate-700 font-medium">{selectedJob.location || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Salary</span>
                  <p className="text-slate-700 font-medium">{selectedJob.salary ? `$${selectedJob.salary}` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</span>
                  <p className="text-slate-600 mt-1 whitespace-pre-line bg-slate-50/80 p-3.5 rounded-lg border border-slate-100 text-xs leading-relaxed">
                    {selectedJob.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-lg border border-slate-200/70 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold tracking-tight text-slate-900">Post New Job</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-sm font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. Software Engineer"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3b28c8] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    placeholder="e.g. Google"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3b28c8] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="e.g. Dhaka"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3b28c8] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Salary ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    placeholder="e.g. 60000"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3b28c8] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="e.g. Develop scalable backend APIs."
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3b28c8] resize-none transition"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#3b28c8] px-5 py-2 text-xs font-semibold text-white hover:bg-[#3120ab] transition"
                  >
                    Submit Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-lg border border-slate-200/70 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold tracking-tight text-slate-900">Edit Job</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-sm font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateJob} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editJob.title}
                    onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3b28c8] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    value={editJob.company}
                    onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3b28c8] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editJob.location}
                    onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3b28c8] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Salary ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={editJob.salary}
                    onChange={(e) => setEditJob({ ...editJob, salary: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3b28c8] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={editJob.description}
                    onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3b28c8] resize-none transition"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#3b28c8] px-5 py-2 text-xs font-semibold text-white hover:bg-[#3120ab] transition"
                  >
                    Update Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}