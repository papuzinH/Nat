# Copilot Instructions para NatArt

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Proyecto NatArt - Sitio Web Artístico

Este es un sitio web para Natalia Heller, una artista y tatuadora que necesita mostrar su portafolio y conectar con clientes.

### Tecnologías
- **Frontend**: React 18 con TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Build Tool**: Vite

### Estilo y Diseño
- **Paleta de colores**: Blancos, cremas, neutros y transparencias
- **Fuentes**: 
  - Títulos: "Aboreto" (serif)
  - Texto: "Gayathri" (sans-serif)
- **Estilo**: Natural, liviano, minimalista

### Estructura del Proyecto
- `src/components/shared/`: Componentes reutilizables (Header, Footer, Layout)
- `src/pages/`: Páginas principales (Home, Obras, Tattoo, Sobre mi, Blog, FAQs, Contacto)
- Responsive design con mobile-first approach

### Patrones de Código
- Usar functional components con TypeScript
- Implementar proper props typing
- Usar React hooks apropiadamente
- Mantener componentes pequeños y enfocados
- Aplicar principios de composición sobre herencia

### Accesibilidad
- Usar elementos HTML semánticos
- Implementar navegación por teclado
- Incluir atributos ARIA apropiados
- Mantener contraste de colores adecuado

### Performance
- Implementar lazy loading cuando sea apropiado
- Usar memoization con React.memo, useMemo, useCallback cuando sea necesario
- Optimizar imágenes y assets

Al trabajar en este proyecto, mantén siempre el enfoque artístico y profesional apropiado para una tatuadora/artista.
