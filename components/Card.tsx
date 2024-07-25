"use client";
import React from "react";
import { Car } from "../types";
import { Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import '../styles/globals.css';

interface CardProps {
  car: Car;
  isLoading: boolean;
}

function CarCard({ car, isLoading }: CardProps) {
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
            <Skeleton className="rounded-lg h-4 w-3/4" isLoaded={!isLoading}>
              <p className="text-xs font-semibold bg-gray-200 h-4 w-3/4"></p>
            </Skeleton>
            <Skeleton className="rounded-lg h-4 w-2/4 mt-1" isLoaded={!isLoading}>
              <h3 className="text-sm font-semibold text-red-500 bg-gray-200 h-4 w-1/2 mt-2"></h3>
            </Skeleton>
            <div className="flex text-sm flex-row gap-4 py-2">
              <Skeleton className="rounded-lg w-2/4 mt-1" isLoaded={!isLoading}>
                <div className="flex flex-col">
                  <p className="text-neutral-400 text-xs">Ano</p>
                  <p className="font-medium text-sm bg-gray-200 h-4 w-1/2"></p>
                </div>
              </Skeleton>
              <Skeleton className="rounded-lg w-2/4 mt-1" isLoaded={!isLoading}>
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
          src={car.fotos[0] || "/carroTeste.png"}
          className="w-full h-full object-cover"
          alt={`${car.marca} ${car.modelo}`}
        />
      </div>

      <CardBody className="overflow-visible py-2">
        <div>
          <p className="text-xs font-semibold">
            {car.marca} {car.modelo}
          </p>
          <h3 className="text-sm font-semibold text-red-500 min-h-10">{car.versao}</h3>
          <div className="flex text-sm flex-row gap-4 py-2">
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs">Ano</p>
              <p className="font-medium text-sm">
                {car.ano_fabricacao}/{car.ano_modelo}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs">Km</p>
              <p className="font-medium text-sm">
                {car.km}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="">
        <p className="text-md font-semibold">
          R${car.preco}
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
