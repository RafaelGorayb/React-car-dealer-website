"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Car } from "../../types";
import { supabase } from "../../lib/initSupabase";
import CarCard from "@/components/Card";

function Estoque() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCarId, setLastCarId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);

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

  const fetchCars = async (isInitial = false) => {
    setIsLoading(true);
  
    let query = supabase
      .from('carro')
      .select(`
        id,
        especificacao_carro (
          marca,
          modelo,
          versao,
          preco,
          ano_modelo,
          ano_fabricacao,
          km,
          cor,
          motorizacao,
          potencia,
          torque,
          cambio,
          tracao,
          direcao,
          freios,
          rodas,
          bancos,
          airbag,
          ar_condicionado,
          farol,
          multimidia,
          final_placa,
          carroceria,
          blindado,
          carro_id
        ),
        opcionais_carro (nome),
        fotos_urls (url)
      `)
      .order('id', { ascending: true })
      .limit(12);
  
    if (!isInitial && lastCarId) {
      query = query.gt('id', lastCarId);
    }
  
    const { data, error } = await query;
  
    if (error) {
      console.error("Erro ao buscar carros:", error);
      setIsLoading(false);
      return;
    }
  
    console.log("Dados brutos retornados pela consulta:", data);
  
    const carsList: Car[] = data.map((carro: any) => {
      const especificacao = carro.especificacao_carro[0] || {};
      return {
        id: carro.id,
        marca: especificacao.marca,
        modelo: especificacao.modelo,
        versao: especificacao.versao,
        preco: especificacao.preco,
        ano_modelo: especificacao.ano_modelo,
        ano_fabricacao: especificacao.ano_fabricacao,
        km: especificacao.km,
        cor: especificacao.cor,
        motorizacao: especificacao.motorizacao,
        potencia: especificacao.potencia,
        torque: especificacao.torque,
        cambio: especificacao.cambio,
        tracao: especificacao.tracao,
        direcao: especificacao.direcao,
        freios: especificacao.freios,
        rodas: especificacao.rodas,
        bancos: especificacao.bancos,
        airbags: especificacao.airbags,
        ar_condicionado: especificacao.ar_condicionado,
        farol: especificacao.farol,
        multimidia: especificacao.multimidia,
        final_placa: especificacao.final_placa,
        carroceria: especificacao.carroceria,
        blindado: especificacao.blindado,
        carro_id: especificacao.carro_id,
        opcionais: carro.opcionais_carro ? carro.opcionais_carro.map((opcional: any) => opcional.nome) : [],
        fotos: carro.fotos_urls ? carro.fotos_urls.map((foto: any) => foto.url) : [],
      };
    });
  
    console.log("Dados mapeados:", carsList);
  
    if (isInitial) {
      setCars(carsList);
    } else {
      setCars((prevCars) => [...prevCars, ...carsList]);
    }
  
    setLastCarId(data.length ? data[data.length - 1].id : null);
    setHasMore(data.length === 12);
    setIsLoading(false);
  };
  
  

  const fetchMoreCars = () => {
    if (!isLoading && hasMore) {
      fetchCars(false);
    }
  };

  useEffect(() => {
    fetchCars(true);
  }, []);

  return (
    <div className="relative">
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
