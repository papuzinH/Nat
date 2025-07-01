import React, { useState } from 'react';

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-title text-gray-800 mb-6">
            Contacto
          </h1>
          <p className="text-xl text-gray-600 font-body leading-relaxed">
            ¿Listo para crear algo único juntos? Ponte en contacto conmigo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-title text-gray-800 mb-8">
                Información de Contacto
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-cream-200 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-cream-600">📧</span>
                  </div>
                  <div>
                    <h3 className="font-title text-gray-800 text-lg">Email</h3>
                    <p className="text-gray-600 font-body">contacto@nataliaheller.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-cream-200 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-cream-600">📱</span>
                  </div>
                  <div>
                    <h3 className="font-title text-gray-800 text-lg">Instagram</h3>
                    <p className="text-gray-600 font-body">@nataliaheller.art</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-cream-200 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-cream-600">📍</span>
                  </div>
                  <div>
                    <h3 className="font-title text-gray-800 text-lg">Ubicación</h3>
                    <p className="text-gray-600 font-body">Buenos Aires, Argentina</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-cream-200 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-cream-600">🕒</span>
                  </div>
                  <div>
                    <h3 className="font-title text-gray-800 text-lg">Horarios</h3>
                    <p className="text-gray-600 font-body">
                      Lunes a Viernes: 10:00 - 18:00<br />
                      Sábados: 10:00 - 15:00<br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-cream-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-cream-600 font-body">Mapa de ubicación</span>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-title text-gray-800 mb-8">
              Envíame un Mensaje
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-body mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cream-500 focus:border-transparent font-body"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-body mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cream-500 focus:border-transparent font-body"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-700 font-body mb-2">
                  Tipo de consulta *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cream-500 focus:border-transparent font-body"
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
                <label htmlFor="message" className="block text-gray-700 font-body mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cream-500 focus:border-transparent font-body resize-none"
                  placeholder="Cuéntame sobre tu idea, proyecto o consulta..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cream-600 text-white py-3 px-6 rounded-md font-body hover:bg-cream-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cream-500 focus:ring-offset-2"
              >
                Enviar Mensaje
              </button>
            </form>

            <div className="mt-8 p-6 bg-cream-100 rounded-lg">
              <h3 className="font-title text-gray-800 text-lg mb-3">
                Tiempo de respuesta
              </h3>
              <p className="text-gray-600 font-body text-sm">
                Respondo todos los mensajes dentro de 24-48 horas. 
                Para consultas urgentes, puedes contactarme directamente por Instagram.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
