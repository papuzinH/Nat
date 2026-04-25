import React from 'react'

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  containerClassName?: string
  containerStyle?: React.CSSProperties
  paddingClassName?: string
  maxWidthClassName?: string
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className = '',
  style,
  containerClassName = '',
  containerStyle,
  paddingClassName = 'px-6 md:px-12 py-16 md:py-20',
  maxWidthClassName = 'max-w-7xl',
  ...props
}) => {
  const outerClassName = [paddingClassName, className].filter(Boolean).join(' ')
  const innerClassName = ['mx-auto w-full', maxWidthClassName, containerClassName]
    .filter(Boolean)
    .join(' ')

  return (
    <section {...props} className={outerClassName} style={style}>
      <div className={innerClassName} style={containerStyle}>
        {children}
      </div>
    </section>
  )
}

export default SectionContainer