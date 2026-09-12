interface Application {
  id: number;
  jobId: number;
  userId: number;
  status: string;
}

interface ApplicationCardProps {
  app: Application;
}

export default function ApplicationCard({ app }: ApplicationCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-slate-200/70 bg-white p-4 shadow-xs transition hover:shadow-sm">
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Application #{app.id}</span>
          <span
            className={`rounded px-2.5 py-0.5 text-xs font-semibold uppercase ${
              app.status?.toLowerCase() === 'accepted'
                ? 'bg-emerald-50 text-emerald-700'
                : app.status?.toLowerCase() === 'rejected'
                ? 'bg-red-50 text-red-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {app.status}
          </span>
        </div>

        <div className="mt-3.5 space-y-1.5 text-xs text-slate-500">
          <p>
            Job ID: <span className="font-semibold text-slate-800">#{app.jobId}</span>
          </p>
          <p>
            Applicant User ID: <span className="font-semibold text-slate-800">#{app.userId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}