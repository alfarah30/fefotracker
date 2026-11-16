import { Package, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

const cardConfig = [
  {
    key: 'total',
    filterValue: 'all',
    label: 'Total Batch Obat',
    subtitle: 'Seluruh batch aktif',
    icon: Package,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    ringColor: 'ring-teal-500',
    accentBorder: 'border-l-teal-500',
    valueFn: (counts) => counts.total,
  },
  {
    key: 'aman',
    filterValue: 'aman',
    label: 'Status Aman',
    subtitle: '> 6 bulan (Penyimpanan normal)',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    ringColor: 'ring-emerald-500',
    accentBorder: 'border-l-emerald-500',
    valueFn: (counts) => counts.aman,
  },
  {
    key: 'waspada',
    filterValue: 'waspada',
    label: 'Prioritas Keluar / Retur',
    subtitle: '1 – 6 bulan (Waspada)',
    icon: AlertTriangle,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    ringColor: 'ring-amber-500',
    accentBorder: 'border-l-amber-500',
    valueFn: (counts) => counts.waspada,
  },
  {
    key: 'kritis',
    filterValue: 'kritis',
    label: 'Kritis / Kadaluwarsa',
    subtitle: '< 1 bulan atau lewat tanggal',
    icon: ShieldAlert,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    ringColor: 'ring-red-500',
    accentBorder: 'border-l-red-500',
    valueFn: (counts) => counts.kritis,
  },
];

/**
 * 4 kartu ringkasan di bagian atas dashboard.
 * @param {{
 *   counts: { total: number, aman: number, waspada: number, kritis: number },
 *   activeFilter?: string,
 *   onSelectFilter?: (filter: string) => void
 * }} props
 */
export default function SummaryCards({ counts, activeFilter, onSelectFilter }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 print:gap-2">
      {cardConfig.map(
        ({
          key,
          filterValue,
          label,
          subtitle,
          icon: Icon,
          iconBg,
          iconColor,
          ringColor,
          accentBorder,
          valueFn,
        }) => {
          const isSelected = activeFilter === filterValue;

          return (
            <div
              key={key}
              onClick={() => onSelectFilter && onSelectFilter(filterValue)}
              role="button"
              tabIndex={0}
              title={`Klik untuk memfilter status: ${label}`}
              className={`flex items-center gap-4 rounded-xl border bg-white p-4 sm:p-5 shadow-sm transition cursor-pointer select-none hover:shadow-md ${
                accentBorder ? `border-l-4 ${accentBorder}` : 'border-gray-200'
              } ${
                isSelected
                  ? `ring-2 ${ringColor} border-transparent bg-teal-50/20`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Icon */}
              <div
                className={`flex h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}
              >
                <Icon size={22} className={iconColor} />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold tracking-tight text-gray-900">
                    {valueFn(counts)}
                  </p>
                  {isSelected && (
                    <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="truncate text-sm font-medium text-gray-700">
                  {label}
                </p>
                {subtitle && (
                  <p className="truncate text-[11px] text-gray-400 print:hidden">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}
