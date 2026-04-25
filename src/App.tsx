import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ScrollToTop, GTMTag, NoscriptGTM, Header, Footer } from './components/shared';
import Home from './pages/Home';
import Tienda from './pages/Tienda';

const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Estudio       = lazy(() => import('./pages/Estudio'));
const Blog          = lazy(() => import('./pages/Blog'));
const BlogPost      = lazy(() => import('./pages/BlogPost'));
const Contacto      = lazy(() => import('./pages/Contacto'));

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-cream-50" aria-live="polite">
    <span className="font-mono text-[12px] text-ink-soft uppercase tracking-[0.14em]">Cargando…</span>
  </div>
);

function App() {
  return (
    <>
      <GTMTag gtmId="GTM-WXL45DSC" />

      <Router>
        <NoscriptGTM gtmId="GTM-WXL45DSC" />

        <ScrollToTop />
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          } />

          <Route path="/*" element={
            <Layout>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/tienda"       element={<Tienda />} />
                  <Route path="/tienda/:slug" element={<ProductDetail />} />
                  <Route path="/estudio"      element={<Estudio />} />
                  <Route path="/blog"         element={<Blog />} />
                  <Route path="/blog/:slug"   element={<BlogPost />} />
                  <Route path="/contacto"     element={<Contacto />} />
                </Routes>
              </Suspense>
            </Layout>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
