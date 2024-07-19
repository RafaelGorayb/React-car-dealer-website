
import React from 'react';


type SectionTitleProps = {
  title: string;
};

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <div className="flex flex-col justify-center items-start">
      <div className="text-2xl font-light font-['Inter'] uppercase leading-normal">
        {title}
      </div>
      <div className="w-12 h-1 bg-red-500"></div>
    </div>
  );
};

export default SectionTitle;
