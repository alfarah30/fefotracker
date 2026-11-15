import Header from './components/layout/Header';
import SummaryCards from './components/dashboard/SummaryCards';
import InventoryTable from './components/dashboard/InventoryTable';
import dummyInventory from './data/dummyData';
import { getDaysUntilExpiry, getStatus } from './utils/dateUtils';

/**
 * Root component – Layout utama dashboard FEFO Tracker.
 */
export default function App() {
  // Hitung jumlah per status
  const counts = dummyInventory.reduce(
    (acc, item) => {
      const status = getStatus(getDaysUntilExpiry(item.expiryDate));
      acc.total += 1;
      acc[status] += 1;
      return acc;
    },
    { total: 0, aman: 0, waspada: 0, kritis: 0 },
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Kartu Ringkasan */}
        <SummaryCards counts={counts} />

        {/* Tabel Inventaris */}
        <InventoryTable data={dummyInventory} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-gray-400 sm:px-6 lg:px-8">
          FEFO Tracker v0.1 — Minggu 1 • Fondasi UI &amp; Data Dummy •{' '}
          <span className="font-medium text-teal-600">
            First Expired, First Out
          </span>
        </div>
      </footer>
    </div>
  );
}
