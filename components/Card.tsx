import React from 'react';
import { Car } from '../types';
import Image from "next/image";

interface CardProps {
  car: Car;
}

const Card: React.FC<CardProps> = ({ car }) => {
    return (
<div className="w-44 h-80 bg-white rounded-xl shadow flex-col justify-start items-center gap-2.5 inline-flex">
  <img className="self-stretch h-44 rounded-tl-xl rounded-tr-xl" src="/carroTeste.png" />
  <div className="self-stretch h-8 px-3 flex-col justify-center items-start flex">
    <div className="text-black text-xs font-medium leading-none">{car.Marca} {car.Modelo}  </div>
    <div className="justify-center items-center gap-2.5 inline-flex">
      <div className="text-red-600 text-xs font-medium leading-none">{car.Versao}</div>
    </div>
  </div>
  <div className="self-stretch px-3 bg-white/opacity-5 rounded-lg justify-start items-start inline-flex">
    <div className="w-20 flex-col justify-start items-start gap-0.5 inline-flex">
      <div className="self-stretch text-neutral-400 text-xs font-normal leading-none">Ano</div>
      <div className="w-20 h-4 text-zinc-900 text-xs font-medium leading-none">{car.Especificacoes.ano_de_fabricacao}/{car.Especificacoes.ano_do_modelo}</div>
    </div>
    <div className="w-20 flex-col justify-start items-start gap-0.5 inline-flex">
      <div className="self-stretch text-neutral-400 text-xs font-normal leading-none">Km</div>
      <div className="self-stretch text-zinc-900 text-xs font-medium leading-none">{car.Especificacoes.km}</div>
    </div>
  </div>
  <div className="self-stretch h-4 px-3 bg-white/opacity-5 rounded-lg flex-col justify-center items-start flex">
    <div className="w-36 h-4 text-black text-sm font-semibold leading-none">R$ {car.Preco}</div>
  </div>
</div>
    );
};

export default Card;
