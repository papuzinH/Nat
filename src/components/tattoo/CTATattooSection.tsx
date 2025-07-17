import { Section, Title, Subtitle, Button } from "../shared";

const CTATattooSection = () => {
    return (
        <Section>
            <div className="text-center bg-white shadow-xl rounded-2xl py-16">
                <Title as="h2" variant="titleSection" className="mb-6">
                    ¿Tenés una idea en mente?
                </Title>
                <Subtitle className="mb-8 max-w-2xl mx-auto text-gray-700">
                    Trabajemos juntos para crear el diseño perfecto que refleje tu personalidad.
                    Cada tatuaje es único y está pensado especialmente para vos.
                </Subtitle>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
                        Quiero un tatuaje
                    </Button>

                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-8">
                    <div className="group flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-md hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
                        <span className="text-sm font-medium text-gray-700">Consultás sin compromiso</span>
                    </div>
                    <div className="group flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-md hover:shadow-md transition-all duration-300 hover:scale-105 animation-delay-150">
                        <div className="w-2 h-2 bg-cream-600 rounded-full animate-pulse group-hover:animate-bounce"></div>
                        <span className="text-sm font-medium text-gray-700">Diseños personalizados</span>
                    </div>
                    <div className="group flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-md hover:shadow-md transition-all duration-300 hover:scale-105 animation-delay-300">
                        <div className="w-2 h-2 bg-brown-600 rounded-full animate-pulse group-hover:animate-bounce"></div>
                        <span className="text-sm font-medium text-gray-700">Ambiente profesional</span>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default CTATattooSection;