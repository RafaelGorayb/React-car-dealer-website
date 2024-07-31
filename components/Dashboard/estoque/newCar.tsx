"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Button,
  Checkbox,
  Switch,
  Select,
  SelectItem,
  Chip,
} from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";

const carSchema = z.object({
  marca: z.string().min(1, "Marca é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  versao: z.string().min(1, "Versão é obrigatória"),
  cor: z.string().min(1, "Cor é obrigatória"),
  preco: z.number().positive("Preço deve ser positivo"),
  ano_fabricacao: z
    .number()
    .int()
    .positive("Ano de fabricação deve ser positivo"),
  ano_modelo: z.number().int().positive("Ano do modelo deve ser positivo"),
  potencia: z.number().positive("Potência deve ser positiva"),
  torque: z.number().positive("Torque deve ser positivo"),
  motor: z.string().min(1, "Motor é obrigatório"),
  cambio: z.string().min(1, "Câmbio é obrigatório"),
  carroceria: z.string().min(1, "Carroceria é obrigatória"),
  blindado: z.boolean(),
  tracao: z.number().int().min(2).max(4),
  rodas: z.string().min(1, "Rodas são obrigatórias"),
  freios: z.string().min(1, "Freios são obrigatórios"),
  direcao: z.string().min(1, "Direção é obrigatória"),
  bancos: z.string().min(1, "Bancos são obrigatórios"),
  ar_condicionado: z.string().min(1, "Ar condicionado é obrigatório"),
  farol: z.string().min(1, "Farol é obrigatório"),
  multimidia: z.string().min(1, "Multimídia é obrigatória"),
  final_placa: z.string().length(1, "Final da placa deve ter 1 caractere"),
  km: z.number().nonnegative("Quilometragem deve ser não negativa"),
  airbag: z.string().min(1, "Airbag é obrigatório"),
});

type CarFormData = z.infer<typeof carSchema>;

type FileWithPreview = File & { preview: string };

export default function NewCarForm() {
  const [activeTab, setActiveTab] = useState<string>("especificacoes");
  const [opcionais, setOpcionais] = useState<string[]>([]);
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const supabase = createClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      blindado: false,
      tracao: 2,
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const onSubmit = async (data: CarFormData) => {
    try {
      // Insert car data
      const { data: carData, error: carError } = await supabase
        .from("carro")
        .insert({ created_at: new Date().toISOString(), id: 3000 })
        .select()
        .single();

      if (carError) throw carError;

      // Insert car specifications
      const { error: specError } = await supabase
        .from("especificacao_carro")
        .insert({ ...data, carro_id: carData.id });

      if (specError) throw specError;

      // Insert optional items
      if (opcionais.length > 0) {
        const { error: optionalsError } = await supabase
          .from("opcionais_carro")
          .insert(
            opcionais.map((opcional) => ({
              nome: opcional,
              carro_id: carData.id,
            }))
          );

        if (optionalsError) throw optionalsError;
      }

      // Upload photos
      for (const file of files) {
        const { error: uploadError } = await supabase.storage
          .from("carros")
          .upload(`${carData.id}/${file.name}`, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("carros")
          .getPublicUrl(`${carData.id}/${file.name}`);

        if (urlData) {
          const { error: photoError } = await supabase
            .from("fotos_urls")
            .insert({ url: urlData.publicUrl, carro_id: carData.id });

          if (photoError) throw photoError;
        }
      }

      alert("Carro adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar carro:", error);
      alert("Erro ao adicionar carro. Por favor, tente novamente.");
    }
  };

  const renderFormField = (fieldName: keyof CarFormData) => {
    const fieldSchema = carSchema.shape[fieldName];

    if (fieldSchema instanceof z.ZodBoolean) {
      return (
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <Switch
              {...field}
              value={field.value as any}
              checked={field.value as any}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              {fieldName}
            </Switch>
          )}
        />
      );
    } else if (fieldSchema instanceof z.ZodNumber) {
      return (
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label={fieldName}
              value={field.value as any}
              placeholder={`Digite ${fieldName}`}
              isInvalid={!!errors[fieldName]}
              errorMessage={errors[fieldName]?.message}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      );
    } else {
      return (
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label={fieldName}
              isInvalid={!!errors[fieldName]}
              value={field.value as any}
              placeholder={`Digite ${fieldName}`}
              errorMessage={errors[fieldName]?.message}
            />
          )}
        />
      );
    }
  };

  return (
    <div className="p-16">
      <h1 className="text-2xl font-bold mb-4">Adicionar novo veículo</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key: any) => setActiveTab(key)}
        >
          <Tab key="especificacoes" title="Especificações">
            <Card>
              <CardBody>
                <div className="grid grid-cols-3 gap-4">
                  {Object.keys(carSchema.shape).map((fieldName) => (
                    <div key={fieldName}>
                      {renderFormField(fieldName as keyof CarFormData)}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="opcionais" title="Opcionais">
            <Card>
              <CardBody>
                <Input
                  label="Novo item opcional"
                  placeholder="Digite um item opcional"
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      const target = e.target as HTMLInputElement;
                      if (target.value.trim()) {
                        setOpcionais([...opcionais, target.value.trim()]);
                        target.value = "";
                      }
                    }
                  }}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {opcionais.map((opcional, index) => (
                    <Chip
                      key={index}
                      onClose={() =>
                        setOpcionais(opcionais.filter((_, i) => i !== index))
                      }
                    >
                      {opcional}
                    </Chip>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="fotos" title="Fotos">
            <Card>
              <CardBody>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <p>
                    Arraste e solte algumas imagens aqui, ou clique para
                    selecionar arquivos
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {files.map((file) => (
                    <img
                      key={file.name}
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
        <Button type="submit" color="primary" className="mt-4">
          Adicionar Veículo
        </Button>
      </form>
    </div>
  );
}
