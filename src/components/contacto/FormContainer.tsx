import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ButtonPrimary, ButtonGhost, NHLeafMark } from '../shared';
import InputField from './InputField';
import TopicPills from './TopicPills';
import TextareaField from './TextareaField';
import { useContactForm } from './useContactForm';
import { tattoos } from '@/assets/tattoo/mock-data';

const FormContainer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('design');

  const selectedDesign = designId
    ? tattoos.find(t => t.id === Number(designId) || t.slug === designId)
    : undefined;

  const {
    formData,
    errors,
    isSubmitting,
    sent,
    handleChange,
    handleTopicChange,
    handleSubmit,
    reset,
  } = useContactForm({
    designId: designId || undefined,
    designTitle: selectedDesign?.title,
  });

  if (sent) {
    const firstName = formData.name.split(' ')[0] || 'por escribirme';
    return (
      <div className="bg-cream-50 rounded-form border border-[var(--line-soft)] shadow-[0_10px_30px_rgba(74,124,89,0.06)] p-8 md:p-10 text-center space-y-5">
        <NHLeafMark size={42} className="mx-auto text-sage-700" />
        <div className="space-y-2">
          <p className="font-display text-2xl text-ink">
            ¡Gracias, {firstName}!
          </p>
          <p className="font-body text-ink-soft text-sm leading-relaxed">
            Te respondo a la brevedad — generalmente en menos de 48 horas.
          </p>
        </div>
        <ButtonGhost type="button" onClick={reset}>
          Enviar otra consulta
        </ButtonGhost>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 rounded-form border border-[var(--line-soft)] shadow-[0_10px_30px_rgba(74,124,89,0.06)] p-6 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <InputField
          id="name"
          name="name"
          type="text"
          label="Nombre"
          value={formData.name}
          placeholder="Tu nombre completo"
          required
          disabled={isSubmitting}
          errorMsg={errors.name}
          onChange={handleChange}
        />

        <InputField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          placeholder="tu@email.com"
          required
          disabled={isSubmitting}
          errorMsg={errors.email}
          onChange={handleChange}
        />

        <InputField
          id="phone"
          name="phone"
          type="tel"
          label="Teléfono"
          value={formData.phone}
          placeholder="+54 9 11 1234-5678"
          disabled={isSubmitting}
          onChange={handleChange}
        />

        <TopicPills
          value={formData.topic}
          onChange={handleTopicChange}
          disabled={isSubmitting}
        />

        <TextareaField
          id="message"
          name="message"
          label="Mensaje"
          value={formData.message}
          placeholder="Contame tu idea: estilo, tamaño, ubicación. Para cotizaciones, incluí referencias."
          required
          disabled={isSubmitting}
          rows={5}
          errorMsg={errors.message}
          onChange={handleChange}
        />

        <div className="pt-2">
          <ButtonPrimary type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
};

export default FormContainer;
