'use client';

import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import ApplicationCard, {
  Application,
} from './components/ApplicationCard';
import EmptyApplication from './components/EmptyApplication';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getApplications = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get(
          '/application/my-application'
        );

        setApplications(response.data);
      } catch (error: any) {
        console.error(
          'Failed to load applications:',
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            'Failed to load your applications'
        );
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#20243a]">
          My Applications
        </h1>

        <p className="mt-2 text-sm text-[#777b91]">
          Track the jobs you have applied for and monitor your
          application status.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-[#e1e1ee] bg-white py-16 text-center">
          <p className="text-sm text-[#777b91]">
            Loading your applications...
          </p>
        </div>
      )}

      {/* Applications */}
      {!loading && applications.length > 0 && (
        <>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-[#777b91]">
              Showing{' '}
              <span className="font-semibold text-[#20243a]">
                {applications.length}
              </span>{' '}
              application
              {applications.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
              />
            ))}
          </div>
        </>
      )}

      {/* Empty */}
      {!loading && applications.length === 0 && !error && (
        <EmptyApplication />
      )}
    </div>
  );
}