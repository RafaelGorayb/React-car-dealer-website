import React from 'react';
import SectionTitle from './sectionTitle';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const OndeEstamos: React.FC = () => {
  return (
    <div className="pb-20 px-4 w-full flex sm:flex-row flex-col justify-between sm:items-center">
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <FiMapPin className="text-2xl text-gray-700" />
          <div>
            <SectionTitle title='endereço' fontsize='sm' />
            <p className='pt-4 font-light'>
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
            <p className='pt-4 font-light'>(19) 3251-0331</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <FiMail className="text-2xl text-gray-700" />
          <div>
            <SectionTitle title='email' fontsize='sm' />
            <p className='pt-4 font-light'>vendas@akkarmotors.com.br</p>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-3/4">
        <iframe
          className="w-full h-64 sm:h-96 rounded-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.430220486901!2d-47.06258168445755!3d-22.900994785013885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8cf60ab7b1295%3A0x4f0e0e0e0e0e0e0e!2sAv.%20Orosimbo%20Maia%2C%202042%20-%20Cambu%C3%AD%2C%20Campinas%20-%20SP%2C%2013024-045!5e0!3m2!1sen!2sbr!4v1623859292932!5m2!1sen!2sbr"
          allowFullScreen
          loading="lazy"
          
        ></iframe>
      </div>
    </div>
  );
};

export default OndeEstamos;
