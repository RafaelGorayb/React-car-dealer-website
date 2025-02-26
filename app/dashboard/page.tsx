"use client";
import React, { useState, useEffect } from "react";
import { Pie, Bar, Line } from 'react-chartjs-2';
import { 
  Chart, 
  ArcElement, 
  PieController, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  BarController,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { createClient } from "@/utils/supabase/client"; // Importando o cliente do Supabase
import { toast } from "react-toastify"; // Importando o toast para notificações
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import InfoCard from '@/components/Dashboard/InfoCard'; // Importe o novo componente
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrando os componentes necessários do Chart.js
Chart.register(
  PieController, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  BarController,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

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
  const [priceRangeData, setPriceRangeData] = useState<{ [key: string]: number }>({});
  const [yearData, setYearData] = useState<{ [key: string]: number }>({});
  const [avgPrice, setAvgPrice] = useState<number>(0);
  const [avgKm, setAvgKm] = useState<number>(0);
  const [topCars, setTopCars] = useState<Car[]>([]);
  const [colorData, setColorData] = useState<{ [key: string]: number }>({});

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

        // Calculando o preço médio
        setAvgPrice(totalVal / fetchedCars.length);

        // Calculando a quilometragem média
        const totalKm = fetchedCars.reduce((sum, car) => sum + (car.km || 0), 0);
        setAvgKm(totalKm / fetchedCars.length);

        // Contando a quantidade de veículos por marca
        const brandCounts: { [key: string]: number } = {};
        fetchedCars.forEach((car) => {
          brandCounts[car.marca] = (brandCounts[car.marca] || 0) + 1;
        });
        setBrandData(brandCounts);

        // Contando a quantidade de veículos por faixa de preço
        const priceRanges: { [key: string]: number } = {
          "Até R$ 50.000": 0,
          "R$ 50.001 - R$ 100.000": 0,
          "R$ 100.001 - R$ 150.000": 0,
          "R$ 150.001 - R$ 200.000": 0,
          "Acima de R$ 200.000": 0,
        };

        fetchedCars.forEach((car) => {
          if (car.preco <= 50000) {
            priceRanges["Até R$ 50.000"]++;
          } else if (car.preco <= 100000) {
            priceRanges["R$ 50.001 - R$ 100.000"]++;
          } else if (car.preco <= 150000) {
            priceRanges["R$ 100.001 - R$ 150.000"]++;
          } else if (car.preco <= 200000) {
            priceRanges["R$ 150.001 - R$ 200.000"]++;
          } else {
            priceRanges["Acima de R$ 200.000"]++;
          }
        });
        setPriceRangeData(priceRanges);

        // Contando a quantidade de veículos por ano
        const yearCounts: { [key: string]: number } = {};
        fetchedCars.forEach((car) => {
          if (car.ano_modelo) {
            const year = car.ano_modelo.toString();
            yearCounts[year] = (yearCounts[year] || 0) + 1;
          }
        });
        setYearData(yearCounts);

        // Obtendo os 5 carros mais caros
        const sortedCars = [...fetchedCars].sort((a, b) => b.preco - a.preco);
        setTopCars(sortedCars.slice(0, 5));

        // Contando a quantidade de veículos por cor
        const colorCounts: { [key: string]: number } = {};
        fetchedCars.forEach((car) => {
          if (car.cor) {
            colorCounts[car.cor] = (colorCounts[car.cor] || 0) + 1;
          }
        });
        setColorData(colorCounts);
      }
    };

    fetchCars();
  }, []);

  // Preparando os dados para o gráfico de pizza (marcas)
  const brandChartData = {
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
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
          'rgba(255, 99, 255, 0.6)',
          'rgba(0, 162, 235, 0.6)',
        ],
      },
    ],
  };

  // Preparando os dados para o gráfico de barras (faixas de preço)
  const priceRangeChartData = {
    labels: Object.keys(priceRangeData),
    datasets: [
      {
        label: 'Quantidade de Veículos por Faixa de Preço',
        data: Object.values(priceRangeData),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Preparando os dados para o gráfico de linha (anos)
  const yearChartData = {
    labels: Object.keys(yearData).sort(),
    datasets: [
      {
        label: 'Quantidade de Veículos por Ano',
        data: Object.keys(yearData).sort().map(year => yearData[year]),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  // Preparando os dados para o gráfico de pizza (cores)
  const colorChartData = {
    labels: Object.keys(colorData),
    datasets: [
      {
        label: 'Quantidade de Veículos por Cor',
        data: Object.values(colorData),
        backgroundColor: [
          'rgba(0, 0, 0, 0.6)',      // Preto
          'rgba(255, 255, 255, 0.6)', // Branco
          'rgba(192, 192, 192, 0.6)', // Prata
          'rgba(128, 128, 128, 0.6)', // Cinza
          'rgba(255, 0, 0, 0.6)',     // Vermelho
          'rgba(0, 0, 255, 0.6)',     // Azul
          'rgba(0, 128, 0, 0.6)',     // Verde
          'rgba(255, 255, 0, 0.6)',   // Amarelo
          'rgba(165, 42, 42, 0.6)',   // Marrom
          'rgba(255, 165, 0, 0.6)',   // Laranja
        ],
      },
    ],
  };

  // Configurações do gráfico de pizza, incluindo o uso do plugin para exibir labels
  const pieChartOptions = {
    plugins: {
      datalabels: {
        color: '#fff', // Cor do texto
        formatter: (value: number, context: any) => {
          return context.chart.data.labels[context.dataIndex]; // Exibir a marca no rótulo
        },
        font: {
          weight: 700, // Use a numeric value for the weight, such as 700 for "bold"
          size: 11,
        },
      },
      legend: {
        position: 'right' as const,
        align: 'center' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Configurações do gráfico de barras
  const barChartOptions = {
    plugins: {
      datalabels: {
        color: '#000',
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: (value: number) => value,
        font: {
          weight: 700,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Configurações do gráfico de linha
  const lineChartOptions = {
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Veículos</h1>
      
      {/* Cards informativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard 
          title="Número total de carros" 
          value={totalCars} 
        />
        <InfoCard 
          title="Valor total dos carros" 
          value={totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
        />
        <InfoCard 
          title="Preço médio" 
          value={avgPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
        />
        <InfoCard 
          title="Quilometragem média" 
          value={Math.round(avgKm).toLocaleString('pt-BR') + ' km'} 
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de pizza - Marcas */}
        <Card className="p-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h2 className="text-xl font-bold">Veículos por Marca</h2>
          </CardHeader>
          <CardBody className="h-96">
            <div className="h-full w-full flex items-center justify-center">
              <Pie data={brandChartData} options={pieChartOptions} />
            </div>
          </CardBody>
        </Card>

        {/* Gráfico de barras - Faixas de preço */}
        <Card className="p-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h2 className="text-xl font-bold">Veículos por Faixa de Preço</h2>
          </CardHeader>
          <CardBody className="h-96">
            <Bar data={priceRangeChartData} options={barChartOptions} />
          </CardBody>
        </Card>

        {/* Gráfico de linha - Anos */}
        <Card className="p-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h2 className="text-xl font-bold">Veículos por Ano</h2>
          </CardHeader>
          <CardBody className="h-96">
            <Line data={yearChartData} options={lineChartOptions} />
          </CardBody>
        </Card>

        {/* Gráfico de pizza - Cores */}
        <Card className="p-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h2 className="text-xl font-bold">Veículos por Cor</h2>
          </CardHeader>
          <CardBody className="h-96">
            <div className="h-full w-full flex items-center justify-center">
              <Pie data={colorChartData} options={pieChartOptions} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabela de carros mais caros */}
      <Card className="p-4 mb-6">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h2 className="text-xl font-bold">Top 5 Carros Mais Caros</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Tabela de carros mais caros">
            <TableHeader>
              <TableColumn>MARCA</TableColumn>
              <TableColumn>MODELO</TableColumn>
              <TableColumn>VERSÃO</TableColumn>
              <TableColumn>ANO</TableColumn>
              <TableColumn>PREÇO</TableColumn>
            </TableHeader>
            <TableBody>
              {topCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.marca}</TableCell>
                  <TableCell>{car.modelo}</TableCell>
                  <TableCell>{car.versao || '-'}</TableCell>
                  <TableCell>{car.ano_modelo || '-'}</TableCell>
                  <TableCell>{car.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default DashboardLayout;