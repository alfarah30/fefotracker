import { Search, X, Filter } from 'lucide-react';

const filterOptions = [
  { id: 'all', label: 'Semua Status' },
  { id: 'aman', label: 'Aman (> 6 bln)', activeClass: 'bg-emerald-600 text-white' },
  { id: 'waspada', label: 'Waspada (1–6 bln)', activeClass: 'bg-amber-600 text-white' },
  { id: 'kritis', label: 'Kritis / Kedaluwarsa', activeClass: 'bg-red-600 text-white' },
];

/**
 * Komponen Input Pencarian & Filter Cepat Status
 * @param {{
 *   searchTerm: string,
 *   onSearchChange: (value: string) => void,
 *   activeFilter: string,
 *   onFilterChange: (filter: string) => void,
 *   resultCount: number
 * }} props
 */
export default function SearchAndFilter({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  resultCount,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama obat, batch, atau PBF..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="hidden items-center gap-1 text-xs text-gray-400 lg:flex mr-1">
          <Filter size={13} />
          Filter:
        </span>
        {filterOptions.map((opt) => {
          const isActive = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onFilterChange(opt.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? opt.activeClass || 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
