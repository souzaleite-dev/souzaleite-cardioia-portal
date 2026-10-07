// Datas sem hora ficam no formato AAAA-MM-DD (o mesmo do <input type="date">) e são formatadas em UTC,
// para o fuso horário não mudar o dia exibido.
const emUtc = (iso) => new Date(`${iso}T00:00:00Z`)
const formatoCurto = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', timeZone: 'UTC' })
const formatoDia = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const formatoSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' })
const formatoLongo = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export function hojeIso(agora = new Date()) {
  return new Date(agora.getTime() - agora.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export const horaAtual = (agora = new Date()) => agora.toTimeString().slice(0, 5)

export const horaDoDia = (agora = new Date()) => agora.getHours()

export function somarDias(iso, dias) {
  const data = emUtc(iso)
  data.setUTCDate(data.getUTCDate() + dias)
  return data.toISOString().slice(0, 10)
}

/** "Hoje", "Amanhã" ou "" para as demais datas. */
export function rotuloRelativo(iso, hoje) {
  if (iso === hoje) return 'Hoje'
  if (iso === somarDias(hoje, 1)) return 'Amanhã'
  return ''
}

export const formatarData = (iso) => formatoCurto.format(emUtc(iso)) // "qua., 07 de out."

export const formatarDia = (iso) => formatoDia.format(emUtc(iso)) // "quarta-feira, 7 de outubro"

export const diaDaSemana = (iso) => formatoSemana.format(emUtc(iso)).replace('.', '') // "qua"

export const formatarDataLonga = (agora = new Date()) => formatoLongo.format(agora)
