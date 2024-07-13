"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Car } from "../../types";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  orderBy,
  DocumentSnapshot,
  where,
} from "firebase/firestore";
import { db } from "../../config/firestore";
import { useCompareList } from "@/lib/userState";
import CarCard from "@/components/Card";
import CarFilter from "@/components/carFilter";
import { FilterSchemaType } from "@/lib/formTypes";

function Estoque() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<FilterSchemaType | null>(
    null
  );

  const { compareList, setCompareList } = useCompareList();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCarElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreCars();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchCars = async (isInitial = false, filters?: FilterSchemaType) => {
    setIsLoading(true);
    const carsCollection = collection(db, "carros");
    let carsQuery = query(carsCollection, orderBy("Preco"), limit(12));

    if (filters) {
      if (filters.marca) {
        carsQuery = query(carsQuery, where("Marca", "==", filters.marca));
      }
      if (filters.precoMin) {
        carsQuery = query(carsQuery, where("Preco", ">=", filters.precoMin));
      }
      if (filters.precoMax) {
        carsQuery = query(carsQuery, where("Preco", "<=", filters.precoMax));
      }
      if (filters.anoMin) {
        carsQuery = query(
          carsQuery,
          where(
            "Especificacoes.ano_de_fabricacao",
            ">=",
            filters.anoMin.getFullYear()
          )
        );
      }
      if (filters.anoMax) {
        carsQuery = query(
          carsQuery,
          where(
            "Especificacoes.ano_de_fabricacao",
            "<=",
            filters.anoMax.getFullYear()
          )
        );
      }
      if (filters.kmMin) {
        carsQuery = query(
          carsQuery,
          where("Especificacoes.km", ">=", filters.kmMin)
        );
      }
      if (filters.kmMax) {
        carsQuery = query(
          carsQuery,
          where("Especificacoes.km", "<=", filters.kmMax)
        );
      }
      if (filters.motorizacao) {
        carsQuery = query(
          carsQuery,
          where("Especificacoes.motor", "==", filters.motorizacao)
        );
      }
      if (filters.blindado !== undefined) {
        carsQuery = query(
          carsQuery,
          where("Especificacoes.blindado", "==", filters.blindado)
        );
      }
    }

    if (!isInitial && lastDoc) {
      carsQuery = query(carsQuery, startAfter(lastDoc));
    }

    const carsSnapshot = await getDocs(carsQuery);
    const carsList = carsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Car
    );

    if (isInitial) {
      setCars(carsList);
    } else {
      setCars((prevCars) => [...prevCars, ...carsList]);
    }

    setLastDoc(carsSnapshot.docs[carsSnapshot.docs.length - 1] || null);
    setHasMore(carsSnapshot.docs.length === 12);
    setIsLoading(false);
  };

  const fetchMoreCars = () => {
    if (!isLoading && hasMore) {
      fetchCars(false, currentFilters || undefined);
    }
  };

  useEffect(() => {
    fetchCars(true);
  }, []);

  function handleFilterSubmit(data: FilterSchemaType) {
    setCurrentFilters(data);
    setLastDoc(null);
    setHasMore(true);
    fetchCars(true, data);
  }

  return (
    <div className="relative">
      <CarFilter submitForm={handleFilterSubmit} />

      <div className="lg:ml-80 p-4">
        <div className="grid gap-4 justify-items-center grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car, index) => (
            <div
              key={car.id}
              ref={index === cars.length - 1 ? lastCarElementRef : null}
            >
              <CarCard car={car} isLoading={false} />
            </div>
          ))}
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <CarCard
                key={`loading-${index}`}
                car={{} as Car}
                isLoading={true}
              />
            ))}
        </div>
        {!hasMore && (
          <p className="text-center mt-4">Não há mais carros para carregar.</p>
        )}
      </div>
    </div>
  );
}

export default Estoque;
