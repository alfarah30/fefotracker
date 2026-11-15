import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

const config = {
  aman: {
    label: 'Aman',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    icon: ShieldCheck,
  },
  waspada: {
    label: 'Waspada',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: AlertTriangle,
  },
  kritis: {
    label: 'Kritis',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: ShieldAlert,
  },
};

/**
 * Badge status visual untuk setiap batch obat.
 * @param {{ status: "aman" | "waspada" | "kritis" }} props
 */
export default function StatusBadge({ status }) {
  const { label, bg, text, icon: Icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${bg} ${text}`}
    >
      <Icon size={14} />
      {label}
    </span>
  );
}
