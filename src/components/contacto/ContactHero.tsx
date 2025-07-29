import React from 'react';
import {HeroSection, Subtitle, Title} from '../shared';
import ContactForm from './ContactForm';
import heroVideo from '../../assets/hero_video.mov';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactHeroProps {
  formData: FormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactHero: React.FC<ContactHeroProps> = ({
  formData,
  isSubmitting,
  isSubmitted,
  onFieldChange,
  onSubmit
}) => {
  return (
    <HeroSection 
      video={heroVideo}
      content={
        <div className="mx-auto px-4a flex items-center justify-between gap-4 w-full">
          <div className="text-left mb-12 max-w-md ml-0 mr-auto">
            <Title variant='titlePage' className='text-white mb-8'>
              Contacto
            </Title>
            <Subtitle variant='large' className='text-white'>
              ¿Listo para crear algo único juntos? Ponte en contacto conmigo.
            </Subtitle>
          </div>
          
          <ContactForm
            formData={formData}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
            onFieldChange={onFieldChange}
            onSubmit={onSubmit}
          />
        </div>
      }
    />
  );
};

export default ContactHero;
