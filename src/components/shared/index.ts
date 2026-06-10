export { default as Header } from './Header';
export { default as Footer } from './Footer';
// Componentes legacy del stack Vite (Layout, ScrollToTop, SchemaMarkup, GTMTag,
// NoscriptGTM, SEOMeta) reemplazados en la migración a Next y removidos del
// barrel para no arrastrar hooks/react-router a contextos server. Se eliminan
// definitivamente en el cutover (Wave 10).
export { default as NHLeafMark } from './NHLeafMark';
export { default as NHDivider } from './NHDivider';
export { default as NHSprig } from './NHSprig';
// ── Hero typography & buttons (design system unificado) ──
export { default as HeroEyebrow } from './HeroEyebrow';
export { default as HeroTitle } from './HeroTitle';
export { default as HeroSubtitle } from './HeroSubtitle';
export { default as SectionTitle } from './SectionTitle';
export { default as ButtonPrimary } from './ButtonPrimary';
export { default as ButtonGhost } from './ButtonGhost';
export { default as SectionContainer } from './SectionContainer';
export { default as NHFlower } from './NHFlower';
