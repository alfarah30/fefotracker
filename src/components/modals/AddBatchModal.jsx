import { useState } from 'react';
import { X, PlusCircle, Building2, Package, Calendar, Tag, Layers } from 'lucide-react';

const COMMON_SUPPLIERS = [
  'PT Kimia Farma Trading & Distribution',
  'PT Enseval Putera Megatrading',
  'PT Anugrah Argon Medica',
  'PT Mensa Bina Sukses',
  'PT Parit Padang Global',
  'PT Dexa Medica Distribution',
  'PT Tempo Scan Pacific',
  'PT Kalbe Farma Tbk',
];

const COMMON_UNITS = ['Box', 'Strip', 'Botol', 'Tube', 'Ampul', 'Vial', 'Sachet'];

export default function AddBatchModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    batchNumber: '',
    supplier: '',
    stock: '',
    unit: 'Box',
    expiryDate: '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama obat wajib diisi';
    if (!formData.batchNumber.trim()) errs.batchNumber = 'Nomor batch wajib diisi';
    if (!formData.supplier.trim()) errs.supplier = 'Nama PBF / Pemasok wajib diisi';
    if (!formData.stock || Number(formData.stock) <= 0) {
      errs.stock = 'Jumlah stok minimal 1';
    }
    if (!formData.expiryDate) {
      errs.expiryDate = 'Tanggal kadaluwarsa wajib dipilih';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAdd({
      ...formData,
      stock: Number(formData.stock),
      id: Date.now(),
    });

    // Reset form & close
    setFormData({
      name: '',
      dosage: '',
      batchNumber: '',
      supplier: '',
      stock: '',
      unit: 'Box',
      expiryDate: '',
    });
    setErrors({});
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
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Tambah Batch Obat Baru
              </h3>
              <p className="text-xs text-gray-500">
                Data akan otomatis masuk ke antrean urutan FEFO
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama Obat & Dosis */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nama Obat <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Misal: Paracetamol, Amoxicillin"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Dosis / Sediaan
              </label>
              <input
                type="text"
                name="dosage"
                placeholder="500 mg, Sirup"
                value={formData.dosage}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
            </div>
          </div>

          {/* Nomor Batch & Tanggal Kadaluwarsa */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Tag size={13} className="text-gray-400" />
                Nomor Batch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="batchNumber"
                placeholder="Misal: PCM-2026A"
                value={formData.batchNumber}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 font-mono text-sm uppercase focus:outline-none focus:ring-2 ${
                  errors.batchNumber
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'
                }`}
              />
              {errors.batchNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.batchNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar size={13} className="text-gray-400" />
                Tanggal Kadaluwarsa <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.expiryDate
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'
                }`}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-xs text-red-500">{errors.expiryDate}</p>
              )}
            </div>
          </div>

          {/* Nama PBF / Pemasok */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Building2 size={13} className="text-gray-400" />
              Nama PBF / Pemasok <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="supplier"
              list="supplier-suggestions"
              placeholder="Ketik atau pilih nama PBF distributor"
              value={formData.supplier}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                errors.supplier
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'
              }`}
            />
            <datalist id="supplier-suggestions">
              {COMMON_SUPPLIERS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            {errors.supplier && (
              <p className="mt-1 text-xs text-red-500">{errors.supplier}</p>
            )}
          </div>

          {/* Jumlah Stok & Satuan */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Package size={13} className="text-gray-400" />
                Jumlah Stok Masuk <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                min="1"
                placeholder="Jumlah"
                value={formData.stock}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.stock
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'
                }`}
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Layers size={13} className="text-gray-400" />
                Satuan Kemasan
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
              className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 transition"
            >
              Simpan Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
