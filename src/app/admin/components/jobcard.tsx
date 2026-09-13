interface Job {
  id: number;
  title: string;
  company: string;
  salary: number;
  location: string;
  description: string;
}

interface JobCardProps {
  job: Job;
  onDelete: (id: number) => void;
}

export default function JobCard({ job, onDelete }: JobCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_-14px_rgba(30,41,59,0.2)] transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_18px_34px_-16px_rgba(67,56,202,0.24)]">
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Job #{job.id}</span>
          {job.location && (
            <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {job.location}
            </span>
          )}
        </div>

        <h3 className="mt-2 text-sm font-bold tracking-tight text-slate-900 line-clamp-1">{job.title}</h3>
        <p className="text-xs font-normal text-slate-500">{job.company || 'N/A'}</p>

        {job.description && (
          <p className="mt-2 text-xs font-normal text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>
        )}

        <p className="mt-3 text-sm font-bold text-[#3b28c8]">
          {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
        </p>
      </div>

      <div className="mt-3.5 flex justify-end border-t border-slate-100 pt-3">
        <button
          onClick={() => onDelete(job.id)}
          className="rounded-xl bg-gradient-to-br from-red-50 to-rose-100 px-3.5 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:-translate-y-px hover:from-red-100 hover:to-rose-200 hover:shadow-md"
        >
          Delete Job
        </button>
      </div>
    </div>
  );
}
