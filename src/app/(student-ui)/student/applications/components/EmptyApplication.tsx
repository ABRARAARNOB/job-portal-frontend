import { FileText } from 'lucide-react';

export default function EmptyApplications() {
  return (
    <div className="rounded-xl border border-[#e1e1ee] bg-white py-16 text-center">
      <FileText
        size={38}
        className="mx-auto text-[#aaaec0]"
      />

      <h3 className="mt-4 font-semibold text-[#20243a]">
        No applications yet
      </h3>

      <p className="mt-1 text-sm text-[#777b91]">
        You have not applied for any jobs yet.
      </p>
    </div>
  );
}