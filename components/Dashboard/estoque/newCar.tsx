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
import OpcionaisTab from "./opcionais";

const currentYear = new Date().getFullYear();

const carSchema = z.object({
  marca: z.string().min(1, "Marca é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  versao: z.string().min(1, "Versão é obrigatória"),
  motorizacao: z.string().min(1, "Motorização é obrigatória"),
  cor: z.string().min(1, "Cor é obrigatória"),
  preco: z.coerce.number().positive("Preço deve ser positivo"),
  ano_fabricacao: z.coerce
    .number()
    .int()
    .min(1900, "Ano inválido")
    .max(currentYear, "Ano não pode ser futuro"),
  ano_modelo: z.coerce
    .number()
    .int()
    .min(1900, "Ano inválido")
    .max(
      currentYear + 1,
      "Ano do modelo não pode ser mais que um ano no futuro"
    ),
  potencia: z.coerce.number().positive("Potência deve ser positiva"),
  torque: z.coerce.number().positive("Torque deve ser positivo"),
  motor: z.string().min(1, "Motor é obrigatório"),
  cambio: z.enum(["Manual", "Automático", "CVT", "Semi-automático"]),
  carroceria: z.enum([
    "Hatch",
    "Sedan",
    "SUV",
    "Picape",
    "Perua",
    "Coupé",
    "Conversível",
  ]),
  blindado: z.boolean(),
  tracao: z.enum(["Dianteira", "Traseira", "Integral"]),
  rodas: z.string().min(1, "Rodas são obrigatórias"),
  freios: z.enum([
    "Disco nas 4 rodas",
    "Disco na frente e tambor atrás",
    "Tambor nas 4 rodas",
  ]),
  direcao: z.enum(["Mecânica", "Hidráulica", "Elétrica", "Eletro-hidráulica"]),
  bancos: z.enum(["Tecido", "Couro", "Couro sintético"]),
  ar_condicionado: z.enum([
    "Manual",
    "Digital",
    "Dual zone",
    "Tri zone",
    "Não possui",
  ]),
  farol: z.enum(["Halógeno", "LED", "Xenon"]),
  multimidia: z.enum(["Não possui", "Com tela", "Sem tela"]),
  final_placa: z.string().length(1, "Final da placa deve ter 1 caractere"),
  km: z.coerce.number().nonnegative("Quilometragem deve ser não negativa"),
  airbag: z.enum([
    "Motorista",
    "Motorista e passageiro",
    "Lateral",
    "Cortina",
    "Todos",
  ]),
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
      tracao: "Dianteira",
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

      const fileLength = files.length;

      let progress = 0;

      const toastEnvio = toast.loading(`Enviando foto 0 de ${fileLength}`, {
        autoClose: false,
      });

      for (const file of files) {
        const { error: uploadError } = await supabase.storage
          .from("carros")
          .upload(`${carData.id}/${file.name}`, file);

        if (uploadError) {
          toast.error("Erro ao enviar foto. Por favor, tente novamente.");
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("carros")
          .getPublicUrl(`${carData.id}/${file.name}`);

        if (urlData) {
          const { error: photoError } = await supabase
            .from("fotos_urls")
            .insert({ url: urlData.publicUrl, carro_id: carData.id });

          if (photoError) {
            toast.error("Erro ao adicionar foto. Por favor, tente novamente.");
            throw photoError;
          }
        }
        progress++;
        toast.update(toastEnvio, {
          render: `Enviando foto ${progress} de ${fileLength}`,
        });
      }

      toast.dismiss(toastEnvio);

      toast.success("Carro adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar carro:", error);
      toast.error("Erro ao adicionar carro. Por favor, tente novamente.");
    }
  };

  const formatFieldName = (fieldName: string) => {
    return fieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderFormField = (fieldName: keyof CarFormData, label: string) => {
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
              isSelected={field.value as boolean}
              onValueChange={field.onChange}
            >
              {label}
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
              label={label}
              value={field.value as any}
              placeholder={`Digite ${label}`}
              isInvalid={!!errors[fieldName]}
              errorMessage={errors[fieldName]?.message}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      );
    } else if (fieldSchema instanceof z.ZodEnum) {
      const options = (fieldSchema as any)._def.values;
      return (
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label={label}
              value={field.value as any}
              placeholder={`Selecione ${label}`}
              isInvalid={!!errors[fieldName]}
              errorMessage={errors[fieldName]?.message}
            >
              {options.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
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
              label={label}
              isInvalid={!!errors[fieldName]}
              value={field.value as any}
              placeholder={`Digite ${label}`}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(carSchema.shape).map((fieldName) => (
                    <div key={fieldName}>
                      {renderFormField(
                        fieldName as keyof CarFormData,
                        formatFieldName(fieldName)
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="opcionais" title="Opcionais">
            <OpcionaisTab opcionais={opcionais} setOpcionais={setOpcionais} />
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
