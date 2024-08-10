import React from "react";
import {Image} from '@nextui-org/react';

const instagramPage: React.FC = () => {
    return(

        <>
        <div className="flex">
        <div className="w-9/12">
    <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
        ACOMPANHE NOSSO INSTAGRAM.
    </p>
    <p className="text-xs font-light">
        Conecte-se ao melhor do universo automotivo. Fique por dentro de novidades, curiosidades, lançamentos e descubra os recém-chegados de nosso estoque em primeira mão.
    </p>
</div>
        <div className="w-3/12">
            <Image
                src="/instagram.png"
                width={300}
                height={500}
                alt="Instagram"
            />
        </div>
        </div>
        </>
    );
}

export default instagramPage;