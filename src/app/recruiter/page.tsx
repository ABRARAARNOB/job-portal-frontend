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
    <div className="flex h-screen overflow-hidden bg-[#f3f5fa] text-gray-800">
      <aside className="flex w-64 h-full shrink-0 flex-col justify-between border-r border-gray-100 bg-white p-5 shadow-sm">
        <div>
          <div className="px-2 py-3">
            <h2 className="text-base font-bold text-indigo-700">Recruiter Portal</h2>
            <p className="text-xs text-gray-400">UniCareer</p>
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
              onClick={() => setActiveTab('my-jobs')}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition ${
                activeTab === 'my-jobs'
                  ? 'bg-[#3b28c8] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              My Jobs
            </button>
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-100">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full rounded-xl bg-[#2f27ce] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#251eb0]"
          >
            + Post New Job
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
              {activeTab === 'dashboard' ? 'Recruiter Dashboard' : 'My Jobs'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back. Here&apos;s an overview of your recruitment activities.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-xl bg-[#2f27ce] px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#251eb0]"
          >
            + Post New Job
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
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border-l-4 border-indigo-600 bg-white p-5 text-center shadow-sm">
                    <p className="text-3xl font-extrabold text-indigo-700">{myJobs.length}</p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      MY POSTED JOBS
                    </p>
                  </div>

                  <div className="rounded-2xl border-l-4 border-purple-500 bg-white p-5 text-center shadow-sm">
                    <p className="text-3xl font-extrabold text-purple-600">{allJobs.length}</p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      TOTAL PLATFORM JOBS
                    </p>
                  </div>

                  <div className="rounded-2xl border-l-4 border-blue-500 bg-white p-5 text-center shadow-sm">
                    <p className="text-3xl font-extrabold text-blue-600">0</p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      APPLICATIONS
                    </p>
                  </div>

                  <div className="rounded-2xl border-l-4 border-green-500 bg-white p-5 text-center shadow-sm">
                    <p className="text-3xl font-extrabold text-green-600">0</p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      ACCEPTED
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between pb-4">
                    <h2 className="text-lg font-bold text-gray-900">My Posted Jobs</h2>
                    <button
                      onClick={() => setActiveTab('my-jobs')}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {myJobs.length === 0 ? (
                    <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                      No jobs posted yet. Click &quot;+ Post New Job&quot; above to create one.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {myJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span className="font-semibold text-gray-600">Job #{job.id}</span>
                              <span className="rounded bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                                {job.location}
                              </span>
                            </div>

                            <h3 className="mt-2 text-base font-bold text-gray-900 line-clamp-1">
                              {job.title}
                            </h3>
                            <p className="text-xs font-medium text-gray-500">{job.company || 'N/A'}</p>

                            <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                              {job.description || 'No description provided.'}
                            </p>

                            <p className="mt-3 text-sm font-extrabold text-indigo-600">
                              {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                            <button
                              onClick={() => handleViewJob(job.id)}
                              className="flex-1 rounded-lg bg-gray-100 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEditModal(job)}
                              className="flex-1 rounded-lg bg-indigo-50 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
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
                  <div className="flex items-center justify-between pb-4">
                    <h2 className="text-lg font-bold text-gray-900">All Platform Jobs</h2>
                    <span className="text-xs font-semibold text-gray-400">{allJobs.length} Available</span>
                  </div>

                  {allJobs.length === 0 ? (
                    <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                      No platform jobs found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {allJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span className="font-semibold text-gray-600">Job #{job.id}</span>
                              <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                                {job.location}
                              </span>
                            </div>

                            <h3 className="mt-2 text-base font-bold text-gray-900 line-clamp-1">
                              {job.title}
                            </h3>
                            <p className="text-xs font-medium text-gray-500">{job.company || 'N/A'}</p>

                            <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                              {job.description || 'No description provided.'}
                            </p>

                            <p className="mt-3 text-sm font-extrabold text-indigo-600">
                              {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
                            </p>
                          </div>

                          <div className="mt-4 border-t border-gray-100 pt-3">
                            <button
                              onClick={() => handleViewJob(job.id)}
                              className="w-full rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
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
                <h2 className="text-lg font-bold text-gray-900 mb-4">My Posted Jobs</h2>

                {myJobs.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                    No jobs found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {myJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="font-semibold text-gray-600">Job #{job.id}</span>
                            <span className="rounded bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                              {job.location}
                            </span>
                          </div>

                          <h3 className="mt-2 text-base font-bold text-gray-900 line-clamp-1">
                            {job.title}
                          </h3>
                          <p className="text-xs font-medium text-gray-500">{job.company || 'N/A'}</p>

                          <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                            {job.description || 'No description provided.'}
                          </p>

                          <p className="mt-3 text-sm font-extrabold text-indigo-600">
                            {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                          <button
                            onClick={() => handleViewJob(job.id)}
                            className="flex-1 rounded-lg bg-gray-100 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditModal(job)}
                            className="flex-1 rounded-lg bg-indigo-50 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Job Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-sm font-bold text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Title</span>
                  <p className="font-semibold text-gray-900">{selectedJob.title}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Company</span>
                  <p className="text-gray-800">{selectedJob.company || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Location</span>
                  <p className="text-gray-800">{selectedJob.location || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Salary</span>
                  <p className="text-gray-800">{selectedJob.salary ? `$${selectedJob.salary}` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Description</span>
                  <p className="text-gray-800 mt-1 whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {selectedJob.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Post New Job</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-sm font-bold text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. Software Engineer"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    placeholder="e.g. Google"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="e.g. Dhaka"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Salary ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    placeholder="e.g. 60000"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="e.g. Develop scalable backend APIs."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-600 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#2f27ce] px-4 py-2 text-xs font-semibold text-white hover:bg-[#251eb0]"
                  >
                    Submit Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Edit Job</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-sm font-bold text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateJob} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editJob.title}
                    onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    value={editJob.company}
                    onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editJob.location}
                    onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Salary ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={editJob.salary}
                    onChange={(e) => setEditJob({ ...editJob, salary: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={editJob.description}
                    onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-600 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#2f27ce] px-4 py-2 text-xs font-semibold text-white hover:bg-[#251eb0]"
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