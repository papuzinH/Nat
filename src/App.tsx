import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/shared';
import { 
  Home, 
  Obras, 
  Tattoo, 
  SobreMi, 
  Blog, 
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
    <Router>
      <Routes>
        {/* Ruta Home sin Layout (sin navbar) */}
        <Route path="/" element={<Home />} />
        
        {/* Todas las demás rutas con Layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
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
              <Route path="/sobre-mi" element={<SobreMi />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/contacto" element={<Contacto />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
