import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
} from 'lucide-react';
import ApplicationStatus from './ApplicationStatus';

export interface Application {
  id: number;
  status: string;
  appliedAt: string;
  studentId: number;
  jobId: number;

  job?: {
    id: number;
    title: string;
    company: string;
    salary: number;
  };
}

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({
  application,
}: ApplicationCardProps) {
  return (
    <div className="rounded-xl border border-[#e1e1ee] bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eeedff] text-[#4134d8]">
            <BriefcaseBusiness size={21} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#20243a]">
              {application.job?.title || `Job #${application.jobId}`}
            </h2>

            {application.job?.company && (
              <div className="mt-1 flex items-center gap-1.5 text-sm text-[#777b91]">
                <Building2 size={15} />
                {application.job.company}
              </div>
            )}
          </div>
        </div>

        <ApplicationStatus status={application.status} />
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-[#eeeeF5] pt-4 text-sm text-[#777b91]">
        <CalendarDays size={16} />

        <span>
          Applied on{' '}
          {new Date(application.appliedAt).toLocaleDateString()}
        </span>
      </div>

      {application.job?.salary && (
        <div className="mt-3 text-sm font-medium text-[#4134d8]">
          Salary: {Number(application.job.salary).toLocaleString()} / month
        </div>
      )}
    </div>
  );
}