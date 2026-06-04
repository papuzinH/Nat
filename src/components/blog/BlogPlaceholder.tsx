import React from 'react'

interface BlogPlaceholderProps {
  aspect?: '4/5' | '16/9' | '3/2'
  label?: string
  className?: string
  style?: React.CSSProperties
}

const BlogPlaceholder: React.FC<BlogPlaceholderProps> = ({
  aspect = '4/5',
  label,
  className = '',
  style,
}) => (
  <div
    className={`relative w-full overflow-hidden bg-cream-200 ${className}`}
    style={{ aspectRatio: aspect ?? '4/5', ...style }}
    aria-hidden="true"
  >
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(74,124,89,0.07) 12px, rgba(74,124,89,0.07) 24px)',
      }}
    />
    {label && (
      <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </span>
    )}
  </div>
)

export default BlogPlaceholder
