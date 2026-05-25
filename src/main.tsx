import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './context/ToastContext'
import ToastViewport from './components/admin/shared/ToastViewport'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <App />
        <ToastViewport />
      </ToastProvider>
    </HelmetProvider>
  </StrictMode>,
)
