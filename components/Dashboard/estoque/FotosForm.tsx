import React from "react";
import { BiImageAdd, BiTrash } from "react-icons/bi";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";

const FotosForm = ({
  files,
  setFiles,
  existingPhotos,
  setExistingPhotos,
  photosToDelete,
  setPhotosToDelete,
}: any) => {
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

  return (
    <Card className="min-w-72 md:min-w-96 min-h-60">
      <CardBody>
        <div
          {...getRootProps({
            className: "dropzone flex flex-col items-center justify-center text-center rounded-lg border-2 border-dashed border-gray-600 p-6 h-full",
          })}
        >
          <input {...getInputProps()} />
          <p>Arraste e solte as fotos aqui ou clique para selecionar</p>
          <BiImageAdd size={40} opacity={0.5} />
        </div>
      </CardBody>
      <CardFooter>
        <div className="grid md:grid-cols-8 grid-cols-3 gap-4 max-h-[500px] w-full overflow-y-scroll overflow-x-hidden">
          {existingPhotos.map((photo: any) => (
            <div key={photo.id} className="relative ">
              <img
                src={photo.url}
                alt="Existing photo"
                className="w-[160] h-[90] object-cover rounded hover:opacity-50"
              />
              <button
                type="button"
                className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full hover:bg-red-500"
                onClick={() => {
                  setExistingPhotos(existingPhotos.filter((p: any) => p.id !== photo.id));
                  setPhotosToDelete([...photosToDelete, photo.id]);
                }}
              >
                <BiTrash size={20} color="white" />
              </button>
            </div>
          ))}
          {files.map((file: any, index: number) => (
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
                  setFiles(files.filter((_: any, i: number) => i !== index));
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
  );
};

export default FotosForm;
