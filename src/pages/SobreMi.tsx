import React from 'react';
import { HeroSobreMi, AboutSobreMi } from '../components/shared';

const SobreMi: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSobreMi />
      <AboutSobreMi />
    </div>
  );
};

export default SobreMi;
