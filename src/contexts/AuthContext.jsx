import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apagarToken, autenticar, lerSessaoSalva, lerToken, salvarToken } from '../services/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(lerSessaoSalva) // payload do token, ou null

  const entrar = useCallback(async (email, senha) => {
    const token = await autenticar(email, senha)
    salvarToken(token)
    setSessao(lerToken(token))
  }, [])

  const sair = useCallback(() => {
    apagarToken()
    setSessao(null)
  }, [])

  // encerra a sessão sozinho quando o token expira
  useEffect(() => {
    if (!sessao) return undefined
    const temporizador = setTimeout(sair, sessao.exp * 1000 - Date.now())
    return () => clearTimeout(temporizador)
  }, [sessao, sair])

  const valor = useMemo(
    () => ({
      usuario: sessao && { nome: sessao.nome, papel: sessao.papel, email: sessao.sub },
      autenticado: Boolean(sessao),
      entrar,
      sair,
    }),
    [sessao, entrar, sair],
  )

  return <AuthContext value={valor}>{children}</AuthContext>
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth precisa estar dentro de <AuthProvider>.')
  return contexto
}
