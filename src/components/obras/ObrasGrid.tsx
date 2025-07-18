import { Button, Title, Subtitle, Section } from '@/components/shared';

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
            {tiposObras.map((tipo) => (
                <div key={tipo.id} className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                    {/* Image Container */}
                    <div className="relative h-64 bg-gradient-to-br from-cream-200 to-cream-300 flex items-center justify-center">
                        <img
                            src={tipo.image}
                            alt={tipo.title}
                            className="w-full h-full object-cover transition-transform duration-300"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                        {/* Button - aparece solo en hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                                variant="secondary"
                                size="medium"
                                as="link"
                                to={tipo.route}
                            >
                                Ver Obras
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <Title variant="titleCard" as="h3" className="mb-3 group-hover:text-cream-700 transition-colors">
                            {tipo.title}
                        </Title>
                        <Subtitle variant="small" as="p" className="text-cream-600 leading-relaxed">
                            {tipo.description}
                        </Subtitle>
                    </div>
                </div>
            ))}
        </Section>
    )
}

export default ObrasGrid;