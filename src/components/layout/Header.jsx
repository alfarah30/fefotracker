import { Pill, Plus, RotateCcw } from 'lucide-react';

/**
 * Header / Topbar aplikasi FEFO Tracker.
 * @param {{ onOpenAddModal: () => void, onResetData: () => void }} props
 */
export default function Header({ onOpenAddModal, onResetData }) {
  const handleResetClick = () => {
    if (
      window.confirm(
        'Kembalikan data ke 8 batch obat demo default? Seluruh perubahan manual saat ini akan direset.',
      )
    ) {
      onResetData();
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* ── Branding ── */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm ring-4 ring-teal-50">
            <Pill size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 sm:text-xl">
                FEFO Tracker
              </h1>
              <span className="hidden rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-teal-800 sm:inline-block">
                APOTEK
              </span>
            </div>
            <p className="hidden text-xs text-gray-500 sm:block">
              Sistem Manajemen Inventaris &amp; Pemantau Kadaluwarsa Apotek
            </p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2">
          {/* Tombol Reset Data Demo */}
          <button
            type="button"
            onClick={handleResetClick}
            title="Kembalikan ke data demo awal"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          >
            <RotateCcw size={14} className="text-gray-400" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>

          {/* Tombol Tambah Batch Obat */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 active:scale-95"
          >
            <Plus size={16} />
            <span>Tambah Batch Obat</span>
          </button>
        </div>
      </div>
    </header>
  );
}
