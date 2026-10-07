import assert from 'node:assert/strict'
import { test } from 'node:test'
import { USUARIO_DEMO, autenticar, criarTokenFalso, lerToken } from '../src/services/auth.js'

const agora = Date.UTC(2026, 9, 6, 12, 0, 0)

test('token falso tem 3 partes, dura 1 hora e preserva acentos', () => {
  const token = criarTokenFalso(USUARIO_DEMO, agora)
  assert.equal(token.split('.').length, 3)
  const sessao = lerToken(token, agora)
  assert.equal(sessao.nome, 'Dra. Ana Lúcia Ramos')
  assert.equal(sessao.sub, USUARIO_DEMO.email)
  assert.equal(sessao.exp - sessao.iat, 3600)
})

test('token expirado ou malformado não abre sessão', () => {
  const token = criarTokenFalso(USUARIO_DEMO, agora)
  assert.equal(lerToken(token, agora + 3600 * 1000), null)
  assert.equal(lerToken('nao.e.um-token', agora), null)
  assert.equal(lerToken('', agora), null)
})

test('login aceita só as credenciais de demonstração', async () => {
  await assert.rejects(autenticar(USUARIO_DEMO.email, 'senha-errada'), /incorretos/)
  const token = await autenticar(` ${USUARIO_DEMO.email.toUpperCase()} `, USUARIO_DEMO.senha)
  assert.equal(lerToken(token).papel, 'Cardiologista')
})
