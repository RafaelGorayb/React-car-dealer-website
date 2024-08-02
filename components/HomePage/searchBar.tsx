"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input, Spinner, Button } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Car } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
      if (searchTerm.length > 2) {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("carro")
          .select("*")
          .ilike("modelo", `%${searchTerm}%`)
          .limit(5);

        if (error) {
          console.error("Erro ao buscar carros:", error);
        } else {
          setCars(data as Car[]);
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
    <div className="relative" ref={dropdownRef}>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Input
              type="text"
              placeholder="Pesquisar veículo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              labelPlacement="outside"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <FaMagnifyingGlass />
                </div>
              }
              endContent={isLoading && <Spinner size="sm" />}
            />
            {showDropdown && cars.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(car)}
                  >
                    <div className="font-semibold">{`${car.marca} ${car.modelo}`}</div>
                    <div className="text-sm text-gray-500">{`${car.versao} - ${car.ano_modelo}`}</div>
                  </div>
                ))}
              </div>
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
              variant="faded"
              aria-label="pesquisar"
              onClick={onToggle}
            >
              <FaMagnifyingGlass className="text-base text-default-400 pointer-events-none flex-shrink-0" />
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
