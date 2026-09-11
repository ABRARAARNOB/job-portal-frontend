import { CheckCircle, Clock, CalendarCheck, XCircle } from 'lucide-react';

interface ApplicationStatusProps {
  status: string;
}

export default function ApplicationStatus({
  status,
}: ApplicationStatusProps) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
        <Clock size={13} />
        Pending
      </span>
    );
  }

  if (normalizedStatus === 'interview') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        <CalendarCheck size={13} />
        Interview
      </span>
    );
  }

  if (normalizedStatus === 'accepted') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
        <CheckCircle size={13} />
        Accepted
      </span>
    );
  }

  if (normalizedStatus === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
        <XCircle size={13} />
        Rejected
      </span>
    );
  }

  return (
    <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
      {status}
    </span>
  );
}