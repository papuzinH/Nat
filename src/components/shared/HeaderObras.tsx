import React from 'react';
import { Title, Subtitle } from './';

interface HeaderObrasProps {
  title: string;
  description: string;
  imagebg?: string;
}

const HeaderObras: React.FC<HeaderObrasProps> = ({ title, description, imagebg }) => {
  return (
    <div className={`text-center h-[100dvh] flex flex-col items-center justify-center bg-[url('${imagebg}')] bg-cover bg-center relative pt-16`}>
      {/* Background Overlay */}
      <div className='z-10 relative'>
        <Title variant="titlePage" as="h1" className="mb-8 text-white">
          {title}
        </Title>
        <Subtitle variant="large" className="max-w-4xl mx-auto text-lg leading-relaxed text-white">
          {description}
        </Subtitle>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-transparent bg-opacity-40"></div>
    </div>
  );
};

export default HeaderObras;
