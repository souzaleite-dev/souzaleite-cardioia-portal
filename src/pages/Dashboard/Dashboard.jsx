import { CalendarPlus, ChevronRight, Clock, Stethoscope, Users } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Botao from '../../components/Botao/Botao.jsx'
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina.jsx'
import { Esqueleto, MensagemErro, Vazio } from '../../components/Estado/Estado.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useConsultas } from '../../contexts/ConsultasContext.jsx'
import { ATENDIMENTOS } from '../../contexts/consultasReducer.js'
import { usePacientes } from '../../hooks/usePacientes.js'
import {
  diaDaSemana,
  formatarData,
  formatarDataLonga,
  formatarDia,
  hojeIso,
  horaDoDia,
  rotuloRelativo,
  somarDias,
} from '../../utils/datas.js'
import { tratamento } from '../../utils/nomes.js'
import estilos from './Dashboard.module.css'

const porcentagem = (parte, total) => (total ? Math.round((parte / total) * 100) : 0)
const saudacao = (hora) => (hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite')

export default function Dashboard() {
  const { usuario } = useAuth()
  const { consultas } = useConsultas()
  const { pacientes, carregando, erro, tentarNovamente } = usePacientes()
  const hoje = hojeIso()

  const futuras = useMemo(() => consultas.filter((consulta) => consulta.data >= hoje), [consultas, hoje])
  const paraHoje = futuras.filter((consulta) => consulta.data === hoje).length
  const [proxima, ...seguintes] = futuras

  const perfil = useMemo(() => {
    const contar = (condicao) => pacientes.filter(condicao).length
    return {
      total: pacientes.length,
      comDoenca: contar((p) => p.doencaCardiaca),
      mulheres: contar((p) => p.sexo === 'F'),
      fumantes: contar((p) => p.fumante),
      diabetes: contar((p) => p.diabetes),
      idadeMedia: pacientes.length ? Math.round(pacientes.reduce((soma, p) => soma + p.idade, 0) / pacientes.length) : 0,
    }
  }, [pacientes])

  const semana = Array.from({ length: 7 }, (_, i) => {
    const data = somarDias(hoje, i)
    return { data, total: futuras.filter((c) => c.data === data).length }
  })
  const porAtendimento = ATENDIMENTOS.map((tipo) => ({ tipo, total: futuras.filter((c) => c.atendimento === tipo).length }))
  const maior = Math.max(1, ...porAtendimento.map((item) => item.total))
  const parteDoenca = porcentagem(perfil.comDoenca, perfil.total)

  return (
    <>
      <CabecalhoPagina
        sobretitulo={formatarDataLonga()}
        titulo={`${saudacao(horaDoDia())}, ${tratamento(usuario.nome)}`}
        subtitulo={`${futuras.length} ${futuras.length === 1 ? 'consulta agendada' : 'consultas agendadas'}, ${paraHoje} para hoje.`}
      >
        <Botao como={Link} to="/agendamento" icone={CalendarPlus}>
          Nova consulta
        </Botao>
      </CabecalhoPagina>

      {erro && <MensagemErro mensagem={erro} aoTentarNovamente={tentarNovamente} />}

      <div className={estilos.grade}>
        <section className={`${estilos.painel} ${estilos.agenda}`} aria-labelledby="titulo-proxima">
          <header className={estilos.topoPainel}>
            <h2 id="titulo-proxima">
              <Clock aria-hidden="true" />
              Próxima consulta
            </h2>
            <Link to="/agendamento" className={estilos.verTudo}>
              Ver agenda
              <ChevronRight aria-hidden="true" />
            </Link>
          </header>

          {proxima ? (
            <div className={estilos.proxima}>
              <p className={estilos.hora}>{proxima.horario}</p>
              <p className={estilos.quando}>
                {[rotuloRelativo(proxima.data, hoje), formatarDia(proxima.data)].filter(Boolean).join(' · ')}
              </p>
              <p className={estilos.quem}>
                <strong>{proxima.pacienteId}</strong> · {proxima.atendimento}
              </p>
              {proxima.observacoes && <p className={estilos.observacao}>{proxima.observacoes}</p>}
            </div>
          ) : (
            <Vazio icone={CalendarPlus} titulo="Nenhuma consulta agendada.">
              <Botao como={Link} to="/agendamento" variante="secundario" tamanho="pequeno">
                Agendar a primeira
              </Botao>
            </Vazio>
          )}

          {seguintes.length > 0 && (
            <>
              <h3 className={estilos.subtitulo}>Em seguida</h3>
              <ol className={estilos.lista}>
                {seguintes.slice(0, 4).map((consulta) => (
                  <li key={consulta.id}>
                    <span className={estilos.listaHora}>{consulta.horario}</span>
                    <span className={estilos.listaData}>{formatarData(consulta.data)}</span>
                    <span className={estilos.listaQuem}>
                      <strong>{consulta.pacienteId}</strong> · {consulta.atendimento}
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className={estilos.semana}>
            <h3 className={estilos.subtitulo}>Próximos 7 dias</h3>
            <ol>
              {semana.map(({ data, total }) => (
                <li key={data} className={data === hoje ? estilos.hoje : undefined}>
                  <span>{diaDaSemana(data)}</span>
                  <strong>{Number(data.slice(8))}</strong>
                  <i aria-hidden="true">
                    {Array.from({ length: Math.min(total, 3) }, (_, n) => (
                      <b key={n} />
                    ))}
                  </i>
                  <span className="visualmente-oculto">
                    {total} {total === 1 ? 'consulta' : 'consultas'}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={estilos.painel} aria-labelledby="titulo-pacientes">
          <header className={estilos.topoPainel}>
            <h2 id="titulo-pacientes">
              <Users aria-hidden="true" />
              Pacientes monitorados
            </h2>
            <Link to="/pacientes" className={estilos.verTudo}>
              Ver lista
              <ChevronRight aria-hidden="true" />
            </Link>
          </header>

          {carregando ? (
            <Esqueleto texto="Carregando pacientes…" quantidade={3} altura="2.25rem" />
          ) : (
            <>
              <p className={estilos.total}>
                {perfil.total}
                <span>pacientes na base</span>
              </p>
              <div
                className={estilos.proporcao}
                role="img"
                aria-label={`${perfil.comDoenca} com doença cardíaca e ${perfil.total - perfil.comDoenca} sem`}
              >
                <span style={{ width: `${parteDoenca}%` }} />
              </div>
              <dl className={estilos.legenda}>
                <div>
                  <dt>
                    <i className={estilos.marcaDoenca} aria-hidden="true" />
                    Com doença cardíaca
                  </dt>
                  <dd>
                    {perfil.comDoenca} <small>{parteDoenca}%</small>
                  </dd>
                </div>
                <div>
                  <dt>
                    <i aria-hidden="true" />
                    Sem doença cardíaca
                  </dt>
                  <dd>{perfil.total - perfil.comDoenca}</dd>
                </div>
              </dl>
              <dl className={estilos.perfil}>
                <div>
                  <dt>Idade média</dt>
                  <dd>{perfil.idadeMedia} anos</dd>
                </div>
                <div>
                  <dt>Mulheres</dt>
                  <dd>{porcentagem(perfil.mulheres, perfil.total)}%</dd>
                </div>
                <div>
                  <dt>Fumantes</dt>
                  <dd>{porcentagem(perfil.fumantes, perfil.total)}%</dd>
                </div>
                <div>
                  <dt>Com diabetes</dt>
                  <dd>{porcentagem(perfil.diabetes, perfil.total)}%</dd>
                </div>
              </dl>
            </>
          )}
        </section>

        <section className={estilos.painel} aria-labelledby="titulo-tipos">
          <header className={estilos.topoPainel}>
            <h2 id="titulo-tipos">
              <Stethoscope aria-hidden="true" />
              Consultas por tipo
            </h2>
            <span className={estilos.contagem}>{futuras.length} agendadas</span>
          </header>
          <ul className={estilos.barras}>
            {porAtendimento.map(({ tipo, total }) => (
              <li key={tipo}>
                <span>{tipo}</span>
                <span className={estilos.trilho} aria-hidden="true">
                  <span style={{ width: `${(total / maior) * 100}%` }} />
                </span>
                <strong>{total}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
