"use client";
import React from "react";
import { Car } from "../types";
import { Card, CardBody, Image, CardFooter, Button } from "@nextui-org/react";
import { useCompareList } from "@/lib/userState";
//import Image from "next/image";
interface CardProps {
  car: Car;
}

function CarCard({ car }: CardProps) {
  function handleAddToCompare() {
    const { setCompareList } = useCompareList();
    setCompareList((prev) => [...(prev || []), car]);
  }
  console.log(car);

  return (
    <Card>
      <Image
        src={car.Imagens[0]}
        width="100"
        className="object-cover"
        alt="Carro"
      />
      <CardBody className="overflow-visible py-2">
        <div>
          <h2 className="text-md font-bold">
            {car.Marca} {car.Modelo}
          </h2>
          <h3 className="text-sm font-semibold text-red-500">{car.Versao}</h3>
          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-1">
              <p className="">Ano</p>
              <p className="">
                {car.Especificacoes.ano_de_fabricacao}/
                {car.Especificacoes.ano_do_modelo}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="">Km</p>
              <p className="">
                {car.Especificacoes.km.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xl font-semibold ">
            R${car.Preco.toLocaleString("pt-BR")}
          </p>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between gap-4 px-4">
        <Button onPress={handleAddToCompare} color="secondary">
          Adicionar ao comparador
        </Button>
        <Button color="primary">Ver mais</Button>
      </CardFooter>
    </Card>
  );
}

export default CarCard;
