import React from "react";
import { Image } from "@nextui-org/react";
import SectionTitle from "@/components/HomePage/sectionTitle";

const SobreNos: React.FC = () => {
  return (
    <>
    <div className="sm:columns-2 sm:flex sm:justify-between sm:items-start px-4">
      <div className="sm:w-3/4">
      <div className="p-4">
        <SectionTitle title="Sobre Nós" />
      </div>
        <p className="text-justify font-extralight px-4 ">
          Com 35 anos de experiência no mercado, nossa loja se destaca pela
          excelência na comercialização de veículos de luxo seminovos Localizada
          em Campinas, somos referência em qualidade, confiança e atendimento
          especializado. Nossa equipe de vendedores altamente qualificados está
          comprometida em proporcionar uma experiência de compra única,
          garantindo a satisfação e a segurança de cada negociação. Oferecemos
          uma seleção cuidadosa de veículos para atender aos padrões de nossos
          clientes exigentes. Venha nos visitar e descubra por que somos a
          escolha certa para quem busca luxo e confiabilidade.
        </p>
      </div>
      <div className="flex justify-center items-center sm:w-1/2">
        <Image
          src="/sobrenos.png"
          isBlurred
          width="360"
          alt="Sobre nós"
          className="mb-8"
        />
      </div>
    </div>
    </>
  );
};

export default SobreNos;
