import { CalendarCheck, CalendarX2, Check, TriangleAlert, X } from 'lucide-react'
import { useId, useMemo, useReducer, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Botao from '../../components/Botao/Botao.jsx'
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina.jsx'
import Campo from '../../components/Campo/Campo.jsx'
import { MensagemErro, Vazio } from '../../components/Estado/Estado.jsx'
import { useConsultas } from '../../contexts/ConsultasContext.jsx'
import { ATENDIMENTOS } from '../../contexts/consultasReducer.js'
import { usePacientes } from '../../hooks/usePacientes.js'
import { SEXO } from '../../services/pacientesApi.js'
import { formatarData, formatarDia, hojeIso, horaAtual, rotuloRelativo } from '../../utils/datas.js'
import { HORARIOS, LIMITE_OBSERVACOES, estadoInicial, formularioReducer, validarAgendamento } from './formulario.js'
import estilos from './Agendamento.module.css'

export default function Agendamento() {
  const [parametros] = useSearchParams()
  const { consultas, agendar, cancelar } = useConsultas()
  const { pacientes, carregando, erro: erroPacientes, tentarNovamente } = usePacientes()
  // ?paciente=CIA-0007 (atalho "Agendar" da lista) já chega com o paciente escolhido
  const [{ campos, erros }, despachar] = useReducer(formularioReducer, parametros.get('paciente') ?? '', estadoInicial)
  const [confirmada, setConfirmada] = useState(null)
  const nomeHorario = useId()
  const nomeAtendimento = useId()

  const hoje = hojeIso()
  const agora = horaAtual()
  const ocupados = useMemo(
    () => new Set(consultas.filter((c) => c.data === campos.data).map((c) => c.horario)),
    [consultas, campos.data],
  )
  const agendadas = consultas.filter((c) => c.data >= hoje).length
  const porDia = useMemo(() => {
    const grupos = new Map()
    for (const consulta of consultas) grupos.set(consulta.data, [...(grupos.get(consulta.data) ?? []), consulta])
    return [...grupos]
  }, [consultas])

  const alterar = (campo) => (evento) => {
    setConfirmada(null)
    despachar({ tipo: 'alterar', campo, valor: evento.target.value })
  }

  function enviar(evento) {
    evento.preventDefault()
    const encontrados = validarAgendamento(campos, consultas, { hoje, horaAtual: agora })
    if (Object.keys(encontrados).length) {
      despachar({ tipo: 'invalidar', erros: encontrados })
      return
    }
    setConfirmada(agendar(campos))
    despachar({ tipo: 'limpar' })
  }

  return (
    <>
      <CabecalhoPagina titulo="Agenda" subtitulo="Marque consultas e exames. Só aparecem os horários livres do dia escolhido." />

      <div className={estilos.colunas}>
        <form className={estilos.painel} onSubmit={enviar} noValidate aria-labelledby="titulo-nova">
          <h2 id="titulo-nova">Nova consulta</h2>

          {erroPacientes && <MensagemErro mensagem={erroPacientes} aoTentarNovamente={tentarNovamente} />}

          <Campo rotulo="Paciente" erro={erros.pacienteId}>
            {(props) => (
              <select {...props} value={campos.pacienteId} onChange={alterar('pacienteId')} disabled={carregando}>
                <option value="">{carregando ? 'Carregando pacientes…' : 'Selecione o paciente'}</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} · {p.idade} anos · {SEXO[p.sexo]}
                  </option>
                ))}
              </select>
            )}
          </Campo>

          <Campo rotulo="Data" erro={erros.data}>
            {(props) => <input {...props} type="date" min={hoje} value={campos.data} onChange={alterar('data')} />}
          </Campo>

          <fieldset className={estilos.grupo} aria-describedby={erros.horario ? `${nomeHorario}-erro` : undefined}>
            <legend>Horário</legend>
            {campos.data ? (
              <div className={estilos.horarios}>
                {HORARIOS.map((horario) => {
                  const ocupado = ocupados.has(horario)
                  const encerrado = campos.data === hoje && horario <= agora
                  return (
                    <label key={horario} className={estilos.chip}>
                      <input
                        type="radio"
                        name={nomeHorario}
                        value={horario}
                        checked={campos.horario === horario}
                        disabled={ocupado || encerrado}
                        onChange={alterar('horario')}
                      />
                      <span>
                        {horario}
                        {(ocupado || encerrado) && <small>{ocupado ? 'ocupado' : 'encerrado'}</small>}
                      </span>
                    </label>
                  )
                })}
              </div>
            ) : (
              <p className={estilos.ajuda}>Escolha a data para ver os horários livres.</p>
            )}
            {erros.horario && (
              <p id={`${nomeHorario}-erro`} className={estilos.erro}>
                <TriangleAlert aria-hidden="true" />
                {erros.horario}
              </p>
            )}
          </fieldset>

          <fieldset className={estilos.grupo}>
            <legend>Tipo de atendimento</legend>
            <div className={estilos.atendimentos}>
              {ATENDIMENTOS.map((atendimento) => (
                <label key={atendimento} className={estilos.chip}>
                  <input
                    type="radio"
                    name={nomeAtendimento}
                    value={atendimento}
                    checked={campos.atendimento === atendimento}
                    onChange={alterar('atendimento')}
                  />
                  <span>{atendimento}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Campo
            rotulo="Observações (opcional)"
            erro={erros.observacoes}
            dica={`${campos.observacoes.length}/${LIMITE_OBSERVACOES} caracteres`}
          >
            {(props) => <textarea {...props} value={campos.observacoes} onChange={alterar('observacoes')} />}
          </Campo>

          <div className={estilos.acoes}>
            <Botao type="submit" icone={CalendarCheck}>
              Agendar
            </Botao>
            <Botao variante="fantasma" onClick={() => despachar({ tipo: 'limpar' })}>
              Limpar
            </Botao>
          </div>

          <p className={estilos.confirmacao} role="status">
            {confirmada && (
              <>
                <Check aria-hidden="true" />
                Consulta agendada: {confirmada.pacienteId} · {confirmada.atendimento} · {formatarData(confirmada.data)} às{' '}
                {confirmada.horario}.
              </>
            )}
          </p>
        </form>

        <section className={estilos.painel} aria-labelledby="titulo-agenda">
          <header className={estilos.topoAgenda}>
            <h2 id="titulo-agenda">Próximos atendimentos</h2>
            <span>{agendadas} agendadas</span>
          </header>

          {porDia.length ? (
            porDia.map(([data, itens]) => (
              <div key={data} className={estilos.dia}>
                <h3>{[rotuloRelativo(data, hoje), formatarDia(data)].filter(Boolean).join(' · ')}</h3>
                <ul>
                  {itens.map((consulta) => {
                    const realizada = consulta.data < hoje
                    return (
                      <li key={consulta.id} className={realizada ? estilos.realizada : undefined}>
                        <span className={estilos.horaItem}>{consulta.horario}</span>
                        <span className={estilos.detalhes}>
                          <strong>{consulta.pacienteId}</strong>
                          <span>
                            {consulta.atendimento}
                            {consulta.observacoes && ` · ${consulta.observacoes}`}
                          </span>
                        </span>
                        {realizada ? (
                          <span className={estilos.selo}>Realizada</span>
                        ) : (
                          <Botao
                            variante="perigo"
                            tamanho="pequeno"
                            icone={X}
                            onClick={() => cancelar(consulta.id)}
                            aria-label={`Cancelar ${consulta.atendimento} de ${consulta.pacienteId} em ${formatarData(consulta.data)} às ${consulta.horario}`}
                          >
                            Cancelar
                          </Botao>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          ) : (
            <Vazio icone={CalendarX2} titulo="Nenhuma consulta na agenda.">
              Escolha um paciente e um horário ao lado.
            </Vazio>
          )}
        </section>
      </div>
    </>
  )
}
