import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ScrollToTop, GTMTag, NoscriptGTM, Header } from './components/shared';
import { 
  Home, 
  Obras, 
  Tattoo,
  TattooDetail,
  SobreMi, 
  Blog,
  BlogPost, 
  FAQs, 
  Contacto,
  Acrilicos,
  Acuarelas,
  FloresPrensadas,
  Gouache,
  Ilustraciones,
  TecnicasMixtas,
  Marcadores,
  Ceramicas,
  Stickers
} from './pages';

function App() {
  return (
    <>
      {/* Google Tag Manager */}
      <GTMTag gtmId="GTM-WXL45DSC" />
      
      <Router>
        {/* Google Tag Manager (noscript) */}
        <NoscriptGTM gtmId="GTM-WXL45DSC" />
        
        <ScrollToTop />
        <Routes>
        {/* Ruta Home con Header manual (sin Layout completo para evitar padding) */}
        <Route path="/" element={
          <>
            <Header />
            <Home />
          </>
        } />
        
        {/* Todas las demás rutas con Layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/obras" element={<Obras />} />
              <Route path="/obras/acrilicos" element={<Acrilicos />} />
              <Route path="/obras/acuarelas" element={<Acuarelas />} />
              <Route path="/obras/flores-prensadas" element={<FloresPrensadas />} />
              <Route path="/obras/gouache" element={<Gouache />} />
              <Route path="/obras/ilustraciones" element={<Ilustraciones />} />
              <Route path="/obras/tecnicas-mixtas" element={<TecnicasMixtas />} />
              <Route path="/obras/marcadores" element={<Marcadores />} />
              <Route path="/obras/ceramicas" element={<Ceramicas />} />
              <Route path="/obras/stickers" element={<Stickers />} />
              <Route path="/tattoo" element={<Tattoo />} />
              <Route path="/tattoo/:id" element={<TattooDetail />} />
              <Route path="/sobre-mi" element={<SobreMi />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/faqs" element={<FAQs />} />
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
