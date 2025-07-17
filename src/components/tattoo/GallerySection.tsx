import { Title, Subtitle, Section } from '@/components/shared';

type Tattoo = {
    id: string;
    title: string;
    image: string;
    description: string;
};

const GallerySection = ({ tattoos }: { tattoos: Tattoo[] }) => {
    return (
        <Section className="pt-16 !px-0 max-w-none pb-0">
            <div className='max-w-6xl mx-auto text-center mb-16'>
                <Title className='mb-8'>
                    Galería
                </Title>
                <Subtitle className='max-w-4xl mx-auto'>
                    Me especializo en trabajos de Linea Fina, Ornamental y Botánico. También hago trabajos de estilo Ilustrativo, con algún detalle a color o trabajos en Black and Grey.
                </Subtitle>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-0 auto-rows-[400px]'>
                {
                    tattoos.map(tattoo => (
                        <div key={tattoo.id} className="overflow-hidden">
                            <img src={tattoo.image} alt={tattoo.title} className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                        </div>
                    ))}


            </div>
        </Section>
    )
}

export default GallerySection;