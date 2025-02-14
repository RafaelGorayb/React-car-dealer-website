import React from 'react';
import { Button } from "@nextui-org/react";
import { FiltrosPesquisa } from '@/types';
import FilterChips from './FilterChips';

interface FilterSliderProps {
  filters: FiltrosPesquisa | null;
  onClearAll: () => void;
  onRemoveFilter: (key: keyof FiltrosPesquisa) => void;
  hasActiveFilters: boolean;
}

const FilterSlider: React.FC<FilterSliderProps> = ({
  filters,
  onClearAll,
  onRemoveFilter,
  hasActiveFilters
}) => {
  return (
      <div className="w-full pb-3 overflow-x-auto no-scrollbar px-2">
        <div className="inline-flex gap-2 pb-2">            
          {hasActiveFilters && (
            <Button 
              color="warning" 
              size="sm" 
              onClick={onClearAll}
              className="shrink-0"
            >
              Limpar Filtros
            </Button>
          )}
          {filters && (
            <FilterChips
              filters={filters}
              onRemoveFilter={onRemoveFilter}
            />
          )}
        </div>
      </div>
  );
};

export default FilterSlider; 