import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection, Footer, Title, Subtitle, Button, SchemaMarkup } from '@/components/shared';
import sobremiHeroVideo from '@/assets/sobremi_hero.mp4';
import { tattoos } from '@/assets/tattoo/mock-data';

// Hero Content Component
const ContentHero = () => (
  <div className="px-4 py-12 md:py-16">
    <div className="max-w-4xl mx-auto text-center">
      {/* H1 optimizado para SEO */}
      <Title 
        as="h1" 
        variant="titlePage" 
        className="text-white mb-6 animate-fade-in"
      >
        Diseños de Tatuajes Únicos y Personalizados en Buenos Aires
      </Title>
      
      {/* Subtitle descriptivo */}
      <Subtitle 
        variant="large" 
        className="text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-150"
      >
        Transformo tu historia y esencia en un diseño único, permanente. 
        En mi estudio, la naturaleza y la simetría guían cada trazo.
      </Subtitle>
      
      {/* CTA Principal */}
      <div className="animate-fade-in animation-delay-300">
        <Button 
          variant="primary" 
          size="large"
          as="link"
          to="/contacto"
          className="font-title tracking-wide shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
        >
          AGENDA MI CITA
        </Button>
      </div>
    </div>
  </div>
);

// Testimonios / Prueba Social Component
const SocialProofSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      text: '500+ Diseños de Autor',
      subtitle: 'Cada pieza refleja la esencia única de quien la lleva.',
      icon: '🎨'
    },
    {
      id: 2,
      text: 'Mi Experiencia: 8+ Años',
      subtitle: 'Perfeccionando el arte del tatuaje con pasión y dedicación.',
      icon: '⭐'
    },
    {
      id: 3,
      text: 'Estudio Personal & Seguro',
      subtitle: 'Trabajo bajo los más altos estándares de higiene y cuidado.',
      icon: '✨'
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-cream-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <Title 
            as="h2" 
            variant="titleSection" 
            className="text-cream-800 mb-4 animate-fade-in"
          >
            Mi Universo Creativo y Tu Historia
          </Title>
          <Subtitle 
            variant="medium" 
            className="text-cream-600 max-w-2xl mx-auto animate-fade-in animation-delay-150"
          >
            Enfocada en el detalle, te invito a co-crear un diseño exclusivo, 
            con la confianza y seguridad de 8+ años de experiencia.
          </Subtitle>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 
                         border border-cream-200 hover:border-green-300 transform hover:scale-105
                         animate-fade-in`}
              style={{ animationDelay: `${index * 150 + 300}ms` }}
            >
              {/* Icon */}
              <div className="text-5xl mb-4 text-center">
                {testimonial.icon}
              </div>
              
              {/* Main Text */}
              <Title 
                as="h3" 
                variant="titleCard" 
                className="text-cream-800 text-center mb-3"
              >
                {testimonial.text}
              </Title>
              
              {/* Subtitle */}
              <Subtitle 
                variant="small" 
                className="text-cream-600 text-center leading-relaxed"
              >
                {testimonial.subtitle}
              </Subtitle>
            </div>
          ))}
        </div>

        {/* Secondary CTA */}
        <div className="text-center mt-12 md:mt-16 animate-fade-in animation-delay-600">
          <Button 
            variant="outline" 
            size="large"
            as="link"
            to="/tattoo"
            className="font-body"
          >
            Ver Portfolio de Tatuajes
          </Button>
        </div>
      </div>
    </section>
  );
};

// Portafolio Destacado Component
const FeaturedPortfolioSection: React.FC = () => {
  // Seleccionar los primeros 4 tatuajes para mostrar
  const featuredTattoos = tattoos.slice(0, 4);

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-nude-50 to-brown-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <Title 
            as="h2" 
            variant="titleSection" 
            className="text-brown-800 mb-4 animate-fade-in"
          >
            Trabajos Destacados
          </Title>
          <Subtitle 
            variant="medium" 
            className="text-brown-600 max-w-2xl mx-auto animate-fade-in animation-delay-150"
          >
            Explora algunos de nuestros diseños más emblemáticos. 
            Cada tatuaje cuenta una historia única.
          </Subtitle>
        </div>

        {/* Grid de Tatuajes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto mb-12">
          {featuredTattoos.map((tattoo, index) => (
            <Link
              key={tattoo.id}
              to="/tattoo"
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl 
                         transition-all duration-500 transform hover:scale-105 animate-fade-in
                         border border-brown-200 hover:border-green-400`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image Container */}
              <div className="aspect-[3/4] overflow-hidden bg-nude-100">
                <img
                  src={tattoo.image}
                  alt={tattoo.title}
                  className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-110"
                  loading={index < 2 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </div>

              {/* Overlay con info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                            flex flex-col justify-end p-6">
                <h3 className="font-title text-white text-lg md:text-xl mb-2">
                  {tattoo.title}
                </h3>
                <p className="font-body text-white/80 text-sm">
                  {tattoo.category}
                </p>
              </div>

              {/* Badge de categoría */}
              <div className="absolute top-4 right-4 bg-green-600/90 backdrop-blur-sm 
                            text-white text-xs font-body px-3 py-1 rounded-full">
                {tattoo.category}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Secundario */}
        <div className="text-center animate-fade-in animation-delay-600">
          <Button 
            variant="primary" 
            size="large"
            as="link"
            to="/tattoo"
            className="font-title tracking-wide bg-green-600 hover:bg-green-700"
          >
            VER PORTAFOLIO COMPLETO
          </Button>
        </div>
      </div>
    </section>
  );
};

// Instagram CTA Component
const InstagramSection: React.FC = () => {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-br from-brown-100 via-nude-100 to-cream-100 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brown-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon/Emoji */}
          <div className="text-6xl md:text-7xl mb-6 animate-fade-in">
            📸
          </div>

          {/* Title */}
          <Title 
            as="h2" 
            variant="titleSection" 
            className="text-brown-800 mb-6 animate-fade-in animation-delay-150"
          >
            Mi Diario de Arte: Proceso y Reflexiones
          </Title>

          {/* Subtitle */}
          <Subtitle 
            variant="large" 
            className="text-brown-600 mb-8 animate-fade-in animation-delay-300"
          >
            Sígueme en Instagram para ver mis sketches, mis últimos trabajos 
            y las inspiraciones que guían mi proceso creativo.
          </Subtitle>

          {/* Stats Row */}
          <div className="flex justify-center gap-8 md:gap-12 mb-10 animate-fade-in animation-delay-450">
            <div className="text-center">
              <div className="font-title text-3xl md:text-4xl text-green-700 mb-1">
                10K+
              </div>
              <div className="font-body text-sm md:text-base text-brown-600">
                Seguidores
              </div>
            </div>
            <div className="w-px bg-brown-300"></div>
            <div className="text-center">
              <div className="font-title text-3xl md:text-4xl text-green-700 mb-1">
                500+
              </div>
              <div className="font-body text-sm md:text-base text-brown-600">
                Publicaciones
              </div>
            </div>
            <div className="w-px bg-brown-300"></div>
            <div className="text-center">
              <div className="font-title text-3xl md:text-4xl text-green-700 mb-1">
                4.9★
              </div>
              <div className="font-body text-sm md:text-base text-brown-600">
                Valoración
              </div>
            </div>
          </div>

          {/* Instagram Feed - Widget Real */}
          <div className="my-12 animate-fade-in animation-delay-450">
            {/* Feed Title */}
            <h2 className="font-title text-2xl md:text-3xl text-brown-800 mb-8">
              Mis Últimos Tatuajes
            </h2>

            {/* LightWidget Instagram Feed */}
            <div className="w-full">
              <script src="https://cdn.lightwidget.com/widgets/lightwidget.js"></script>
              <iframe 
                src="//lightwidget.com/widgets/11730c9547d65b8da1544c6a36290e44.html" 
                scrolling="no" 
                allowTransparency={true}
                loading="lazy"
                className="lightwidget-widget w-full border-0 min-h-[400px] md:min-h-[550px]"
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in animation-delay-600">
            <Button 
              variant="primary" 
              size="large"
              as="link"
              href="https://instagram.com/nataliaceller_art"
              target="_blank"
              className="font-title tracking-wide bg-gradient-to-r from-green-600 to-green-700 
                       hover:from-green-700 hover:to-green-800 shadow-xl hover:shadow-green-500/50"
            >
              📱 Sígueme en Instagram
            </Button>
          </div>

          {/* Handle */}
          <p className="mt-4 font-body text-brown-500 text-sm animate-fade-in animation-delay-600">
            @nataliaceller_art
          </p>
        </div>
      </div>
    </section>
  );
};

// FAQ Section - Props Interface
interface FAQItemProps {
  question: string;
  answer: string;
  delay?: string;
}

// FAQ Item Component
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, delay = '' }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div 
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
                 border border-cream-200 overflow-hidden ${delay}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex items-center justify-between 
                 hover:bg-cream-50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <Title 
          as="h3" 
          variant="titleCard" 
          className="text-cream-800 pr-4"
        >
          {question}
        </Title>
        <span 
          className={`text-green-600 text-2xl font-bold transform transition-transform duration-300 
                     flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 pt-2">
          <Subtitle 
            variant="small" 
            className="text-cream-700 leading-relaxed"
          >
            {answer}
          </Subtitle>
        </div>
      </div>
    </div>
  );
};

// FAQ Section Component
const FAQSection: React.FC = () => {
  const faqs: Array<{ question: string; answer: string }> = [
    {
      question: '¿Cuál es el rango de precios para un tatuaje?',
      answer: 'Los precios varían según el tamaño, complejidad y tiempo estimado. Un tatuaje pequeño comienza desde $5,000 ARS, mientras que diseños más elaborados pueden requerir una consulta personalizada. Contactanos para obtener un presupuesto ajustado a tu proyecto específico.'
    },
    {
      question: '¿Cómo funciona el proceso de reserva y diseño?',
      answer: 'Primero agendas una consulta donde discutimos tu idea. Luego creo un diseño personalizado que revisamos juntos. Una vez aprobado, reservamos tu cita con una seña del 30%. El día del tatuaje, finalizamos los detalles y comenzamos el trabajo en un ambiente profesional y seguro.'
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-cream-100 to-cream-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <Title 
            as="h2" 
            variant="titleSection" 
            className="text-cream-800 mb-4 animate-fade-in"
          >
            ¿Tenés dudas? Te ayudo
          </Title>
          <Subtitle 
            variant="medium" 
            className="text-cream-600 max-w-2xl mx-auto animate-fade-in animation-delay-150"
          >
            Respondí las preguntas más frecuentes para que tomes la mejor decisión. 
            Si tienes más dudas, hablemos personalmente.
          </Subtitle>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              delay={`animate-fade-in animation-delay-${index * 150 + 300}`}
            />
          ))}
        </div>

        {/* CTA Terciario */}
        <div className="text-center animate-fade-in animation-delay-600">
          <Button 
            variant="outline" 
            size="large"
            as="link"
            to="/faqs"
            className="font-body border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
          >
            PREGUNTAS FRECUENTES (FAQs)
          </Button>
        </div>
      </div>
    </section>
  );
};

// Main Home Component
const Home: React.FC = () => {
  // Schema.org LocalBusiness Data
  const localBusinessSchema = {
    name: 'Natalia Heller Tattoo Studio',
    image: 'https://tatuajesnaty.com/hero-image.webp',
    url: 'https://tatuajesnaty.com/',
    telephone: '+54 9 11 6619-1209',
    address: {
      '@type': 'PostalAddress' as const,
      addressLocality: 'Buenos Aires',
      addressRegion: 'CABA',
      addressCountry: 'AR',
    },
    priceRange: '$$',
    serviceType: [
      'Tatuaje Line Art',
      'Tatuaje Botánico',
      'Diseño Personalizado',
      'Tatuaje Minimalista',
      'Cover Up',
    ],
    description: 'Estudio de tatuajes especializado en diseños únicos y personalizados. Line Art, Botánico, Minimalista. 8+ años de experiencia en Buenos Aires.',
    openingHours: [
      'Mo-Fr 10:00-19:00',
      'Sa 11:00-17:00',
    ],
    sameAs: [
      'https://instagram.com/nataliaceller_art',
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <SchemaMarkup type="LocalBusiness" data={localBusinessSchema} />

      <div className="relative min-h-screen flex flex-col">
        {/* Hero Section con video background */}
        <HeroSection 
          video={sobremiHeroVideo} 
          content={<ContentHero />}
        />

      {/* Social Proof / Testimonials Section */}
      <SocialProofSection />

      {/* Featured Portfolio Section */}
      <FeaturedPortfolioSection />

      {/* Instagram Engagement Section */}
      <InstagramSection />

      {/* FAQ Section - Cierre de objeciones */}
      <FAQSection />

      {/* Footer con estilo transparente */}
      <Footer />
      </div>
    </>
  );
};

export default Home;
