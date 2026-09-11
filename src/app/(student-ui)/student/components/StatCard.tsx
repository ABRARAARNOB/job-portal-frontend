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
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <Icon size={20} />

        <div>
          <p className="text-2xl font-bold">
            {value}
          </p>

          <p className="text-xs text-gray-500">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}