import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Botao from '../../components/Botao/Botao.jsx'
import Campo from '../../components/Campo/Campo.jsx'
import Marca from '../../components/Marca/Marca.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { USUARIO_DEMO } from '../../services/auth.js'
import estilos from './Login.module.css'

export default function Login() {
  const { autenticado, entrar } = useAuth()
  const destino = useLocation().state?.de?.pathname ?? '/'
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  // com a sessão criada, volta para a página que o usuário tentou abrir
  if (autenticado) return <Navigate to={destino} replace />

  async function enviar(evento) {
    evento.preventDefault()
    if (!email.trim() || !senha) {
      setErro('Preencha o e-mail e a senha.')
      return
    }
    setErro('')
    setEnviando(true)
    try {
      await entrar(email, senha)
    } catch (falha) {
      setErro(falha.message)
      setEnviando(false)
    }
  }

  function preencherDemonstracao() {
    setEmail(USUARIO_DEMO.email)
    setSenha(USUARIO_DEMO.senha)
    setErro('')
  }

  return (
    <main className={estilos.pagina}>
      <div className={estilos.coluna}>
        <div className={estilos.topo}>
          <Marca />
          <svg className={estilos.traco} viewBox="0 0 240 36" aria-hidden="true">
            <path d="M2 20h76l7-12 10 24 9-19 6 7h128" />
          </svg>
        </div>

        <form className={estilos.cartao} onSubmit={enviar} noValidate>
          <div className={estilos.titulo}>
            <h1>Entrar</h1>
            <p>Acesso da equipe de cardiologia.</p>
          </div>

          <Campo rotulo="E-mail">
            {(props) => (
              <input
                {...props}
                type="email"
                autoComplete="username"
                placeholder="nome@cardioia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </Campo>
          <Campo rotulo="Senha">
            {(props) => (
              <input
                {...props}
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            )}
          </Campo>

          {erro && (
            <p className={estilos.erro} role="alert">
              <TriangleAlert aria-hidden="true" />
              {erro}
            </p>
          )}

          <Botao type="submit" carregando={enviando} className={estilos.entrar}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </Botao>

          <div className={estilos.demonstracao}>
            <p>
              <strong>Acesso de demonstração</strong>
              <span>
                {USUARIO_DEMO.email} · {USUARIO_DEMO.senha}
              </span>
            </p>
            <Botao
              variante="secundario"
              tamanho="pequeno"
              onClick={preencherDemonstracao}
              aria-label="Preencher dados de demonstração"
            >
              Preencher
            </Botao>
          </div>
        </form>

        <p className={estilos.rodape}>Dados simulados · uso educacional · FIAP</p>
      </div>
    </main>
  )
}
