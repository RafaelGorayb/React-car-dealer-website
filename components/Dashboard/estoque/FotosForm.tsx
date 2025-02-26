import React from "react";
import { BiImageAdd, BiTrash } from "react-icons/bi";
import { Card, CardBody, CardFooter, Divider, Button } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";

interface FotosFormProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  existingPhotos: { id: string; url: string }[];
  setExistingPhotos: React.Dispatch<React.SetStateAction<{ id: string; url: string }[]>>;
  photosToDelete: string[];
  setPhotosToDelete: React.Dispatch<React.SetStateAction<string[]>>;
}

const FotosForm = ({
  files,
  setFiles,
  existingPhotos,
  setExistingPhotos,
  photosToDelete,
  setPhotosToDelete,
}: FotosFormProps) => {
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

  const totalPhotos = existingPhotos.length + files.length;

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardBody className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-primary">Upload de Fotos</h3>
          <Divider className="mb-4" />
          
          <div
            {...getRootProps({
              className: "dropzone flex flex-col items-center justify-center text-center rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 p-8 h-40 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer",
            })}
          >
            <input {...getInputProps()} />
            <BiImageAdd size={40} className="text-gray-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-300">
              Arraste e solte as fotos aqui ou clique para selecionar
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Formatos aceitos: JPG, PNG, WEBP
            </p>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {totalPhotos} {totalPhotos === 1 ? 'foto' : 'fotos'} {files.length > 0 && `(${files.length} nova${files.length > 1 ? 's' : ''})`}
            </p>
            {files.length > 0 && (
              <Button
                size="sm"
                color="danger"
                variant="light"
                onClick={() => {
                  files.forEach(file => URL.revokeObjectURL((file as any).preview));
                  setFiles([]);
                }}
              >
                Limpar novas fotos
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
      
      {(existingPhotos.length > 0 || files.length > 0) && (
        <Card className="shadow-sm">
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-primary">Galeria de Fotos</h3>
            <Divider className="mb-4" />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto p-2">
              {existingPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    <img
                      src={photo.url}
                      alt="Foto do veículo"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    onClick={() => {
                      setExistingPhotos(existingPhotos.filter((p) => p.id !== photo.id));
                      setPhotosToDelete([...photosToDelete, photo.id]);
                    }}
                    aria-label="Remover foto"
                  >
                    <BiTrash size={16} color="white" />
                  </button>
                </div>
              ))}
              
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    <img
                      src={(file as any).preview}
                      alt={`Nova foto ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="absolute bottom-2 left-2 text-white text-xs font-medium px-2 py-1 bg-black/50 rounded-full">
                        Nova
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    onClick={() => {
                      setFiles(files.filter((_, i) => i !== index));
                      URL.revokeObjectURL((file as any).preview);
                    }}
                    aria-label="Remover foto"
                  >
                    <BiTrash size={16} color="white" />
                  </button>
                </div>
              ))}
            </div>
            
            {photosToDelete.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  color="primary"
                  variant="light"
                  onClick={() => {
                    const photosToRestore = existingPhotos.filter(
                      photo => !photosToDelete.includes(photo.id)
                    );
                    const photosToAdd = photosToDelete.map(
                      id => existingPhotos.find(photo => photo.id === id)
                    ).filter(Boolean) as { id: string; url: string }[];
                    
                    setExistingPhotos([...photosToRestore, ...photosToAdd]);
                    setPhotosToDelete([]);
                  }}
                >
                  Restaurar fotos removidas ({photosToDelete.length})
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default FotosForm;
