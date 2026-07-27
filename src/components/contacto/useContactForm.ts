import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

interface UseContactFormProps {
  designId?: string;
  designTitle?: string;
}

export const useContactForm = ({ designId, designTitle }: UseContactFormProps = {}) => {
  const initialMessage = designId && designTitle
    ? `Me inspiró el diseño: ${designTitle}. Mi idea es... `
    : '';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    topic: '',
    message: initialMessage,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = 'Nombre requerido.';
    if (!formData.email.trim()) {
      e.email = 'Email requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Email inválido.';
    }
    if (formData.message.trim().length < 10) e.message = 'Mínimo 10 caracteres.';
    return e;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTopicChange = (value: string) => {
    setFormData(prev => ({ ...prev, topic: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          topic: formData.topic,
          message: formData.message,
          designId,
          designTitle,
        }),
      });

      if (!res.ok) {
        throw new Error(`send-contact-email ${res.status}`);
      }

      const w = window as Window & { dataLayer?: Record<string, unknown>[] }
      if (w.dataLayer) {
        w.dataLayer.push({
          event: 'form_submitted_success',
          design_id: designId || undefined,
          design_title: designTitle || undefined,
          conversion_value: 50,
          currency: 'USD',
          lead_type: designId ? 'tattoo_inquiry' : 'general_contact',
        });
      }

      setSent(true);
    } catch (error) {
      console.error('Error enviando formulario:', error);
      setSubmitError('No pudimos enviar tu mensaje. Probá de nuevo en unos minutos o escribime por Instagram.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      topic: '',
      message: initialMessage,
    });
    setErrors({});
    setSent(false);
    setSubmitError(null);
  };

  return {
    formData,
    errors,
    isSubmitting,
    sent,
    submitError,
    handleChange,
    handleTopicChange,
    handleSubmit,
    reset,
  };
};
