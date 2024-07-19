import React from 'react';

type SectionTitleProps = {
  title: string;
  fontsize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
};

const SectionTitle: React.FC<SectionTitleProps> = ({ title, fontsize = '2xl' }) => {
  const textSizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
    '9xl': 'text-9xl',
  }[fontsize];

  return (
    <div className="flex flex-col justify-center items-start">
      <div className={`${textSizeClass} font-light font-['Inter'] uppercase leading-normal`}>
        {title}
      </div>
      <div className="w-12 h-1 bg-red-500"></div>
    </div>
  );
};

export default SectionTitle;
