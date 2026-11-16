import { Download, Printer, AlertTriangle, ShieldAlert, Building2, Calendar, FileSpreadsheet } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import {
  getDaysUntilExpiry,
  getStatus,
  formatRemainingTime,
  formatDateID,
} from '../../utils/dateUtils';
import { exportToCSV } from '../../utils/exportUtils';

/**
 * Modul Laporan Retur & Pemusnahan
 * Memisahkan otomatis Tabel A (Prioritas Retur PBF) dan Tabel B (Karantina & Pemusnahan).
 * @param {{ inventory: Array }} props
 */
export default function ReportsView({ inventory }) {
  // Pisahkan data secara otomatis
  const returList = inventory.filter((item) => {
    const days = getDaysUntilExpiry(item.expiryDate);
    return getStatus(days) === 'waspada';
  });

  const pemusnahanList = inventory.filter((item) => {
    const days = getDaysUntilExpiry(item.expiryDate);
    return getStatus(days) === 'kritis';
  });

  const handleExportAll = () => {
    const combined = [...pemusnahanList, ...returList];
    exportToCSV(`Laporan_Retur_Pemusnahan_${new Date().toISOString().split('T')[0]}`, combined, 'all');
  };

  const handleExportRetur = () => {
    exportToCSV(`Daftar_Retur_PBF_${new Date().toISOString().split('T')[0]}`, returList, 'retur');
  };

  const handleExportPemusnahan = () => {
    exportToCSV(`Daftar_Karantina_Pemusnahan_${new Date().toISOString().split('T')[0]}`, pemusnahanList, 'pemusnahan');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* ── Action Toolbar (Hidden on print) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm print:hidden">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Modul Laporan Retur &amp; Pemusnahan Obat
          </h2>
          <p className="text-xs text-gray-500">
            Dipisahkan otomatis berdasarkan tingkat risiko masa simpan obat
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol Ekspor CSV */}
          <button
            type="button"
            onClick={handleExportAll}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
          >
            <Download size={15} className="text-teal-600" />
            <span>Ekspor CSV (Excel)</span>
          </button>

          {/* Tombol Cetak PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-95"
          >
            <Printer size={15} />
            <span>Cetak Laporan (PDF)</span>
          </button>
        </div>
      </div>

      {/* ── TABEL A: DAFTAR PRIORITAS RETUR KE PBF ── */}
      <div className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
        {/* Table A Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-100 bg-amber-50/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Tabel A — Daftar Prioritas Retur ke PBF (Masa Simpan 1–6 Bulan)
              </h3>
              <p className="text-xs text-amber-700">
                Batch obat berstatus <strong>Waspada (Kuning)</strong> yang harus segera dikoordinasikan penukarannya ke distributor PBF.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleExportRetur}
              disabled={returList.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm hover:bg-amber-50 disabled:opacity-50"
            >
              <FileSpreadsheet size={14} />
              <span>CSV Retur ({returList.length})</span>
            </button>
          </div>
        </div>

        {/* Table A Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3 text-center w-10">#</th>
                <th className="px-4 py-3 text-left">Nama Obat &amp; Dosis</th>
                <th className="px-4 py-3 text-left">No. Batch</th>
                <th className="px-4 py-3 text-left">PBF / Pemasok Resmi</th>
                <th className="px-4 py-3 text-center">Stok</th>
                <th className="px-4 py-3 text-left">Tgl. Kadaluwarsa</th>
                <th className="px-4 py-3 text-left">Sisa Waktu</th>
                <th className="px-4 py-3 text-left">Rekomendasi Tindakan Retur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {returList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-gray-400 italic">
                    Tidak ada obat dalam kategori prioritas retur (semua stok di luar rentang 1–6 bulan).
                  </td>
                </tr>
              ) : (
                returList.map((item, idx) => {
                  const daysLeft = getDaysUntilExpiry(item.expiryDate);
                  return (
                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-4 py-3 text-center text-xs text-gray-400">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {item.name} {item.dosage}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                          {item.batchNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-800 font-medium">
                          <Building2 size={13} className="text-amber-600 flex-shrink-0" />
                          <span>{item.supplier}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-gray-900">{item.stock}</span>{' '}
                        <span className="text-xs text-gray-500">{item.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        {formatDateID(item.expiryDate)}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-amber-700">
                        {formatRemainingTime(daysLeft)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <span className="inline-block rounded bg-amber-100/70 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                          Siapkan formulir retur ke {item.supplier.split(' ')[1] || 'PBF'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TABEL B: DAFTAR KARANTINA & PEMUSNAHAN ── */}
      <div className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        {/* Table B Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-red-100 bg-red-50/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-900">
                Tabel B — Daftar Karantina &amp; Pemusnahan (Masa Simpan &le; 30 Hari / Sudah Lewat)
              </h3>
              <p className="text-xs text-red-700">
                Batch obat berstatus <strong>Kritis (Merah)</strong> yang TIDAK BOLEH didistribusikan ke pasien dan wajib ditarik dari rak.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleExportPemusnahan}
              disabled={pemusnahanList.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-800 shadow-sm hover:bg-red-50 disabled:opacity-50"
            >
              <FileSpreadsheet size={14} />
              <span>CSV Karantina ({pemusnahanList.length})</span>
            </button>
          </div>
        </div>

        {/* Table B Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3 text-center w-10">#</th>
                <th className="px-4 py-3 text-left">Nama Obat &amp; Dosis</th>
                <th className="px-4 py-3 text-left">No. Batch</th>
                <th className="px-4 py-3 text-left">PBF / Pemasok</th>
                <th className="px-4 py-3 text-center">Stok Karantina</th>
                <th className="px-4 py-3 text-left">Tgl. Kadaluwarsa</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-left">Prosedur Farmasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pemusnahanList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-gray-400 italic">
                    Tidak ada obat berstatus kritis atau kadaluwarsa.
                  </td>
                </tr>
              ) : (
                pemusnahanList.map((item, idx) => {
                  const daysLeft = getDaysUntilExpiry(item.expiryDate);
                  const isOverdue = daysLeft <= 0;

                  return (
                    <tr key={item.id} className="bg-red-50/20 hover:bg-red-50/40 transition-colors">
                      <td className="px-4 py-3 text-center text-xs text-gray-400">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {item.name} {item.dosage}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                          {item.batchNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        {item.supplier}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-red-600">{item.stock}</span>{' '}
                        <span className="text-xs text-gray-500">{item.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        {formatDateID(item.expiryDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status="kritis" isOverdue={isOverdue} />
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-red-700">
                        {isOverdue ? (
                          <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-800">
                            Pindahkan ke Lemari Karantina &bull; Siapkan Berita Acara
                          </span>
                        ) : (
                          <span className="inline-block rounded bg-red-50 border border-red-200 px-2 py-0.5 text-[11px] text-red-700">
                            Tarik dari etalase ({daysLeft} hari lagi)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Catatan Kepatuhan Regulasi Farmasi (BPOM / Kemenkes) ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-xs text-gray-600 space-y-2">
        <h4 className="font-semibold text-gray-900 flex items-center gap-1.5">
          <span>Pedoman Pengelolaan Obat Rusak &amp; Kadaluwarsa (Standar Pelayanan Kefarmasian):</span>
        </h4>
        <ul className="list-disc list-inside space-y-1 text-gray-500 pl-1">
          <li>Obat kadaluwarsa atau rusak harus dipisahkan dan disimpan pada lemari/area karantina khusus yang terkunci.</li>
          <li>Pemusnahan obat wajib disaksikan oleh petugas Dinkes / BPOM setempat dan dibuatkan Berita Acara Pemusnahan (BAP).</li>
          <li>Batas waktu permohonan retur ke PBF umumnya berkisar antara 3 hingga 6 bulan sebelum tanggal kadaluwarsa (mengacu pada Surat Perjanjian Kerjasama masing-masing PBF).</li>
        </ul>
      </div>
    </div>
  );
}
