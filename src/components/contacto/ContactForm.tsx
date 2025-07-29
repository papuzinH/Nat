import React from 'react';
import { Button } from '../shared';

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface ContactFormProps {
    formData: FormData;
    isSubmitting: boolean;
    isSubmitted: boolean;
    onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
    formData,
    isSubmitting,
    isSubmitted,
    onFieldChange,
    onSubmit
}) => {
    if (isSubmitted) {
        return (
            <div className="text-center w-full">
                <div className="bg-white/95 backdrop-blur-sm border border-cream-200 rounded-xl p-8 shadow-lg">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                            <span className="text-green-600 text-2xl">✓</span>
                        </div>
                        <h3 className="text-2xl font-title text-gray-800 mb-2">
                            ¡Mensaje Enviado!
                        </h3>
                        <p className="text-gray-600 font-body">
                            Gracias por contactarme. Te responderé dentro de 24-48 horas.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-white/25 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-white-700 font-body mb-2 text-sm font-medium text-left">
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={onFieldChange}
                            required
                            disabled={isSubmitting}
                            className="text-gray-600 w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent font-body transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-white-700 font-body mb-2 text-sm font-medium text-left">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={onFieldChange}
                            required
                            disabled={isSubmitting}
                            className="text-gray-600 w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent font-body transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-white-700 font-body mb-2 text-sm font-medium text-left">
                            Tipo de consulta *
                        </label>
                        <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={onFieldChange}
                            required
                            disabled={isSubmitting}
                            className="text-gray-600 w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent font-body transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="tatuaje">Consulta sobre tatuaje</option>
                            <option value="obra">Consulta sobre obra de arte</option>
                            <option value="presupuesto">Solicitud de presupuesto</option>
                            <option value="colaboracion">Propuesta de colaboración</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-white-700 font-body mb-2 text-sm font-medium text-left">
                            Mensaje *
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={onFieldChange}
                            required
                            disabled={isSubmitting}
                            rows={4}
                            className="text-gray-600 w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent font-body resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Cuéntame sobre tu idea, proyecto o consulta..."
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando...
                            </>
                        ) : (
                            'Enviar Mensaje'
                        )}
                    </Button>
                </form>


            </div>
        </div>
    );
};

export default ContactForm;
