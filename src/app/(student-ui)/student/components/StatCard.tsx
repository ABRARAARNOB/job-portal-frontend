import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_-12px_rgba(30,41,59,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_16px_32px_-14px_rgba(67,56,202,0.24)]">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white"><Icon size={20} /></div>

        <div>
          <p className="text-2xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
