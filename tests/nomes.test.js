import assert from 'node:assert/strict'
import { test } from 'node:test'
import { iniciais, nomeCurto, tratamento } from '../src/utils/nomes.js'

test('nomes com e sem título', () => {
  assert.equal(tratamento('Dra. Ana Lúcia Ramos'), 'Dra. Ana')
  assert.equal(nomeCurto('Dra. Ana Lúcia Ramos'), 'Dra. Ana Ramos')
  assert.equal(iniciais('Dra. Ana Lúcia Ramos'), 'AR')
  assert.equal(tratamento('Bruno Leite'), 'Bruno')
  assert.equal(nomeCurto('Bruno de Souza Leite'), 'Bruno Leite')
  assert.equal(iniciais('Bruno'), 'B')
})
