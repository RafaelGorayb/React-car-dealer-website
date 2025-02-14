"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Car, FiltrosPesquisa } from "../../types";
import CarCard from "@/components/Card";
import CarFilterSideMenu from "@/components/carFilter";
import SortSelector from "@/components/ui/SeletorEstoque";
import { Button } from "@nextui-org/react";
import { FilterIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import FilterChips from '@/components/ui/FilterChips';
import FilterSlider from '@/components/ui/FilterSlider';
import Breadcrumb from '@/components/ui/Breadcrumb';

function Estoque() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCarAttribute, setLastCarAttribute] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<FiltrosPesquisa | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [totalCarsCount, setTotalCarsCount] = useState(0);
  const [orderBy, setOrderBy] = useState<string>("id");
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const supabase = createClient();

  const lastCarElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreCars();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchCars = async (isInitial = false) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("carro")
        .select(
          `
          *,
          opcionais_carro (nome),
          fotos_urls (url)
        `,
          { count: "exact" }
        )
        .order(orderBy, { ascending: isAscending })
        .limit(12);

      // Apply filters only if they have values
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            switch (key) {
              case 'precoMin':
              case 'anoMin':
              case 'kmMin':
                query = query.gte(key.replace('Min', ''), value);
                break;
              case 'precoMax':
              case 'anoMax':
              case 'kmMax':
                query = query.lte(key.replace('Max', ''), value);
                break;
              case 'blindado':
                if (value === true) {
                  query = query.eq(key, value);
                }
                break;
              case 'cor':
              case 'carroceria':
                if (value !== '') {
                  query = query.eq(key, value);
                }
                break;
              default:
                if (typeof value === 'string' && value.trim() !== '') {
                  query = query.eq(key, value);
                }
            }
          }
        });
      }

      if (!isInitial && lastCarAttribute) {
        query = isAscending
          ? query.gt(orderBy, lastCarAttribute)
          : query.lt(orderBy, lastCarAttribute);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const carsList: Car[] = data.map((carro: any) => ({
        id: carro.id,
        marca: carro.marca,
        modelo: carro.modelo,
        versao: carro.versao,
        preco: carro.preco,
        ano_modelo: carro.ano_modelo,
        ano_fabricacao: carro.ano_fabricacao,
        km: carro.km,
        cor: carro.cor,
        motorizacao: carro.motorizacao,
        motor: carro.motor,
        potencia: carro.potencia,
        torque: carro.torque,
        cambio: carro.cambio,
        tracao: carro.tracao,
        direcao: carro.direcao,
        freios: carro.freios,
        rodas: carro.rodas,
        bancos: carro.bancos,
        airbags: carro.airbag,
        ar_condicionado: carro.ar_condicionado,
        farol: carro.farol,
        multimidia: carro.multimidia,
        final_placa: carro.final_placa,
        carroceria: carro.carroceria,
        blindado: carro.blindado,
        opcionais: carro.opcionais_carro ? carro.opcionais_carro.map((opcional: any) => opcional.nome) : [],
        fotos: carro.fotos_urls ? carro.fotos_urls.map((foto: any) => foto.url) : [],
      }));

      if (isInitial) {
        setCars(carsList);
      } else {
        setCars((prevCars) => [...prevCars, ...carsList]);
      }

      setLastCarAttribute(data.length ? data[data.length - 1][orderBy] : null);
      setHasMore(data.length === 12);
      setTotalCarsCount(count || 0);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreCars = () => {
    if (!isLoading && hasMore) {
      fetchCars(false);
    }
  };

  useEffect(() => {
    fetchCars(true);
  }, [filters, orderBy, isAscending]);

  const handleFilterSubmit = (data: FiltrosPesquisa) => {
    // Reset pagination when applying new filters
    setLastCarAttribute(null);
    setHasMore(true);
    setFilters(data);
  };

  const handleRemoveFilter = (key: keyof FiltrosPesquisa) => {
    if (!filters) return;
    
    const newFilters = { ...filters };
    
    switch (key) {
      case 'marca':
        newFilters.marca = '';
        newFilters.modelo = '';
        newFilters.versao = '';
        break;
      case 'modelo':
        newFilters.modelo = '';
        newFilters.versao = '';
        break;
      case 'versao':
        newFilters.versao = '';
        break;
      default:
        if (key === 'precoMin' || key === 'precoMax' || key === 'anoMin' || 
            key === 'anoMax' || key === 'kmMin' || key === 'kmMax') {
          (newFilters[key] as number) = 0;
        } else if (key === 'blindado') {
          newFilters[key] = false;
        } else {
          (newFilters[key] as string) = '';
        }
    }
    
    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    const defaultFilters: FiltrosPesquisa = {
      marca: '',
      modelo: '',
      versao: '',
      precoMin: 0,
      precoMax: 0,
      anoMin: 0,
      anoMax: 0,
      kmMin: 0,
      kmMax: 0,
      cor: '',
      motorizacao: '',
      carroceria: '',
      blindado: false
    };
    
    setFilters(defaultFilters);
  };

  const handleSortChange = (newOrderBy: string, newIsAscending: boolean) => {
    // Reset pagination when changing sort
    setLastCarAttribute(null);
    setHasMore(true);
    setOrderBy(newOrderBy);
    setIsAscending(newIsAscending);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="flex bg-slate-50">
      <div className="left-0 z-20 md:z-20">
        <CarFilterSideMenu 
          submitForm={handleFilterSubmit} 
          isOpen={isOpen} 
          toggleMenu={toggleMenu} 
          currentFilters={filters}
          resetForm={handleClearAllFilters}
        />
      </div>
      <div className="flex-1 lg:ml-80 flex flex-col items-center pt-8 w-full">
        <div className="w-full px-4 mb-4">
          <Breadcrumb
            items={[
              { label: 'Estoque', href: '/estoque' }
            ]}
          />
        </div>
        <p className="text-gray-500 pb-2 text-sm">{totalCarsCount} carros encontrados</p>
        <div className="sticky px-2 top-16 w-full bg-slate-50/70 backdrop-blur-md flex py-2 mb-4 justify-between lg:justify-end z-10">
          <div className="w-4/12 lg:hidden block justify-end">
            <Button                    
              endContent={<FilterIcon size={16} />}
              className="lg:hidden relative"
              onClick={toggleMenu}
              variant="faded"
            >
              Filtrar
            </Button>
          </div>
          <SortSelector onChange={handleSortChange} />
        </div>
        <FilterSlider
          filters={filters}
          onClearAll={handleClearAllFilters}
          onRemoveFilter={handleRemoveFilter}
          hasActiveFilters={filters ? Object.values(filters).some(value => 
            value !== '' && value !== 0 && value !== false
          ) : false}
        />
        <div className="grid gap-4 justify-items-center grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car, index) => (
            <div key={car.id} ref={index === cars.length - 1 ? lastCarElementRef : null}>
              <CarCard car={car} isLoading={false} />
            </div>
          ))}
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <CarCard key={`loading-${index}`} car={{} as Car} isLoading={true} />
            ))}
        </div>
        {!hasMore && <p className="text-center mt-4">Isso é tudo!</p>}
      </div>
    </div>
  );
  
}

export default Estoque;
