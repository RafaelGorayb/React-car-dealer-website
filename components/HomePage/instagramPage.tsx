import React from "react";
import {Image, Button} from '@nextui-org/react';

const instagramPage: React.FC = () => {
return(

<div className="lg:px-6 px-2 mb-20">
    <div className="flex items-center justify-center">
        <div className="w-9/12">
            <p
                className="lg:text-lg text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                ACOMPANHE NOSSO INSTAGRAM.
            </p>
            <p className="text-[10px] lgfont-light text-balance">
                Conecte-se ao melhor do universo automotivo. Fique por dentro de novidades, curiosidades, lançamentos e
                descubra os recém-chegados de nosso estoque em primeira mão.
            </p>
        </div>
        <div className="w-5/12">
            <Image src="/CardInstagramPagina.png" alt="InstagramPag" />
        </div>
    </div>

    <div className="flex justify-end mt-10">
        <div className="w-9/12 ">
            <p
                className="lg:text-lg text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                EM PRIMEIRA MÃO
            </p>
            <p className="text-[10px] font-light text-balance">
                Fique por dentro dos recém chegados ao nosso estoque. Conheça em primeira mão os veículos que acabaram
                de chegar e aproveite as melhores oportunidades.
            </p>
            </div>
        </div>
        <div className="flex items-center  px-2">
            <Image src="/CelularInstagramCarro.png" alt="InstagramCarro" className="mt-7 h-[215px] shadow-lg" />
            <div className="flex">
                <Image src="/carroCardInstagram(1).jpeg" alt="InstagramCarro" className="h-[104px] shadow-lg"
                    radius="sm" />
                <Image src="/carroCardInstagram(2).jpeg" alt="InstagramCarro" className="h-[104px] px-1 shadow-lg"
                    radius="sm" />
                <Image src="/carroCardInstagram(3).jpeg" alt="InstagramCarro" className="h-[104px] shadow-lg"
                    radius="sm" />
            </div>
        </div>
        <div className="flex justify-center">
        <Button className="w-6/12  mt-8 px-10" variant="shadow" color="danger" >
        Seguir
        </Button>
        </div>
</div>

);
}

export default instagramPage;