import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Switch,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { filterSchema, FilterSchemaType } from "@/lib/formTypes";
import { Filter, X } from "lucide-react";

interface CarFilterProps {
  submitForm: (data: FilterSchemaType) => void;
}

const CarFilterSideMenu: React.FC<CarFilterProps> = ({ submitForm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterSchemaType>({
    resolver: zodResolver(filterSchema),
  });

  const onSubmit = (data: FilterSchemaType) => {
    submitForm(data);
    if (window.innerWidth < 768) {
      toggleMenu();
    }
  };

  const FilterForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Accordion>
        <AccordionItem key="marca" title="Marca">
          <Input
            {...register("marca")}
            label="Marca"
            placeholder="Selecione a marca"
          />
        </AccordionItem>
        <AccordionItem key="preco" title="Preço">
          <div className="flex space-x-2">
            <Input
              {...register("precoMin", { valueAsNumber: true })}
              type="number"
              label="Preço mínimo"
              placeholder="Min"
            />
            <Input
              {...register("precoMax", { valueAsNumber: true })}
              type="number"
              label="Preço máximo"
              placeholder="Max"
            />
          </div>
        </AccordionItem>
        <AccordionItem key="ano" title="Ano">
          <div className="flex space-x-2">
            <Input
              {...register("anoMin", { valueAsNumber: true })}
              type="number"
              label="Ano mínimo"
              placeholder="De"
            />
            <Input
              {...register("anoMax", { valueAsNumber: true })}
              type="number"
              label="Ano máximo"
              placeholder="Até"
            />
          </div>
        </AccordionItem>
        <AccordionItem key="km" title="Km">
          <div className="flex space-x-2">
            <Input
              {...register("kmMin", { valueAsNumber: true })}
              type="number"
              label="Km mínimo"
              placeholder="De"
            />
            <Input
              {...register("kmMax", { valueAsNumber: true })}
              type="number"
              label="Km máximo"
              placeholder="Até"
            />
          </div>
        </AccordionItem>
        <AccordionItem key="motorizacao" title="Motorização">
          <Input
            {...register("motorizacao")}
            label="Motorização"
            placeholder="Tipo de motor"
          />
        </AccordionItem>
      </Accordion>
      <div className="flex items-center justify-between">
        <label htmlFor="blindado" className="text-sm">
          Blindado
        </label>
        <Switch {...register("blindado")} id="blindado" />
      </div>
      <Button type="submit" color="danger" className="w-full">
        Aplicar Filtros
      </Button>
    </form>
  );

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 lg:hidden">
        <Button
          onClick={toggleMenu}
          color="danger"
          isIconOnly
          className="rounded-full shadow-lg"
        >
          <Filter size={24} />
        </Button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-80 bg-background shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Button
          onClick={toggleMenu}
          isIconOnly
          className="absolute top-4 right-4"
          variant="light"
        >
          <X size={24} />
        </Button>

        <div className="p-6 mt-16 overflow-y-auto h-full">
          <h2 className="text-2xl font-bold mb-6">Filtros</h2>
          <FilterForm />
        </div>
      </div>

      <div className="hidden lg:block fixed w-80 h-screen overflow-y-auto p-4 bg-background shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Filtros</h2>
        <FilterForm />
      </div>
    </>
  );
};

export default CarFilterSideMenu;
