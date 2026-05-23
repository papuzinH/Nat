import React from 'react'
import { SectionContainer, NHLeafMark, HeroEyebrow, ButtonGhost } from '@/components/shared'

interface TiendaEmptyStateProps {
  variant: 'global' | 'filtered'
  onReset?: () => void
}

const TiendaEmptyState: React.FC<TiendaEmptyStateProps> = ({ variant, onReset }) => {
  if (variant === 'global') {
    return (
      <SectionContainer paddingClassName="px-6 md:px-12 py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <NHLeafMark size={32} className="text-sage-700 mb-6" />
          <HeroEyebrow className="mb-4">Próximamente</HeroEyebrow>
          <h2 className="font-display font-normal text-[28px] md:text-[40px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
            Nuevas obras en camino
          </h2>
          <p className="text-ink-soft text-[15px] leading-relaxed max-w-sm mb-8">
            Mientras tanto, seguime en Instagram donde comparto el proceso creativo día a día.
          </p>
          <ButtonGhost href="https://www.instagram.com/nat.tatt/" target="_blank">
            @nat.tatt
          </ButtonGhost>
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer paddingClassName="px-6 md:px-12 py-16 md:py-20">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-display font-normal text-[22px] text-ink mb-6">
          No hay obras en esta categoría todavía
        </h2>
        <ButtonGhost onClick={onReset}>Ver todas las obras</ButtonGhost>
      </div>
    </SectionContainer>
  )
}

export default TiendaEmptyState
