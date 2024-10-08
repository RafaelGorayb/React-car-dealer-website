"use client";
import React, { useState } from "react";
import { useCompareList } from "@/lib/userState";
import { Car } from "@/types";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Tooltip,
  Link
} from "@nextui-org/react";
import { XCircle, AlertCircle} from "lucide-react";
import { SearchBar } from "@/components/HomePage/searchBar";
import { toast } from "react-toastify";


export default function Comparador() {
  const { compareList, setCompareList } = useCompareList();

  const handleCarSelect = (car: Car) => {
    if (compareList && compareList.find((c) => c.id === car.id)) {
      toast.warn("Este carro já está no comparador.");
      return;
    }
    setCompareList((prevList) => (prevList ? [...prevList, car] : [car]));
    toast.success("Carro adicionado ao comparador");
  };

  if (!compareList || compareList.length === 0) {
    return (
      <div className="flex flex-col items-center  h-screen p-4 mt-4">
        <AlertCircle size={48} className="text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Nenhum carro para comparar</h1>
        <p className="text-gray-600">
          Adicione carros ao comparador para começar.
        </p>
        <div className="w-full lg:w-6/12 mt-4">
        <SearchBar onSelect={handleCarSelect} /> 
        </div>
        
      </div>
    );
  }

  const removeCar = (index: number) => {
    setCompareList(compareList.filter((_, i) => i !== index));
  };



  const formatValue = (key: string, value: any) => {
    if (key === "preco") {
      return `R$ ${value.toLocaleString("pt-BR")}`;
    }
    if (key === "km") {
      return `${value.toLocaleString("pt-BR")} km`;
    }
    if (key === "potencia") {
      return `${value} cv`;
    }
    if (key === "torque") {
      return `${value} kgfm`;
    }
    if (typeof value === "boolean") {
      return value ? "Sim" : "Não";
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value || "-";
  };

  const columns = [
    { key: "propriedade", label: "Propriedade" },
    ...compareList.map((car, index) => ({
      key: `car-${index}`,
      label: `${car.marca} ${car.modelo}`,
    })),
  ];

  const propertiesToShow = [
    "marca",
    "modelo",
    "versao",
    "preco",
    "ano_modelo",
    "ano_fabricacao",
    "km",
    "cor",
    "motorizacao",
    "potencia",
    "torque",
    "cambio",
    "tracao",
    "direcao",
    "freios",
    "rodas",
    "bancos",
    "airbags",
    "ar_condicionado",
    "farol",
    "multimidia",
    "final_placa",
    "carroceria",
    "blindado",
    "opcionais",
  ];

  const rows = propertiesToShow.map((key) => {
    const row: any = {
      propriedade: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
    };
    compareList.forEach((car, index) => {
      row[`car-${index}`] = formatValue(key, car[key as keyof Car]);
    });
    return row;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Comparador de Carros</h1>
      <SearchBar onSelect={handleCarSelect} /> {/* Adicione a barra de pesquisa aqui */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 mb-8 md:w-6/12">
        {compareList.map((car, index) => (
          <Card key={index} className="w-full">
            <CardBody className="relative flex flex-col items-center p-2">
              <div className="relativeflex items-center justify-center">
                <Image
                  src={car.fotos[0] || "/carroTeste.png"}
                  alt={`${car.marca} ${car.modelo}`}
                  className="rounded-lg h-[9rem] w-[16rem] object-cover"
                />
                <Button
                  isIconOnly
                  color="danger"
                  variant="solid"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => removeCar(index)}
                >
                  <XCircle size={20} />
                </Button>
              </div>
              <h2 className="text-md font-medium">
                {car.marca} {car.modelo}
              </h2>
              <p className="text-gray-600 text-center">{car.versao}</p>
            </CardBody>
          </Card>

        ))}
        {/* se tiver menos de 2 carro, adicionar um botão para adicionar mais carros */}
        {compareList.length < 2 && (
          <Card className="w-full">
            <CardBody className="flex items-center justify-center">
              <p className="opacity-60 text-xs">Adicione mais um veículo para comparar</p>
            </CardBody>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Comparação Detalhada</h2>
        <div className="overflow-x-auto">
          <Table isStriped aria-label="Tabela de comparação de carros">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key} className="max-w-[60px] bg-gray-100 dark:bg-zinc-800 font-bold text-xs md:text-sm lg:text-base">
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={item.propriedade}>
                  {(columnKey) => (
                    <TableCell className="max-w-[60px] break-words text-xs md:text-sm lg:text-base">
                      {columnKey === "propriedade" ? (
                        <span className="font-semibold">{item[columnKey]}</span>
                      ) : (
                        item[columnKey as keyof typeof item]
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
