// API simulada: JSON estático em public/api, com 30 pacientes da base sintética da Fase 1 do CardioIA.
export const SEXO = { F: 'Feminino', M: 'Masculino' } // rótulo dos códigos que a API devolve

const ATRASO_MS = 600 // latência artificial, para o estado de carregamento ser visível

let requisicao = null // promessa compartilhada: dashboard, lista e agendamento usam uma única busca

export function buscarPacientes() {
  requisicao ??= fetch(`${import.meta.env.BASE_URL}api/pacientes.json`)
    .then((resposta) => {
      if (!resposta.ok) throw new Error(`A API de pacientes respondeu com erro (HTTP ${resposta.status}).`)
      return resposta.json()
    })
    .then((pacientes) => new Promise((resolve) => setTimeout(() => resolve(pacientes), ATRASO_MS)))
    .catch((erro) => {
      requisicao = null // a próxima chamada tenta de novo
      throw erro instanceof TypeError ? new Error('Sem conexão com a API de pacientes.') : erro
    })
  return requisicao
}
