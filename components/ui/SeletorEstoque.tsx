import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';

interface SortSelectorProps {
  onChange: (orderBy: string, isAscending: boolean) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ onChange }) => {
  const handleSortChange = (selected: any) => {
    const [orderBy, orderDirection] = selected.target.value.split("-");
    onChange(orderBy, orderDirection === "asc");
  };

  return (
    <div className="items-center w-40">
      {/* <label htmlFor="sort" className="mr-2 text-gray-500">Ordenar por:</label> */}
      <Select id="sort" placeholder="Ordenar por:" onChange={handleSortChange}>
        <SelectItem key="marca-asc" value="marca-asc">Marca A - Z</SelectItem>
        <SelectItem key="marca-desc" value="marca-desc">Marca Z - A</SelectItem>
        <SelectItem key="preco-asc" value="preco-asc">Preço Menor - Maior</SelectItem>
        <SelectItem key="preco-desc" value="preco-desc">Preço Maior - Menor</SelectItem>
        <SelectItem key="ano_modelo-asc" value="ano_modelo-asc">Ano Ascendente</SelectItem>
        <SelectItem key="ano_modelo-desc" value="ano_modelo-desc">Ano Descendente</SelectItem>
        <SelectItem key="km-asc" value="km-asc">Km Menor - Maior</SelectItem>
        <SelectItem key="km-desc" value="km-desc">Km Maior - Menor</SelectItem>
      </Select>
    </div>
  );
};

export default SortSelector;
