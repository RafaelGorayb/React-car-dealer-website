import React from "react";
import { useState } from "react";
import { FaWhatsapp } from 'react-icons/fa';
import { Car } from "../types";
import {
  Card,
  CardBody,
  CardFooter,
  Skeleton,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import "../styles/globals.css";
import { Shield } from "lucide-react";
import CarModal from "./CarModal";


interface CardProps {
  car: Car;
  isLoading: boolean;
}

function CarCard({ car, isLoading }: CardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderCardContent = () => (
    <>
      <div className="relative w-full h-[170px]">
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full object-cover" />
        )}
        <img
          src={car.fotos[0] || "/carroTeste.png"}
          className="w-full h-full object-cover"
          alt={`${car.marca} ${car.modelo}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)} // Você pode optar por tratar erros de forma diferente
          style={{ display: imageLoaded ? "block" : "none" }}
        />
      </div>


      <CardBody className="overflow-visible pt-2 h-[140px]">
        <div className="flex flex-col h-full">
          <p className="text-xs font-semibold min-h-8 line-clamp-2">
            {car.marca} {car.modelo}
          </p>
          <h3 className="text-sm font-semibold text-red-500 min-h-10 line-clamp-2">
            {car.versao}
          </h3>
          <div className="flex text-sm flex-row gap-4 py-2">
            <div className="flex flex-col w-20">
              <p className="text-neutral-400 text-xs">Ano</p>
              <p className="font-medium text-sm truncate">
                {car.ano_fabricacao}/{car.ano_modelo}
              </p>
            </div>
            <div className="flex flex-col w-20">
              <p className="text-neutral-400 text-xs">Km</p>
              <p className="font-medium text-sm truncate">
                {car.km.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
          <div className="min-h-6">
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
        </div>
      </CardBody>
      <CardFooter className="h-[40px]">
        <p className="text-md font-semibold">
          R$ {car.preco.toLocaleString("pt-BR")}
        </p>
      </CardFooter>
    </>
  );

  if (isLoading) {
    return (
      <Card
        className="md:w-lg md:h-lg w-sm shadow-2xl"
        radius="sm"
        isPressable={true}
        isHoverable={true}
      >
        <div className="relative w-full h-[170px]">
          <Skeleton isLoaded={!isLoading} className="w-full h-full object-cover">
            <div className="w-full h-full bg-gray-200"></div>
          </Skeleton>
        </div>
        <CardBody className="overflow-visible py-2">
          <div>
            <Skeleton
              className="rounded-lg h-4 w-3/4"
              isLoaded={!isLoading}
            >
              <p className="text-xs font-semibold bg-gray-200 h-4 w-3/4"></p>
            </Skeleton>
            <Skeleton
              className="rounded-lg h-4 w-2/4 mt-1"
              isLoaded={!isLoading}
            >
              <h3 className="text-sm font-semibold text-red-500 bg-gray-200 h-4 w-1/2 mt-2"></h3>
            </Skeleton>
            <div className="flex text-sm flex-row gap-4 py-2">
              <Skeleton
                className="rounded-lg w-2/4 mt-1"
                isLoaded={!isLoading}
              >
                <div className="flex flex-col">
                  <p className="text-neutral-400 text-xs">Ano</p>
                  <p className="font-medium text-sm bg-gray-200 h-4 w-1/2"></p>
                </div>
              </Skeleton>
              <Skeleton
                className="rounded-lg w-2/4 mt-1"
                isLoaded={!isLoading}
              >
                <div className="flex flex-col">
                  <p className="text-neutral-400 text-xs">Km</p>
                  <p className="font-medium text-sm bg-gray-200 h-4 w-1/2"></p>
                </div>
              </Skeleton>
            </div>
          </div>
        </CardBody>
        <CardFooter className="">
          <Skeleton
            className="rounded-lg h-4 w-3/4"
            isLoaded={!isLoading}
          >
            <p className="text-md font-semibold bg-gray-200 h-4 w-1/3"></p>
          </Skeleton>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <Card
        className="md:w-lg md:h-lg w-sm shadow-xl"
        radius="sm"
        isPressable={true}
        allowTextSelectionOnPress={true}
        isHoverable={true}
        onClick={onOpen}
      >
        {renderCardContent()}
      </Card>

      <CarModal car={car} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default CarCard;
