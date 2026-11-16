import { ArrowUpDown, Calendar, Building2, ArrowDownRight, Trash2, PackageOpen } from 'lucide-react';
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
  { label: 'PBF / Pemasok', className: 'text-left' },
  { label: 'Stok', className: 'text-center' },
  { label: 'Tgl. Kadaluwarsa', className: 'text-left' },
  { label: 'Sisa Masa Simpan', className: 'text-left' },
  { label: 'Status', className: 'text-center' },
  { label: 'Aksi', className: 'text-center print:hidden' },
];

/**
 * Tabel inventaris obat utama (Urutan FEFO dinamis)
 * @param {{
 *   data: Array,
 *   onOpenStockOut: (item: Object) => void,
 *   onOpenDelete: (item: Object) => void,
 *   searchTerm?: string,
 *   activeFilter?: string
 * }} props
 */
export default function InventoryTable({
  data,
  onOpenStockOut,
  onOpenDelete,
  searchTerm,
  activeFilter,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* ── Table Header Bar ── */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Daftar Inventaris Obat
          </h2>
          <p className="text-xs text-gray-500">
            Diurutkan otomatis secara FEFO (First Expired, First Out)
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
          <ArrowUpDown size={14} />
          <span>Urutan FEFO Aktif</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
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
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-gray-400">
                  <PackageOpen size={36} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium text-gray-600">
                    Tidak ada batch obat yang sesuai
                  </p>
                  {(searchTerm || activeFilter !== 'all') && (
                    <p className="text-xs text-gray-400 mt-1">
                      Coba ubah kata kunci pencarian atau reset filter status.
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const daysLeft = getDaysUntilExpiry(item.expiryDate);
                const status = getStatus(daysLeft);
                const remaining = formatRemainingTime(daysLeft);
                const isOverdue = daysLeft <= 0;
                const displayName = item.dosage
                  ? `${item.name} ${item.dosage}`
                  : item.name;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-gray-50 ${
                      status === 'kritis' ? 'bg-red-50/30' : ''
                    }`}
                  >
                    {/* # */}
                    <td className="px-4 py-3.5 text-center text-xs text-gray-400">
                      {index + 1}
                    </td>

                    {/* Nama Obat */}
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-gray-900">{displayName}</p>
                    </td>

                    {/* No. Batch */}
                    <td className="px-4 py-3.5">
                      <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700">
                        {item.batchNumber}
                      </span>
                    </td>

                    {/* PBF / Pemasok */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 max-w-[180px] truncate" title={item.supplier}>
                        <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{item.supplier || '-'}</span>
                      </div>
                    </td>

                    {/* Stok */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-semibold text-gray-900">
                        {item.stock}
                      </span>
                      <span className="ml-1 text-xs text-gray-500">
                        {item.unit}
                      </span>
                    </td>

                    {/* Tanggal Kadaluwarsa */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <Calendar size={13} className="text-gray-400" />
                        {formatDateID(item.expiryDate)}
                      </div>
                    </td>

                    {/* Sisa Masa Simpan */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-semibold ${
                          status === 'kritis'
                            ? 'text-red-600'
                            : status === 'waspada'
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                        }`}
                      >
                        {remaining}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5 text-center">
                      <StatusBadge status={status} isOverdue={isOverdue} />
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3.5 text-center print:hidden">
                      <div className="flex items-center justify-center gap-1">
                        {/* Tombol Obat Keluar */}
                        <button
                          type="button"
                          onClick={() => onOpenStockOut(item)}
                          title="Catat obat keluar / kurangi stok"
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 transition active:scale-95"
                        >
                          <ArrowDownRight size={13} />
                          <span>Keluar</span>
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          type="button"
                          onClick={() => onOpenDelete(item)}
                          title="Hapus batch obat"
                          className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Table Footer ── */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-5 py-3 text-xs text-gray-500">
        <span>Menampilkan {data.length} batch obat</span>
        <span className="text-[11px] text-gray-400">
          Aturan: Merah (≤30 hari) • Kuning (31–180 hari) • Hijau (&gt;180 hari)
        </span>
      </div>
    </div>
  );
}
