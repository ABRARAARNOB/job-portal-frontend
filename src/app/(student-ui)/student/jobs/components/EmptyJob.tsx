import { BriefcaseBusiness } from 'lucide-react';

interface EmptyJobsProps {
  search: string;
}

export default function EmptyJobs({
  search,
}: EmptyJobsProps) {
  return (
    <div className="rounded-xl border border-[#e1e1ee] bg-white py-16 text-center">

      <BriefcaseBusiness
        size={35}
        className="mx-auto text-[#aaaec0]"
      />

      <h3 className="mt-4 font-semibold text-[#20243a]">
        No jobs found
      </h3>

      <p className="mt-1 text-sm text-[#777b91]">
        {search
          ? 'Try searching with a different job title.'
          : 'There are currently no available jobs.'}
      </p>

    </div>
  );
}