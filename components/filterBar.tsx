import React from 'react';

interface FilterBarProps {
  carCount: number;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ carCount, onFilterChange }) => {
  return (
    <>
    <div className="flex flex-col sm:flex-row justify-between  mb-4 py-4 border-b">
      <p className="text-lg font-semibold">{carCount} veículos encontrados</p>
      </div>
      <div className="flex justify-between items-center mt-2 sm:mt-0 py-2 bg-stone-50">
        <button className="mr-2 p-2 bg-red-500 text-white rounded">Filtrar</button>
        <select onChange={onFilterChange} className="p-2 border rounded">
          <option value="marca">Ordenar por: Marca A - Z</option>
          <option value="preco">Ordenar por: Preço</option>
        </select>
      </div>
      </>
  );
};

export default FilterBar;
