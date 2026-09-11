'use client';

import { ChangeEvent, useRef } from 'react';
import { FileUp, Upload, X } from 'lucide-react';

interface ResumeUploadProps {
  file: File | null;
  uploading: boolean;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
  onCancel: () => void;
}

export default function ResumeUpload({
  file,
  uploading,
  onFileChange,
  onUpload,
  onCancel,
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="rounded-xl border border-[#e1e1ee] bg-white p-7">
      <div className="flex items-center justify-between border-b border-[#eeeeF5] pb-5">
        <div>
          <h2 className="text-lg font-semibold text-[#20243a]">
            Upload Resume
          </h2>

          <p className="mt-1 text-sm text-[#777b91]">
            Choose your latest resume file.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-[#777b91] transition hover:bg-[#f4f4f8] hover:text-[#20243a]"
        >
          <X size={19} />
        </button>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-[#d9d9e8] px-6 py-12 text-center transition hover:border-[#4134d8] hover:bg-[#fafaff]"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eeedff] text-[#4134d8]">
            <FileUp size={25} />
          </div>

          <p className="mt-4 text-sm font-semibold text-[#20243a]">
            Click to select your resume
          </p>

          <p className="mt-1 text-xs text-[#777b91]">
            PDF, JPG or JPEG · Maximum 5MB
          </p>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {file && (
        <div className="mt-5 flex items-center justify-between rounded-lg bg-[#f6f6fb] px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#20243a]">
              {file.name}
            </p>

            <p className="mt-1 text-xs text-[#777b91]">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="ml-4 text-xs font-medium text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={uploading}
          className="rounded-lg border border-[#dedff0] px-5 py-2.5 text-sm font-medium text-[#55596f] transition hover:bg-[#f7f7fa]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onUpload}
          disabled={!file || uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#4134d8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3529bd] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload size={16} />

          {uploading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </div>
    </div>
  );
}