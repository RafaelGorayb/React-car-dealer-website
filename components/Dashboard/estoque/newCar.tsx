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
  CardFooter,
  Image,
} from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { BiImageAdd, BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";

const carSchema = z.object({
  marca: z.string().min(1, "Marca é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  versao: z.string().min(1, "Versão é obrigatória"),
  motorizacao: z.string().min(1, "Motorização é obrigatória"),
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

  const onSubmit = async (dataForm: CarFormData) => {
    try {
      const { data: carData, error: carError } = await supabase
        .from("carro")
        .insert({ ...dataForm })
        .select()
        .single();

      if (carError) throw carError;

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

      toast.success("Carro adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar carro:", error);
      toast.error("Erro ao adicionar carro. Por favor, tente novamente.");
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
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
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
            <Card className="min-w-72 md:min-w-96 min-h-60">
              <CardBody>
                <div
                  {...getRootProps({
                    className:
                      "dropzone flex flex-col items-center justify-center text-center rounded-lg border-2 border-dashed border-gray-600 p-6 h-full",
                  })}
                >
                  <input {...getInputProps()} />
                  <p>
                    Arraste e solte algumas imagens aqui, ou clique para
                    selecionar arquivos
                  </p>
                  <BiImageAdd size={40} opacity={0.5} />
                </div>
              </CardBody>
              <CardFooter>
                <div className="grid grid-cols-6 gap-4 ">
                  {files.map((file, index) => (
                    <div key={file.name} className="relative ">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-[160] h-[90] object-cover rounded hover:opacity-50"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full hover:bg-red-500"
                        onClick={() => {
                          setFiles(files.filter((_, i) => i !== index));
                          URL.revokeObjectURL(file.preview);
                        }}
                      >
                        <BiTrash size={20} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardFooter>
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
