import { useEffect, useState, useCallback } from "react";
import { useForm, FormProvider, set } from "react-hook-form";
import { FiltrosPesquisa } from "../types/index";
import { Button } from "@nextui-org/react";
import { Filter, X } from "lucide-react";
import { supabase } from "../lib/initSupabase";
import FilterForm from "./filterForm";

interface CarFilterProps {
  submitForm: (data: FiltrosPesquisa) => void;
  isOpen: boolean;
  toggleMenu: () => void;
}

interface CarroData {
  marca: string;
  cor: string;
  carroceria: string;
  motorizacao: string;
  modelo: string;
  versao: string;
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
  const [motorizacoes, setmotorizacoes] = useState<string[]>([]);
  const [carrocerias, setCarrocerias] = useState<string[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<string>("");
  const [selectedModelo, setSelectedModelo] = useState<string>("");
  const [selectedVersao, setSelectedVersao] = useState<string>("");
  const [selectedMotorizacao, setSelectedMotorizacao] = useState<string>("");

  const methods = useForm<FiltrosPesquisa>();
  const { handleSubmit, setValue } = methods;

  const fetchDistinctValues = useCallback(
    async (
      column: keyof CarroData,
      filterColumn?: keyof CarroData,
      filterValue?: string
    ): Promise<string[]> => {
      try {
        let query = supabase
          .from("carro")
          .select(column)
          .neq(column, null)
          .neq(column, "")
          .order(column, { ascending: true });
  
        if (filterColumn && filterValue) {
          query = query.eq(filterColumn, filterValue);
        }
  
        // Tipar o resultado da consulta
        const { data, error } = await query as { data: Record<string, string>[]; error: any };
  
        if (error) throw error;
  
        // Agora o TypeScript sabe que item[column] é uma string
        return Array.from(new Set(data.map((item) => item[column])));
      } catch (error) {
        console.error(`Erro ao buscar ${column}:`, error);
        return [];
      }
    },
    []
  );
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marcasData, coresData, carroceriasData, motorizacoesData] = await Promise.all([
          fetchDistinctValues("marca"),
          fetchDistinctValues("cor"),
          fetchDistinctValues("carroceria"),
          fetchDistinctValues("motorizacao"),
        ]);
        setMarcas(marcasData);
        setCores(coresData);
        setCarrocerias(carroceriasData);
        setmotorizacoes(motorizacoesData);
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      }
    };

    fetchData();
  }, [fetchDistinctValues]);

  useEffect(() => {
    const fetchModelos = async () => {
      if (selectedMarca) {
        const modelosData = await fetchDistinctValues(
          "modelo",
          "marca",
          selectedMarca
        );
        setModelos(modelosData);
      } else {
        setModelos([]);
      }
    };

    fetchModelos();
  }, [selectedMarca, fetchDistinctValues]);

  useEffect(() => {
    const fetchVersoes = async () => {
      if (selectedModelo) {
        const versoesData = await fetchDistinctValues(
          "versao",
          "modelo",
          selectedModelo
        );
        setVersoes(versoesData);
      } else {
        setVersoes([]);
      }
    };

    fetchVersoes();
  }, [selectedModelo, fetchDistinctValues]);

  const onSubmit = (data: FiltrosPesquisa) => {
    submitForm(data);
    if (window.innerWidth < 768) {
      toggleMenu();
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed pt-12 inset-y-0 w-full h-full bg-background transform transition-transform duration-200 ease-in-out z-10 lg:hidden">
          <div className="p-6 pb-24 overflow-y-auto h-full">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-6">Filtros</h2>
              <Button color="default" onClick={toggleMenu}>
                Fechar
              </Button>
            </div>
            <FormProvider {...methods}>
              <FilterForm
                marcas={marcas}
                modelos={modelos}
                versoes={versoes}
                cores={cores}
                motorizacoes={motorizacoes}
                carrocerias={carrocerias}
                selectedMarca={selectedMarca}
                selectedModelo={selectedModelo}
                selectedVersao={selectedVersao}
                setSelectedMarca={setSelectedMarca}
                setSelectedModelo={setSelectedModelo}
                setSelectedVersao={setSelectedVersao}
                setSelectedMotorizacao={setSelectedMotorizacao}
                
              />
            </FormProvider>
          </div>
          <div className="fixed bottom-0 z-10 left-0 w-full p-4 bg-background">
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
      )}

      {!isMobile && (
        <div className="hidden lg:block flex flex-col fixed bg-background h-screen w-80 ">
          <h2 className="text-2xl font-bold mb-6 ml-4">Filtros</h2>

          <FormProvider {...methods}>
            <div className="flex-1 overflow-y-auto max-h-full pb-52 px-4"> {/* Adicionando max-h-full e padding-bottom */}
              <FilterForm
                marcas={marcas}
                modelos={modelos}
                versoes={versoes}
                cores={cores}
                motorizacoes={motorizacoes}
                carrocerias={carrocerias}
                selectedMarca={selectedMarca}
                selectedModelo={selectedModelo}
                selectedVersao={selectedVersao}
                setSelectedMarca={setSelectedMarca}
                setSelectedModelo={setSelectedModelo}
                setSelectedVersao={setSelectedVersao}
                setSelectedMotorizacao={setSelectedMotorizacao}
              />
            </div>
          </FormProvider>

          <div className="fixed bottom-0 z-10 left-0 p-4 w-80 bg-background">
            <Button
              type="submit"
              color="danger"
              className="w-full mt-4"
              onClick={handleSubmit(onSubmit)}
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>

      )}
    </>
  );
};

export default CarFilterSideMenu;