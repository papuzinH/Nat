import React from 'react';
import { HeroEyebrow, HeroTitle, HeroSubtitle } from '../shared';

const INFO_ITEMS = [
  { label: 'Correo', value: 'hola@nataliaheller.ar' },
  { label: 'Instagram', value: '@nat.tatt' },
  { label: 'Estudio', value: 'Parque Chacabuco · CABA\nCon turno previo' },
  { label: 'Horario', value: 'Mar a Sáb · 11:00 — 19:00' },
];

const ContactInfo: React.FC = () => (
  <div className="flex flex-col gap-8 lg:gap-10">
    <div className="space-y-4">
      <HeroEyebrow>Escribime</HeroEyebrow>
      <HeroTitle as="h1">
        Las buenas conversaciones <em>empiezan así.</em>
      </HeroTitle>
      <HeroSubtitle className="max-w-sm text-ink-soft">
        Contame tu idea, pedí una cotización o simplemente decí hola. Respondo en menos de 48 horas.
      </HeroSubtitle>
    </div>

    <dl className="grid gap-5">
      {INFO_ITEMS.map(item => (
        <div key={item.label}>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-1">
            {item.label}
          </dt>
          <dd
            className="font-display text-xl text-ink whitespace-pre-line"
            style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

export default ContactInfo;
