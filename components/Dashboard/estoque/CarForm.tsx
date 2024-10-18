"use client";
import React, { useState, useEffect, Key } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Tabs, Tab, Button } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import EspecificacoesForm from "./EspecificacoesForm";
import FotosForm from "./FotosForm";
import OpcionaisTab from "./opcionais";
import { useRouter } from 'next/navigation';


const currentYear = new Date().getFullYear();

export const carSchema = z.object({
  marca: z.string().min(1, "Marca é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  versao: z.string().min(1, "Versão é obrigatória"),
  motorizacao: z.enum(["Combustão", "Elétrico", "Híbrido"]),
  cor: z.string().min(1, "Cor é obrigatória"),
  preco: z.coerce.number().positive("Preço deve ser positivo"),
  ano_fabricacao: z.coerce.number().int().min(1900, "Ano inválido").max(currentYear, "Ano não pode ser futuro"),
  ano_modelo: z.coerce.number().int().min(1900, "Ano inválido").max(currentYear + 1, "Ano do modelo não pode ser mais que um ano no futuro"),
  potencia: z.coerce.number().positive("Potência deve ser positiva"),
  torque: z.coerce.number().positive("Torque deve ser positivo"),
  motor: z.string().min(1, "Motorização é obrigatória"),
  cambio: z.enum(["Manual", "Automático"]),
  carroceria: z.enum(["Hatch", "Sedan", "SUV", "Picape", "Esportivo"]),
  tracao: z.enum(["Dianteira", "Traseira", "Integral"]),
  rodas: z.string(),
  freios: z.string(),
  direcao: z.enum(["Mecânica", "Hidráulica", "Elétrica", "Eletro-hidráulica"]),
  bancos: z.string(),
  ar_condicionado: z.string(),
  farol: z.string(),
  multimidia: z.string(),
  final_placa: z.string().length(1, "Final da placa deve ter 1 caractere"),
  km: z.coerce.number().nonnegative("Quilometragem deve ser não negativa"),
  airbag: z.string(),
});

type CarFormData = z.infer<typeof carSchema>;

export default function NewCarForm({ editCardId }: { editCardId?: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("especificacoes");
  const [opcionais, setOpcionais] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<{ id: string, url: string }[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);

  const supabase = createClient();
  const { control, handleSubmit, formState: { errors }, reset } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: { tracao: "Dianteira" },
  });



  const fetchCarData = async () => {
    if (!editCardId) return;
  
    try {
      const { data: carData, error: carError } = await supabase
        .from("carro")
        .select("*, opcionais_carro(*), fotos_urls(*)")
        .eq("id", editCardId)
        .single();
  
      if (carError) throw carError;
  
      if (carData) {
        // Resetando os valores do formulário, incluindo os valores dos campos controlados (selects e switches)
        reset({
          ...carData,
          motorizacao: carData.motorizacao || "Combustão",  // Exemplo: preencha com um valor padrão se estiver vazio
          tracao: carData.tracao || "Dianteira",
          cambio: carData.cambio || "Manual",
          direcao: carData.direcao || "Mecânica",
        });
        
        setOpcionais(carData.opcionais_carro.map((opcional: any) => opcional.nome));
        setExistingPhotos(carData.fotos_urls);
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
      toast.error("Erro ao buscar dados do carro. Por favor, tente novamente.");
    }
  };
  
  useEffect(() => {
    if (editCardId) {
      fetchCarData();
    }
  }, [editCardId]);

  const onSubmit = async (dataForm: CarFormData) => {
    try {
      let carId = editCardId;
  
      if (editCardId) {
        const { error: updateError } = await supabase
          .from("carro")
          .update(dataForm)
          .eq("id", editCardId);
  
        if (updateError) throw updateError;
      } else {
        const { data: carData, error: carError } = await supabase
          .from("carro")
          .insert({ ...dataForm })
          .select()
          .single();
  
        if (carError) throw carError;
        carId = carData.id;
      }
  
      // Handle optional features
      await handleOptionals(carId as string);
  
      // Handle photo deletions
      await handlePhotoDeletions();
  
      // Handle new photo uploads
      await handlePhotoUploads(carId as string);
  
      toast.success(
        editCardId
          ? "Carro atualizado com sucesso!"
          : "Carro adicionado com sucesso!"
      );
  
      // Redirecionar para a página da tabela
      router.push('/dashboard/estoque'); // Ajuste o caminho conforme necessário
  
    } catch (error) {
      console.error("Erro no processamento dos dados", error);
      toast.error("Erro ao processar dados. Por favor, tente novamente.");
    }
  };
  

  const handlePhotoDeletions = async () => {
    for (const photoId of photosToDelete) {
      const photoToDelete = existingPhotos.find(
        (photo) => photo.id === photoId
      );
      if (
        photoToDelete &&
        photoToDelete.url.includes("https://hkuzikocskwbvvucobqa.supabase.co")
      ) {
        const fileName = photoToDelete.url.split("/").pop();
        await supabase.storage
          .from("carros")
          .remove([`${editCardId}/${fileName}`]);
      }
      await supabase.from("fotos_urls").delete().eq("id", photoId);
    }
  };

  const handleOptionals = async (carId: string) => {
    if (editCardId) {
      await supabase.from("opcionais_carro").delete().eq("carro_id", carId);
    }

    if (opcionais.length > 0) {
      const { error: optionalsError } = await supabase
        .from("opcionais_carro")
        .insert(
          opcionais.map((opcional) => ({
            nome: opcional,
            carro_id: carId,
          }))
        );

      if (optionalsError) throw optionalsError;
    }
  };

  const handlePhotoUploads = async (carId: string) => {
    const fileLength = files.length;
    let progress = 0;
  
    const toastEnvio = toast.loading(`Enviando foto 0 de ${fileLength}`, {
      autoClose: false,
    });
  
    for (const file of files) {
      // Convertendo a imagem em base64 para envio via API ImgBB
      const base64Image = await toBase64(file);

      // Removendo o prefixo "data:image/*;base64," para enviar apenas a string base64
      const cleanBase64Image = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");
  
      const formData = new FormData();
      formData.append("key", "678deb6913ea31aa4d00701313ecd255");
      formData.append("image", cleanBase64Image);
  
      // Fazendo o upload via API ImgBB
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (result.success) {
        const imageUrl = result.data.url; // URL da imagem hospedada
  
        // Salvando a URL no Supabase
        const { error: photoError } = await supabase
          .from("fotos_urls")
          .insert({ url: imageUrl, carro_id: carId });
  
        if (photoError) {
          toast.error("Erro ao adicionar foto. Por favor, tente novamente.");
          throw photoError;
        }
      } else {
        toast.error("Erro ao enviar foto. Por favor, tente novamente.");
        throw new Error(result.error.message);
      }
  
      progress++;
      toast.update(toastEnvio, {
        render: `Enviando foto ${progress} de ${fileLength}`,
      });
    }
  
    toast.dismiss(toastEnvio);
  };
  
  // Função auxiliar para converter a imagem para Base64
  const toBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  

  const formatFieldName = (fieldName: string) => {
    return fieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  return (
    <div className="p-2 md:p-16 overflow-auto">
      <div className="flex">
      <h1 className="text-2xl font-bold mb-4">
        {editCardId ? "Editar Veículo" : "Adicionar Veículo"}
      </h1>
      <Button      
        className="ml-auto"
        onClick={() => router.push('/dashboard/estoque')}
      >
        Voltar
      </Button>
      </div>
      <form className="mb-12" onSubmit={handleSubmit(onSubmit)}>
        <Tabs selectedKey={activeTab} onSelectionChange={(key: Key) => setActiveTab(key as string)}>
          <Tab key="especificacoes" title="Especificações">
            <EspecificacoesForm control={control} errors={errors} />
          </Tab>
          <Tab key="opcionais" title="Opcionais">
            <OpcionaisTab opcionais={opcionais} setOpcionais={setOpcionais} />
          </Tab>
          <Tab key="fotos" title="Fotos">
            <FotosForm
              files={files}
              setFiles={setFiles}
              existingPhotos={existingPhotos}
              setExistingPhotos={setExistingPhotos}
              photosToDelete={photosToDelete}
              setPhotosToDelete={setPhotosToDelete}
            />
          </Tab>
        </Tabs>
        <Button type="submit" color="primary" className="mt-4">
          {editCardId ? "Atualizar Veículo" : "Adicionar Veículo"}
        </Button>
       
      </form>
    </div>
  );
}
