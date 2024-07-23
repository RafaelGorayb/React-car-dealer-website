"use client";
import React, { useEffect, useState } from "react";
import CarCard from "@/components/Card";
import { Car } from "../../types";
import { db } from "../../config/firestore";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const RecemChegados = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCars = async () => {
      const carsCollection = collection(db, "carros");
      const carsQuery = query(carsCollection, limit(5));
      const carsSnapshot = await getDocs(carsQuery);
      const carsList = carsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Car
      );
      setCars(carsList);
      setIsLoading(false);
    };

    fetchRecentCars();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarCard key={`loading-${index}`} car={{} as Car} isLoading={true} />
        ))}
      </div>
    );
  }

  return (
    <> 
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} isLoading={false} />
      ))}
    </div>
    </>
  );
};

export default RecemChegados;
