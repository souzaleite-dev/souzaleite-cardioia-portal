import { somarDias } from '../utils/datas.js'

export const ATENDIMENTOS = ['Consulta', 'Retorno', 'Eletrocardiograma', 'Ecocardiograma', 'Teste ergométrico']

/** Agenda de consultas. Ações: { tipo: 'agendar', consulta } e { tipo: 'cancelar', id }. */
export function consultasReducer(consultas, acao) {
  switch (acao.tipo) {
    case 'agendar':
      return [...consultas, acao.consulta]
    case 'cancelar':
      return consultas.filter((consulta) => consulta.id !== acao.id)
    default:
      throw new Error(`Ação desconhecida: ${acao.tipo}`)
  }
}

export const ordenarPorHorario = (consultas) =>
  [...consultas].sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`))

/** Primeira visita: três consultas nos próximos dias, para o dashboard não começar vazio. */
export const consultasDeExemplo = (hoje) => [
  { id: 'exemplo-1', pacienteId: 'CIA-0003', data: somarDias(hoje, 1), horario: '09:00', atendimento: 'Consulta', observacoes: 'Primeira avaliação cardiológica.' },
  { id: 'exemplo-2', pacienteId: 'CIA-0011', data: somarDias(hoje, 2), horario: '14:30', atendimento: 'Eletrocardiograma', observacoes: '' },
  { id: 'exemplo-3', pacienteId: 'CIA-0007', data: somarDias(hoje, 5), horario: '10:00', atendimento: 'Retorno', observacoes: 'Trazer os exames de colesterol.' },
]
