import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  consultType: string;
  message: string;
}

interface UseContactFormProps {
  designId?: string;
  designTitle?: string;
}

export const useContactForm = ({ designId, designTitle }: UseContactFormProps = {}) => {
  // Pre-llenar mensaje si viene desde un diseño específico
  const initialMessage = designId && designTitle 
    ? `Me inspiró el diseño: ${designTitle}. Mi idea es... `
    : '';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    consultType: '',
    message: initialMessage
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica para enviar el formulario
      console.log('Formulario enviado:', formData);
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Push al DataLayer para GTM
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'form_submitted_success',
          design_id: designId || undefined,
          design_title: designTitle || undefined,
          conversion_value: 50,
          currency: 'USD',
          lead_type: designId ? 'tattoo_inquiry' : 'general_contact'
        });
      }

      // Mostrar modal de éxito
      setShowSuccessModal(true);
      
      // Reset form después de mostrar el modal
      const initialMessage = designId && designTitle 
        ? `Me inspiró el diseño: ${designTitle}. Mi idea es... `
        : '';
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        consultType: '',
        message: initialMessage
      });
      
    } catch (error) {
      console.error('Error enviando formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const resetForm = () => {
    const initialMessage = designId && designTitle 
      ? `Me inspiró el diseño: ${designTitle}. Mi idea es... `
      : '';
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      consultType: '',
      message: initialMessage
    });
    setShowSuccessModal(false);
  };

  return {
    formData,
    isSubmitting,
    showSuccessModal,
    handleChange,
    handleSubmit,
    closeSuccessModal,
    resetForm
  };
};
