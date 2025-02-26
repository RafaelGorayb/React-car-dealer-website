// FilterForm.tsx
import React, { useEffect } from 'react';
import { useFormContext } from "react-hook-form";
import { Input, Select, SelectItem, Button, Divider } from "@nextui-org/react";
import { FiltrosPesquisa } from "../types/index";
import {
  Select1,
  Select1Content,
  Select1Item,
  Select1Trigger,
  Select1Value,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

interface FilterFormProps {
  marcas: string[];
  modelos: string[];
  versoes: string[];
  cores: string[];
  motorizacoes: string[];
  carrocerias: string[];
  selectedMarca: string;
  selectedModelo: string;
  selectedVersao: string;
  setSelectedMarca: (value: string) => void;
  setSelectedModelo: (value: string) => void;
  setSelectedVersao: (value: string) => void;
  setSelectedMotorizacao: (value: string) => void;
  currentFilters: FiltrosPesquisa | null;
  resetForm: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
  marcas,
  modelos,
  versoes,
  cores,
  motorizacoes,
  carrocerias,
  selectedMarca,
  selectedModelo,
  selectedVersao,
  setSelectedMarca,
  setSelectedModelo,
  setSelectedVersao,
  setSelectedMotorizacao,
  currentFilters,
  resetForm
}) => {
  const { register, setValue, watch, reset, getValues } = useFormContext<FiltrosPesquisa>();

  // Add effect to sync form with currentFilters
  useEffect(() => {
    if (currentFilters) {
      // Reset all form values to match currentFilters
      reset(currentFilters);
      
      // Reset selected states
      setSelectedMarca(currentFilters.marca || '');
      setSelectedModelo(currentFilters.modelo || '');
      setSelectedVersao(currentFilters.versao || '');
      setSelectedMotorizacao(currentFilters.motorizacao || '');
    }
  }, [currentFilters, reset, setSelectedMarca, setSelectedModelo, setSelectedVersao, setSelectedMotorizacao]);

  const clearAllFilters = () => {
    resetForm();
  };

  const handleRemoveFilter = (key: keyof FiltrosPesquisa) => {
    switch (key) {
      case 'marca':
        setSelectedMarca('');
        setSelectedModelo('');
        setSelectedVersao('');
        setValue('marca', '');
        setValue('modelo', '');
        setValue('versao', '');
        break;
      case 'modelo':
        setSelectedModelo('');
        setSelectedVersao('');
        setValue('modelo', '');
        setValue('versao', '');
        break;
      case 'versao':
        setSelectedVersao('');
        setValue('versao', '');
        break;
      case 'motorizacao':
        setSelectedMotorizacao('');
        setValue('motorizacao', '');
        break;
      default:
        if (typeof getValues()[key] === 'number') {
          setValue(key, 0);
        } else if (typeof getValues()[key] === 'boolean') {
          setValue(key, false);
        } else {
          setValue(key, '');
        }
    }
    
    // Force trigger form submission to update filters
    const form = document.querySelector('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  };

  const formValues = getValues();
  const hasActiveFilters = Object.values(formValues).some(value => 
    value !== '' && value !== 0 && value !== false
  );

  return (
    <form className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Filtros de Busca</h3>
        <Button 
          color="warning" 
          size="sm" 
          onClick={clearAllFilters}
          variant="flat"
          startContent={<X size={16} />}
        >
          Limpar
        </Button>
      </div>

      {/* Grupo de Seleção Principal */}
      <Card className="bg-default-50">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Marca</label>
              <Select1
                value={selectedMarca}
                onValueChange={(selected) => {
                  setSelectedMarca(selected);
                  setValue("marca", selected);
                  setSelectedModelo("");
                  setValue("modelo", "");
                  setSelectedVersao("");
                  setValue("versao", "");
                }}
              >
                <Select1Trigger className="w-full">
                  <Select1Value placeholder="Selecione a marca" />
                </Select1Trigger>
                <Select1Content className="bg-background">
                  {marcas.map((marca) => (
                    <Select1Item key={marca} value={marca}>
                      {marca}
                    </Select1Item>
                  ))}
                </Select1Content>
              </Select1>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Modelo</label>
              <Select
                classNames={{
                  trigger: "w-full",
                }}
                items={modelos.map((modelo) => ({ label: modelo, value: modelo }))}          
                placeholder="Selecione o modelo"
                selectedKeys={[selectedModelo]}
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
              <label className="text-sm font-medium mb-2 block">Versão</label>
              <Select
                classNames={{
                  trigger: "w-full",
                }}
                items={versoes.map((versao) => ({ label: versao, value: versao }))}
                placeholder="Selecione a versão"
                selectedKeys={new Set([selectedVersao])}
                disabled={!selectedModelo}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys).join(", ");
                  setSelectedVersao(selected);
                  setValue("versao", selected);
                }}
              >
                {(versao) => (
                  <SelectItem key={versao.value}>{versao.label}</SelectItem>
                )}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grupo de Preço e Ano */}
      <Card className="bg-default-50">
        <CardContent className="p-4 space-y-4">
          <h4 className="text-sm font-medium">Faixa de Preço</h4>
          <div className="flex space-x-2">
            <Input
              {...register("precoMin", { valueAsNumber: true })}
              type="number"
              label="Mínimo"
              placeholder="R$ 0"
              size="sm"
              classNames={{
                input: "text-small",
                label: "text-small",
              }}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">R$</span>
                </div>
              }
            />
            <Input
              {...register("precoMax", { valueAsNumber: true })}
              type="number"
              label="Máximo"
              placeholder="R$ 999.999"
              size="sm"
              classNames={{
                input: "text-small",
                label: "text-small",
              }}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">R$</span>
                </div>
              }
            />
          </div>

          <Divider className="my-4" />

          <h4 className="text-sm font-medium">Ano do Veículo</h4>
          <div className="flex space-x-2">
            <Input
              {...register("anoMin", { valueAsNumber: true })}
              type="number"
              label="De"
              placeholder="2010"
              size="sm"
              classNames={{
                input: "text-small",
                label: "text-small",
              }}
            />
            <Input
              {...register("anoMax", { valueAsNumber: true })}
              type="number"
              label="Até"
              placeholder="2024"
              size="sm"
              classNames={{
                input: "text-small",
                label: "text-small",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Grupo de Quilometragem */}
      <Card className="bg-default-50">
        <CardContent className="p-4 space-y-4">
          <h4 className="text-sm font-medium">Quilometragem</h4>
          <div className="flex space-x-2">
            <Input
              {...register("kmMin", { valueAsNumber: true })}
              type="number"
              label="De"
              placeholder="0 km"
              size="sm"
              classNames={{
                input: "text-small",
                label: "text-small",
              }}
            />
            <Input
              {...register("kmMax", { valueAsNumber: true })}
              type="number"
              label="Até"
              placeholder="500.000 km"
              size="sm"
              classNames={{
                input: "text-small",
                label: "text-small",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Grupo de Características */}
      <Card className="bg-default-50">
        <CardContent className="p-4 space-y-4">
          <h4 className="text-sm font-medium">Características</h4>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Cor</label>
            <Select
              id="cor"
              {...register("cor")}
              items={cores.map((cor) => ({ label: cor, value: cor }))}
              placeholder="Selecione a cor"
              selectedKeys={new Set([watch("cor")])}
              classNames={{
                trigger: "w-full",
              }}
              size="sm"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys).join(", ");
                setValue("cor", selected);
              }}
            >
              {(cor) => <SelectItem key={cor.value}>{cor.label}</SelectItem>}
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Motorização</label>
            <Select
              id="motorizacao"
              {...register("motorizacao")}
              items={motorizacoes.map((motorizacao) => ({ label: motorizacao, value: motorizacao }))}
              placeholder="Selecione o tipo de motor"
              selectedKeys={new Set([watch("motorizacao")])}
              classNames={{
                trigger: "w-full",
              }}
              size="sm"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys).join(", ");
                setSelectedMotorizacao(selected);
                setValue("motorizacao", selected);
              }}
            >
              {(motorizacao) => <SelectItem key={motorizacao.value}>{motorizacao.label}</SelectItem>}
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Carroceria</label>
            <Select
              id="carroceria"
              {...register("carroceria")}
              items={carrocerias.map((carroceria) => ({
                label: carroceria,
                value: carroceria,
              }))}
              placeholder="Selecione o tipo de carroceria"
              selectedKeys={new Set([watch("carroceria")])}
              classNames={{
                trigger: "w-full",
              }}
              size="sm"
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

          <div className="flex items-center justify-between pt-2">
            <label htmlFor="blindado" className="text-sm font-medium">
              Blindado
            </label>
            <Switch {...register("blindado")} id="blindado" />
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(formValues).map(([key, value]) => {
            if (value && value !== '' && value !== 0 && value !== false) {
              return (
                <Badge 
                  key={key} 
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveFilter(key as keyof FiltrosPesquisa)}
                >
                  {key}: {value.toString()}
                  <X size={14} className="ml-1 inline-block" />
                </Badge>
              );
            }
            return null;
          })}
        </div>
      )}
    </form>
  );
};

export default FilterForm;
