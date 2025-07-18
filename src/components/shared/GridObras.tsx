import React from 'react';
import { Title, Subtitle } from './';

interface ObraData {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface GridObrasProps {
  obras: ObraData[];
}

const GridObras: React.FC<GridObrasProps> = ({ obras }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
      {obras.map((obra) => (
        <div key={obra.id} className="group cursor-pointer">
          <div className="relative overflow-hidden bg-cream-100 aspect-square hover:shadow-2xl transition-all duration-500 transform">
            {/* Imagen placeholder */}
            <img
              src={obra.image}
              alt={obra.title}
              className="w-full h-full object-cover transition-transform duration-300"
            />

            {/* Overlay con título - aparece solo en hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
              <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                <Title variant="titleCard" as="h3" className="text-white mb-2 text-xl font-semibold">
                  {obra.title}
                </Title>
                <Subtitle variant="small" as="p" className="text-white/90 text-sm">
                  {obra.description}
                </Subtitle>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default GridObras;
