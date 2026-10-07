// Autenticação SIMULADA. O "JWT" é montado e lido no próprio navegador, sem assinatura verificável:
// demonstra o fluxo de sessão (token no localStorage, expiração, proteção de rotas), não oferece segurança.

const CHAVE_TOKEN = 'cardioia:token'
const DURACAO_SEGUNDOS = 60 * 60

export const USUARIO_DEMO = {
  email: 'medico@cardioia.com',
  senha: 'cardio123',
  nome: 'Dra. Ana Lúcia Ramos',
  papel: 'Cardiologista',
}

const paraBase64Url = (bytes) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const deBase64Url = (texto) =>
  Uint8Array.from(atob(texto.replace(/-/g, '+').replace(/_/g, '/')), (caractere) => caractere.charCodeAt(0))

// TextEncoder/TextDecoder mantêm acentos (UTF-8) no payload, como num JWT de verdade
const codificar = (objeto) => paraBase64Url(new TextEncoder().encode(JSON.stringify(objeto)))

export function criarTokenFalso(usuario, agora = Date.now()) {
  const iat = Math.floor(agora / 1000)
  const payload = { sub: usuario.email, nome: usuario.nome, papel: usuario.papel, iat, exp: iat + DURACAO_SEGUNDOS }
  return `${codificar({ alg: 'none', typ: 'JWT' })}.${codificar(payload)}.assinatura-simulada`
}

/** Payload do token se ele for legível e ainda não tiver expirado; senão, null. */
export function lerToken(token, agora = Date.now()) {
  try {
    const payload = JSON.parse(new TextDecoder().decode(deBase64Url(token.split('.')[1])))
    return payload.exp * 1000 > agora ? payload : null
  } catch {
    return null
  }
}

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Simula a chamada de login a um servidor: devolve o token ou rejeita com mensagem para a tela. */
export async function autenticar(email, senha) {
  await esperar(500)
  if (email.trim().toLowerCase() !== USUARIO_DEMO.email || senha !== USUARIO_DEMO.senha) {
    throw new Error('E-mail ou senha incorretos.')
  }
  return criarTokenFalso(USUARIO_DEMO)
}

export function salvarToken(token) {
  try {
    localStorage.setItem(CHAVE_TOKEN, token)
  } catch {
    // sem armazenamento local, a sessão dura só enquanto a aba estiver aberta
  }
}

export function apagarToken() {
  try {
    localStorage.removeItem(CHAVE_TOKEN)
  } catch {
    // nada a apagar
  }
}

/** Sessão salva de uma visita anterior; token inválido ou expirado é descartado. */
export function lerSessaoSalva() {
  try {
    const token = localStorage.getItem(CHAVE_TOKEN)
    const sessao = token && lerToken(token)
    if (!sessao) apagarToken()
    return sessao || null
  } catch {
    return null
  }
}
