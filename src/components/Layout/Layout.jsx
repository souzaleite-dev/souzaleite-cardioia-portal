import { CalendarDays, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { iniciais, nomeCurto } from '../../utils/nomes.js'
import Marca from '../Marca/Marca.jsx'
import estilos from './Layout.module.css'

const LINKS = [
  { para: '/', rotulo: 'Dashboard', icone: LayoutDashboard, exato: true },
  { para: '/pacientes', rotulo: 'Pacientes', icone: Users },
  { para: '/agendamento', rotulo: 'Agenda', icone: CalendarDays },
]

/** Moldura das páginas protegidas: barra lateral (abas no celular), usuário logado e conteúdo. */
export default function Layout() {
  const { usuario, sair } = useAuth()
  const { pathname } = useLocation()

  // cada página começa do topo: o BrowserRouter não restaura a rolagem ao trocar de rota
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={estilos.app}>
      <a href="#conteudo" className={estilos.pular}>
        Pular para o conteúdo
      </a>

      <aside className={estilos.lateral}>
        <div className={estilos.marca}>
          <Marca />
        </div>

        <nav aria-label="Principal" className={estilos.navegacao}>
          {LINKS.map(({ para, rotulo, icone: Icone, exato }) => (
            <NavLink
              key={para}
              to={para}
              end={exato}
              className={({ isActive }) => `${estilos.link} ${isActive ? estilos.ativo : ''}`}
            >
              <Icone aria-hidden="true" />
              <span>{rotulo}</span>
            </NavLink>
          ))}
        </nav>

        <div className={estilos.usuario}>
          <span className={estilos.avatar} aria-hidden="true">
            {iniciais(usuario.nome)}
          </span>
          <span className={estilos.identificacao}>
            <strong>{nomeCurto(usuario.nome)}</strong>
            <small>{usuario.papel}</small>
          </span>
          <button type="button" className={estilos.sair} onClick={sair} aria-label="Sair" title="Sair">
            <LogOut aria-hidden="true" />
          </button>
        </div>
      </aside>

      <main id="conteudo" className={estilos.conteudo} tabIndex={-1}>
        <Outlet />
        <p className={estilos.nota}>CardioIA · dados simulados, uso educacional</p>
      </main>
    </div>
  )
}
