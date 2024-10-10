import React from "react";
import {Image, Button} from '@nextui-org/react';

const instagramPage: React.FC = () => {
return(

<div className="lg:px-6 px-2 mb-20">
    <div className="flex items-center justify-center">
        <div className="w-9/12">
            <p
                className="lg:text-[20px] text-sm font-semibold ">
                ACOMPANHE NOSSO INSTAGRAM.
            </p>
            <p className="text-[10px] md:text-[24px] font-light text-balance">
                Conecte-se ao melhor do universo automotivo. Fique por dentro de novidades, curiosidades, lançamentos e
                descubra os recém-chegados de nosso estoque em primeira mão.
            </p>
        </div>
        <div className="w-4/12 lg:w-3/12">
            <Image src="/CardInstagramPagina.png" isBlurred alt="InstagramPag" />
        </div>
    </div>

    <div className="flex justify-end mt-8">
        <div className="w-7/12 ">
            <p
                className="lg:text-[20px] text-sm font-semibold ">
                EM PRIMEIRA MÃO
            </p>
            <p className="text-[10px] md:text-[24px] font-light text-balance">
                Fique por dentro dos recém chegados ao nosso estoque. Conheça em primeira mão os veículos que acabaram
                de chegar e aproveite as melhores oportunidades.
            </p>
            </div>
        </div>
        <div className="flex items-center px-2">
            <Image src="/CelularInstagramCarro.png" isBlurred alt="InstagramCarro" className=" h-[215px] lg:h-[430px] shadow-lg" />
            <div className="flex">
                <Image src="/carroCardInstagram(1).jpeg" isBlurred alt="InstagramCarro" className="h-[104px] lg:h-[208px] shadow-lg" radius="sm" />
                <Image src="/carroCardInstagram(2).jpeg" isBlurred alt="InstagramCarro" className="h-[104px] lg:h-[208px] px-1 shadow-lg" radius="sm" />
                <Image src="/carroCardInstagram(3).jpeg" isBlurred alt="InstagramCarro" className="h-[104px] lg:h-[208px] shadow-lg" radius="sm" />
            </div>
        </div>
        <div className="flex justify-center">
        <Button 
            className="w-6/12  mt-8 px-10" 
            variant="shadow" 
            color="danger" 
            onClick={() => window.open('https://www.instagram.com/akkarmotors/', '_blank')}
            >
            Seguir
        </Button>
        </div>
</div>

);
}

export default instagramPage;