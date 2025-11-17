import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../shared/Button';
import InputField from './InputField';
import RadioField from './RadioField';
import TextareaField from './TextareaField';
import { useContactForm } from './useContactForm';
import { tattoos } from '@/assets/tattoo/mock-data';

const FormContainer: React.FC = () => {
  // Capturar query param 'design'
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('design');
  
  // Buscar el tatuaje en mock data si existe designId
  const selectedDesign = designId 
    ? tattoos.find(t => t.id === Number(designId) || t.slug === designId)
    : undefined;

  const { formData, isSubmitting, showSuccessModal, handleChange, handleSubmit, closeSuccessModal } = useContactForm({
    designId: designId || undefined,
    designTitle: selectedDesign?.title
  });

  const consultTypeOptions = [
    { value: 'cotizacion', label: 'Cotización de un Diseño' },
    { value: 'pregunta', label: 'Pregunta General/Información' },
    { value: 'retoque', label: 'Retoque o Diseño Anterior' }
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          id="name"
          name="name"
          type="text"
          label="Nombre"
          value={formData.name}
          placeholder="Tu nombre completo"
          required
          disabled={isSubmitting}
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

        <RadioField
          name="consultType"
          label="Tipo de Consulta"
          value={formData.consultType}
          options={consultTypeOptions}
          required
          disabled={isSubmitting}
          onChange={handleChange}
        />

        <TextareaField
          id="message"
          name="message"
          label="Mensaje"
          value={formData.message}
          placeholder="Describe tu idea: estilo (Line Art, Botánico), tamaño (en cm), y la ubicación exacta en el cuerpo. Si es una cotización, incluye referencias."
          required
          disabled={isSubmitting}
          rows={6}
          onChange={handleChange}
        />

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full md:w-auto min-w-[200px]"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center shadow-xl">
            <div className="mb-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                ¡Mensaje Enviado!
              </h3>
              <p className="text-gray-600 font-body">
                Gracias por contactarme. Te responderé lo antes posible.
              </p>
            </div>
            <Button 
              onClick={closeSuccessModal}
              variant="primary"
              className="w-full"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormContainer;
