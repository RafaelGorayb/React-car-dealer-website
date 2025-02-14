import React from 'react';
import { Chip } from "@nextui-org/react";
import { X } from "lucide-react";
import { FiltrosPesquisa } from '@/types';

interface FilterChipsProps {
  filters: FiltrosPesquisa;
  onRemoveFilter: (key: keyof FiltrosPesquisa) => void;
}

const formatFilterLabel = (key: string, value: any): string | null => {
  if (!value || (typeof value === 'string' && !value.trim()) || value === 0) return null;
  
  switch (key) {
    case 'precoMin':
      return `Preço min: R$ ${value.toLocaleString()}`;
    case 'precoMax':
      return `Preço máx: R$ ${value.toLocaleString()}`;
    case 'anoMin':
      return `Ano min: ${value}`;
    case 'anoMax':
      return `Ano máx: ${value}`;
    case 'kmMin':
      return `Km min: ${value.toLocaleString()}`;
    case 'kmMax':
      return `Km máx: ${value.toLocaleString()}`;
    case 'blindado':
      return value ? 'Blindado' : null;
    case 'marca':
      return value ? `Marca: ${value}` : null;
    case 'modelo':
      return value ? `Modelo: ${value}` : null;
    case 'versao':
      return value ? `Versão: ${value}` : null;
    case 'cor':
      return value ? `Cor: ${value}` : null;
    case 'motorizacao':
      return value ? `Motor: ${value}` : null;
    case 'carroceria':
      return value ? `Carroceria: ${value}` : null;
    default:
      return value ? `${key}: ${value}` : null;
  }
};

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onRemoveFilter }) => {
  return (
    <div className="flex gap-2 items-center">
      {Object.entries(filters).map(([key, value]) => {
        const label = formatFilterLabel(key, value);
        if (!label) return null;

        return (
          <Chip
            key={key}
            onClose={() => onRemoveFilter(key as keyof FiltrosPesquisa)}
            variant="flat"
            color="primary"
            className="px-2 py-1 text-sm bg-primary-100 shrink-0"
            endContent={<X size={14} className="cursor-pointer" />}
          >
            {label}
          </Chip>
        );
      })}
    </div>
  );
};

export default FilterChips; 