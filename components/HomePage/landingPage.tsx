"use client";
import React from 'react';
import { Image, Input, Button } from '@nextui-org/react';

const LandingPage: React.FC = () => {
  return (
    <> 
        <div className="container mx-auto flex justify-center items-center">
          <div className="flex flex-col lg:flex-row columns-2">
            <div className="flex justify-center items-center">
              <Image src="/landingImage.png" isBlurred alt="hero" width={650} height={630} />
            </div>
            <div className="search flex flex-col justify-center items-start lg:items-start p-4">
              <p className="sm:text-3xl text-2xl font-bold">Excelência em Cada Detalhe</p>
              <p className="font-light sm:text-md text-sm w-10/12">Veículos de luxo seminovos, atendimento especializado e negociações seguras.</p>
              <div className="w-full flex flex-col gap-2 mt-4">
                <Input
                  type="url"
                  placeholder="Pesquisar veículo"
                  labelPlacement="outside"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">/o</span>
                    </div>
                  }
                />
                <p className="text-default-500 text-xs">Ex: Porsche Macan</p>
                {/* fazer um texto escrito "ou" e posicionalo ao centro*/}
                <div className="flex justify-center items-center">
                  <div className="w-1/2 "></div>
                  <p className="text-default-500 text-xs px-2">ou</p>
                  <div className="w-1/2 "></div>
                  </div>
              </div>
              <Button href='/estoque' color='danger' variant="shadow" className='w-full mt-4'>Explorar veículos</Button>
            </div>
          </div>
        </div>
    </>
  );
};

export default LandingPage;
