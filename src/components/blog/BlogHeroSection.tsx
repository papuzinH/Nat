import React from 'react'
import HeroEyebrow from '@/components/shared/HeroEyebrow'
import HeroTitle from '@/components/shared/HeroTitle'
import HeroSubtitle from '@/components/shared/HeroSubtitle'
import { useLayoutEffect, useRef } from 'react'
import { gsap, shouldAnimate } from '@/lib/gsap'

interface BlogHeroSectionProps {
    sectionRef?: React.RefObject<HTMLElement | null>
}

const BlogHeroSection: React.FC<BlogHeroSectionProps> = ({ sectionRef }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!shouldAnimate()) return
        const ctx = gsap.context(() => {
            gsap.fromTo(
                Array.from(containerRef.current?.children ?? []),
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
            )
        })
        return () => ctx.revert()
    }, [])
    return (
        <section ref={sectionRef} aria-label="Blog" className="bg-cream-100 px-6 md:px-12 py-16 md:py-20">
            <div className="relative mx-auto max-w-7xl">
                <HeroEyebrow className="blog-eyebrow mb-4">
                    Diario del estudio
                </HeroEyebrow>
                <HeroTitle className="blog-h1 mb-4">
                    Notas sobre proceso, plantas y oficio.
                </HeroTitle>
                <HeroSubtitle className="blog-subtitle">
                    Una vez al mes escribo sobre lo que estoy aprendiendo. Sin agenda,
                    sin newsletter de lunes. Solo notas del taller.
                </HeroSubtitle>
            </div>
        </section>
    )
}

export default BlogHeroSection
