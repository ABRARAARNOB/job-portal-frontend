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
    <div className="group relative flex min-h-[285px] flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#3b28c8] via-indigo-500 to-emerald-400" />
      <div>
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
            Job #{job.id}
          </span>
          {job.location && (
            <span className="truncate rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              {job.location}
            </span>
          )}
        </div>

        <h3 className="mt-4 min-h-10 text-base font-bold leading-5 tracking-tight text-slate-900 line-clamp-2">
          {job.title}
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500">{job.company || 'Company not specified'}</p>

        {job.description && (
          <p className="mt-4 min-h-9 text-xs leading-relaxed text-slate-600 line-clamp-2">
            {job.description}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Compensation</p>
            <p className="mt-0.5 text-sm font-bold text-[#3b28c8]">
              {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        {isManageable ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onView(job.id)}
              className="inline-flex min-h-9 items-center justify-center rounded-md bg-gradient-to-br from-slate-50 to-slate-200 px-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-px hover:from-slate-100 hover:to-slate-300 hover:shadow-md"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => onApplicants && onApplicants(job)}
              className="inline-flex min-h-9 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 px-2.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-px hover:from-emerald-600 hover:to-teal-700 hover:shadow-md"
            >
              Applicants
            </button>
            <button
              type="button"
              onClick={() => onEdit && onEdit(job)}
              className="inline-flex min-h-9 items-center justify-center rounded-md bg-gradient-to-br from-indigo-50 to-indigo-100 px-2.5 text-xs font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-px hover:from-indigo-100 hover:to-indigo-200 hover:shadow-md"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete && onDelete(job.id)}
              className="inline-flex min-h-9 items-center justify-center rounded-md bg-gradient-to-br from-red-50 to-rose-100 px-2.5 text-xs font-semibold text-red-600 shadow-sm transition hover:-translate-y-px hover:from-red-100 hover:to-rose-200 hover:shadow-md"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onView(job.id)}
            className="w-full rounded-md bg-gradient-to-r from-[#3b28c8] to-indigo-600 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-px hover:from-[#3120ab] hover:to-indigo-700 hover:shadow-md"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}