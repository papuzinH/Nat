import React from 'react';
import {HeroSection, Title, Subtitle} from '../shared';
import ContactForm from './ContactForm';
import SuccessModal from './SuccessModal';
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
    showSuccessModal: boolean;
    onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCloseSuccessModal: () => void;
}

const ContactHero: React.FC<ContactHeroProps> = ({
    formData,
    isSubmitting,
    showSuccessModal,
    onFieldChange,
    onSubmit,
    onCloseSuccessModal
}) => {
    return (
        <>
            <HeroSection
                video={heroVideo}
                content={
                    <div className="mx-auto px-4 flex items-center justify-between gap-8">
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
                            onFieldChange={onFieldChange}
                            onSubmit={onSubmit}
                        />
                    </div>
                }
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={onCloseSuccessModal}
            />
        </>
    );
};

export default ContactHero;
