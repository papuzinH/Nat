import React from 'react';
import { Title, Subtitle } from '../shared';
import ContactForm from './ContactForm';
import heroVideo from '../../assets/hero_video.mov';

const ContactHero: React.FC = () => {
    return (
        <>
            <div className="relative flex flex-col">
                {/* Background Video - Full Page */}
                <video
                    className="fixed top-0 left-0 w-full h-full object-cover z-0"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src={heroVideo} type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                </video>

                {/* Background Overlay - Full Page */}
                <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-0"></div>

                {/* Hero Content Section */}
                <section className="relative w-full z-10">
                    <div className="w-full h-full flex justify-center">
                        <div className="mx-auto px-4 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-12 max-w-6xl w-full">
                            <div className="text-center lg:text-left mb-4 lg:mb-0 max-w-md lg:max-w-lg w-full lg:sticky lg:top-32">
                                <Title variant='titlePage' className='text-white mb-4 lg:mb-8 text-3xl md:text-4xl lg:text-5xl drop-shadow-lg'>
                                    ¡Hablemos de tu Próximo Tatuaje!
                                </Title>
                                <Subtitle variant='large' className='text-white/95 text-base md:text-lg drop-shadow-md'>
                                    Usa este formulario para contarme tu idea, obtener una cotización o agendar una consulta gratuita. Tu historia comienza aquí.
                                </Subtitle>
                            </div>

                            <div className="w-full max-w-md">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </section>


            </div>
        </>
    );
};

export default ContactHero;
