"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Car, CarObjectComplete } from "@/types";
import { CircleAlert, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { useCompareList } from "@/lib/userState";
import SectionTitle from "@/components/HomePage/sectionTitle";
import { Chip, Button, Spinner, Image } from "@nextui-org/react";
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
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">

      <Carousel>
                  <CarouselNext className="top-1/3 -translate-y-1/3" />
                  <CarouselPrevious className="top-1/3 -translate-y-1/3" />
                  <CarouselMainContainer>
                    {car.fotos.map((foto, index) => (
                      <SliderMainItem key={index} className="bg-transparent">
                        <Image
                          src={foto}
                          radius="none"
                          className="object-cover w-[800px] max-h-[500px]"
                          alt={`${car.marca} ${car.modelo}`}
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
                          className="w-full h-12 object-cover rounded-lg shadow"
                          alt={`${car.marca} ${car.modelo} - Foto ${index + 2}`}
                        />
                      </SliderThumbItem>
                    ))}
                  </CarouselThumbsContainer>

                </Carousel>
                <div className="px-4">
                  <p className="text-lg font-semibold">
                    {car.marca} {car.modelo}
                  </p>
                  <h3 className="text-lg font-semibold text-red-500 min-h-10 line-clamp-2">
                    {car.versao}
                  </h3>
                  <div>
                    {car.blindado && (
                      <Chip
                        startContent={<Shield size={12} />}
                        variant="solid"
                        color="danger"
                        size="sm"
                      >
                        Blindado
                      </Chip>
                    )}
                  </div>
                  <div className="flex flex-row gap-4 py-2">
                    <div className="flex flex-col">
                      <p className="text-neutral-400 text-md">Ano</p>
                      <p className="font-medium text-md">
                        {car.ano_fabricacao}/{car.ano_modelo}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-neutral-400 text-md">Km</p>
                      <p className="font-medium text-md">
                        {car.km.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    R$ {car.preco.toLocaleString("pt-BR")}
                  </p>
                  <br />

                  <div className="bg-gray-100 dark:bg-zinc-950 rounded-lg p-4 mt-6">
                    <SectionTitle title="Especificações" fontsize="lg" />
                      <div className="grid grid-cols-3 gap-y-2 gap-x-2 text-xs mt-6">
                        <div>
                          <p className="text-xs font-light">Marca</p>
                          <p className="text-xs font-bold">{car.marca}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Ano</p>
                          <p className="text-xs font-bold">{car.ano_modelo}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Modelo</p>
                          <p className="text-xs font-bold">{car.ano_fabricacao}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Km</p>
                          <p className="text-xs font-bold">{car.km.toLocaleString("pt-BR")}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Motor</p>
                          <p className="text-xs font-bold">{car.motorizacao}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Potência</p>
                          <p className="text-xs font-bold">{car.potencia} cv</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Rodas</p>
                          <p className="text-xs font-bold">{car.rodas}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Torque</p>
                          <p className="text-xs font-bold">{car.torque} kgmf</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Blindado</p>
                          <p className="text-xs font-bold">{car.blindado ? "Sim" : "Não"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Câmbio</p>
                          <p className="text-xs font-bold">{car.cambio}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Carroceria</p>
                          <p className="text-xs font-bold">{car.carroceria}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Tração</p>
                          <p className="text-xs font-bold">{car.tracao}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Final da Placa</p>
                          <p className="text-xs font-bold">{car.final_placa}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Cor</p>
                          <p className="text-xs font-bold">{car.cor}</p>
                        </div>
                        <div>
                          <p className="text-xs font-light">Direção</p>
                          <p className="text-xs font-bold">{car.direcao}</p>
                        </div>
                      </div>
                    </div>
                    </div>
                   </div>
                    <div className="p-4">
                    <div className="bg-gray-100 dark:bg-zinc-950 rounded-lg p-4 mt-6">
                    <SectionTitle title="Opcionais" fontsize="lg" />
                    <ul className="list-disc pl-5 columns-2 md:columns-3 text-xs font-light mt-6">
                      {car.opcionais.map((opcional, index) => (
                        <li key={index}>{opcional}</li>
                      ))}
                    </ul>
                  </div>
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
