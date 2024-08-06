"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Spinner,
  Button,
  Card,
  CardBody,
  Avatar,
  Image,
} from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Car } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatCars } from "@/utils/functions";
import { toast } from "react-toastify";

interface SearchBarProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const SearchBar = ({ isExpanded, onToggle }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    router.push(`/carro/${car.id}`);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md min-w-[300px]"
          >
            <Input
              type="text"
              placeholder="Pesquisar veículo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              labelPlacement="outside"
              startContent={
                <FaMagnifyingGlass className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              endContent={isLoading && <Spinner size="sm" />}
              className="w-full"
            />
            {showDropdown && cars.length > 0 && (
              <Card className="w-full mt-1 absolute">
                <CardBody className="p-0">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleSelect(car)}
                    >
                      <div className="flex p-1 justify-between items-center">
                        <div>
                          <div className="font-semibold">{`${car.marca} ${car.modelo}`}</div>
                          <div className="text-sm text-gray-500">{`${car.versao} - ${car.ano_modelo}`}</div>
                          <div className="text-sm font-medium text-primary-500">{`R$ ${car.preco.toLocaleString("pt-BR")}`}</div>
                        </div>
                        <Image
                          src={car.fotos[0]}
                          alt={car.modelo}
                          height={60}
                          className="rounded-md"
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
              <FaMagnifyingGlass className="text-xl" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
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
