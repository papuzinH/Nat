const Section = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <section className={`py-16 px-4 md:px-8 lg:px-16 max-w-6xl mx-auto ${className}`}>

            {children}
        </section>
    );
};

export default Section;
