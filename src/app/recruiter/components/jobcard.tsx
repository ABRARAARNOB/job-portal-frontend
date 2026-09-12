interface Job {
  id: number;
  title: string;
  company?: string;
  salary?: number;
  location?: string;
  description?: string;
  status?: string;
}

interface JobCardProps {
  job: Job;
  onView: (id: number) => void;
  onApplicants?: (job: Job) => void;
  onEdit?: (job: Job) => void;
  onDelete?: (id: number) => void;
}

export default function JobCard({ job, onView, onApplicants, onEdit, onDelete }: JobCardProps) {
  const isManageable = Boolean(onEdit && onDelete);

  return (
    <div className="flex flex-col justify-between rounded-lg border border-slate-200/70 bg-white p-4 shadow-xs transition hover:shadow-sm">
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

        {job.description && (
          <p className="mt-2 text-xs font-normal text-slate-600 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}

        <p className="mt-3 text-sm font-bold text-[#3b28c8]">
          {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
        </p>
      </div>

      <div className="mt-3.5 border-t border-slate-100 pt-3">
        {isManageable ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onView(job.id)}
              className="inline-flex min-h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              View
            </button>
            <button
              onClick={() => onApplicants && onApplicants(job)}
              className="inline-flex min-h-9 items-center justify-center rounded-md border border-emerald-200 bg-white px-2.5 text-xs font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              Applicants
            </button>
            <button
              onClick={() => onEdit && onEdit(job)}
              className="inline-flex min-h-9 items-center justify-center rounded-md border border-indigo-200 bg-white px-2.5 text-xs font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(job.id)}
              className="inline-flex min-h-9 items-center justify-center rounded-md border border-red-200 bg-white px-2.5 text-xs font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={() => onView(job.id)}
            className="w-full rounded-md bg-[#3b28c8] py-1.5 text-xs font-medium text-white hover:bg-[#3120ab] transition"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}