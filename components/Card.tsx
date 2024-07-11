"use client";
import React from "react";
import { Car } from "../types";
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import { useCompareList } from "@/lib/userState";
import '../styles/globals.css';
import { Fullscreen } from "lucide-react";

interface CardProps {
  car: Car;
}

function CarCard({ car }: CardProps) {
  function handleAddToCompare() {
    const { setCompareList } = useCompareList();
    setCompareList((prev) => [...(prev || []), car]);
  }

  return (
    <Card className="md:w-lg md:h-lg w-sm shadow-2xl" radius="sm" isPressable={true} isHoverable={true}>
      <div className="relative w-full h-[170px]">
        <img
          src="/carroTeste.png"
          className="w-full h-full object-cover"
          alt="Carro"
        />
      </div>

      <CardBody className="overflow-visible py-2">
        <div>
          <p className="text-xs font-semibold">
            {car.Marca} {car.Modelo}
          </p>
          <h3 className="text-sm font-semibold text-red-500">{car.Versao}</h3>
          <div className="flex text-sm flex-row gap-4 py-2">
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs">Ano</p>
              <p className="font-medium text-stone-900 text-sm">
                {car.Especificacoes.ano_de_fabricacao}/
                {car.Especificacoes.ano_do_modelo}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs">Km</p>
              <p className="font-medium text-stone-900 text-sm">
                {car.Especificacoes.km.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
          <p className="mt-2 text-md font-semibold">
            R${car.Preco.toLocaleString("pt-BR")}
          </p>
        </div>
      </CardBody>
      {/* <CardFooter className="flex justify-between gap-4 px-4">
        <Button onPress={handleAddToCompare} color="secondary">
          Adicionar ao comparador
        </Button>
        <Button color="primary">Ver mais</Button>
      </CardFooter> */}
    </Card>
  );
}

export default CarCard;
