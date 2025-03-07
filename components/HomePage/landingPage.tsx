"use client";
import React from "react";
import { Button, Link } from "@nextui-org/react";
import { SearchBar } from "./searchBar";

const LandingPage: React.FC = () => {
  return (
    <>
      {/* Mobile layout (hidden on md and larger screens) */}
      <div className="relative overflow-hidden min-h-[500px] w-full md:hidden">
        {/* Video background container for mobile */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 rounded-2xl">
          {/* Gradient overlay for better text readability */}

          <video
            src="/caranimation3.mp4" 
            autoPlay
            muted
            loop
            playsInline
            className="object-cover h-8/12 pt-[160px]"
          />
        </div>
        
        {/* Content container for mobile */}
        <div className="relative z-20 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto">
          <div className=" mb-6">
            <p className="text-2xl font-semibold mb-2">
              Encontre aqui o seu próximo veículo.
            </p>
            <p className="font-light text-sm max-w-2xl mx-auto">
              Automóveis de luxo seminovos, atendimento especializado e negociações
              seguras.
            </p>
          </div>
          
          <div className="w-full max-w-xl flex flex-col gap-2 mt-4">
            <SearchBar isExpanded={true} />
            <p className="text-default-500 text-xs text-center">Ex: Porsche Macan</p>
            <div className="flex justify-center items-center my-2">
              <div className="w-1/3 h-px bg-gray-200"></div>
              <p className="text-default-500 text-xs px-2 py-2">ou</p>
              <div className="w-1/3 h-px bg-gray-200"></div>
            </div>
            
            <Button
              as={Link}
              href="/estoque"
              color="danger"
              variant="shadow"
              className="w-full"
            >
              Ver estoque completo
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop layout (hidden on smaller than md screens) */}
      <div className="hidden px-16 md:flex flex-row columns-2 lg:space-x-8">
        <div className="p-4 place-content-center relative">
          <p className="text-3xl font-semibold">
            Encontre aqui o seu próximo veículo.
          </p>
          <p className="font-light text-md w-10/12">
            Automóveis de luxo seminovos, atendimento especializado e negociações
            seguras.
          </p>
          <div className="w-full flex flex-col gap-2 mt-4">
            <SearchBar isExpanded={true} />
            <p className="text-default-500 text-xs">Ex: Porsche Macan</p>
            <div className="flex justify-center items-center">
              <div className="w-1/2 h-px bg-gray-200"></div>
              <p className="text-default-500 text-xs px-2 py-4">ou</p>
              <div className="w-1/2 h-px bg-gray-200"></div>
            </div>
          </div>
          <Button
            as={Link}
            href="/estoque"
            color="danger"
            variant="shadow"
            className="w-full"
          >
            Ver estoque completo
          </Button>
        </div>
        <div className="relative overflow-hidden rounded-3xl">
          <video
            src="/caranimation3.mp4" 
            autoPlay
            muted
            loop
            playsInline
            className="w-full max-w-[950px] relative z-0"
          />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
