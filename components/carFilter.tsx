import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiltrosPesquisa } from "../types";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { Filter, X } from "lucide-react";

interface CarFilterProps {
  submitForm: (data: FiltrosPesquisa) => void;
  marcasDisponiveis: string[];
}

const CarFilterSideMenu: React.FC<CarFilterProps> = ({ submitForm, marcasDisponiveis }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FiltrosPesquisa>();

  useEffect(() => {
    // Registering the marca field to use the setValue method
    register("marca");
  }, [register]);

  const onSubmit = (data: FiltrosPesquisa) => {
    submitForm(data);
    if (window.innerWidth < 768) {
      toggleMenu();
    }
  };

  const FilterForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
<Select
        label="Marca"
        placeholder="Selecione a marca"
        onChange={(e) => setValue("marca", e.target.value)}
        className="max-w-xs"
      >
        {marcasDisponiveis.map((marca) => (
          <SelectItem key={marca} value={marca}>
            {marca}
          </SelectItem>
        ))}
      </Select>
      {errors.marca && <span className="text-red-500">{errors.marca.message}</span>}

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

      <Input
        {...register("cor")}
        label="Cor"
        placeholder="Cor do veículo"
      />

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
