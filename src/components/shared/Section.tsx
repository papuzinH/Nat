const Section = ({ children, className, type }: { children: React.ReactNode, className?: string, type?: 'curved-top' | 'curved-bottom' | 'curved' }) => {
    return (
        <section className={`relative py-16 px-4 md:px-8 lg:px-16 max-w-6xl mx-auto ${className}`}>
            {type === 'curved-top' || type === 'curved' && (
                <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
                    <svg
                        className="absolute top-0 w-full h-full z-30 rotate-180 scale-x-[-1]"
                        preserveAspectRatio="none"
                        viewBox="0 0 1200 120"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M 0 60 C 600 180 600 -60 1200 60 L 1200 120 L 0 120 Z"
                            fill="#fdfcfb"
                        />
                    </svg>
                </div>)}
            {children}
            {type === 'curved-bottom' || type === 'curved' && (
                <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
                    <svg
                        className="absolute bottom-0 w-full h-full z-30"
                        preserveAspectRatio="none"
                        viewBox="0 0 1200 120"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M 0 60 C 600 180 600 -60 1200 60 L 1200 120 L 0 120 Z"
                            fill="#fdfcfb"
                        />
                    </svg>
                </div>)}
        </section>
    );
};

export default Section;
