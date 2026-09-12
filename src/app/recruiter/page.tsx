'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

import Sidebar from './components/sidebar';
import JobCard from './components/jobcard';
import ProtectedRoute from '@/app/components/ProtectedRoute';

interface Job {
  id: number;
  title: string;
  company?: string;
  salary?: number;
  location?: string;
  description?: string;
  status?: string;
}

interface Application {
  id: number;
  status?: string;
  appliedAt?: string;
  studentId?: number;
  userId?: number;
  student?: Record<string, unknown>;
  user?: Record<string, unknown>;
  applicant?: Record<string, unknown>;
  resume?: {
    fileName?: string;
    filePath?: string;
  } | null;
}

type ApplicantData = Record<string, unknown> & {
  id?: number;
  userId?: number;
  user?: {
    id?: number;
  };
};

const applicationStatuses = [
  { value: 'pending', label: 'Pending', className: 'amber' },
  { value: 'interview', label: 'Interview', className: 'indigo' },
  { value: 'accepted', label: 'Accepted', className: 'emerald' },
  { value: 'rejected', label: 'Rejected', className: 'red' },
];

export default function RecruiterDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'my-jobs'>('dashboard');
  const [loading, setLoading] = useState<boolean>(false);

  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedApplicants, setSelectedApplicants] = useState<Application[]>([]);
  const [selectedApplicantsJob, setSelectedApplicantsJob] = useState<Job | null>(null);
  const [showApplicantsModal, setShowApplicantsModal] = useState<boolean>(false);
  const [applicantsLoading, setApplicantsLoading] = useState<boolean>(false);
  const [updatingApplicationId, setUpdatingApplicationId] = useState<number | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<Record<number, string>>({});

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

  const handleViewApplicants = async (job: Job) => {
    setApplicantsLoading(true);
    setError('');
    setSelectedApplicantsJob(job);
    setShowApplicantsModal(true);

    try {
      const response = await api.get(`/application/PostedJob/${job.id}`);
      const applications = Array.isArray(response.data)
        ? response.data
        : response.data?.applications;
      const applicantApplications = Array.isArray(applications) ? applications : [];
      const applicationsWithResumes = await Promise.all(
        applicantApplications.map(async (application: Application) => {
          if (application.resume) return application;

          const applicant = (application.student || application.user || application.applicant) as ApplicantData | undefined;
          const applicantId =
            application.studentId ??
            application.userId ??
            applicant?.id ??
            applicant?.userId ??
            applicant?.user?.id;
          if (!applicantId) return application;

          try {
            const resumeResponse = await api.get(`/resume/student/${applicantId}`);
            const resume = resumeResponse.data?.resume || resumeResponse.data;
            return { ...application, resume };
          } catch {
            return application;
          }
        }),
      );

      setSelectedApplicants(applicationsWithResumes);
    } catch (err: unknown) {
      setShowApplicantsModal(false);
      const response = (err as { response?: { data?: { message?: string } } }).response;
      setError(response?.data?.message || 'Failed to load applicants');
    } finally {
      setApplicantsLoading(false);
    }
  };

  const getApplicantValue = (application: Application, key: string) => {
    const applicant = application.student || application.user || application.applicant;
    return applicant?.[key] as string | undefined;
  };

  const handleUpdateApplicationStatus = async (
    applicationId: number,
    status: string,
  ) => {
    try {
      setUpdatingApplicationId(applicationId);
      setError('');

      const normalizedStatus = status.toLowerCase();

      const response = await api.patch(
        `/application/PostedJob/${applicationId}/status`,
        { status: normalizedStatus },
      );
      const updatedApplication = response.data?.data || response.data;
      const savedStatus =
        typeof updatedApplication?.status === 'string'
          ? updatedApplication.status.toLowerCase()
          : normalizedStatus;

      setSelectedApplicants((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? { ...application, status: savedStatus }
            : application,
        ),
      );
      setSuccess('Application status updated successfully');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  const getResumeUrl = (application: Application) => {
    const applicant = application.student || application.user || application.applicant;
    const resume = application.resume || applicant?.resume as Application['resume'];
    const filePath = resume?.filePath;
    return filePath
      ? `/api/backend/${filePath.replace(/^\.\//, '').replace(/\\/g, '/')}`
      : null;
  };

  const getApplicantResume = (application: Application) => {
    const applicant = application.student || application.user || application.applicant;
    return application.resume || applicant?.resume as Application['resume'];
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
    <ProtectedRoute role="recruiter">
    <div className="flex h-screen overflow-hidden bg-[#f4f7fb] text-slate-800 antialiased font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPostJob={() => setShowCreateModal(true)}
        onLogout={handleLogout}
      />

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
                        <JobCard
                          key={job.id}
                          job={job}
                          onView={handleViewJob}
                          onApplicants={handleViewApplicants}
                          onEdit={openEditModal}
                          onDelete={handleDeleteJob}
                        />
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
                        <JobCard
                          key={job.id}
                          job={job}
                          onView={handleViewJob}
                        />
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
                  <div className="rounded-lg border border-slate-200/60 bg-white p-8 text-center text-xs font-medium text-slate-400 shadow-xs">
                    No jobs found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {myJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onView={handleViewJob}
                        onApplicants={handleViewApplicants}
                        onEdit={openEditModal}
                        onDelete={handleDeleteJob}
                      />
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

        {showApplicantsModal && selectedApplicantsJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-200/70 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold tracking-tight text-slate-900">Applicants</h2>
                  <p className="mt-1 text-xs text-slate-500">{selectedApplicantsJob.title}</p>
                </div>
                <button
                  onClick={() => setShowApplicantsModal(false)}
                  className="text-sm font-bold text-slate-400 hover:text-slate-600"
                  aria-label="Close applicants"
                >
                  ✕
                </button>
              </div>

              {applicantsLoading ? (
                <div className="py-12 text-center text-sm text-slate-500">Loading applicants...</div>
              ) : selectedApplicants.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  No students have applied for this job yet.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {selectedApplicants.map((application) => {
                    const resumeUrl = getResumeUrl(application);
                    const resume = getApplicantResume(application);
                    const name = getApplicantValue(application, 'fullName') || getApplicantValue(application, 'name');
                    const email = getApplicantValue(application, 'email');
                    const phone = getApplicantValue(application, 'phone');

                    return (
                      <div key={application.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{name || `Student #${application.studentId || application.userId || 'Unknown'}`}</h3>
                            <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                              <p>{email || 'Email not provided'}</p>
                              {phone && <p>{phone}</p>}
                              {application.appliedAt && <p>Applied {new Date(application.appliedAt).toLocaleDateString()}</p>}
                            </div>
                          </div>
                          <div className="w-full rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:w-auto">
                            <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                              Change application status
                            </p>
                            <div className="flex items-center gap-2">
                            <select
                              value={selectedStatuses[application.id] || (application.status || 'pending').toLowerCase()}
                              disabled={updatingApplicationId === application.id}
                              onChange={(event) =>
                                setSelectedStatuses((current) => ({
                                  ...current,
                                  [application.id]: event.target.value,
                                }))
                              }
                              className="min-h-10 min-w-[148px] flex-1 cursor-pointer rounded-lg border border-indigo-200 bg-gradient-to-br from-white to-slate-50 px-3 text-xs font-bold text-slate-700 outline-none transition hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:flex-none"
                              aria-label={`Select status for application ${application.id}`}
                            >
                              {applicationStatuses.map((statusOption) => (
                                <option key={statusOption.value} value={statusOption.value}>
                                  {statusOption.label}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              disabled={updatingApplicationId === application.id}
                              onClick={() =>
                                handleUpdateApplicationStatus(
                                  application.id,
                                  selectedStatuses[application.id] || (application.status || 'pending').toLowerCase(),
                                )
                              }
                              className="min-h-10 rounded-lg bg-gradient-to-r from-[#3b28c8] to-indigo-600 px-3.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-px hover:from-[#3120ab] hover:to-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-wait disabled:opacity-60"
                            >
                              {updatingApplicationId === application.id ? 'Saving...' : 'Change status'}
                            </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 border-t border-slate-200 pt-3">
                          {resumeUrl ? (
                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex rounded-md bg-[#3b28c8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3120ab]"
                            >
                              View CV{resume?.fileName ? `: ${resume.fileName}` : ''}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">CV not uploaded</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowApplicantsModal(false)}
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
    </ProtectedRoute>
  );
}