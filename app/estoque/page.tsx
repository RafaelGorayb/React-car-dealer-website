"use client";

import React, { useEffect, useState } from "react";
import { Car } from "../../types";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../../config/firestore";
import { useCompareList } from "@/lib/userState";
import CarCard from "@/components/Card";
import CarFilter from "@/components/carFilter";
import { FilterSchemaType } from "@/lib/formTypes";
import { Spinner } from "@nextui-org/react";

function Estoque() {
  const [cars, setCars] = useState<Car[]>([]);

  const { compareList, setCompareList } = useCompareList();

  useEffect(() => {
    const fetchCars = async () => {
      const carsCollection = collection(db, "carros");
      const carsQuery = query(carsCollection, limit(4));
      const carsSnapshot = await getDocs(carsQuery);
      const carsList = carsSnapshot.docs.map((doc) => doc.data() as Car);
      setCars(carsList);
    };

    fetchCars();
  }, []);

  function handleFilterSubmit(data: FilterSchemaType) {
    const filteredCars = cars.filter((car) => {
      if (data.marca && car.Marca !== data.marca) return false;
      if (data.precoMin && car.Preco < data.precoMin) return false;
      if (data.precoMax && car.Preco > data.precoMax) return false;
      if (
        data.anoMin &&
        car.Especificacoes.ano_de_fabricacao < data.anoMin.getFullYear()
      )
        return false;
      if (
        data.anoMax &&
        car.Especificacoes.ano_de_fabricacao > data.anoMax.getFullYear()
      )
        return false;
      if (data.kmMin && car.Especificacoes.km < data.kmMin) return false;
      if (data.kmMax && car.Especificacoes.km > data.kmMax) return false;
      // if (data.motorizacao && car.Especificacoes.motorizacao !== data.motorizacao)
      //   return false;
      if (data.blindado && !car.Especificacoes.blindado) return false;
      return true;
    });
    setCars(filteredCars);
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Filtros</h2>
        <CarFilter submitForm={handleFilterSubmit} />
      </div>

      <div className="w-full md:w-3/4 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.length === 0 ? (
            <Spinner />
          ) : (
            cars.map((car, index) => <CarCard key={index} car={car} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default Estoque;
