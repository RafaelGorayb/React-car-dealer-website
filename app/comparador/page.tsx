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
} from "@nextui-org/react";
import { XCircle, AlertCircle, Check, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Comparador() {
  const { compareList, setCompareList } = useCompareList();
  const [selectedFeature, setSelectedFeature] = useState("preco");

  if (!compareList || compareList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle size={48} className="text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Nenhum carro para comparar</h1>
        <p className="text-gray-600">
          Adicione carros ao comparador para começar.
        </p>
      </div>
    );
  }

  const removeCar = (index: number) => {
    setCompareList(compareList.filter((_, i) => i !== index));
  };

  const features = [
    { key: "preco", label: "Preço" },
    { key: "km", label: "Quilometragem" },
    { key: "potencia", label: "Potência" },
    { key: "ano_modelo", label: "Ano do Modelo" },
  ];

  const getChartData = () => {
    return compareList.map((car) => ({
      name: `${car.marca} ${car.modelo}`,
      value: car[selectedFeature as keyof Car],
    }));
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {compareList.map((car, index) => (
          <Card key={index} className="w-full">
            <CardBody className="p-4">
              <div className="relative">
                <Image
                  src={car.fotos[0] || "/carroTeste.png"}
                  alt={`${car.marca} ${car.modelo}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  isIconOnly
                  color="danger"
                  variant="solid"
                  className="absolute top-2 right-2"
                  onClick={() => removeCar(index)}
                >
                  <XCircle size={20} />
                </Button>
              </div>
              <h2 className="text-xl font-semibold mt-4">
                {car.marca} {car.modelo}
              </h2>
              <p className="text-gray-600">{car.versao}</p>
            </CardBody>
            <CardFooter className="text-lg font-bold">
              R$ {car.preco.toLocaleString("pt-BR")}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Comparação Gráfica</h2>
        <div className="flex gap-2 mb-4">
          {features.map((feature) => (
            <Button
              key={feature.key}
              color={selectedFeature === feature.key ? "primary" : "default"}
              onClick={() => setSelectedFeature(feature.key)}
            >
              {feature.label}
            </Button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Comparação Detalhada</h2>
        <Table aria-label="Tabela de comparação de carros">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} className="bg-gray-100 font-bold">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.propriedade}>
                {(columnKey) => (
                  <TableCell className="py-2">
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
  );
}
