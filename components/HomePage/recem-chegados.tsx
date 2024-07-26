"use client";
import React, { useEffect, useState } from "react";
import CarCard from "@/components/Card";
import { Car } from "../../types";
import { supabase } from "../../lib/initSupabase";

const RecemChegados = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCars = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('carro')
        .select(`
          id,
          especificacao_carro (
          *
          ),
          opcionais_carro (nome),
          fotos_urls (url)
        `)
        .order('id', { ascending: true })        
        .limit(5);

      if (error) {
        console.error("Erro ao buscar carros:", error);
        setIsLoading(false);
        return;
      }

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
          airbags: especificacao.airbag,
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
