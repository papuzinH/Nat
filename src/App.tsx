import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ScrollToTop, GTMTag, NoscriptGTM, Header, Footer } from './components/shared';
import {
  Home,
  Tienda,
  ProductDetail,
  Estudio,
  Blog,
  BlogPost,
  Contacto
} from './pages';

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
              <Routes>
                <Route path="/tienda" element={<Tienda />} />
                <Route path="/tienda/:slug" element={<ProductDetail />} />
                <Route path="/estudio" element={<Estudio />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contacto" element={<Contacto />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
