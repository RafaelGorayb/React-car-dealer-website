"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Spinner,
  Button,
  Card,
  CardBody,
  Image,
} from "@nextui-org/react";
import { Car } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatCars } from "@/utils/functions";
import { toast } from "react-toastify";
import CarModal from "../CarModal"; // Ajuste o caminho de importação conforme necessário
import { Search } from "lucide-react";

interface SearchBarProps {
  isExpanded?: boolean;
  onToggle?: () => void;
  onSelect?: (car: Car) => void;
}

// Componentes wrapper para garantir compatibilidade com JSX
const SafeAnimatePresence: React.FC<{ children: React.ReactNode, initial?: boolean }> = ({
  children,
  initial,
}) => {
  return <>{children}</>;
};

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => {
  return <Search className={className} />;
};

export const SearchBar = ({
  isExpanded = true,
  onToggle,
  onSelect,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isSearchExpanded = onToggle ? isExpanded : true;

  // Estados para controlar o carro selecionado e o modal
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      if (searchTerm.length > 0) {
        setIsLoading(true);

        const terms = searchTerm.split(" ");
        let query = supabase
          .from("carro")
          .select(
            `
            *,
            opcionais_carro (nome),
            fotos_urls (url)
          `
          );

        // Adicionar filtros para cada termo
        terms.forEach((term) => {
          query = query.or(
            `marca.ilike.%${term}%,modelo.ilike.%${term}%,versao.ilike.%${term}%`
          );
        });

        const { data, error } = await query.limit(5);

        if (error) {
          toast.error("Erro ao buscar carros: " + error.message);
        } else {
          setCars(formatCars(data) as Car[]);
          setShowDropdown(true);
        }
        setIsLoading(false);
      } else {
        setCars([]);
        setShowDropdown(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchCars();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (car: Car) => {
    if (onSelect) {
      onSelect(car);
      setShowDropdown(false); // Fecha o dropdown após a seleção
    } else {
      setSelectedCar(car);
      setIsModalOpen(true);
      setShowDropdown(false); // Fecha o dropdown após a seleção
    }
  };

  return (
    <div className="relative z-20 w-full" ref={dropdownRef}>
      <SafeAnimatePresence initial={false}>
        {isSearchExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className=""
          >
            <Input
              type="text"
              placeholder="Pesquisar veículo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              labelPlacement="outside"
              startContent={
                <SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              endContent={isLoading && <Spinner size="sm" />}
              className=""
            />
            {showDropdown && cars.length > 0 && (
              <Card className="mt-1 absolute w-full">
                <CardBody className="p-0">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer transition-colors"
                      onClick={() => handleSelect(car)}
                    >
                      <div className="flex p-1 justify-between items-center">
                        <div>
                          <div className="font-semibold">{`${car.marca} ${car.modelo}`}</div>
                          <div className="text-xs font-light ">{`${car.versao} - ${car.ano_modelo}`}</div>
                          <div className="text-xs mt-1">{`R$ ${car.preco.toLocaleString(
                            "pt-BR"
                          )}`}</div>
                        </div>
                        <Image
                          removeWrapper
                          src={car.fotos[0]}
                          alt={car.modelo}
                          className="rounded-md max-h-[5rem] w-[8rem] object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </CardBody>
              </Card>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ width: "auto", opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              isIconOnly
              variant="light"
              aria-label="pesquisar"
              onClick={onToggle}
            >
              <SearchIcon className="text-xl" />
            </Button>
          </motion.div>
        )}
      </SafeAnimatePresence>

      {/* Renderiza o CarModal se onSelect não estiver definido */}
      {selectedCar && !onSelect && (
        <CarModal
          car={selectedCar}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <SearchBar
        isExpanded={isSearchExpanded}
        onToggle={() => setIsSearchExpanded(!isSearchExpanded)}
      />
    </nav>
  );
};
