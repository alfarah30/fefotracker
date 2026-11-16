/**
 * Utilitas tanggal untuk menghitung sisa masa simpan,
 * menentukan status kadaluwarsa obat, dan pengurutan FEFO.
 */

/**
 * Hitung selisih hari dari hari ini hingga tanggal kadaluwarsa.
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
 * Tentukan status berdasarkan aturan sisa hari:
 *  - "kritis"  → <= 30 hari atau sudah lewat (Merah)
 *  - "waspada" → 31 s/d 180 hari (1–6 bulan) (Kuning)
 *  - "aman"    → > 180 hari (> 6 bulan) (Hijau)
 *
 * @param {number} daysLeft
 * @returns {"aman" | "waspada" | "kritis"}
 */
export function getStatus(daysLeft) {
  if (daysLeft <= 30) return 'kritis';
  if (daysLeft <= 180) return 'waspada';
  return 'aman';
}

/**
 * Format sisa hari menjadi teks informatif:
 * - Jika <= 0: "Kadaluwarsa" atau "Kadaluwarsa (X hari lalu)"
 * - Jika 1 s/d 30: "Sisa X hari"
 * - Jika > 30: "X bulan Y hari"
 *
 * @param {number} daysLeft
 * @returns {string}
 */
export function formatRemainingTime(daysLeft) {
  if (daysLeft < 0) {
    const overdue = Math.abs(daysLeft);
    return `Kadaluwarsa (${overdue} hari lalu)`;
  }
  if (daysLeft === 0) return 'Kadaluwarsa hari ini';
  if (daysLeft <= 30) return `Sisa ${daysLeft} hari`;

  if (daysLeft <= 365) {
    const months = Math.floor(daysLeft / 30);
    const remDays = daysLeft % 30;
    return remDays > 0 ? `${months} bulan ${remDays} hari` : `${months} bulan`;
  }

  const years = Math.floor(daysLeft / 365);
  const remMonths = Math.floor((daysLeft % 365) / 30);
  return remMonths > 0 ? `${years} tahun ${remMonths} bulan` : `${years} tahun`;
}

/**
 * Format tanggal ISO (YYYY-MM-DD) ke format Indonesia (DD MMM YYYY).
 * @param {string} dateStr - Format "YYYY-MM-DD"
 * @returns {string}
 */
export function formatDateID(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Urutkan array obat berdasarkan prinsip FEFO (First Expired, First Out)
 * Tanggal kadaluwarsa paling dekat atau sudah lewat selalu di posisi teratas.
 * @param {Array} items
 * @returns {Array} Array terurut baru
 */
export function sortByFEFO(items) {
  return [...items].sort((a, b) => {
    const timeA = new Date(a.expiryDate + 'T00:00:00').getTime();
    const timeB = new Date(b.expiryDate + 'T00:00:00').getTime();
    return timeA - timeB;
  });
}
