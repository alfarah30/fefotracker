import {
  getDaysUntilExpiry,
  getStatus,
  formatRemainingTime,
  formatDateID,
} from './dateUtils';

/**
 * Mengonversi array objek obat menjadi string CSV dan memicu unduhan file browser.
 * Menyertakan UTF-8 BOM (\uFEFF) agar file langsung rapi saat dibuka di Microsoft Excel.
 *
 * @param {string} filename Nama file hasil unduhan
 * @param {Array} items Daftar data obat
 * @param {string} reportType Jenis laporan ('all' | 'retur' | 'pemusnahan')
 */
export function exportToCSV(filename, items, reportType = 'all') {
  const headers = [
    'No',
    'Nama Obat',
    'Dosis',
    'No. Batch',
    'PBF / Pemasok',
    'Jumlah Stok',
    'Satuan',
    'Tanggal Kedaluwarsa',
    'Sisa Hari',
    'Status Simpan',
    'Keterangan & Tindakan',
  ];

  const rows = items.map((item, index) => {
    const daysLeft = getDaysUntilExpiry(item.expiryDate);
    const status = getStatus(daysLeft);
    const remainingText = formatRemainingTime(daysLeft);

    let statusText = 'Aman';
    let recommendation = 'Penyimpanan normal di etalase';

    if (status === 'kritis') {
      statusText = daysLeft <= 0 ? 'Kedaluwarsa' : 'Kritis (<1 bln)';
      recommendation =
        'Tarik dari rak / Karantina untuk Berita Acara Pemusnahan';
    } else if (status === 'waspada') {
      statusText = 'Waspada (1-6 bln)';
      recommendation = 'Prioritas Pengeluaran / Konfirmasi Retur ke PBF';
    }

    return [
      index + 1,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.dosage || '-').replace(/"/g, '""')}"`,
      `"${(item.batchNumber || '').replace(/"/g, '""')}"`,
      `"${(item.supplier || '-').replace(/"/g, '""')}"`,
      item.stock,
      `"${item.unit || 'Box'}"`,
      item.expiryDate,
      daysLeft,
      `"${statusText}"`,
      `"${recommendation}"`,
    ];
  });

  const csvContent =
    '\uFEFF' +
    [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
