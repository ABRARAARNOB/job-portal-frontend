interface Job {
  id: number;
  title: string;
  company: string;
  salary: number;
  location?: string;
  description?: string;
}

interface JobCardProps {
  job: Job;
  onDelete: (id: number) => void;
}

export default function JobCard({ job, onDelete }: JobCardProps) {
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
          className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
        >
          Delete Job
        </button>
      </div>
    </div>
  );
}