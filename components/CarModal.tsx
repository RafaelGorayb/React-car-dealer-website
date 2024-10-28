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
import { MdCompareArrows, MdChevronLeft } from "react-icons/md";
import {
Carousel,
CarouselNext,
CarouselPrevious,
CarouselMainContainer,
CarouselThumbsContainer,
SliderMainItem,
SliderThumbItem,
} from "./ui/carousel";
import { useRouter } from 'next/navigation';

interface CarModalProps {
car: Car;
isOpen: boolean;
onClose: () => void;
}

function CarModal({ car, isOpen, onClose }: CarModalProps) {
const { setCompareList } = useCompareList();
const router = useRouter();

const [modalSize, setModalSize] = useState< | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full">
  ("5xl");
  const [modalScroll, setModalScroll] = useState< "normal" | "outside" | "inside">("normal");

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
    router.push('/comparador');
    toast.success("Carro adicionado ao comparador");
    }

    return (
    <Modal isOpen={isOpen} size={modalSize} onClose={onClose} scrollBehavior={modalScroll} hideCloseButton={true}
      backdrop="blur" className="">
      <ModalContent className="max-h-screen overflow-y-auto">
        {(onClose) => (
        <>
          <ModalHeader className="dark bg-zinc-900 flex items-center">
            <div className="absolute left-0">
              <Button variant="light" onPress={onClose} className="flex items-center gap-0">
                <MdChevronLeft size={24} />
                Fechar
              </Button>
            </div>
            <p className="text-white text-sm mx-auto">Detalhes do veículo</p>
            <div className="absolute right-2">
              <Button variant="flat" onPress={addToComparador} className="flex items-center gap-2">
                <MdCompareArrows size={20} />
                Comparar
              </Button>
            </div>
          </ModalHeader>

          <ModalBody className="p-0 overflow-y-auto  bg-slate-50">
            {/* Container da Imagem do Veículo */}
            <div className="w-full lg:px-8 mb-6 ">
              <Carousel className="rounded-md overflow-hidden h-full lg:h-[45rem] object-cover">
                <CarouselNext className="top-1/3 -translate-y-1/3" />
                <CarouselPrevious className="top-1/3 -translate-y-1/3" />
                <CarouselMainContainer className="h-full mb-10">
                  {car.fotos.map((foto, index) => (
                  <SliderMainItem key={index}>
                    <img src={foto} alt={`${car.marca} ${car.modelo}`} className="w-full h-full object-cover" />
                    {/* Gradiente Overlay */}
                    <div
                      className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none">
                    </div>
                  </SliderMainItem>
                  ))}
                </CarouselMainContainer>

                <CarouselThumbsContainer className="">
                  {car.fotos.map((foto, index) => (
                  <SliderThumbItem key={index} index={index} className="bg-transparent">
                    <div
                      className="absolute top-0 left-0 w-full h-5 bg-gradient-to-t from-transparent to-slate-50 pointer-events-none">
                    </div>
                    <img src={foto} className="w-full h-16 object-cover rounded-md shadow" alt={`${car.marca}
                      ${car.modelo} - Foto ${index + 1}`} />
                  </SliderThumbItem>
                  ))}
                </CarouselThumbsContainer>
              </Carousel>

            </div>

            {/* Container das Informações */}
            <div className="px-4 lg:px-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {car.marca} {car.modelo}
              </h2>

              <h3 className="text-lg font-semibold text-red-500 mb-4 line-clamp-2">
                {car.versao}
              </h3>

              {car.blindado && (
              <div className="mb-4">
                <Chip startContent={<Shield size={16} />}
                variant="solid"
                color="danger"
                size="sm"
                >
                Blindado
                </Chip>
              </div>
              )}

              <div className="flex gap-x-12 gap-y-2 mb-4">
                <div>
                  <p className="text-neutral-500 text-sm">Ano</p>
                  <p className="font-medium text-base text-gray-900 dark:text-white">
                    {car.ano_fabricacao}/{car.ano_modelo}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm">Km</p>
                  <p className="font-medium text-base text-gray-900 dark:text-white">
                    {car.km.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              <p className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                R$ {car.preco.toLocaleString("pt-BR")}
              </p>

              <Button color="danger" variant="solid"
                className="w-full py-3 text-lg font-semibold flex items-center justify-center gap-2 rounded-lg shadow-lg hover:bg-red-600 transition-all duration-300 mb-6"
                onPress={()=> {
                window.open(
                `https://api.whatsapp.com/send?phone=5519999083534&text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20carro%20${car.marca}%20${car.modelo}%20${car.versao}`,
                "_blank"
                );
                }}
                >
                <FaWhatsapp size={24} /> Envie uma proposta
              </Button>

              <div
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-slate-800 ">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Especificações</h2>
                <div
                  className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm font-light text-gray-700 dark:text-gray-300">
                  {/* Código de especificações mantido */}
                  <div>
                    <p className="font-light text-gray-500">Marca</p>
                    <p className="font-semibold">{car.marca}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Ano</p>
                    <p className="font-semibold">{car.ano_fabricacao}/{car.ano_modelo}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Km</p>
                    <p className="font-semibold">{car.km.toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Potência</p>
                    <p className="font-semibold">{car.potencia} cv</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Tipo motor</p>
                    <p className="font-semibold">{car.motorizacao}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Torque</p>
                    <p className="font-semibold">{car.torque} kgmf</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Cor</p>
                    <p className="font-semibold">{car.cor}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Blindado</p>
                    <p className="font-semibold">{car.blindado ? "Sim" : "Não"}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Direção</p>
                    <p className="font-semibold">{car.direcao}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Carroceria</p>
                    <p className="font-semibold">{car.carroceria}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Tração</p>
                    <p className="font-semibold">{car.tracao}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Final da Placa</p>
                    <p className="font-semibold">{car.final_placa}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Câmbio</p>
                    <p className="font-semibold">{car.cambio}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Rodas</p>
                    <p className="font-semibold">{car.rodas}</p>
                  </div>
                  <div>
                    <p className="font-light text-gray-500">Motor</p>
                    <p className="font-semibold">{car.motor}</p>
                  </div>

                </div>
              </div>
            </div>

            {/* Container de Opcionais */}
            <div className="px-4 lg:px-8">
              <div
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-slate-800">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Opcionais</h2>
                <ul
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 text-sm font-light text-gray-700 dark:text-gray-300">
                  {car.opcionais.map((opcional, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2  font-light">
                      -
                    </span>
                    {opcional}
                  </li>
                  ))}
                </ul>
              </div>
            </div>
          </ModalBody>
        </>
        )}
      </ModalContent>
    </Modal>

    );
    }

    export default CarModal;