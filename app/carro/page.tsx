import { CircleAlert } from "lucide-react";

export default function PaginaCarro() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <CircleAlert size={48} className="text-yellow-500 mb-4" />
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Carro não encontrado</h1>
        <p className="text-gray-600">
          O carro que você está procurando não foi encontrado
        </p>
      </div>
    </div>
  );
}
