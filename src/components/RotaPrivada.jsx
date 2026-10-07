import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

/** Libera as rotas filhas só com sessão válida; sem ela, vai ao login lembrando a página pedida. */
export default function RotaPrivada() {
  const { autenticado } = useAuth()
  const location = useLocation()
  return autenticado ? <Outlet /> : <Navigate to="/login" replace state={{ de: location }} />
}
