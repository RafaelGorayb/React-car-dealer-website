import React from 'react';
import { Car } from '../types';
import Image from "next/image";

interface CardProps {
  car: Car;
}

const Card: React.FC<CardProps> = ({ car }) => {
    return (
        <div className="car-card group p-2 border rounded-lg h-85">
          <div className="relative w-full h-42  mb-4">
            <Image src="/carroTeste.png" alt="Carro" layout="fill" objectFit="cover" className="rounded-lg" />
          </div>
          <div className="car-card__content text-leading">
            <h2 className="text-md font-bold">
              {car.Marca} {car.Modelo}
            </h2>
            <h3 className="text-sm font-semibold text-red-500">{car.Versao}</h3>
          </div>
          <div className="car-card__details columns-2 text-sm mt-2">
            <div>
            <p className="">Ano</p>
            <p className="">{car.Especificacoes.ano_de_fabricacao}/{car.Especificacoes.ano_do_modelo}</p>
            </div>
           <div>
           <p className="">Km</p>
            <p className="">{car.Especificacoes.km.toLocaleString('pt-BR')}</p>
           </div>

          </div>
          <p className='mt-2 text-xl font-semibold '>
            R${car.Preco.toLocaleString('pt-BR')}
          </p>
        </div>
    );
};

export default Card;
