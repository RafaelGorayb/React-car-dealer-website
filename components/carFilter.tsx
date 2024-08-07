import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiltrosPesquisa } from "../types/index";
import { Button, Input, Switch, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,} from "@nextui-org/react";
import { Filter, X } from "lucide-react";
import { supabase } from "../lib/initSupabase";

interface CarFilterProps {
  submitForm: (data: FiltrosPesquisa) => void;
  isOpen: boolean;
  toggleMenu: () => void;
}

const CarFilterSideMenu: React.FC<CarFilterProps> = ({
  submitForm,
  isOpen,
  toggleMenu,
}) => {
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [versoes, setVersoes] = useState<string[]>([]);
  const [cores, setCores] = useState<string[]>([]);
  const [carrocerias, setCarrocerias] = useState<string[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<string>("");
  const [selectedModelo, setSelectedModelo] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FiltrosPesquisa>();

  const fetchDistinctValues = async (
    column: string,
    filterColumn?: string,
    filterValue?: string
  ) => {
    let query = supabase
      .from("carro")
      .select(column)
      .neq(column, null)
      .neq(column, "")
      .order(column, { ascending: true });

    if (filterColumn && filterValue) {
      query = query.eq(filterColumn, filterValue);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar ${column}:", error);
      return [];
    }

    const distinctValues = Array.from(
      new Set(data.map((item: any) => item[column]))
    );

    return distinctValues;
  };

  useEffect(() => {
    const fetchData = async () => {
      const [marcas, cores, carrocerias] = await Promise.all([
        fetchDistinctValues("marca"),
        fetchDistinctValues("cor"),
        fetchDistinctValues("carroceria"),
      ]);
      setMarcas(marcas);
      setCores(cores);
      setCarrocerias(carrocerias);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMarca) {
      const fetchModelos = async () => {
        const modelos = await fetchDistinctValues(
          "modelo",
          "marca",
          selectedMarca
        );
        setModelos(modelos);
      };

      fetchModelos();
    } else {
      setModelos([]);
    }
  }, [selectedMarca]);

  useEffect(() => {
    if (selectedModelo) {
      const fetchVersoes = async () => {
        const versoes = await fetchDistinctValues(
          "versao",
          "modelo",
          selectedModelo
        );
        setVersoes(versoes);
      };

      fetchVersoes();
    } else {
      setVersoes([]);
    }
  }, [selectedModelo]);

  const onSubmit = (data: FiltrosPesquisa) => {
    console.log(data); // Adicione esta linha para imprimir os dados do formulário
    submitForm(data);
    if (window.innerWidth < 768) {
      toggleMenu();
    }
  };

  const FilterForm = () => (

    
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="marca">Marca</label>
        <Select
          items={marcas.map((marca) => ({ label: marca, value: marca }))}
          placeholder="Selecione a marca"
          selectedKeys={new Set([selectedMarca])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys).join(", ");
            setSelectedMarca(selected);
            setValue("marca", selected);
          }}
        >
          {(marca) => <SelectItem key={marca.value}>{marca.label}</SelectItem>}
        </Select>
      </div>

      <div>
        <label htmlFor="modelo">Modelo</label>
        <Select
          items={modelos.map((modelo) => ({ label: modelo, value: modelo }))}
          placeholder="Selecione o modelo"
          selectedKeys={new Set([selectedModelo])}
          disabled={!selectedMarca}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys).join(", ");
            setSelectedModelo(selected);
            setValue("modelo", selected);
          }}
        >
          {(modelo) => (
            <SelectItem key={modelo.value}>{modelo.label}</SelectItem>
          )}
        </Select>
      </div>

      <div>
        <label htmlFor="versao">Versão</label>
        <Select
          items={versoes.map((versao) => ({ label: versao, value: versao }))}
          placeholder="Selecione a versão"
          selectedKeys={new Set([watch("versao")])}
          disabled={!selectedModelo}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys).join(", ");
            setValue("versao", selected);
          }}
        >
          {(versao) => (
            <SelectItem key={versao.value}>{versao.label}</SelectItem>
          )}
        </Select>
      </div>

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

      <div>
        <label htmlFor="cor">Cor</label>
        <Select
          id="cor"
          {...register("cor")}
          items={cores.map((cor) => ({ label: cor, value: cor }))}
          placeholder="Selecione a cor"
          selectedKeys={new Set([watch("cor")])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys).join(", ");
            setValue("cor", selected);
          }}
        >
          {(cor) => <SelectItem key={cor.value}>{cor.label}</SelectItem>}
        </Select>
      </div>

      <div>
        <label htmlFor="carroceria">Carroceria</label>
        <Select
          id="carroceria"
          {...register("carroceria")}
          items={carrocerias.map((carroceria) => ({
            label: carroceria,
            value: carroceria,
          }))}
          placeholder="Selecione o tipo de carroceria"
          selectedKeys={new Set([watch("carroceria")])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys).join(", ");
            setValue("carroceria", selected);
          }}
        >
          {(carroceria) => (
            <SelectItem key={carroceria.value}>{carroceria.label}</SelectItem>
          )}
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="blindado" className="text-sm">
          Blindado
        </label>
        <input type="checkbox" {...register("blindado")} id="blindado" />
      </div>
    </form>
  );

  return (
    <>
      <div
        className={`fixed pt-12 inset-y-0 w-full h-full bg-background transform transition-transform duration-200 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pb-24 overflow-y-auto h-full"> {/* Adiciona padding-bottom */}
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold mb-6">Filtros</h2>
            <Button color="default" onClick={toggleMenu}>
              Fechar
            </Button>
          </div>
          <FilterForm />
        </div>
        <div className="fixed bottom-0 left-0 w-full p-4 bg-background">
          <Button
            type="submit"
            color="danger"
            className="w-full"
            onClick={handleSubmit(onSubmit)}
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>
  
      <div className="hidden lg:block fixed bg-background w-80 h-screen overflow-y-auto p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Filtros</h2>
        <FilterForm />
        <Button type="submit" color="danger" className="w-full mt-4" onClick={handleSubmit(onSubmit)}>
          Aplicar Filtros
        </Button>
      </div>
    </>
  );
};

export default CarFilterSideMenu;