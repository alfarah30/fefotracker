import { Pill, Plus } from 'lucide-react';

/**
 * Header / Topbar aplikasi FEFO Tracker.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* ── Branding ── */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
            <Pill size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 sm:text-xl">
              FEFO Tracker
            </h1>
            <p className="hidden text-xs text-gray-500 sm:block">
              Sistem Manajemen Inventaris &amp; Pemantau Kadaluarsa Apotek
            </p>
          </div>
        </div>

        {/* ── Tombol placeholder ── */}
        <button
          disabled
          title="Fitur akan tersedia di Minggu 2"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Tambah Batch Obat</span>
        </button>
      </div>
    </header>
  );
}
