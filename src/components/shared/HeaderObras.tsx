import React from 'react';
import { Title, Subtitle } from './';

interface HeaderObrasProps {
  title: string;
  description: string;
}

const HeaderObras: React.FC<HeaderObrasProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-20">
      <Title variant="titlePage" as="h1" className="mb-8">
        {title}
      </Title>
      <Subtitle variant="large" className="max-w-4xl mx-auto text-lg leading-relaxed">
        {description}
      </Subtitle>
    </div>
  );
};

export default HeaderObras;
