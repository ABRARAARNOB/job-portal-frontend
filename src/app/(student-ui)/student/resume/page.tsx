'use client';

import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import ResumePreview from './components/ResumePreview';
import EmptyResume from './components/EmptyResume';

interface Resume {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  createdAt?: string;
}

export default function ResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get current resume
  useEffect(() => {
    const getResume = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/resume/my-resume');

        setResume(response.data);
      } catch (error: any) {
        // If backend returns 404 when no resume exists,
        // treat it as "no resume" instead of an error.
        if (error.response?.status === 404) {
          setResume(null);
        } else {
          setError(
            error.response?.data?.message ||
              'Failed to load your resume',
          );
        }
      } finally {
        setLoading(false);
      }
    };

    getResume();
  }, []);

  // Upload resume
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a resume file.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();

      formData.append('resume', selectedFile);

      const response = await api.post(
        '/resume/upload',
        formData,
      );

      setResume(response.data);

      setSelectedFile(null);
      setShowUpload(false);

      setSuccess('Resume uploaded successfully.');
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Failed to upload resume',
      );
    } finally {
      setUploading(false);
    }
  };

  // Delete resume
  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your resume?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError('');
      setSuccess('');

      await api.delete('/resume/delete/resume');

      setResume(null);

      setSuccess('Resume deleted successfully.');
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Failed to delete resume',
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setShowUpload(false);
    setError('');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#20243a]">
          My Resume
        </h1>

        <p className="mt-2 text-sm text-[#777b91]">
          Manage your resume and keep your profile ready for
          job applications.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-[#e1e1ee] bg-white py-16 text-center">
          <p className="text-sm text-[#777b91]">
            Loading your resume...
          </p>
        </div>
      )}

      {/* Upload form */}
      {!loading && showUpload && (
        <ResumeUpload
          file={selectedFile}
          uploading={uploading}
          onFileChange={setSelectedFile}
          onUpload={handleUpload}
          onCancel={handleCancelUpload}
        />
      )}

      {/* Existing resume */}
      {!loading && !showUpload && resume && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#20243a]">
                Your Resume
              </h2>

              <p className="mt-1 text-sm text-[#777b91]">
                This resume will be available to recruiters
                when you apply for jobs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="rounded-lg bg-[#4134d8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3529bd]"
            >
              Replace Resume
            </button>
          </div>

          <ResumePreview
            resume={resume}
            onDelete={handleDelete}
            deleting={deleting}
          />
        </div>
      )}

      {/* No resume */}
      {!loading && !showUpload && !resume && (
        <EmptyResume
          onUpload={() => setShowUpload(true)}
        />
      )}
    </div>
  );
}