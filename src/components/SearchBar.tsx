// Search Bar component

import React, { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { debounce } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

export const SearchBar: React.FC = () => {
  const filter = useAppStore((state) => state.filter);
  const setFilter = useAppStore((state) => state.setFilter);
  const [localValue, setLocalValue] = useState(filter.searchTerm);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilter({ searchTerm: value });
    }, 300),
    [setFilter]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setLocalValue('');
    setFilter({ searchTerm: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ searchTerm: localValue });
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder="Buscar vehículos..."
          className="w-full pl-10 pr-10 py-3 bg-tg-bg text-tg-text border border-tg-hint/30 rounded-lg focus:outline-none focus:border-tg-link focus:ring-2 focus:ring-tg-link/20 transition-all"
          autoComplete="off"
        />
        
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-hint pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Clear Button */}
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-tg-hint hover:text-tg-text transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Search button for mobile */}
      <button
        type="submit"
        className="sr-only"
        aria-label="Search"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;
