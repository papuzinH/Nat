import { Title, Subtitle, Section, ImageGallery, type GalleryImage } from '@/components/shared';

type Tattoo = {
    id: string;
    title: string;
    image: string;
    description: string;
};

const GallerySection = ({ tattoos }: { tattoos: Tattoo[] }) => {
    // Convertir los tatuajes al formato requerido por ImageGallery
    const galleryImages: GalleryImage[] = tattoos.map(tattoo => ({
        id: tattoo.id,
        src: tattoo.image,
        alt: tattoo.title,
        title: tattoo.title,
        description: tattoo.description
    }));

    return (
        <Section className="pt-16 !px-0 max-w-none pb-0">
            <div className='max-w-6xl mx-auto text-center mb-16 px-6'>
                <Title className='mb-8'>
                    Galería
                </Title>
                <Subtitle className='max-w-4xl mx-auto'>
                    Me especializo en trabajos de Linea Fina, Ornamental y Botánico. También hago trabajos de estilo Ilustrativo, con algún detalle a color o trabajos en Black and Grey.
                </Subtitle>
            </div>
            
            <div className='relative'>
                {/* SVG decorativo superior */}
                <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden z-30">
                    <svg
                        className="absolute top-0 w-full h-full rotate-180 scale-x-[-1]"
                        preserveAspectRatio="none"
                        viewBox="0 0 1200 120"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M 0 60 C 600 180 600 -60 1200 60 L 1200 120 L 0 120 Z"
                            fill="#fdfcfb"
                        />
                    </svg>
                </div>
                
                {/* Galería de imágenes */}
                <ImageGallery
                    images={galleryImages}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-0 auto-rows-[400px]"
                />
            </div>
        </Section>
    )
}

export default GallerySection;