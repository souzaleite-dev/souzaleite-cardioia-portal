import { useCallback, useEffect, useState } from 'react'
import { buscarPacientes } from '../services/pacientesApi.js'

/** Carrega os pacientes da API simulada, com estados de carregamento e erro e opção de tentar de novo. */
export function usePacientes() {
  const [estado, setEstado] = useState({ pacientes: [], carregando: true, erro: '' })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true // ignora a resposta se o componente sair da tela antes dela chegar
    buscarPacientes()
      .then((pacientes) => {
        if (ativo) setEstado({ pacientes, carregando: false, erro: '' })
      })
      .catch((erro) => {
        if (ativo) setEstado({ pacientes: [], carregando: false, erro: erro.message })
      })
    return () => {
      ativo = false
    }
  }, [tentativa])

  const tentarNovamente = useCallback(() => {
    setEstado({ pacientes: [], carregando: true, erro: '' })
    setTentativa((n) => n + 1)
  }, [])

  return { ...estado, tentarNovamente }
}
