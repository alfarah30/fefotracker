/**
 * Data dummy 8 batch obat apotek Indonesia.
 * Disusun berdasarkan prinsip FEFO (First Expired, First Out).
 *
 * Catatan:
 * - Paracetamol 500 mg → 2 batch (Kritis & Aman)
 * - Amoxicillin 500 mg → 2 batch (Waspada & Aman)
 */

const dummyInventory = [
  {
    id: 1,
    name: 'Cefixime',
    dosage: '100 mg',
    batchNumber: 'CFX-2024A',
    stock: 5,
    unit: 'Box',
    expiryDate: '2026-10-30',
  },
  {
    id: 2,
    name: 'Paracetamol',
    dosage: '500 mg',
    batchNumber: 'PCM-2024A',
    stock: 12,
    unit: 'Box',
    expiryDate: '2026-11-30',
  },
  {
    id: 3,
    name: 'Amoxicillin',
    dosage: '500 mg',
    batchNumber: 'AMX-2025A',
    stock: 20,
    unit: 'Box',
    expiryDate: '2027-03-20',
  },
  {
    id: 4,
    name: 'Omeprazole',
    dosage: '20 mg',
    batchNumber: 'OMP-2025A',
    stock: 8,
    unit: 'Strip',
    expiryDate: '2027-04-15',
  },
  {
    id: 5,
    name: 'Paracetamol',
    dosage: '500 mg',
    batchNumber: 'PCM-2025B',
    stock: 30,
    unit: 'Box',
    expiryDate: '2027-08-15',
  },
  {
    id: 6,
    name: 'Amoxicillin',
    dosage: '500 mg',
    batchNumber: 'AMX-2025B',
    stock: 15,
    unit: 'Box',
    expiryDate: '2027-09-10',
  },
  {
    id: 7,
    name: 'Cetirizine',
    dosage: '10 mg',
    batchNumber: 'CTZ-2025A',
    stock: 25,
    unit: 'Strip',
    expiryDate: '2027-10-20',
  },
  {
    id: 8,
    name: 'Salbutamol Inhaler',
    dosage: '',
    batchNumber: 'SBT-2025A',
    stock: 10,
    unit: 'Botol',
    expiryDate: '2027-12-01',
  },
];

export default dummyInventory;
