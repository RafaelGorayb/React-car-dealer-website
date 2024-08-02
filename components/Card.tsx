import React from "react";
import { Car } from "../types";
import {
  Card,
  CardBody,
  CardFooter,
  Skeleton,
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
import { Shield } from "lucide-react";
import { toast } from "react-toastify";
import { useCompareList } from "@/lib/userState";
import SectionTitle from "./HomePage/sectionTitle";
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
        onClose={onClose}
        size="full"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-0 overflow-x-clip">
                <Carousel>
                  <CarouselNext className="top-1/3 -translate-y-1/3" />
                  <CarouselPrevious className="top-1/3 -translate-y-1/3" />
                  <CarouselMainContainer>
                    {car.fotos.map((foto, index) => (
                      <SliderMainItem key={index} className="bg-transparent">
                        <img
                          src={foto}
                          className="w-full h-64 object-cover rounded-lg"
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
                          className="w-full h-20 object-cover rounded-lg shadow"
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

                  <div className="bg-gray-100 dark:bg-zinc-950 rounded-lg p-4 mt-4">
                    <SectionTitle title="Especificações" fontsize="lg" />
                    <div className="grid grid-flow-row grid-cols-2 gap-4 text-xs mt-6 text-wrap">
                      <p>
                        Ano:{" "}
                        <strong>
                          {car.ano_fabricacao}/{car.ano_modelo}
                        </strong>
                      </p>
                      <p>
                        Quilometragem:{" "}
                        <strong>{car.km.toLocaleString("pt-BR")} km</strong>
                      </p>
                      <p>
                        Cor: <strong>{car.cor}</strong>
                      </p>
                      <p>
                        Motorização: <strong>{car.motorizacao}</strong>
                      </p>
                      <p>
                        Potência: <strong>{car.potencia}</strong>
                      </p>
                      <p>
                        Torque: <strong>{car.torque}</strong>
                      </p>
                      <p>
                        Câmbio: <strong>{car.cambio}</strong>
                      </p>
                      <p>
                        Tração: <strong>{car.tracao}</strong>
                      </p>
                      <p>
                        Direção: <strong>{car.direcao}</strong>
                      </p>
                      <p>
                        Freios: <strong>{car.freios}</strong>
                      </p>
                      <p>
                        Rodas: <strong>{car.rodas}</strong>
                      </p>
                      <p>
                        Bancos: <strong>{car.bancos}</strong>
                      </p>
                      <p>
                        Airbags: <strong>{car.airbags}</strong>
                      </p>
                      <p>
                        Ar Condicionado: <strong>{car.ar_condicionado}</strong>
                      </p>
                      <p>
                        Faróis: <strong>{car.farol}</strong>
                      </p>
                      <p className="text-wrap ">
                        Multimídia: <strong>{car.multimidia}</strong>
                      </p>
                      <p>
                        Final da Placa: <strong>{car.final_placa}</strong>
                      </p>
                      <p>
                        Carroceria: <strong>{car.carroceria}</strong>
                      </p>
                      <p>
                        Blindado:{" "}
                        <strong>{car.blindado ? "Sim" : "Não"}</strong>
                      </p>
                    </div>
                  </div>
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
                  color="secondary"
                  variant="faded"
                  onClick={addToComparador}
                >
                  Adicionar ao comparador
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
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
