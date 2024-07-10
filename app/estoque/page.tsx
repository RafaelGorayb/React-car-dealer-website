'use client'

import React, { useEffect, useState } from 'react';
import { Car } from '../../types';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../config/firestore'; // Certifique-se de que o Firebase está configurado corretamente
import Card from '../../components/Card'; // Vamos criar esse componente
import FilterBar from '../../components/filterBar'; // Novo componente de barra de filtro

const Estoque: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filter, setFilter] = useState<string>('marca');

  useEffect(() => {
    const fetchCars = async () => {
      const carsCollection = collection(db, 'carros');
      const carsQuery = query(carsCollection, limit(4)); // Pode ajustar conforme necessário
      const carsSnapshot = await getDocs(carsQuery);
      const carsList = carsSnapshot.docs.map(doc => doc.data() as Car);
      setCars(carsList);
    };

    fetchCars();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
    // Adicione a lógica de filtragem/sorting aqui, se necessário
  };

  return (
    <div>
      <FilterBar carCount={cars.length} onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {cars.map((car, index) => (
          <Card key={index} car={car} />
        ))}
      </div>
    </div>
  );
};

export default Estoque;
