import React from 'react'
import { SectionContainer } from '../shared'

const STEPS = [
  {
    num: '01',
    title: 'Conversamos',
    desc: 'Mandame tu idea por el formulario. Te respondo en 3 a 5 días con preguntas para entender bien qué querés.',
  },
  {
    num: '02',
    title: 'Diseño',
    desc: 'Preparo una propuesta única dibujada para vos. Ajustamos hasta que quede exactamente como lo imaginaste.',
  },
  {
    num: '03',
    title: 'Sesión',
    desc: 'Nos encontramos en el estudio. Sin apuro. Mate, música suave, y el tiempo que haga falta.',
  },
  {
    num: '04',
    title: 'Cuidado',
    desc: 'Te doy una guía de cicatrización detallada y te sigo de cerca en los días que siguen.',
  },
]

const ProcessSteps: React.FC = () => (
  <SectionContainer>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 max-w-7xl mx-auto">
      {STEPS.map((step) => (
        <div key={step.num}>
          <p
            className="font-display italic leading-none mb-4"
            style={{ fontSize: '56px', color: '#7a9e7e' }}
          >
            {step.num}
          </p>
          <h3
            className="font-display mb-2"
            style={{ fontSize: '22px', color: '#2c2c2c' }}
          >
            {step.title}
          </h3>
          <p className="font-body leading-[1.6]" style={{ fontSize: '14px', color: '#5a5350' }}>
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  </SectionContainer>
)

export default ProcessSteps
