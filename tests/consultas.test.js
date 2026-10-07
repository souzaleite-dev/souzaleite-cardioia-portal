import assert from 'node:assert/strict'
import { test } from 'node:test'
import { consultasDeExemplo, consultasReducer, ordenarPorHorario } from '../src/contexts/consultasReducer.js'

const consulta = (id, data, horario) => ({ id, pacienteId: 'CIA-0001', data, horario, atendimento: 'Consulta', observacoes: '' })

test('agendar adiciona e cancelar remove pelo id', () => {
  const agenda = consultasReducer([], { tipo: 'agendar', consulta: consulta('a', '2026-10-07', '09:00') })
  assert.equal(agenda.length, 1)
  assert.deepEqual(consultasReducer(agenda, { tipo: 'cancelar', id: 'a' }), [])
})

test('reducer não altera o estado anterior', () => {
  const antes = [consulta('a', '2026-10-07', '09:00')]
  consultasReducer(antes, { tipo: 'agendar', consulta: consulta('b', '2026-10-08', '10:00') })
  assert.equal(antes.length, 1)
})

test('ordena por data e depois por horário', () => {
  const ordem = ordenarPorHorario([
    consulta('c', '2026-10-09', '08:00'),
    consulta('b', '2026-10-07', '14:30'),
    consulta('a', '2026-10-07', '09:00'),
  ]).map((c) => c.id)
  assert.deepEqual(ordem, ['a', 'b', 'c'])
})

test('exemplos ficam nos próximos dias e ação desconhecida é erro', () => {
  assert.deepEqual(consultasDeExemplo('2026-12-30').map((c) => c.data), ['2026-12-31', '2027-01-01', '2027-01-04'])
  assert.throws(() => consultasReducer([], { tipo: 'remarcar' }), /desconhecida/)
})
