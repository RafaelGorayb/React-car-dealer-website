"use client";
import React from "react";
import { Car } from "../types";
import { Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import { useCompareList } from "@/lib/userState";
import '../styles/globals.css';

interface CardProps {
  car: Car;
  isLoading: boolean;
}
//
function CarCard({ car, isLoading }: CardProps) {
  function handleAddToCompare() {
    const { setCompareList } = useCompareList();
    setCompareList((prev) => [...(prev || []), car]);
  }

  if (isLoading) {
    return (
      <Card className="md:w-lg md:h-lg w-sm shadow-2xl" radius="sm" isPressable={true} isHoverable={true}>
        <div className="relative w-full h-[170px]">
          <Skeleton isLoaded={!isLoading} className="w-full h-full object-cover">
            <div className="w-full h-full bg-gray-200"></div>
          </Skeleton>
        </div>

        <CardBody className="overflow-visible py-2">
          
            <div>
            <Skeleton className= "rounded-lg h-4 w-3/4" isLoaded={!isLoading}>
              <p className="text-xs font-semibold bg-gray-200 h-4 w-3/4"></p>
            </Skeleton>
            <Skeleton className= "rounded-lg h-4 w-2/4 mt-1" isLoaded={!isLoading}>
              <h3 className="text-sm font-semibold text-red-500 bg-gray-200 h-4 w-1/2 mt-2"></h3>
            </Skeleton>            
              <div className="flex text-sm flex-row gap-4 py-2">
              <Skeleton className= "rounded-lg w-2/4 mt-1" isLoaded={!isLoading}>
                <div className="flex flex-col">
                  <p className="text-neutral-400 text-xs">Ano</p>
                  <p className="font-medium  text-sm bg-gray-200 h-4 w-1/2"></p>
                </div>
                </Skeleton>
                <Skeleton className= "rounded-lg w-2/4 mt-1" isLoaded={!isLoading}>
                <div className="flex flex-col">
                  <p className="text-neutral-400 text-xs">Km</p>
                  <p className="font-medium text-sm bg-gray-200 h-4 w-1/2"></p>
                </div>
                </Skeleton>
              </div>
            
              
            </div>
         
        </CardBody>
        <CardFooter className="">
          <Skeleton className="rounded-lg h-4 w-3/4" isLoaded={!isLoading}>
            <p className="text-md font-semibold bg-gray-200 h-4 w-1/3"></p>
          </Skeleton>
        </CardFooter>
      </Card>
    );
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
              <p className="font-medium  text-sm">
                {car.Especificacoes?.ano_de_fabricacao}/
                {car.Especificacoes?.ano_do_modelo}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs">Km</p>
              <p className="font-medium text-sm">
                {car.Especificacoes?.km?.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="">
        <p className="text-md font-semibold">
          R${car.Preco?.toLocaleString("pt-BR")}
        </p>
        {/* <Button onPress={handleAddToCompare} color="secondary">
          Adicionar ao comparador
        </Button>
        <Button color="primary">Ver mais</Button> */}
      </CardFooter>
    </Card>
  );
}

export default CarCard;
