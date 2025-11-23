import React from 'react';

interface ContentImageProps {
  orientation?: 'reverse';
  text: React.ReactNode;
  image: string;
  alt: string;
}

const ContentImage: React.FC<ContentImageProps> = ({ orientation, text, image, alt }) => {
    return (
        <div className={`flex flex-col md:flex-row justify-between items-center gap-8 h-fit mb-16 ${
            orientation === 'reverse' ? 'md:flex-row-reverse' : ''
        }`}>
            <div className="w-full md:w-1/2 text-left flex flex-col gap-4 items-start justify-start text-lg">
                {text}
            </div>
            <div className="w-full md:w-1/2 max-h-[28rem] overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105">
                <img 
                    src={image} 
                    alt={alt} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export default ContentImage;