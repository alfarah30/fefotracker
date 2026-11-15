/**
 * Utilitas tanggal untuk menghitung sisa masa simpan
 * dan menentukan status kadaluarsa obat.
 */

/**
 * Hitung selisih hari dari hari ini hingga tanggal kedaluwarsa.
 * @param {string} expiryDateStr - Format "YYYY-MM-DD"
 * @returns {number} Jumlah hari tersisa (negatif = sudah lewat)
 */
export function getDaysUntilExpiry(expiryDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr + 'T00:00:00');
  const diffMs = expiry - today;

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Tentukan status berdasarkan sisa hari:
 *  - "kritis"  → < 30 hari atau sudah lewat
 *  - "waspada" → 30 – 180 hari (1–6 bulan)
 *  - "aman"    → > 180 hari (> 6 bulan)
 *
 * @param {number} daysLeft
 * @returns {"aman" | "waspada" | "kritis"}
 */
export function getStatus(daysLeft) {
  if (daysLeft < 30) return 'kritis';
  if (daysLeft <= 180) return 'waspada';
  return 'aman';
}

/**
 * Format sisa hari menjadi string yang mudah dibaca.
 * @param {number} daysLeft
 * @returns {string}
 */
export function formatRemainingTime(daysLeft) {
  if (daysLeft < 0) {
    const overdue = Math.abs(daysLeft);
    return `Kedaluwarsa ${overdue} hari lalu`;
  }
  if (daysLeft === 0) return 'Kedaluwarsa hari ini';
  if (daysLeft <= 30) return `${daysLeft} hari`;
  if (daysLeft <= 365) {
    const months = Math.floor(daysLeft / 30);
    const remainingDays = daysLeft % 30;
    return remainingDays > 0
      ? `${months} bulan ${remainingDays} hari`
      : `${months} bulan`;
  }
  const years = Math.floor(daysLeft / 365);
  const remainingMonths = Math.floor((daysLeft % 365) / 30);
  return remainingMonths > 0
    ? `${years} tahun ${remainingMonths} bulan`
    : `${years} tahun`;
}

/**
 * Format tanggal ISO ke format Indonesia (DD MMM YYYY).
 * @param {string} dateStr - Format "YYYY-MM-DD"
 * @returns {string}
 */
export function formatDateID(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
