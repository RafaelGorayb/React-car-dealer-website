"use client";
import React, { useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, PieController, CategoryScale, LinearScale } from 'chart.js';
import { createClient } from "@/utils/supabase/client"; // Importando o cliente do Supabase
import { toast } from "react-toastify"; // Importando o toast para notificações
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import InfoCard from '@/components/Dashboard/InfoCard'; // Importe o novo componente
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrando os componentes necessários do Chart.js
Chart.register(PieController, ArcElement, CategoryScale, LinearScale, ChartDataLabels);

// Registrando os componentes necessários do Chart.js
Chart.register(PieController, ArcElement, CategoryScale, LinearScale, ChartDataLabels); // Registrando o plugin

interface Car {
  id: number;
  marca: string;
  modelo: string;
  versao?: string;
  ano_modelo?: number;
  preco: number;
  km?: number;
  cor?: string;
  // Adicione outros campos conforme necessário
}

// Inicializando o cliente do Supabase
const supabase = createClient();

const DashboardLayout: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [totalCars, setTotalCars] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [brandData, setBrandData] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase.from("carro").select(`
        id,
        marca,
        modelo,
        versao,
        ano_modelo,
        preco,
        km,
        cor
      `);

      if (error) {
        toast.error("Erro ao buscar carros: " + error.message);
        return;
      }

      if (data) {
        const fetchedCars = data as Car[];
        setCars(fetchedCars);

        // Calculando o total de carros
        setTotalCars(fetchedCars.length);

        // Calculando o valor total
        const totalVal = fetchedCars.reduce((sum, car) => sum + car.preco, 0);
        setTotalValue(totalVal);

        // Contando a quantidade de veículos por marca
        const brandCounts: { [key: string]: number } = {};
        fetchedCars.forEach((car) => {
          brandCounts[car.marca] = (brandCounts[car.marca] || 0) + 1;
        });
        setBrandData(brandCounts);
      }
    };

    fetchCars();
  }, []);

  // Preparando os dados para o gráfico de pizza
  const chartData = {
    labels: Object.keys(brandData),
    datasets: [
      {
        label: 'Quantidade de Veículos por Marca',
        data: Object.values(brandData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  // Configurações do gráfico, incluindo o uso do plugin para exibir labels
  const chartOptions = {
    plugins: {
      datalabels: {
        color: '#fff', // Cor do texto
        formatter: (value: number, context: any) => {
          return context.chart.data.labels[context.dataIndex]; // Exibir a marca no rótulo
        },
        font: {
          weight: 700, // Use a numeric value for the weight, such as 700 for "bold"
        },
      },
    },
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="mb-6">
        <InfoCard 
          title="Número total de carros" 
          value={totalCars} 
        />
        <InfoCard 
          title="Valor total dos carros" 
          value={totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
        />
      </div>

      <div className="h-96">
        <h2 className="text-xl mb-4">Veículos por Marca</h2>
        <Pie data={chartData} options={chartOptions}  />
      </div>
    </div>
  );
};

export default DashboardLayout;