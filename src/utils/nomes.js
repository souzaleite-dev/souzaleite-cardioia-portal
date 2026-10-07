const TITULO = /^dra?\.?$/i // "Dr." ou "Dra."
const partes = (nome) => nome.trim().split(/\s+/)

/** "Dra. Ana Lúcia Ramos" -> "Dra. Ana" (saudação) */
export function tratamento(nome) {
  const [primeira, segunda] = partes(nome)
  return TITULO.test(primeira) && segunda ? `${primeira} ${segunda}` : primeira
}

/** "Dra. Ana Lúcia Ramos" -> "Dra. Ana Ramos" (espaços curtos) */
export function nomeCurto(nome) {
  const lista = partes(nome)
  const titulo = TITULO.test(lista[0]) ? `${lista.shift()} ` : ''
  return titulo + (lista.length > 1 ? `${lista[0]} ${lista.at(-1)}` : lista[0])
}

/** "Dra. Ana Lúcia Ramos" -> "AR" (avatar) */
export function iniciais(nome) {
  const lista = partes(nome).filter((parte) => !TITULO.test(parte))
  return `${lista[0][0]}${lista.length > 1 ? lista.at(-1)[0] : ''}`.toUpperCase()
}
