import { Boxes, ClipboardList } from 'lucide-react';

/**
 * Navigasi Tab Utama (Inventaris Stok FEFO vs Laporan Retur & Pemusnahan)
 * @param {{ activeTab: 'inventory' | 'reports', onTabChange: (tab: string) => void, actionCount: number, totalCount: number }} props
 */
export default function NavigationTabs({
  activeTab,
  onTabChange,
  actionCount,
  totalCount,
}) {
  return (
    <div className="border-b border-gray-200 print:hidden">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {/* Tab 1: Inventaris Stok */}
        <button
          type="button"
          onClick={() => onTabChange('inventory')}
          className={`flex items-center gap-2 border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
            activeTab === 'inventory'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          <Boxes size={18} />
          <span>Inventaris Stok (FEFO)</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              activeTab === 'inventory'
                ? 'bg-teal-100 text-teal-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Tab 2: Laporan Retur & Pemusnahan */}
        <button
          type="button"
          onClick={() => onTabChange('reports')}
          className={`flex items-center gap-2 border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
            activeTab === 'reports'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          <ClipboardList size={18} />
          <span>Laporan Retur &amp; Pemusnahan</span>
          {actionCount > 0 && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                activeTab === 'reports'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {actionCount} Perlu Tindakan
            </span>
          )}
        </button>
      </nav>
    </div>
  );
}
