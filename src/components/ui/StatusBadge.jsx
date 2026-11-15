import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

const config = {
  aman: {
    defaultLabel: 'Aman',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    icon: ShieldCheck,
  },
  waspada: {
    defaultLabel: 'Waspada',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: AlertTriangle,
  },
  kritis: {
    defaultLabel: 'Kritis',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: ShieldAlert,
  },
};

/**
 * Badge status visual untuk setiap batch obat.
 * @param {{ status: "aman" | "waspada" | "kritis", label?: string, isOverdue?: boolean }} props
 */
export default function StatusBadge({ status, label, isOverdue }) {
  const current = config[status] || config.aman;
  const Icon = current.icon;
  const displayLabel = label || (status === 'kritis' && isOverdue ? 'Kedaluwarsa' : current.defaultLabel);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${current.bg} ${current.text}`}
    >
      <Icon size={14} className="flex-shrink-0" />
      <span>{displayLabel}</span>
    </span>
  );
}
