'use client';

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import StatCard from "./components/StatCard";
import { CalendarCheck, CheckCircle, Clock, FileText } from "lucide-react";

interface User {
    id: number;
    email: string;
    role: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
}

interface Application {
  id: number;
  status: string;
  appliedAt: string;
  studentId: number;
  jobId: number;
  job: Job;
}

export default function StudentDashboardPage() {

  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      const [userResponse, applicationResponse] =
        await Promise.all([
          api.get('/auth/me'),
          api.get('/application/my-application'),
        ]);

      setUser(userResponse.data);
      setApplications(applicationResponse.data);
    } catch (error: any) {
      console.error(
        'Failed to load dashboard:',
        error.response?.data || error.message
      );
    }
  };

  loadDashboard();
}, []);

const totalApplications = applications.length;

const pendingApplications = applications.filter(
  (application) => application.status === 'pending'
).length;

const interviewInvites = applications.filter(
  (application) => application.status === 'interview'
).length;

const acceptedApplications = applications.filter(
  (application) => application.status === 'accepted'
).length;

const formatStatus = (status: string) => {

    switch (status) {

      case 'pending':
        return 'Pending';

      case 'interview':
        return 'Interview';

      case 'accepted':
        return 'Accepted';

      case 'rejected':
        return 'Rejected';

      default:
        return status;
    }

  };


  const getStatusClass = (status: string) => {

    switch (status) {

      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'interview':
        return 'bg-purple-100 text-purple-700';

      case 'accepted':
        return 'bg-green-100 text-green-700';

      case 'rejected':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }

  };



  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#20243a]">
          Welcome {user?.email}!
        </h1>

        <p className="mt-2 text-sm text-[#777b91]">
          Here is a summary of your career journey.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">

        <StatCard
          title="Applications Submitted"
          value={totalApplications}
          icon={FileText}
        />

        <StatCard
          title="Pending Applications"
          value={pendingApplications}
          icon={Clock}
        />

        <StatCard
          title="Interview Invites"
          value={interviewInvites}
          icon={CalendarCheck}
        />

        <StatCard
          title="Accepted Applications"
          value={acceptedApplications}
          icon={CheckCircle}
        />

      </div>

      <div className="mt-7">

        <h2 className="mb-4 text-lg font-semibold">
          Recent Applications
        </h2>

        <div className="rounded-lg bg-white">

          <div className="grid grid-cols-4 bg-[#f5f5f8] px-5 py-3 text-xs font-medium uppercase text-[#777b91]">
            <div>Job Title</div>
            <div>Company</div>
            <div>Date Applied</div>
            <div>Status</div>
          </div>

          {/* Table Rows */}
          {applications.slice(0, 4).map((application) => (
            <div
              key={application.id}
              className="grid grid-cols-4 items-center border-b px-5 py-4 text-sm"
            >

              {/* Job Title */}
              <div className="font-medium text-[#292d43]">
                {application.job.title}
              </div>

              {/* Company */}
              <div className="text-[#777b91]">
                {application.job.company}
              </div>

              {/* Date */}
              <div className="text-[#777b91]">
                {new Date(
                  application.appliedAt
                ).toLocaleDateString()}
              </div>

              {/* Status */}
              <div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${getStatusClass(
                    application.status
                  )}`}
                >
                  {formatStatus(application.status)}
                </span>
              </div>

            </div>
          ))}

          {/* No Applications */}
          {applications.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-[#777b91]">
              You haven't submitted any applications yet.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}