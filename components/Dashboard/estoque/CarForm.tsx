"use client";
import React, { useState, useEffect, Key } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Tabs, Tab, Button, Card } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import EspecificacoesForm from "./EspecificacoesForm";
import FotosForm from "./FotosForm";
import OpcionaisTab from "./opcionais";
import { useRouter } from 'next/navigation';
import { carSchema, CarFormData } from "./schema";

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
    <div className=" w-full">
      <div className="flex items-center pb-6">
        <h1 className="text-2xl font-bold">
          {editCardId ? "Editar Veículo" : "Adicionar Veículo"}
        </h1>
        <Button      
          className="ml-auto"
          color="default"
          variant="light"
          startContent={<span>←</span>}
          onClick={() => router.push('/dashboard/estoque')}
        >
          Voltar
        </Button>
      </div>
      
      <form className="mb-12" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Tabs 
          className="px-2"
            selectedKey={activeTab} 
            onSelectionChange={(key: Key) => setActiveTab(key as string)}
            variant="solid"
          >
            <Tab 
              key="especificacoes" 
              title={
                <div className="flex items-center space-x-2">
                  <span className="text-lg">Especificações</span>
                </div>
              }
            >
              <div className="mt-6 p-2">
                <EspecificacoesForm control={control} errors={errors} />
              </div>
            </Tab>
            <Tab 
              key="opcionais" 
              title={
                <div className="flex items-center space-x-2">
                  <span className="text-lg">Opcionais</span>
                </div>
              }
            >
              <div className="mt-6 p-2">
                <OpcionaisTab opcionais={opcionais} setOpcionais={setOpcionais} />
              </div>
            </Tab>
            <Tab 
              key="fotos" 
              title={
                <div className="flex items-center space-x-2">
                  <span className="text-lg">Fotos</span>
                </div>
              }
            >
              <div className="mt-6 p-2">
                <FotosForm
                  files={files}
                  setFiles={setFiles}
                  existingPhotos={existingPhotos}
                  setExistingPhotos={setExistingPhotos}
                  photosToDelete={photosToDelete}
                  setPhotosToDelete={setPhotosToDelete}
                />
              </div>
            </Tab>
          </Tabs>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            type="submit" 
            color="primary" 
            size="lg"
            className="px-8"
          >
            {editCardId ? "Atualizar Veículo" : "Adicionar Veículo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
