import { Package, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

const cardConfig = [
  {
    key: 'total',
    label: 'Total Batch Obat',
    icon: Package,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    valueFn: (counts) => counts.total,
  },
  {
    key: 'aman',
    label: 'Status Aman',
    subtitle: '> 6 bulan',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    accentBorder: 'border-l-emerald-500',
    valueFn: (counts) => counts.aman,
  },
  {
    key: 'waspada',
    label: 'Prioritas Keluar',
    subtitle: '1 – 6 bulan',
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    accentBorder: 'border-l-amber-500',
    valueFn: (counts) => counts.waspada,
  },
  {
    key: 'kritis',
    label: 'Kritis / Kedaluwarsa',
    subtitle: '< 1 bulan',
    icon: ShieldAlert,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    accentBorder: 'border-l-red-500',
    valueFn: (counts) => counts.kritis,
  },
];

/**
 * 4 kartu ringkasan di bagian atas dashboard.
 * @param {{ counts: { total: number, aman: number, waspada: number, kritis: number } }} props
 */
export default function SummaryCards({ counts }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cardConfig.map(
        ({ key, label, subtitle, icon: Icon, iconBg, iconColor, accentBorder, valueFn }) => (
          <div
            key={key}
            className={`flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md ${
              accentBorder ? `border-l-4 ${accentBorder}` : ''
            }`}
          >
            {/* Icon */}
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}
            >
              <Icon size={22} className={iconColor} />
            </div>

            {/* Text */}
            <div>
              <p className="text-2xl font-bold text-gray-900">{valueFn(counts)}</p>
              <p className="text-sm font-medium text-gray-600">{label}</p>
              {subtitle && (
                <p className="text-xs text-gray-400">{subtitle}</p>
              )}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
