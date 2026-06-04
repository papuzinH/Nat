import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ScrollToTop, GTMTag, NoscriptGTM, Header, Footer } from './components/shared';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/cart';
import Home from './screens/Home';
import Tienda from './screens/Tienda';

const ProductDetail        = lazy(() => import('./screens/ProductDetail'));
const Checkout             = lazy(() => import('./screens/Checkout'));
const CheckoutConfirmacion = lazy(() => import('./screens/CheckoutConfirmacion'));
const CheckoutError        = lazy(() => import('./screens/CheckoutError'));
const Estudio          = lazy(() => import('./screens/Estudio'));
const EstudioReservar  = lazy(() => import('./screens/EstudioReservar'));
const Blog          = lazy(() => import('./screens/Blog'));
const BlogPost      = lazy(() => import('./screens/BlogPost'));
const Contacto      = lazy(() => import('./screens/Contacto'));
const AdminLogin     = lazy(() => import('./screens/admin/AdminLogin'));
const AdminLayout    = lazy(() => import('./screens/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./screens/admin/AdminDashboard'));
const AdminOrders    = lazy(() => import('./screens/admin/AdminOrders'));
const AdminStock    = lazy(() => import('./screens/admin/AdminStock'));
const AdminProducts = lazy(() => import('./screens/admin/AdminProducts'));
const AdminEnvios   = lazy(() => import('./screens/admin/AdminEnvios'))
const AdminBlog       = lazy(() => import('./screens/admin/AdminBlog'))
const AdminBlogEditor = lazy(() => import('./screens/admin/AdminBlogEditor'));

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
                  <Route path="/estudio"           element={<Estudio />} />
                  <Route path="/estudio/reservar"  element={<EstudioReservar />} />
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
            <Route index             element={<AdminDashboard />} />
            <Route path="ordenes"    element={<AdminOrders />} />
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
