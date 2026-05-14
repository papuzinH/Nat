import React from 'react'
import { SectionContainer } from '@/components/shared'

const CARDS = [
  { tall: 1.3 },
  { tall: 1.0 },
  { tall: 1.5 },
  { tall: 1.2 },
  { tall: 0.9 },
  { tall: 1.4 },
]

const TiendaSkeleton: React.FC = () => (
  <SectionContainer>
    <div className="[column-count:2] md:[column-count:3]" style={{ columnGap: '12px' }}>
      {CARDS.map(({ tall }, i) => (
        <div
          key={i}
          className="break-inside-avoid mb-3 md:mb-4 bg-cream-50 rounded-card overflow-hidden animate-pulse"
          style={{ boxShadow: '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)' }}
        >
          <div className="bg-cream-200 w-full" style={{ aspectRatio: `1 / ${tall}` }} />
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
