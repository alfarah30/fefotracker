import { useState, useMemo } from 'react';
import Header from './components/layout/Header';
import NavigationTabs from './components/layout/NavigationTabs';
import PrintHeader from './components/layout/PrintHeader';
import SummaryCards from './components/dashboard/SummaryCards';
import SearchAndFilter from './components/dashboard/SearchAndFilter';
import InventoryTable from './components/dashboard/InventoryTable';
import ReportsView from './components/reports/ReportsView';
import AddBatchModal from './components/modals/AddBatchModal';
import StockOutModal from './components/modals/StockOutModal';
import ConfirmDeleteModal from './components/modals/ConfirmDeleteModal';

import {
  loadInventory,
  saveInventory,
  resetInventory,
} from './utils/storageUtils';
import {
  getDaysUntilExpiry,
  getStatus,
  sortByFEFO,
} from './utils/dateUtils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // State data inventaris obat
  const [inventory, setInventory] = useState(() => loadInventory());

  // State navigasi tab ('inventory' | 'reports')
  const [activeTab, setActiveTab] = useState('inventory');

  // State pencarian & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // State modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stockOutTarget, setStockOutTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Notifikasi toast singkat
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Hitung jumlah kartu ringkasan secara real-time
  const counts = useMemo(() => {
    return inventory.reduce(
      (acc, item) => {
        const status = getStatus(getDaysUntilExpiry(item.expiryDate));
        acc.total += 1;
        acc[status] += 1;
        return acc;
      },
      { total: 0, aman: 0, waspada: 0, kritis: 0 },
    );
  }, [inventory]);

  // Jumlah obat yang butuh perhatian di tab Laporan (Kritis + Waspada)
  const actionCount = counts.kritis + counts.waspada;

  // Urutan FEFO dinamis untuk seluruh data
  const fefoSorted = useMemo(() => {
    return sortByFEFO(inventory);
  }, [inventory]);

  // Data yang sudah difilter dan dicari untuk tabel inventaris
  const filteredInventory = useMemo(() => {
    return fefoSorted.filter((item) => {
      // Filter status
      if (activeFilter !== 'all') {
        const status = getStatus(getDaysUntilExpiry(item.expiryDate));
        if (status !== activeFilter) return false;
      }

      // Pencarian
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const matchName = (item.name || '').toLowerCase().includes(q);
      const matchDosage = (item.dosage || '').toLowerCase().includes(q);
      const matchBatch = (item.batchNumber || '').toLowerCase().includes(q);
      const matchSupplier = (item.supplier || '').toLowerCase().includes(q);

      return matchName || matchDosage || matchBatch || matchSupplier;
    });
  }, [fefoSorted, activeFilter, searchTerm]);

  // Handler: Tambah Batch Obat Baru
  const handleAddBatch = (newBatch) => {
    const updated = [newBatch, ...inventory];
    setInventory(updated);
    saveInventory(updated);
    showNotification(
      `Batch baru ${newBatch.name} (${newBatch.batchNumber}) berhasil ditambahkan dan masuk urutan FEFO!`,
    );
  };

  // Handler: Catat Obat Keluar
  const handleStockOut = (itemId, amount) => {
    const target = inventory.find((i) => i.id === itemId);
    if (!target) return;

    let updated;
    if (target.stock <= amount) {
      // Stok habis -> hapus dari daftar aktif
      updated = inventory.filter((i) => i.id !== itemId);
      showNotification(
        `Stok ${target.name} (Batch: ${target.batchNumber}) telah habis dan otomatis dikeluarkan dari inventaris aktif.`,
        'info',
      );
    } else {
      // Kurangi stok
      updated = inventory.map((i) =>
        i.id === itemId ? { ...i, stock: i.stock - amount } : i,
      );
      showNotification(
        `Berhasil mengeluarkan ${amount} ${target.unit} ${target.name}. Sisa stok: ${target.stock - amount} ${target.unit}.`,
      );
    }

    setInventory(updated);
    saveInventory(updated);
  };

  // Handler: Hapus Batch
  const handleDeleteBatch = (itemId) => {
    const target = inventory.find((i) => i.id === itemId);
    const updated = inventory.filter((i) => i.id !== itemId);
    setInventory(updated);
    saveInventory(updated);
    showNotification(
      `Batch ${target ? target.name + ' (' + target.batchNumber + ')' : ''} berhasil dihapus.`,
      'info',
    );
  };

  // Handler: Reset Data Demo
  const handleResetData = () => {
    const reset = resetInventory();
    setInventory(reset);
    setSearchTerm('');
    setActiveFilter('all');
    showNotification('Data inventaris berhasil dikembalikan ke 8 data demo awal.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
      {/* ── Topbar / Header ── */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* ── Kop Surat Cetak (Hanya tampil saat window.print()) ── */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <PrintHeader
          reportTitle={
            activeTab === 'reports'
              ? 'Laporan Resmi Retur Distributor & Karantina Pemusnahan Obat'
              : 'Daftar Lengkap Inventaris Stok Berdasarkan Urutan FEFO'
          }
        />
      </div>

      {/* ── Konten Utama ── */}
      <main className="mx-auto max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 w-full">
        {/* Banner Notifikasi Toast */}
        {notification && (
          <div
            className={`flex items-center justify-between gap-3 rounded-xl border p-4 shadow-sm transition-all print:hidden ${
              notification.type === 'info'
                ? 'border-blue-200 bg-blue-50 text-blue-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              {notification.type === 'info' ? (
                <AlertCircle size={18} className="text-blue-600 flex-shrink-0" />
              ) : (
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-semibold hover:underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* 4 Kartu Ringkasan Dinamis */}
        <SummaryCards
          counts={counts}
          activeFilter={activeTab === 'inventory' ? activeFilter : null}
          onSelectFilter={(filterKey) => {
            if (activeTab !== 'inventory') setActiveTab('inventory');
            setActiveFilter(filterKey);
          }}
        />

        {/* Navigasi Tab */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          actionCount={actionCount}
          totalCount={counts.total}
        />

        {/* Tampilan Tab 1: Inventaris Stok (FEFO) */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              resultCount={filteredInventory.length}
            />

            {/* Tabel Inventaris Dinamis */}
            <InventoryTable
              data={filteredInventory}
              onOpenStockOut={(item) => setStockOutTarget(item)}
              onOpenDelete={(item) => setDeleteTarget(item)}
              searchTerm={searchTerm}
              activeFilter={activeFilter}
            />
          </div>
        )}

        {/* Tampilan Tab 2: Modul Laporan Retur & Pemusnahan */}
        {activeTab === 'reports' && (
          <ReportsView inventory={fefoSorted} />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between px-4 py-4 text-xs text-gray-500 sm:px-6 lg:px-8 gap-2">
          <p>
            FEFO Tracker — Sistem Manajemen Inventaris &amp; Pemantau Kadaluwarsa Apotek
          </p>
          <p className="flex items-center gap-1.5 font-medium text-teal-700">
            <span>Standar Pelayanan Kefarmasian:</span>
            <span className="rounded bg-teal-50 px-2 py-0.5 text-teal-800">
              First Expired, First Out
            </span>
          </p>
        </div>
      </footer>

      {/* ── Modals ── */}
      <AddBatchModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBatch}
      />

      <StockOutModal
        isOpen={!!stockOutTarget}
        item={stockOutTarget}
        onClose={() => setStockOutTarget(null)}
        onConfirm={handleStockOut}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        item={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteBatch}
      />
    </div>
  );
}
