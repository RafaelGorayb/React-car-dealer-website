// FilterForm.tsx
import React from 'react';
import { useFormContext } from "react-hook-form";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { FiltrosPesquisa } from "../types/index";
import {
  Select1,
  Select1Content,
  Select1Item,
  Select1Trigger,
  Select1Value,
} from "@/components/ui/select"

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
  setSelectedMotorizacao
}) => {
  const { register, setValue, watch } = useFormContext<FiltrosPesquisa>();

  return (
    <form className="space-y-4">
     <div>
        <label htmlFor="marca">Marca</label>
        <Select1
      value={selectedMarca}
      onValueChange={(selected) => {
        setSelectedMarca(selected);
        setValue("marca", selected);

        // Resetar Modelo e Versão
        setSelectedModelo("");
        setValue("modelo", "");
        setSelectedVersao("");
        setValue("versao", "");
      }}
    >
      <Select1Trigger>
        <Select1Value placeholder="Selecione a marca" />
      </Select1Trigger>
      <Select1Content className='bg-background'>
        {marcas.map((marca) => (
          <Select1Item key={marca} value={marca}>
            {marca}
          </Select1Item>
        ))}
      </Select1Content>
    </Select1>

      </div>

      <div>
        <label htmlFor="modelo">Modelo</label>
        <Select
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
        <label htmlFor="versao">Modelo</label>
        <Select
          items={versoes.map((versao) => ({ label: versao, value: versao }))}
          placeholder="Selecione a versao"
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
        <label htmlFor="motorizacao">Motorizacao</label>
        <Select
          id="motorizacao"
          {...register("motorizacao")}
          items={motorizacoes.map((motorizacao) => ({ label: motorizacao, value: motorizacao }))}
          placeholder="Selecione a o tipo de motor"
          selectedKeys={new Set([watch("motorizacao")])}
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
};

export default FilterForm;
