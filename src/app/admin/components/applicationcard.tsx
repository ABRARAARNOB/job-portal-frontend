interface Application {
  id: number;
  jobId?: number;
  userId?: number;
  studentId?: number;
  status?: string;
  appliedAt?: string;
  job?: {
    title?: string;
    company?: string;
  };
  student?: {
    fullName?: string;
    email?: string;
  };
  user?: {
    fullName?: string;
    email?: string;
  };
}

interface ApplicationCardProps {
  app: Application;
}

export default function ApplicationCard({ app }: ApplicationCardProps) {
  const applicant = app.student || app.user;
  const status = app.status?.toLowerCase() || 'pending';

  return (
    <div className="flex flex-col justify-between rounded-lg border border-slate-200/70 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Application #{app.id}</span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
              status === 'accepted'
                ? 'bg-emerald-50 text-emerald-700'
                : status === 'rejected'
                ? 'bg-red-50 text-red-700'
                : status === 'interview'
                ? 'bg-indigo-50 text-indigo-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {status}
          </span>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <h3 className="text-sm font-bold text-slate-900">
            {applicant?.fullName || `Applicant #${app.studentId || app.userId || 'Unknown'}`}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{applicant?.email || 'Email not provided'}</p>
          <div className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">{app.job?.title || `Job #${app.jobId || 'Unknown'}`}</p>
            {app.job?.company && <p className="mt-0.5">{app.job.company}</p>}
          </div>
          {app.appliedAt && (
            <p className="mt-3 text-xs text-slate-400">
              Applied {new Date(app.appliedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}