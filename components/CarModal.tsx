import React, { useState, useEffect } from "react";
import { FaWhatsapp } from 'react-icons/fa';
import { Car } from "../types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Chip,
} from "@nextui-org/react";
import { Shield } from "lucide-react";
import { toast } from "react-toastify";
import { useCompareList } from "@/lib/userState";
import SectionTitle from "./HomePage/sectionTitle";
import { MdCompareArrows } from "react-icons/md";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "./ui/carousel";

interface CarModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
}

function CarModal({ car, isOpen, onClose }: CarModalProps) {
  const { setCompareList } = useCompareList();

  const [modalSize, setModalSize] = useState<
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full"
  >("5xl");
  const [modalScroll, setModalScroll] = useState<
    "normal" | "outside" | "inside"
  >("normal");

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

    // Configura o tamanho inicial
    handleResize();

    // Adiciona o listener de redimensionamento
    window.addEventListener("resize", handleResize);

    // Limpa o listener ao desmontar
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function addToComparador() {
    setCompareList((prev) => (prev ? [...prev, car] : [car]));
    toast.success("Carro adicionado ao comparador");
  }

  return (
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
                <div className="lg:w-7/12">
                  <Carousel className="">
                    <CarouselNext className="top-1/3 -translate-y-1/3" />
                    <CarouselPrevious className="top-1/3 -translate-y-1/3" />
                    <CarouselMainContainer>
                      {car.fotos.map((foto, index) => (
                        <SliderMainItem
                          key={index}
                          className="bg-transparent"
                        >
                          <Image
                            src={foto}
                            radius="none"
                            className="object-cover w-full h-full"
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
                            src={foto}
                            className="w-full h-12 object-cover rounded-lg shadow"
                            alt={`${car.marca} ${car.modelo} - Foto ${
                              index + 1
                            }`}
                          />
                        </SliderThumbItem>
                      ))}
                    </CarouselThumbsContainer>
                  </Carousel>
                </div>

                <div className="lg:px-5 p-4 lg:py-0 lg:w-5/12 ">
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
                      <p className="font-medium text-md mt-2">
                        {car.km.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    R$ {car.preco.toLocaleString("pt-BR")}
                  </p>
                  <br />

                  <Button
                    color="danger"
                    variant="solid"
                    className="w-full"
                    onPress={() => {
                      window.open(
                        `https://api.whatsapp.com/send?phone=5519999083534&text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20carro%20${car.marca}%20${car.modelo}%20${car.versao}`,
                        "_blank"
                      );
                    }}
                  >
                    <FaWhatsapp className="inline-block mr-2" size={24} /> Envie
                    uma proposta
                  </Button>

                  <div className="bg-gray-100 dark:bg-zinc-950 rounded-lg p-4 mt-6">
                    <SectionTitle title="Especificações" fontsize="lg" />
                    <div className="grid grid-cols-3 gap-y-2 gap-x-2 text-xs mt-6">
                      <div>
                        <p className="text-xs font-light">Marca</p>
                        <p className="text-xs font-bold">{car.marca}</p>
                      </div>
                      <div>
                        <p className="text-xs font-light">Ano</p>
                        <p className="text-xs font-bold">
                          {car.ano_fabricacao}/{car.ano_modelo}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-light">Km</p>
                        <p className="text-xs font-bold">
                          {car.km.toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-light">Potência</p>
                        <p className="text-xs font-bold">{car.potencia} cv</p>
                      </div>
                      <div>
                        <p className="text-xs font-light">Tipo motor</p>
                        <p className="text-xs font-bold">{car.motorizacao}</p>
                      </div>
                      <div>
                        <p className="text-xs font-light">Torque</p>
                        <p className="text-xs font-bold">{car.torque} kgmf</p>
                      </div>
                      <div>
                        <p className="text-xs font-light">Cor</p>
                        <p className="text-xs font-bold">{car.cor}</p>
                      </div>
                      <div>
                        <p className="text-xs font-light">Blindado</p>
                        <p className="text-xs font-bold">
                          {car.blindado ? "Sim" : "Não"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-light">Direção</p>
                        <p className="text-xs font-bold">{car.direcao}</p>
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
                        <p className="text-xs font-light">Câmbio</p>
                        <p className="text-xs font-bold">{car.cambio}</p>
                      </div>
                      <div>
                        <p className="text-xs font-light">Rodas</p>
                        <p className="text-xs font-bold">{car.rodas}</p>
                      </div>
                      <div>
                        <p className="text-xs font-light">Motor</p>
                        <p className="text-xs font-bold">{car.motor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4">
                <div className="bg-gray-100 dark:bg-zinc-950 rounded-lg p-4 ">
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
              <Button color="danger" onPress={onClose}>
                Fechar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CarModal;
