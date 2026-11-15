import dummyInventory from '../data/dummyData';

const STORAGE_KEY = 'fefo_tracker_inventory';

/**
 * Membaca data inventaris dari LocalStorage.
 * Jika kosong atau belum ada, gunakan data dummy bawaan dan simpan ke LocalStorage.
 * @returns {Array}
 */
export function loadInventory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveInventory(dummyInventory);
      return dummyInventory;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveInventory(dummyInventory);
    return dummyInventory;
  } catch (error) {
    console.error('Gagal membaca dari LocalStorage:', error);
    return dummyInventory;
  }
}

/**
 * Menyimpan data inventaris ke LocalStorage.
 * @param {Array} inventory
 */
export function saveInventory(inventory) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  } catch (error) {
    console.error('Gagal menyimpan ke LocalStorage:', error);
  }
}

/**
 * Mengembalikan data inventaris ke data dummy default.
 * @returns {Array}
 */
export function resetInventory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    saveInventory(dummyInventory);
  } catch (error) {
    console.error('Gagal mereset LocalStorage:', error);
  }
  return dummyInventory;
}
