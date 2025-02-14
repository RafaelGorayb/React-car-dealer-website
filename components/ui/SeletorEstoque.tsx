import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';

interface SortOption {
  label: string;
  value: string;
  orderBy: string;
  isAscending: boolean;
}

interface SortSelectorProps {
  onChange: (orderBy: string, isAscending: boolean) => void;
}

const sortOptions: SortOption[] = [
  { label: 'Marca A - Z', value: 'marca-asc', orderBy: 'marca', isAscending: true },
  { label: 'Marca Z - A', value: 'marca-desc', orderBy: 'marca', isAscending: false },
  { label: 'Preço Menor - Maior', value: 'preco-asc', orderBy: 'preco', isAscending: true },
  { label: 'Preço Maior - Menor', value: 'preco-desc', orderBy: 'preco', isAscending: false },
  { label: 'Ano Ascendente', value: 'ano_modelo-asc', orderBy: 'ano_modelo', isAscending: true },
  { label: 'Ano Descendente', value: 'ano_modelo-desc', orderBy: 'ano_modelo', isAscending: false },
  { label: 'Km Menor - Maior', value: 'km-asc', orderBy: 'km', isAscending: true },
  { label: 'Km Maior - Menor', value: 'km-desc', orderBy: 'km', isAscending: false },
];

const SortSelector: React.FC<SortSelectorProps> = ({ onChange }) => {
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = sortOptions.find(option => option.value === event.target.value);
    if (selectedOption) {
      onChange(selectedOption.orderBy, selectedOption.isAscending);
    }
  };

  return (
    <div className="items-center w-40">
      {/* <label htmlFor="sort" className="mr-2 text-gray-500">Ordenar por:</label> */}
      <Select variant='faded' id="sort" placeholder="Ordenar por:" onChange={handleSortChange}>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default SortSelector;
