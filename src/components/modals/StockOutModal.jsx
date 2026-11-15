import { useState, useEffect } from 'react';
import { X, ArrowDownRight, AlertCircle, AlertTriangle } from 'lucide-react';

export default function StockOutModal({ isOpen, onClose, item, onConfirm }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAmount('');
    setError('');
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const currentStock = item.stock;
  const numAmount = Number(amount);
  const willDeplete = numAmount === currentStock;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || numAmount <= 0) {
      setError('Jumlah obat keluar harus lebih dari 0');
      return;
    }
    if (numAmount > currentStock) {
      setError(`Jumlah keluar melebihi sisa stok (${currentStock} ${item.unit})`);
      return;
    }

    onConfirm(item.id, numAmount);
    onClose();
  };

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ArrowDownRight size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Catat Obat Keluar
              </h3>
              <p className="text-xs text-gray-500">
                Pengurangan stok inventaris aktif
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Info Obat */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.name} {item.dosage}
                </p>
                <p className="text-xs text-gray-500">
                  Batch: <span className="font-mono font-medium">{item.batchNumber}</span>
                </p>
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                Sisa: {currentStock} {item.unit}
              </span>
            </div>
            {item.supplier && (
              <p className="text-xs text-gray-400">
                Pemasok: {item.supplier}
              </p>
            )}
          </div>

          {/* Input Kuantitas */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Jumlah Obat Keluar ({item.unit}) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max={currentStock}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder={`Maksimal ${currentStock}`}
              autoFocus
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'
              }`}
            />
            {error && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={13} />
                {error}
              </p>
            )}
          </div>

          {/* Peringatan jika stok habis */}
          {willDeplete && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
              <span>
                Jumlah keluar sama dengan sisa stok. Batch ini akan <strong>habis dan otomatis dihapus</strong> dari daftar inventaris aktif.
              </span>
            </div>
          )}

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
              type="submit"
              className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 transition"
            >
              Keluarkan Stok
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
