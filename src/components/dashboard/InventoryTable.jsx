import { ArrowUpDown, Calendar } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import {
  getDaysUntilExpiry,
  getStatus,
  formatRemainingTime,
  formatDateID,
} from '../../utils/dateUtils';

const columns = [
  { label: '#', className: 'w-10 text-center' },
  { label: 'Nama Obat & Dosis', className: 'text-left' },
  { label: 'No. Batch', className: 'text-left' },
  { label: 'Stok', className: 'text-center' },
  { label: 'Tgl. Kedaluwarsa', className: 'text-left' },
  { label: 'Sisa Masa Simpan', className: 'text-left' },
  { label: 'Status', className: 'text-center' },
];

/**
 * Tabel inventaris obat utama, diurutkan FEFO.
 * @param {{ data: Array }} props
 */
export default function InventoryTable({ data }) {
  // Urutkan berdasarkan tanggal kedaluwarsa terdekat (FEFO)
  const sorted = [...data].sort(
    (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* ── Table Header ── */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Inventaris Obat
          </h2>
          <p className="text-xs text-gray-500">
            Diurutkan berdasarkan FEFO (First Expired, First Out)
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
          <ArrowUpDown size={14} />
          <span>FEFO</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {columns.map((col) => (
                <th
                  key={col.label}
                  className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${col.className}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {sorted.map((item, index) => {
              const daysLeft = getDaysUntilExpiry(item.expiryDate);
              const status = getStatus(daysLeft);
              const remaining = formatRemainingTime(daysLeft);
              const displayName = item.dosage
                ? `${item.name} ${item.dosage}`
                : item.name;

              return (
                <tr
                  key={item.id}
                  className={`transition-colors hover:bg-gray-50 ${
                    status === 'kritis' ? 'bg-red-50/40' : ''
                  }`}
                >
                  {/* # */}
                  <td className="px-4 py-3.5 text-center text-xs text-gray-400">
                    {index + 1}
                  </td>

                  {/* Nama Obat */}
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-gray-900">{displayName}</p>
                  </td>

                  {/* Batch */}
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">
                      {item.batchNumber}
                    </span>
                  </td>

                  {/* Stok */}
                  <td className="px-4 py-3.5 text-center">
                    <span className="font-semibold text-gray-800">
                      {item.stock}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">
                      {item.unit}
                    </span>
                  </td>

                  {/* Tanggal Kedaluwarsa */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Calendar size={14} className="text-gray-400" />
                      {formatDateID(item.expiryDate)}
                    </div>
                  </td>

                  {/* Sisa Masa Simpan */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-sm font-medium ${
                        status === 'kritis'
                          ? 'text-red-600'
                          : status === 'waspada'
                            ? 'text-amber-600'
                            : 'text-gray-600'
                      }`}
                    >
                      {remaining}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3.5 text-center">
                    <StatusBadge status={status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-3">
        <p className="text-xs text-gray-400">
          Menampilkan {sorted.length} batch obat • Data simulasi Minggu 1
        </p>
      </div>
    </div>
  );
}
