import { Section } from '@/components/shared';

const ContenidoText = ({ content }: { content: string[] }) => {
    return (
        <Section>
            {content.map((paragraph: string, index: number) => (
                <p key={index} className={`text-lg ${index === content.length - 1 ? '' : 'mb-4'}`}>{paragraph}</p>
            ))}
        </Section>
    );
}

export default ContenidoText;
