"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Car, FiltrosPesquisa } from "../../types";
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
  const [currentFilters, setCurrentFilters] = useState<FiltrosPesquisa | null>(null);
  const [marcasDisponiveis, setMarcasDisponiveis] = useState<string[]>([]);
  
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

  const buildQuery = (filters?: FiltrosPesquisa) => {
    const carsCollection = collection(db, "carros");
  
    let carsQuery = query(
      carsCollection,
      where("Marca", "!=", "")
    );
  
    if (filters?.precoMax !== undefined && !isNaN(filters.precoMax)) {
      carsQuery = query(carsQuery, where("Preco", "<", filters.precoMax));
    } else {
      carsQuery = query(carsQuery, where("Preco", "<", 100000000));
    }
  
    if (filters?.precoMin !== undefined && !isNaN(filters.precoMin)) {
      carsQuery = query(carsQuery, where("Preco", ">", filters.precoMin));
    } else {
      carsQuery = query(carsQuery, where("Preco", ">", 0));
    }
  
    if (filters?.kmMax !== undefined && !isNaN(filters.kmMax)) {
      carsQuery = query(carsQuery, where("Especificacoes.km", "<", filters.kmMax));
    } else {
      carsQuery = query(carsQuery, where("Especificacoes.km", "<", 10000000));
    }
  
    if (filters?.kmMin !== undefined && !isNaN(filters.kmMin)) {
      carsQuery = query(carsQuery, where("Especificacoes.km", ">", filters.kmMin));
    } else {
      carsQuery = query(carsQuery, where("Especificacoes.km", ">", 0));
    }
  
    if (filters?.anoMin !== undefined && !isNaN(filters.anoMin)) {
      carsQuery = query(carsQuery, where("Especificacoes.ano_de_fabricacao", ">", filters.anoMin));
    } else {
      carsQuery = query(carsQuery, where("Especificacoes.ano_de_fabricacao", ">", 0));
    }
  
    if (filters?.anoMax !== undefined && !isNaN(filters.anoMax)) {
      carsQuery = query(carsQuery, where("Especificacoes.ano_de_fabricacao", "<", filters.anoMax));
    } else {
      carsQuery = query(carsQuery, where("Especificacoes.ano_de_fabricacao", "<", 9999));
    }

    // if(filters?.blindado !== false) {
    //   carsQuery = query(carsQuery, where("Especificacoes.blindado", "==", true));
    // }
  
    carsQuery = query(carsQuery, orderBy("Marca", "asc"), limit(12));
  
    if (filters?.marca) {
      carsQuery = query(carsQuery, where("Marca", "==", filters.marca));
    }
  
    console.log('Building query with filters:', filters);
    return carsQuery;
  };
  
  const fetchCars = async (isInitial = false, filters?: FiltrosPesquisa) => {
    setIsLoading(true);
    let carsQuery = buildQuery(filters);
  
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
      fetchMarcas();
  }, []);

  useEffect(() => {



  }, []);

  async function fetchMarcas() {
    const marcas = await getMarcasDisponiveis();
    setMarcasDisponiveis(marcas);
  }

  function handleFilterSubmit(data: FiltrosPesquisa) {
    console.log("Filtros aplicados:", data);
    setCurrentFilters(data);
    setLastDoc(null);
    setHasMore(true);
    fetchCars(true, data);
  }

  // Função para pegar marcas disponíveis
  async function getMarcasDisponiveis() {
    const carsCollection = collection(db, "carros");
    const carsQuery = query(carsCollection, where("Marca", "!=", ""));
    const marcasDisponiveis: string[] = [];
    const querySnapshot = await getDocs(carsQuery);
    
    querySnapshot.forEach((doc) => {
      const marca = doc.data().Marca;
      if (!marcasDisponiveis.includes(marca)) {
        marcasDisponiveis.push(marca);
      }
    });

    return marcasDisponiveis;
  }

  return (
    <div className="relative">
      <CarFilter submitForm={handleFilterSubmit} marcasDisponiveis={marcasDisponiveis} />

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
