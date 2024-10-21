"use client";
import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaLinkedin } from 'react-icons/fa';

const DemoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000); // 5 segundos

      // Limpar o timer se o componente for desmontado antes de 5 segundos
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Aqui o retorno foi alterado de `false` para `null`
  if (!isVisible) return null;
  
  return (
    isVisible && (
      <div className="fixed bottom-20 lg:top-20 w-full z-50 opacity-90 hover:opacity-80" onClick={handleClick}>
        <div className="max-w-7xl mx-auto p-2 shadow-md bg-amber-50 rounded w-11/12 md:w-7/12 flex flex-wrap justify-center items-center">
          <p className="text-sm font-semibold mb-2 md:mb-0 text-center md:text-left">
            Isso é um website de demonstração. Para mais informações, entre em contato com:
            <span className="ml-1 font-bold">Rafael Gorayb</span>
          </p>
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <a
              href="https://api.whatsapp.com/send?phone=5519999083534&text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20seu%20trabalho!" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm ml-2 font-bold text-green-900 hover:text-yellow-700"
            >
              <FaWhatsapp className="mr-1" /> WhatsApp
            </a>
            <a
              href="https://www.linkedin.com/in/rafael-gorayb-correa-2bb3a2234/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm ml-4 font-bold text-blue-900 hover:text-yellow-700"
            >
              <FaLinkedin className="mr-1" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    )
  );
};

export default DemoBanner;
