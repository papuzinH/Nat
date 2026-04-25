import React from 'react';

const TOPICS = [
  { value: 'obra', label: 'Obra artística' },
  { value: 'tatuaje', label: 'Tatuaje' },
  { value: 'colaboracion', label: 'Colaboración' },
  { value: 'otro', label: 'Otro' },
];

interface TopicPillsProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TopicPills: React.FC<TopicPillsProps> = ({ value, onChange, disabled = false }) => (
  <div>
    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-3">
      Tema
    </p>
    <div className="flex flex-wrap gap-2">
      {TOPICS.map(topic => {
        const active = value === topic.value;
        return (
          <button
            key={topic.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(topic.value)}
            className={[
              'px-4 py-1.5 rounded-pill text-sm font-body border transition-all duration-200',
              'disabled:opacity-50 disabled:pointer-events-none',
              active
                ? 'bg-sage-700 text-cream-50 border-sage-700'
                : 'bg-transparent text-ink-soft border-[var(--line)] hover:border-sage-700 hover:text-sage-700',
            ].join(' ')}
          >
            {topic.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default TopicPills;
