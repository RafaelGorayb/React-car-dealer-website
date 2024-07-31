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

  const formatValue = (value: any) => {
    if (typeof value === "number") {
      return value.toLocaleString("pt-BR");
    }
    return value;
  };

  const rows = compareList.map((car) => {
    const row: any = { carro: `${car.marca} ${car.modelo}` };
    Object.keys(car).forEach((key) => {
      row[key] = car[key as keyof Car];
    });
    return row;
  });

  const columns = compareList.map((car, index) => ({
    key: index,
    label: `${car.marca} ${car.modelo}`,
  }));

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
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.carro}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {String(column.key) === "blindado" ? (
                      item[column.key] ? (
                        <Check className="text-green-500" />
                      ) : (
                        <X className="text-red-500" />
                      )
                    ) : (
                      <Tooltip content={String(item[column.key])}>
                        <span>{formatValue(item[column.key])}</span>
                      </Tooltip>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
