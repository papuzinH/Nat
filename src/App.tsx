import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ScrollToTop, GTMTag, NoscriptGTM, Header, Footer } from './components/shared';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/cart';
import Home from './pages/Home';
import Tienda from './pages/Tienda';

const ProductDetail        = lazy(() => import('./pages/ProductDetail'));
const Checkout             = lazy(() => import('./pages/Checkout'));
const CheckoutConfirmacion = lazy(() => import('./pages/CheckoutConfirmacion'));
const CheckoutError        = lazy(() => import('./pages/CheckoutError'));
const Estudio       = lazy(() => import('./pages/Estudio'));
const Blog          = lazy(() => import('./pages/Blog'));
const BlogPost      = lazy(() => import('./pages/BlogPost'));
const Contacto      = lazy(() => import('./pages/Contacto'));
const AdminLogin    = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout   = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOrders   = lazy(() => import('./pages/admin/AdminOrders'));
const AdminStock    = lazy(() => import('./pages/admin/AdminStock'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminEnvios   = lazy(() => import('./pages/admin/AdminEnvios'))
const AdminBlog       = lazy(() => import('./pages/admin/AdminBlog'))
const AdminBlogEditor = lazy(() => import('./pages/admin/AdminBlogEditor'));

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-cream-50" aria-live="polite">
    <span className="font-mono text-[12px] text-ink-soft uppercase tracking-[0.14em]">Cargando…</span>
  </div>
);

function App() {
  return (
    <CartProvider>
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
                  <Route path="/checkout"                  element={<Checkout />} />
                  <Route path="/checkout/confirmacion" element={<CheckoutConfirmacion />} />
                  <Route path="/checkout/error"        element={<CheckoutError />} />
                  <Route path="/estudio"      element={<Estudio />} />
                  <Route path="/blog"         element={<Blog />} />
                  <Route path="/blog/:slug"   element={<BlogPost />} />
                  <Route path="/contacto"     element={<Contacto />} />
                </Routes>
              </Suspense>
            </Layout>
          } />

          {/* Admin — sin Layout público */}
          <Route path="/admin/login" element={
            <Suspense fallback={<PageFallback />}>
              <AdminLogin />
            </Suspense>
          } />
          <Route path="/admin/*" element={
            <Suspense fallback={<PageFallback />}>
              <AdminLayout />
            </Suspense>
          }>
            <Route index             element={<AdminOrders />} />
            <Route path="stock"      element={<AdminStock />} />
            <Route path="envios"     element={<AdminEnvios />} />
            <Route path="productos"  element={<AdminProducts />} />
            <Route path="blog"       element={<AdminBlog />} />
            <Route path="blog/nuevo" element={<AdminBlogEditor />} />
            <Route path="blog/:id"   element={<AdminBlogEditor />} />
          </Route>
        </Routes>
        <CartDrawer />
      </Router>
    </CartProvider>
  );
}

export default App;
