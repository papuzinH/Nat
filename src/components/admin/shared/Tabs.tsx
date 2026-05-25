import React from 'react'

interface TabsProps {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
  /** Si true, los tabs ocupan todo el ancho. */
  stretch?: boolean
}

const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange, stretch = false }) => (
  <div
    role="tablist"
    className={`flex gap-1 overflow-x-auto scrollbar-hide ${stretch ? '' : 'flex-wrap'}`}
    style={{ borderBottom: '1px solid var(--line-soft)' }}
  >
    {tabs.map((t) => {
      const isActive = t.id === active
      return (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={isActive}
          onClick={() => onChange(t.id)}
          className={`font-mono text-[11px] uppercase tracking-[0.1em] px-3 py-2.5 whitespace-nowrap transition-colors ${
            stretch ? 'flex-1' : ''
          }`}
          style={{
            color: isActive ? 'var(--sage-700)' : 'var(--ink-soft)',
            borderBottom: isActive ? '2px solid var(--sage-700)' : '2px solid transparent',
            marginBottom: -1,
          }}
        >
          {t.label}
        </button>
      )
    })}
  </div>
)

export default Tabs
