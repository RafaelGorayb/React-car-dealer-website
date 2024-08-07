import React, { useState, useEffect } from "react";
import { Car } from "../types";
import {
  Card,
  CardBody,
  CardFooter,
  Skeleton,
  Image,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import "../styles/globals.css";
import { Fullscreen, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { useCompareList } from "@/lib/userState";
import SectionTitle from "./HomePage/sectionTitle";
import { MdCompareArrows } from "react-icons/md";

import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "./ui/carousel";

interface CardProps {
  car: Car;
  isLoading: boolean;
}

function CarCard({ car, isLoading }: CardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { setCompareList } = useCompareList();

  const [modalSize, setModalSize] = useState<"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full">("5xl");
  const [modalScroll, setModalScroll] = useState<"normal" | "outside" | "inside">("normal");


  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setModalSize("5xl");
        setModalScroll("outside");
      } else {
        setModalSize("full");
        setModalScroll("normal");
      }
    }

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  function addToComparador() {
    setCompareList((prev) => (prev ? [...prev, car] : [car]));
    toast.success("Carro adicionado ao comparador");
  }

  const renderCardContent = () => (
    <>
      <div className="relative w-full h-[170px]">
        <img
          src={car.fotos[0] || "/carroTeste.png"}
          className="w-full h-full object-cover"
          alt={`${car.marca} ${car.modelo}`}
        />
      </div>

      <CardBody className="overflow-visible pt-2">
        <div>
          <p className="text-xs font-semibold">
            {car.marca} {car.modelo}
          </p>
          <h3 className="text-sm font-semibold text-red-500 min-h-10 line-clamp-2">
            {car.versao}
          </h3>
          <div className="flex text-sm flex-row gap-4 pb-2">
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs">Ano</p>
              <p className="font-medium text-sm">
                {car.ano_fabricacao}/{car.ano_modelo}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs">Km</p>
              <p className="font-medium text-sm">
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
      <CardFooter className="">
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
          <Skeleton
            isLoaded={!isLoading}
            className="w-full h-full object-cover"
          >
            <div className="w-full h-full bg-gray-200"></div>
          </Skeleton>
        </div>
        <CardBody className="overflow-visible py-2">
          <div>
            <Skeleton className="rounded-lg h-4 w-3/4" isLoaded={!isLoading}>
              <p className="text-xs font-semibold bg-gray-200 h-4 w-3/4"></p>
            </Skeleton>
            <Skeleton
              className="rounded-lg h-4 w-2/4 mt-1"
              isLoaded={!isLoading}
            >
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

      <Modal
        isOpen={isOpen}
        size={modalSize}    
        onClose={onClose}        
        scrollBehavior={modalScroll}    
        backdrop="blur"
        className="overflow-x-clip overflow-y-auto" 
      >
        <ModalContent className="">
          {(onClose) => (
            <>
            <ModalHeader className="flex justify-center">
              <p className="text-sm text-center">Detalhes do veículo</p>
              </ModalHeader>
              
              <ModalBody className="p-0 overflow-x-clip ">
                <div className="lg:flex lg:pl-5">
                <Carousel className="">
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
                <div className="lg:px-5 p-4 lg:p-0 ">
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
                  <div className="flex flex-row gap-4 ">
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
                <div className="px-4">
                  <div className="bg-gray-100 dark:bg-zinc-950 rounded-lg p-4 mt-6">
                    <SectionTitle title="Opcionais" fontsize="lg" />
                    <ul className="list-disc pl-5 columns-2 md:columns-3 text-xs font-light mt-6">
                      {car.opcionais.map((opcional, index) => (
                        <li key={index}>{opcional}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-between">
                <Button
                  color="default"
                  variant="faded"
                  onClick={addToComparador}
                  endContent={<MdCompareArrows size={20} />}
                >
                  Adicionar ao comparador
                </Button>
                <Button color="danger"  onPress={onClose}>
                  Fechar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CarCard;
