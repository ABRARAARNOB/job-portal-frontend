'use client';

import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';

import JobCard, {
  Job,
} from './components/JobCard';

import JobSearch from './components/JobSearch';
import EmptyJob from './components/EmptyJob';

export default function Jobs() {

  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<number | null>(null);

  const [error, setError] = useState('');


  // -------------------------
  // Get Jobs
  // -------------------------

  useEffect(() => {

    const getJobs = async () => {

      try {

        setLoading(true);
        setError('');

        const response = await api.get('/job');

        setJobs(response.data);

      } catch (error: any) {

        console.error(error);

        setError(
          error.response?.data?.message ||
          'Failed to load jobs'
        );

      } finally {

        setLoading(false);

      }

    };

    getJobs();

  }, []);


  // -------------------------
  // Apply
  // -------------------------

  const handleApply = async (jobId: number) => {

    try {

      setApplying(jobId);
      setError('');

      await api.post(
        `/application/apply/${jobId}`
      );

      alert('Application submitted successfully');

    } catch (error: any) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        'Failed to submit application'
      );

    } finally {

      setApplying(null);

    }

  };


  // -------------------------
  // Search
  // -------------------------

  const filteredJobs = jobs.filter((job) =>
    job.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  return (
    <div>

      {/* Page Header */}

      <div className="mb-7">

        <h1 className="text-2xl font-bold text-[#20243a]">
          Browse Jobs
        </h1>

        <p className="mt-2 text-sm text-[#777b91]">
          Find job opportunities and apply for positions
          that match your skills.
        </p>

      </div>


      {/* Search */}

      <div className="mb-7">

        <JobSearch
          value={search}
          onChange={setSearch}
        />

      </div>


      {/* Error */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* Loading */}

      {loading && (
        <div className="py-10 text-center text-sm text-[#777b91]">
          Loading jobs...
        </div>
      )}


      {/* Job Cards */}

      {!loading && filteredJobs.length > 0 && (

        <div className="grid grid-cols-2 gap-5">

          {filteredJobs.map((job) => (

            <JobCard
              key={job.id}
              job={job}
              applying={applying === job.id}
              onApply={handleApply}
            />

          ))}

        </div>

      )}


      {/* Empty */}

      {!loading && filteredJobs.length === 0 && (
        <EmptyJob search={search} />
      )}

    </div>
  );
}