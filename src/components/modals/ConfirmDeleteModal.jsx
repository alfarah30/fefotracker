import { X, Trash2, AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal({ isOpen, onClose, item, onConfirm }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Hapus Batch Obat
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4">
            <AlertTriangle size={22} className="flex-shrink-0 text-red-500 mt-0.5" />
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                Apakah Anda yakin ingin menghapus data batch obat berikut dari inventaris?
              </p>
              <p className="font-semibold text-gray-900">
                {item.name} {item.dosage}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                No. Batch: {item.batchNumber} | Stok: {item.stock} {item.unit}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Tindakan ini tidak dapat dibatalkan, namun Anda dapat mereset data demo kapan saja jika diperlukan.
          </p>

          {/* Footer Buttons */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(item.id);
                onClose();
              }}
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition"
            >
              Ya, Hapus Batch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
