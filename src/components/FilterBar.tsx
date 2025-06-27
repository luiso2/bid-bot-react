// Filter Bar component

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { PRICE_RANGES } from '@/utils/constants';
import { cn } from '@/utils/helpers';

export const FilterBar: React.FC = () => {
  const filter = useAppStore((state) => state.filter);
  const setFilter = useAppStore((state) => state.setFilter);
  const brands = useAppStore((state) => state.brands);
  const resetFilter = useAppStore((state) => state.resetFilter);

  const hasActiveFilters = filter.brand || filter.priceRange || filter.searchTerm;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {/* Brand Filter */}
        <select
          value={filter.brand}
          onChange={(e) => setFilter({ brand: e.target.value })}
          className={cn(
            'flex-1 px-3 py-2 bg-tg-bg text-tg-text border rounded-lg',
            'focus:outline-none focus:border-tg-link focus:ring-2 focus:ring-tg-link/20',
            filter.brand ? 'border-tg-link' : 'border-tg-hint/30'
          )}
        >
          <option value="">Todas las marcas</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.slug}>
              {brand.name} ({brand.count})
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          value={filter.priceRange}
          onChange={(e) => setFilter({ priceRange: e.target.value })}
          className={cn(
            'flex-1 px-3 py-2 bg-tg-bg text-tg-text border rounded-lg',
            'focus:outline-none focus:border-tg-link focus:ring-2 focus:ring-tg-link/20',
            filter.priceRange ? 'border-tg-link' : 'border-tg-hint/30'
          )}
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-tg-hint">
            Filtros activos
          </p>
          <button
            onClick={resetFilter}
            className="text-sm text-tg-link hover:text-tg-link/80 font-medium transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
