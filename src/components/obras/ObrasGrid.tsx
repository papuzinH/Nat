import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/shared';

type TipoObra = {
    id: string;
    title: string;
    image: string;
    description: string;
    route: string;
};

const ObrasGrid = ({ tiposObras }: { tiposObras: TipoObra[] }) => {
    return (
        <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tiposObras.map((tipo, index) => (
                <Link 
                    key={tipo.id} 
                    to={tipo.route}
                    className="group relative block overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                    {/* Image Container - Fixed Height to prevent layout shifts */}
                    <div className="relative h-80 w-full bg-cream-200">
                        <img
                            src={tipo.image}
                            alt={tipo.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            // LCP Optimization: Eager load first 3 images (above the fold)
                            loading={index < 3 ? "eager" : "lazy"}
                            fetchPriority={index < 3 ? "high" : "auto"}
                        />
                        
                        {/* Permanent Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                        
                        {/* Content Positioned at Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300">
                            <h3 className="font-title text-2xl text-white mb-2 group-hover:text-green-300 transition-colors">
                                {tipo.title}
                            </h3>
                            <p className="font-body text-cream-100 text-sm line-clamp-2 opacity-90 group-hover:opacity-100">
                                {tipo.description}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </Section>
    )
}

export default ObrasGrid;