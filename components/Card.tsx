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
      <div className="relative w-full h-[200px] md:h-[250px]">
        <img
          src={car.fotos[0] || "/carroTeste.png"}
          className="w-full h-full object-cover"
          alt={`${car.marca} ${car.modelo}`}
        />
      </div>

      <CardBody className="overflow-visible py-2">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <p className="text-sm md:text-base font-semibold">
              {car.marca} {car.modelo}
            </p>
            <h3 className="text-sm md:text-lg font-semibold text-red-500 min-h-10 line-clamp-2">
              {car.versao}
            </h3>
            <div className="mt-2">
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
          <div className="flex flex-row md:flex-col gap-4 py-2 md:py-0 md:text-right">
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs">Ano</p>
              <p className="font-medium text-sm md:text-base">
                {car.ano_fabricacao}/{car.ano_modelo}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs">Km</p>
              <p className="font-medium text-sm md:text-base">
                {car.km.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <p className="text-lg md:text-xl font-semibold">
          R$ {car.preco.toLocaleString("pt-BR")}
        </p>
      </CardFooter>
    </>
  );

  if (isLoading) {
    return (
      <Card
        className="w-full md:max-w-[400px] shadow-lg"
        radius="sm"
        isPressable={true}
        isHoverable={true}
      >
        <Skeleton className="rounded-lg">
          <div className="h-[200px] md:h-[250px]"></div>
        </Skeleton>
        <CardBody className="overflow-visible py-2">
          <Skeleton className="w-3/4 rounded-lg">
            <div className="h-4 md:h-5"></div>
          </Skeleton>
          <Skeleton className="w-1/2 mt-2 rounded-lg">
            <div className="h-4 md:h-5"></div>
          </Skeleton>
          <div className="flex justify-between mt-4">
            <Skeleton className="w-1/4 rounded-lg">
              <div className="h-4"></div>
            </Skeleton>
            <Skeleton className="w-1/4 rounded-lg">
              <div className="h-4"></div>
            </Skeleton>
          </div>
        </CardBody>
        <CardFooter>
          <Skeleton className="w-1/3 rounded-lg">
            <div className="h-6"></div>
          </Skeleton>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <Card
        className="w-full md:max-w-[400px] shadow-lg"
        radius="sm"
        isPressable={true}
        isHoverable={true}
        onClick={onOpen}
      >
        {renderCardContent()}
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {car.marca} {car.modelo} {car.versao}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <img
                    src={car.fotos[0] || "/carroTeste.png"}
                    className="w-full h-64 object-cover rounded-lg"
                    alt={`${car.marca} ${car.modelo}`}
                  />
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Detalhes do Veículo
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <p>
                        <strong>Preço:</strong> R${" "}
                        {car.preco.toLocaleString("pt-BR")}
                      </p>
                      <p>
                        <strong>Ano:</strong> {car.ano_fabricacao}/
                        {car.ano_modelo}
                      </p>
                      <p>
                        <strong>Quilometragem:</strong>{" "}
                        {car.km.toLocaleString("pt-BR")} km
                      </p>
                      <p>
                        <strong>Cor:</strong> {car.cor}
                      </p>
                      <p>
                        <strong>Motorização:</strong> {car.motorizacao}
                      </p>
                      <p>
                        <strong>Potência:</strong> {car.potencia}
                      </p>
                      <p>
                        <strong>Torque:</strong> {car.torque}
                      </p>
                      <p>
                        <strong>Câmbio:</strong> {car.cambio}
                      </p>
                      <p>
                        <strong>Tração:</strong> {car.tracao}
                      </p>
                      <p>
                        <strong>Direção:</strong> {car.direcao}
                      </p>
                      <p>
                        <strong>Freios:</strong> {car.freios}
                      </p>
                      <p>
                        <strong>Rodas:</strong> {car.rodas}
                      </p>
                      <p>
                        <strong>Bancos:</strong> {car.bancos}
                      </p>
                      <p>
                        <strong>Airbags:</strong> {car.airbags}
                      </p>
                      <p>
                        <strong>Ar Condicionado:</strong> {car.ar_condicionado}
                      </p>
                      <p>
                        <strong>Faróis:</strong> {car.farol}
                      </p>
                      <p>
                        <strong>Multimídia:</strong> {car.multimidia}
                      </p>
                      <p>
                        <strong>Final da Placa:</strong> {car.final_placa}
                      </p>
                      <p>
                        <strong>Carroceria:</strong> {car.carroceria}
                      </p>
                      <p>
                        <strong>Blindado:</strong>{" "}
                        {car.blindado ? "Sim" : "Não"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-2">Opcionais</h3>
                  <ul className="list-disc pl-5 columns-2 md:columns-3">
                    {car.opcionais.map((opcional, index) => (
                      <li key={index}>{opcional}</li>
                    ))}
                  </ul>
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
