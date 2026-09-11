import {
  CalendarDays,
  Download,
  FileText,
  Trash2,
} from 'lucide-react';

interface Resume {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  createdAt?: string;
}

interface ResumePreviewProps {
  resume: Resume;
  onDelete: () => void;
  deleting: boolean;
}

export default function ResumePreview({
  resume,
  onDelete,
  deleting,
}: ResumePreviewProps) {
  const fileUrl = `http://localhost:4000/${resume.filePath
    .replace('./', '')
    .replace(/\\/g, '/')}`;

  return (
    <div className="rounded-xl border border-[#e1e1ee] bg-white p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#eeedff] text-[#4134d8]">
            <FileText size={27} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#20243a]">
              {resume.fileName}
            </h2>

            <p className="mt-1 text-sm text-[#777b91]">
              {(resume.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>

            {resume.createdAt && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#999daf]">
                <CalendarDays size={13} />
                Uploaded on{' '}
                {new Date(resume.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-7 flex gap-3 border-t border-[#eeeeF5] pt-5">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#4134d8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3529bd]"
        >
          <FileText size={16} />
          View Resume
        </a>

        <a
          href={fileUrl}
          download={resume.fileName}
          className="inline-flex items-center gap-2 rounded-lg border border-[#dedff0] px-4 py-2.5 text-sm font-medium text-[#55596f] transition hover:bg-[#f7f7fa]"
        >
          <Download size={16} />
          Download
        </a>

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 size={16} />
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}