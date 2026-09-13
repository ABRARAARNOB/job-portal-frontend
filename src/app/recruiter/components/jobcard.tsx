interface Job {
  id: number;
  title: string;
  company: string;
  salary: number;
  location: string;
  description: string;
  status: string;
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
    <div className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[22px] border border-slate-200/90 bg-white p-7 shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_22px_45px_-20px_rgba(37,99,235,0.3)]">
      <div className="hidden" />
      <div>
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-500">
            Job #{job.id}
          </span>
          {job.location && (
            <span className="truncate rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
              {job.location}
            </span>
          )}
        </div>

        <h3 className="mt-6 text-xl font-bold leading-6 tracking-[-0.035em] text-slate-950 line-clamp-2">
          {job.title}
        </h3>
        <div className="mt-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Company</p>
          <p className="mt-1 text-[15px] font-medium text-[#1d4ed8]">{job.company || 'Company not specified'}</p>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Description</p>
          <p className="mt-1.5 text-[13px] leading-5 text-slate-500 line-clamp-3">
            {job.description || 'No description provided.'}
          </p>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Compensation</p>
            <p className="mt-1 text-xl font-extrabold tracking-[-0.035em] text-slate-950">
              {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6">
        {isManageable ? (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onView(job.id)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_8px_16px_-10px_rgba(15,23,42,0.28)] active:translate-y-0"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => onApplicants && onApplicants(job)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1d4ed8] px-3 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 shadow-[0_7px_14px_-7px_rgba(29,78,216,0.55)] transition-all duration-200 hover:-translate-y-px hover:bg-[#1e40af] hover:shadow-[0_12px_20px_-8px_rgba(29,78,216,0.55)] active:translate-y-0"
            >
              Applicants
            </button>
            <button
              type="button"
              onClick={() => onEdit && onEdit(job)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-px hover:border-slate-300 hover:bg-white hover:shadow-[0_8px_16px_-10px_rgba(15,23,42,0.24)] active:translate-y-0"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete && onDelete(job.id)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-px hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-[0_8px_16px_-10px_rgba(225,29,72,0.2)] active:translate-y-0"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onView(job.id)}
            className="w-full rounded-xl bg-[#1d4ed8] py-3.5 text-sm font-semibold tracking-[-0.01em] text-white ring-1 ring-inset ring-white/20 shadow-[0_10px_20px_-8px_rgba(29,78,216,0.6),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#1741b6] hover:shadow-[0_16px_28px_-9px_rgba(29,78,216,0.62),inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-0 active:scale-[0.99]"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
