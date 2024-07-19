import React from 'react';
import SectionTitle from './sectionTitle';
import { Image } from '@nextui-org/react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const OndeEstamos: React.FC = () => {
  return (
    <div className="p-4 max-w-md mx-auto sm:flex">
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <FiMapPin className="text-2xl text-gray-700" />
          <div>
            <SectionTitle title='endereço' fontsize='sm' />
            <p className='pt-3'>
              Av. Orosimbo Maia, 2042<br />
              Cambuí, Campinas, SP<br />
              CEP 13024-045
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <FiPhone className="text-2xl text-gray-700" />
          <div>
          <SectionTitle title='telefone' fontsize='sm' />
            <p className='pt-3'>(19) 3251-0331</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <FiMail className="text-2xl text-gray-700" />
          <div>
          <SectionTitle title='email' fontsize='sm' />
            <p className='pt-3'>vendas@akkarmotors.com.br</p>
          </div>
        </div>
      </div>
      <Image
      className='pt-5'
        src="/mapa.png"
        isBlurred
        alt="Localização"
        width="350"
        height="380"
        />
    </div>
  );
};

export default OndeEstamos;