"use client";
import React from 'react';
import { Image, Input, Button, Link } from '@nextui-org/react';


const LandingPage: React.FC = () => {
  return (
    <> 

          <div className="flex flex-col sm:items-center md:flex-row columns-2 lg:space-x-8 ">
            <div className="">
              <Image src="/landingImage.png" isBlurred alt="hero" width={650}  style={{objectFit: "contain"}} />
            </div>
            <div className="p-4 place-content-center">
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
                  <p className="text-default-500 text-xs px-2 py-4">ou</p>
                  <div className="w-1/2 "></div>
                </div>
              </div>
                <Button as={Link} href='/estoque' color='danger' variant="shadow" className='w-full'>Explorar veículos</Button>
            </div>
          </div>
    </>
  );
};

export default LandingPage;
