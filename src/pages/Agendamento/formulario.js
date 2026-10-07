import { ATENDIMENTOS } from '../../contexts/consultasReducer.js'

export const LIMITE_OBSERVACOES = 300

/** Horários de início das consultas: 08:00 a 17:30, a cada 30 minutos. */
export const HORARIOS = Array.from({ length: 20 }, (_, i) => {
  const minutos = 8 * 60 + i * 30
  return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`
})

export const estadoInicial = (pacienteId = '') => ({
  campos: { pacienteId, data: '', horario: '', atendimento: ATENDIMENTOS[0], observacoes: '' },
  erros: {},
})

/** Estado do formulário. Ações: alterar (um campo), invalidar (lista de erros) e limpar. */
export function formularioReducer(estado, acao) {
  switch (acao.tipo) {
    case 'alterar': {
      const { [acao.campo]: _corrigido, ...erros } = estado.erros // editar o campo apaga o erro dele
      return { campos: { ...estado.campos, [acao.campo]: acao.valor }, erros }
    }
    case 'invalidar':
      return { ...estado, erros: acao.erros }
    case 'limpar':
      return estadoInicial()
    default:
      throw new Error(`Ação desconhecida: ${acao.tipo}`)
  }
}

/** Erros por campo ({} quando tudo está certo). `hoje` em AAAA-MM-DD e `horaAtual` em HH:MM. */
export function validarAgendamento(campos, consultas, { hoje, horaAtual }) {
  const erros = {}
  if (!campos.pacienteId) erros.pacienteId = 'Escolha o paciente.'

  if (!campos.data) erros.data = 'Escolha a data.'
  else if (campos.data < hoje) erros.data = 'A data não pode estar no passado.'

  if (!campos.horario) erros.horario = 'Escolha o horário.'
  else if (!HORARIOS.includes(campos.horario)) erros.horario = 'Atendimento das 08:00 às 17:30, a cada 30 minutos.'
  else if (campos.data === hoje && campos.horario <= horaAtual) erros.horario = 'Esse horário já passou.'
  else if (consultas.some((c) => c.data === campos.data && c.horario === campos.horario)) {
    erros.horario = 'Já existe consulta nesse dia e horário.'
  }

  if (!ATENDIMENTOS.includes(campos.atendimento)) erros.atendimento = 'Escolha o tipo de atendimento.'
  if (campos.observacoes.length > LIMITE_OBSERVACOES) {
    erros.observacoes = `Use no máximo ${LIMITE_OBSERVACOES} caracteres.`
  }
  return erros
}
