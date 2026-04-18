import React from 'react'
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className="flex items-center gap-1 flex-wrap font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft"
        style={{ listStyle: 'none', margin: 0, padding: 0 }}
      >
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className="opacity-40">/</span>}
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-sage-700 transition-colors duration-150"
                style={{ textDecoration: 'none' }}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-sage-700">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
