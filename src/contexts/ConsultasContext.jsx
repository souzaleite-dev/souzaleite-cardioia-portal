import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { hojeIso } from '../utils/datas.js'
import { consultasDeExemplo, consultasReducer, ordenarPorHorario } from './consultasReducer.js'

const CHAVE = 'cardioia:consultas'
const ConsultasContext = createContext(null)

function carregarConsultas() {
  try {
    const salvas = JSON.parse(localStorage.getItem(CHAVE))
    if (Array.isArray(salvas)) return salvas
  } catch {
    // armazenamento indisponível ou corrompido: recomeça com os exemplos
  }
  return consultasDeExemplo(hojeIso())
}

export function ConsultasProvider({ children }) {
  const [consultas, despachar] = useReducer(consultasReducer, undefined, carregarConsultas)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(consultas))
    } catch {
      // sem armazenamento local, a agenda vale só para esta aba
    }
  }, [consultas])

  const agendar = useCallback((dados) => {
    const consulta = { ...dados, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
    despachar({ tipo: 'agendar', consulta })
    return consulta
  }, [])

  const cancelar = useCallback((id) => despachar({ tipo: 'cancelar', id }), [])

  const valor = useMemo(
    () => ({ consultas: ordenarPorHorario(consultas), agendar, cancelar }),
    [consultas, agendar, cancelar],
  )

  return <ConsultasContext value={valor}>{children}</ConsultasContext>
}

export function useConsultas() {
  const contexto = useContext(ConsultasContext)
  if (!contexto) throw new Error('useConsultas precisa estar dentro de <ConsultasProvider>.')
  return contexto
}
