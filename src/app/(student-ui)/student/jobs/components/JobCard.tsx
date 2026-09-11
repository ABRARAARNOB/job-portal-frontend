import {
  BriefcaseBusiness,
  Building2,
  DollarSign,
  Send,
} from 'lucide-react';

export interface Job {
  id: number;
  title: string;
  company: string;
  salary: number;
  description: string;
  recruiterId: number;
  createdAt: string;
}

interface JobCardProps {
  job: Job;
  applying: boolean;
  onApply: (jobId: number) => void;
}

export default function JobCard({
  job,
  applying,
  onApply,
}: JobCardProps) {
  return (
    <div className="rounded-xl border border-[#e1e1ee] bg-white p-6 shadow-sm transition hover:shadow-md">

        {/* Header */}
        <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eeedff] text-[#4134d8]">
            <BriefcaseBusiness size={21} />
            </div>

            <div>
            <h2 className="text-base font-semibold text-[#20243a]">
                {job.title}
            </h2>

            <div className="mt-1 flex items-center gap-1.5 text-sm text-[#777b91]">
                <Building2 size={15} />
                {job.company}
            </div>
            </div>

        </div>

        {/* Salary */}
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#4134d8]">
            <DollarSign size={17} />

            <span>
            {Number(job.salary).toLocaleString()} / month
            </span>
        </div>

        {/* Description */}
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#777b91]">
            {job.description}
        </p>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-[#eeeeF5] pt-5">

                <span className="text-xs text-[#999daf]">
                Posted{' '}
                {new Date(job.createdAt).toLocaleDateString()}
                </span>

                <button
                type="button"
                onClick={() => onApply(job.id)}
                disabled={applying}
                className="flex items-center gap-2 rounded-lg bg-[#4134d8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3529bd] disabled:cursor-not-allowed disabled:opacity-60"
                >
                <Send size={15} />

                {applying ? 'Applying...' : 'Apply Now'}
                </button>

        </div>

    </div>
  );
}