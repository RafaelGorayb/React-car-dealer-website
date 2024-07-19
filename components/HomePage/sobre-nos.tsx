import React from "react";
import { Image } from "@nextui-org/react"

const SobreNos: React.FC = () => {
    return(
        <div className="collumns-2 sm:flex">
            <div>
                <p className="text-justify font-light px-4">Com 35 anos de experiência no mercado, nossa loja se destaca pela excelência na comercialização de veículos de luxo seminovos Localizada em Campinas, somos referência em qualidade, confiança e atendimento especializado. Nossa equipe de vendedores altamente qualificados está comprometida em proporcionar uma experiência de compra única, garantindo a satisfação e a segurança de cada negociação. Oferecemos uma seleção cuidadosa de veículos para atender aos padrões de nossos clientes exigentes. Venha nos visitar e descubra por que somos a escolha certa para quem busca luxo e confiabilidade.</p>
            </div>
            <Image src="/sobrenos.png" 
            width="360" 
            height="340" 
            alt="Sobre nós" />
        </div>

    );
}

export default SobreNos;