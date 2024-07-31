"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Input, Button, Avatar } from "@nextui-org/react";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

const supabase = createClient();
const schema = z.object({
  displayName: z
    .string()
    .min(2, "O nome de exibição deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const ConfigPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    displayName: "",
    phone: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string[]>>
  >({});

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        toast.error("Falha ao buscar dados do usuário");
        return;
      }

      if (authData.user) {
        const { user } = authData;

        setUser(user);

        if (user.user_metadata?.avatar_url) {
          const { data: avatarData, error: avatarError } =
            await supabase.storage
              .from("usuarios")
              .createSignedUrl(user.user_metadata.avatar_url, 60);

          if (avatarError) {
            toast.error("Falha ao buscar avatar do usuário");
          } else {
            setAvatarUrl(avatarData.signedUrl);
          }
        }

        setFormData({
          displayName: user.user_metadata?.displayName || "",
          phone: user.user_metadata?.phone || "",
        });
      }
    };

    fetchUser();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setProfilePicture(acceptedFiles[0]);
    toast.info("Arquivo de imagem selecionado");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      schema.parse(formData);

      let profilePictureUrl = user?.user_metadata?.avatar_url || "";
      if (profilePicture) {
        toast.info("Iniciando upload da imagem...");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("usuarios")
          .upload(`${user.id}/profilepic`, profilePicture, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;
        profilePictureUrl = uploadData.path;
        toast.success("Imagem de perfil atualizada com sucesso");
      }

      const { data: updateData, error: updateError } =
        await supabase.auth.updateUser({
          data: {
            ...formData,
            avatar_url: profilePictureUrl,
          },
        });

      if (updateError) throw updateError;

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(
          error.flatten().fieldErrors as Partial<
            Record<keyof FormData, string[]>
          >
        );
      } else {
        console.error("Erro ao atualizar perfil:", error);
        toast.error("Falha ao atualizar perfil. Por favor, tente novamente.");
      }
    }
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-16 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configuração do Usuário</h1>
      <p className="mb-4">ID do Usuário: {user.id}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          {...getRootProps()}
          className="border-2 border-dashed p-4 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <Avatar
            src={
              profilePicture
                ? URL.createObjectURL(profilePicture)
                : avatarUrl || undefined
            }
            size="lg"
            className="mx-auto mb-2"
          />
          {isDragActive ? (
            <p>Solte os arquivos aqui ...</p>
          ) : (
            <p>
              Arraste e solte a imagem de perfil aqui, ou clique para selecionar
            </p>
          )}
        </div>

        <Input
          label="Nome de Exibição"
          name="displayName"
          value={formData.displayName}
          onChange={handleInputChange}
          errorMessage={errors.displayName?.[0]}
        />
        <Input label="Email" value={user.email} isReadOnly />
        <Input
          label="Telefone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          errorMessage={errors.phone?.[0]}
        />
        <Button type="submit" color="primary">
          Atualizar Perfil
        </Button>
      </form>
    </div>
  );
};

export default ConfigPage;
