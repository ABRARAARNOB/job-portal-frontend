import { FileUp, Upload } from 'lucide-react';

interface EmptyResumeProps {
  onUpload: () => void;
}

export default function EmptyResume({
  onUpload,
}: EmptyResumeProps) {
  return (
    <div className="rounded-xl border border-[#e1e1ee] bg-white p-10">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eeedff] text-[#4134d8]">
          <FileUp size={28} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-[#20243a]">
          Upload your resume
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#777b91]">
          Upload your latest resume so recruiters can review your
          qualifications when you apply for jobs.
        </p>

        <button
          type="button"
          onClick={onUpload}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#4134d8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3529bd]"
        >
          <Upload size={17} />
          Upload Resume
        </button>

        <p className="mt-4 text-xs text-[#999daf]">
          Accepted formats: PDF, JPG, JPEG · Maximum size: 5MB
        </p>
      </div>
    </div>
  );
}