import { formatDateID } from '../../utils/dateUtils';

/**
 * Kop Surat Laporan Resmi Apotek — Hanya tampil saat dicetak (window.print())
 * @param {{ reportTitle?: string }} props
 */
export default function PrintHeader({ reportTitle = 'Laporan Inventaris & Pemantauan Kadaluwarsa Obat' }) {
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="hidden print:block border-b-2 border-gray-900 pb-4 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
            APOTEK SEHAT PHARMA
          </h1>
          <p className="text-xs text-gray-600">
            Jl. Farmasi Sejahtera No. 12, Jakarta • Telp: (021) 555-0199
          </p>
          <p className="text-[11px] text-gray-500">
            SIA: 503/456/SIA/DPMPTSP/2025 • SIPA: 446/123/SIPA/2025
          </p>
        </div>
        <div className="text-right text-xs text-gray-600">
          <p className="font-semibold text-gray-900">SISTEM FEFO APOTEK</p>
          <p>Tgl. Dokumen: {formatDateID(todayStr)}</p>
          <p className="text-[11px] text-gray-500">Dokumen Otomatis Komputer</p>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-gray-300 text-center">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
          {reportTitle}
        </h2>
        <p className="text-[11px] text-gray-500 italic">
          Berdasarkan Prinsip FEFO (First Expired, First Out)
        </p>
      </div>
    </div>
  );
}
