import React from 'react'
import { SectionContainer } from '@/components/shared'

const CARDS = [0, 1, 2, 3, 4, 5]

const TiendaSkeleton: React.FC = () => (
  <SectionContainer>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
      {CARDS.map((i) => (
        <div
          key={i}
          className="bg-cream-50 rounded-card overflow-hidden animate-pulse"
          style={{ boxShadow: '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)' }}
        >
          <div className="bg-cream-200 w-full" style={{ aspectRatio: '4/5' }} />
          <div className="p-[18px_18px_22px] space-y-2">
            <div className="flex justify-between items-baseline gap-2">
              <div className="h-5 w-3/5 bg-cream-200 rounded" />
              <div className="h-5 w-12 bg-cream-200 rounded" />
            </div>
            <div className="h-3 w-2/5 bg-cream-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  </SectionContainer>
)

export default TiendaSkeleton
