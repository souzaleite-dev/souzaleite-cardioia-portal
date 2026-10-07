import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HORARIOS, estadoInicial, formularioReducer, validarAgendamento } from '../src/pages/Agendamento/formulario.js'

const relogio = { hoje: '2026-10-06', horaAtual: '10:00' }
const valido = { pacienteId: 'CIA-0007', data: '2026-10-07', horario: '09:00', atendimento: 'Consulta', observacoes: '' }

test('horários vão de 08:00 a 17:30, de 30 em 30 minutos', () => {
  assert.equal(HORARIOS.length, 20)
  assert.equal(HORARIOS[0], '08:00')
  assert.equal(HORARIOS.at(-1), '17:30')
})

test('agendamento completo e no futuro não tem erros', () => {
  assert.deepEqual(validarAgendamento(valido, [], relogio), {})
})

test('campos obrigatórios', () => {
  const erros = validarAgendamento(estadoInicial().campos, [], relogio)
  assert.deepEqual(Object.keys(erros).sort(), ['data', 'horario', 'pacienteId'])
})

test('data passada, horário que já passou hoje e fora do expediente', () => {
  assert.ok(validarAgendamento({ ...valido, data: '2026-10-05' }, [], relogio).data)
  assert.match(validarAgendamento({ ...valido, data: '2026-10-06', horario: '09:30' }, [], relogio).horario, /já passou/)
  assert.deepEqual(validarAgendamento({ ...valido, data: '2026-10-06', horario: '10:30' }, [], relogio), {})
  assert.ok(validarAgendamento({ ...valido, horario: '19:00' }, [], relogio).horario)
})

test('não deixa marcar duas consultas no mesmo dia e horário', () => {
  const agenda = [{ ...valido, id: 'x', pacienteId: 'CIA-0001' }]
  assert.match(validarAgendamento(valido, agenda, relogio).horario, /Já existe/)
  assert.deepEqual(validarAgendamento({ ...valido, horario: '09:30' }, agenda, relogio), {})
})

test('observações têm limite de 300 caracteres', () => {
  assert.ok(validarAgendamento({ ...valido, observacoes: 'x'.repeat(301) }, [], relogio).observacoes)
})

test('editar um campo apaga só o erro dele; limpar volta ao início', () => {
  const comErros = formularioReducer(estadoInicial('CIA-0002'), { tipo: 'invalidar', erros: { data: 'x', horario: 'y' } })
  const editado = formularioReducer(comErros, { tipo: 'alterar', campo: 'data', valor: '2026-10-08' })
  assert.deepEqual(editado.erros, { horario: 'y' })
  assert.equal(editado.campos.data, '2026-10-08')
  assert.equal(editado.campos.pacienteId, 'CIA-0002')
  assert.deepEqual(formularioReducer(editado, { tipo: 'limpar' }), estadoInicial())
})
