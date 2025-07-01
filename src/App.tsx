import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/shared';
import { Home, Obras, Tattoo, SobreMi, Blog, FAQs, Contacto } from './pages';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/obras" element={<Obras />} />
          <Route path="/tattoo" element={<Tattoo />} />
          <Route path="/sobre-mi" element={<SobreMi />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
