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
                <section className="relative flex items-center justify-center overflow-hidden z-10">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="mx-auto px-4 flex items-center justify-between gap-8 max-w-6xl w-full">
                            <div className="text-left mb-12 max-w-md ml-0 mr-auto">
                                <Title variant='titlePage' className='text-white mb-8'>
                                    Contacto
                                </Title>
                                <Subtitle variant='large' className='text-white'>
                                    ¿Listo para crear algo único juntos? Ponte en contacto conmigo.
                                </Subtitle>
                            </div>

                            <ContactForm />
                        </div>
                    </div>
                </section>


            </div>
        </>
    );
};

export default ContactHero;
