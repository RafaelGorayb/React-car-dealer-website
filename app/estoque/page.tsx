"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Car, FiltrosPesquisa } from "../../types";
import CarCard from "@/components/Card";
import CarFilterSideMenu from "@/components/carFilter";
import { Button } from "@nextui-org/react";
import { FilterIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function Estoque() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCarId, setLastCarId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<FiltrosPesquisa | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const supabase = createClient();

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

  const fetchCars = async (isInitial = false) => {
    setIsLoading(true);
    let query = supabase
      .from("carro")
      .select(
        `
        *,
        opcionais_carro (nome),
        fotos_urls (url)
      `
      )
      .order("id", { ascending: true })
      .limit(12);

    // Aplicar filtros se tiver algum
    if (filters) {
      if (filters.marca)
        query = query.eq("marca", filters.marca);
      if (filters.modelo)
        query = query.eq("modelo", filters.modelo);
      if (filters.versao)
        query = query.eq("versao", filters.versao);
      if (filters.precoMin)
        query = query.gte("preco", filters.precoMin);
      if (filters.precoMax)
        query = query.lte("preco", filters.precoMax);
      if (filters.anoMin)
        query = query.gte("ano_modelo", filters.anoMin);
      if (filters.anoMax)
        query = query.lte("ano_modelo", filters.anoMax);
      if (filters.kmMin)
        query = query.gte("km", filters.kmMin);
      if (filters.kmMax)
        query = query.lte("km", filters.kmMax);
      if (filters.cor != "")
        query = query.eq("cor", filters.cor);
      if (filters.carroceria != "")
        query = query.eq("carroceria", filters.carroceria);
      if (filters.blindado)
        query = query.eq("blindado", filters.blindado);
    }

    if (!isInitial && lastCarId) {
      query = query.gt("id", lastCarId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar carros:", error);
      setIsLoading(false);
      return;
    }

    const carsList: Car[] = data.map((carro: any) => {
      
      return {
        id: carro.id,
        marca: carro.marca,
        modelo: carro.modelo,
        versao: carro.versao,
        preco: carro.preco,
        ano_modelo: carro.ano_modelo,
        ano_fabricacao: carro.ano_fabricacao,
        km: carro.km,
        cor: carro.cor,
        motorizacao: carro.motorizacao,
        potencia: carro.potencia,
        torque: carro.torque,
        cambio: carro.cambio,
        tracao: carro.tracao,
        direcao: carro.direcao,
        freios: carro.freios,
        rodas: carro.rodas,
        bancos: carro.bancos,
        airbags: carro.airbag,
        ar_condicionado: carro.ar_condicionado,
        farol: carro.farol,
        multimidia: carro.multimidia,
        final_placa: carro.final_placa,
        carroceria: carro.carroceria,
        blindado: carro.blindado,
        opcionais: carro.opcionais_carro
          ? carro.opcionais_carro.map((opcional: any) => opcional.nome)
          : [],
        fotos: carro.fotos_urls
          ? carro.fotos_urls.map((foto: any) => foto.url)
          : [],
      };
    });

    if (isInitial) {
      setCars(carsList);
    } else {
      setCars((prevCars) => [...prevCars, ...carsList]);
    }

    setLastCarId(data.length ? data[data.length - 1].id : null);
    setHasMore(data.length === 12);
    setIsLoading(false);
    console.log("Fetched cars:", carsList);
  };

  const fetchMoreCars = () => {
    if (!isLoading && hasMore) {
      fetchCars(false);
    }
  };

  useEffect(() => {
    fetchCars(true);
  }, [filters]);

  const handleFilterSubmit = (data: FiltrosPesquisa) => {
    setFilters(data);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="flex">
      <div className="fixed left-0 top-10 z-10">
        <CarFilterSideMenu
          submitForm={handleFilterSubmit}
          isOpen={isOpen}
          toggleMenu={toggleMenu}
        />
      </div>
      <div className="flex-1 lg:ml-80 p-4 flex flex-col items-center ">
        <div className="bg-gray-100 w-full flex rounded-xl p-2 mb-4">
          <Button
            color="danger"
            variant="shadow"
            endContent={<FilterIcon size={16} />}
            className="w-4/12"
            onClick={toggleMenu}
          >
            Filtrar
          </Button>
        </div>

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
          <p className="text-center mt-4">Isso é tudo por aqui :D</p>
        )}
      </div>
    </div>
  );
}

export default Estoque;
