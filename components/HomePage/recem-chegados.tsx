"use client";
import React, { useEffect, useState } from "react";
import CarCard from "@/components/Card";
import { Car } from "../../types";
import { createClient } from "@/utils/supabase/client";

const RecemChegados = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCars = async () => {
      setIsLoading(true);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("carro")
        .select(
          `
          *,
          opcionais_carro (nome),
          fotos_urls (url)
        `
        )
        .order("id", { ascending: true })
        .limit(5);

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
          motor: carro.motor,
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
          carro_id: carro.carro_id,
          opcionais: carro.opcionais_carro
            ? carro.opcionais_carro.map((opcional: any) => opcional.nome)
            : [],
          fotos: carro.fotos_urls
            ? carro.fotos_urls.map((foto: any) => foto.url)
            : [],
        };
      });

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
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} isLoading={false} />
      ))}
    </div>
  );
};

export default RecemChegados;
