
const HeroSection = ({video, image, content}: {video?: string, image?: string, content: React.ReactNode}) => {
    // Detectar el tipo de video por extensión
    const getVideoType = (videoSrc: string) => {
        if (videoSrc.endsWith('.webm')) return 'video/webm';
        if (videoSrc.endsWith('.mp4')) return 'video/mp4';
        if (videoSrc.endsWith('.mov')) return 'video/mp4';
        return 'video/mp4'; // default
    };

    return (
        <section className="relative min-h-[calc(100dvh+8rem)] flex items-center justify-center overflow-hidden pb-32">
            {/* Background Video or Image */}
            {video ? (
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src={video} type={getVideoType(video)} />
                    Tu navegador no soporta el elemento de video.
                </video>
            ) : image ? (
                <img
                    src={image}
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute top-0 left-0 w-full h-full bg-cream-200" />
            )}

            {/* Background Blur Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content over video/image */}
            <div className="relative z-10 text-center text-white max-w-6xl w-full">
                {content}
            </div>

            {/* Curved Bottom Cut - S Shape */}
            <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
                <svg 
                    className="absolute bottom-0 w-full h-full" 
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
        </section>
    );
}

export default HeroSection;