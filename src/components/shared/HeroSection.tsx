
const HeroSection = ({video, content}: {video: string, content: React.ReactNode}) => {
    return (
        <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src={video} type="video/webm" />
                Tu navegador no soporta el elemento de video.
            </video>

            {/* Background Blur Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content over video */}
            <div className="relative z-10 text-center text-white max-w-7xl w-full">
                {content}
            </div>
        </section>
    );
}

export default HeroSection;