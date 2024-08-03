"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Car, CarObjectComplete } from "@/types";
import { CircleAlert, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { useCompareList } from "@/lib/userState";
import SectionTitle from "@/components/HomePage/sectionTitle";
import { Chip, Button, Spinner } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { formatCars } from "@/utils/functions";
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "@/components/ui/carousel";

export default function PaginaCarro() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setCompareList } = useCompareList();
  const supabase = createClient();

  useEffect(() => {
    const fetchCar = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("carro")
        .select(
          `
            *,
            opcionais_carro (nome),
            fotos_urls (url)
          `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar carro:", error);
        toast.error("Erro ao carregar os detalhes do carro");
      } else {
        setCar(formatCars(data as CarObjectComplete) as Car);
      }
      setIsLoading(false);
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  function addToComparador() {
    if (car) {
      setCompareList((prev) => (prev ? [...prev, car] : [car]));
      toast.success("Carro adicionado ao comparador");
    }
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <CircleAlert size={48} className="text-yellow-500 mb-4" />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Carro não encontrado</h1>
          <p className="text-gray-600">
            O carro que você está procurando não foi encontrado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        <div>
          <Carousel>
            <CarouselNext className="top-1/3 -translate-y-1/3" />
            <CarouselPrevious className="top-1/3 -translate-y-1/3" />
            <CarouselMainContainer>
              {car.fotos.map((foto, index) => (
                <SliderMainItem key={index} className="bg-transparent">
                  <img
                    key={index}
                    src={foto}
                    alt={`${car.marca} ${car.modelo} - Foto ${index + 2}`}
                    className="rounded-lg"
                  />
                </SliderMainItem>
              ))}
            </CarouselMainContainer>
            <CarouselThumbsContainer>
              {car.fotos.map((foto, index) => (
                <SliderThumbItem
                  key={index}
                  index={index}
                  className="bg-transparent"
                >
                  <img
                    key={index}
                    src={foto}
                    className="w-full h-20 object-cover rounded-lg shadow"
                    alt={`${car.marca} ${car.modelo} - Foto ${index + 2}`}
                  />
                </SliderThumbItem>
              ))}
            </CarouselThumbsContainer>
          </Carousel>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {car.marca} {car.modelo}
          </h1>
          <h2 className="text-2xl font-semibold text-red-500 mb-4">
            {car.versao}
          </h2>
          {car.blindado && (
            <Chip
              startContent={<Shield size={16} />}
              variant="solid"
              color="danger"
              size="lg"
              className="mb-4"
            >
              Blindado
            </Chip>
          )}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Ano</p>
              <p className="font-semibold text-xl">
                {car.ano_fabricacao}/{car.ano_modelo}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Quilometragem</p>
              <p className="font-semibold text-xl">
                {car.km.toLocaleString("pt-BR")} km
              </p>
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600 mb-6">
            R$ {car.preco.toLocaleString("pt-BR")}
          </p>
          <Button
            color="primary"
            size="lg"
            onClick={addToComparador}
            className="w-full mb-4"
          >
            Adicionar ao comparador
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <SectionTitle title="Especificações" fontsize="2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 bg-gray-100 dark:bg-zinc-900 rounded-lg p-6">
          <SpecItem label="Cor" value={car.cor} />
          <SpecItem label="Motorização" value={car.motorizacao} />
          <SpecItem label="Potência" value={car.potencia} />
          <SpecItem label="Torque" value={car.torque} />
          <SpecItem label="Câmbio" value={car.cambio} />
          <SpecItem label="Tração" value={car.tracao} />
          <SpecItem label="Direção" value={car.direcao} />
          <SpecItem label="Freios" value={car.freios} />
          <SpecItem label="Rodas" value={car.rodas} />
          <SpecItem label="Bancos" value={car.bancos} />
          <SpecItem label="Airbags" value={car.airbags} />
          <SpecItem label="Ar Condicionado" value={car.ar_condicionado} />
          <SpecItem label="Faróis" value={car.farol} />
          <SpecItem label="Multimídia" value={car.multimidia} />
          <SpecItem label="Final da Placa" value={car.final_placa} />
          <SpecItem label="Carroceria" value={car.carroceria} />
        </div>
      </div>

      <div className="mt-12">
        <SectionTitle title="Opcionais" fontsize="2xl" />
        <ul className="list-disc pl-5 columns-2 md:columns-3 mt-6 bg-gray-100 dark:bg-zinc-900 rounded-lg p-6">
          {car.opcionais.map((opcional, index) => (
            <li key={index} className="mb-2">
              {opcional}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
