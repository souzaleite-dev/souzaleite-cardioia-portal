import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ConsultasProvider } from './contexts/ConsultasContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConsultasProvider>
          <App />
        </ConsultasProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
