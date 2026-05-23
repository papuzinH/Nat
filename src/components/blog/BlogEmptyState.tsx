import React from 'react'
import { NHLeafMark, HeroEyebrow, ButtonGhost } from '@/components/shared'

interface BlogEmptyStateProps {
  variant: 'global' | 'filtered'
  onReset?: () => void
}

const BlogEmptyState: React.FC<BlogEmptyStateProps> = ({ variant, onReset }) => {
  if (variant === 'global') {
    return (
      <section className="flex flex-col items-center text-center py-24 md:py-32 max-w-7xl mx-auto px-6">
        <NHLeafMark size={32} className="text-sage-700 mb-6" />
        <HeroEyebrow className="mb-4">Próximamente</HeroEyebrow>
        <h2 className="font-display font-normal text-[28px] md:text-[40px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          Las notas están en camino
        </h2>
        <p className="text-ink-soft text-[15px] leading-relaxed max-w-sm mb-8">
          Mientras tanto, seguime en Instagram donde comparto el proceso creativo día a día.
        </p>
        <ButtonGhost href="https://www.instagram.com/nat.tatt/" target="_blank">
          @nat.tatt
        </ButtonGhost>
      </section>
    )
  }

  return (
    <section className="flex flex-col items-center text-center py-16 md:py-20 max-w-7xl mx-auto px-6">
      <h2 className="font-display font-normal text-[22px] text-ink mb-6">
        Todavía no hay notas en esta categoría
      </h2>
      <ButtonGhost onClick={onReset}>Ver todas las notas</ButtonGhost>
    </section>
  )
}

export default BlogEmptyState
