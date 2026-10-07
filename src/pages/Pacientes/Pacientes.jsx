import { ArrowDown, ArrowUp, Search, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import Botao from '../../components/Botao/Botao.jsx'
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina.jsx'
import Campo from '../../components/Campo/Campo.jsx'
import { Esqueleto, MensagemErro, Vazio } from '../../components/Estado/Estado.jsx'
import LinhaPaciente from '../../components/LinhaPaciente/LinhaPaciente.jsx'
import { MEDIDAS } from '../../components/LinhaPaciente/medidas.js'
import Segmentado from '../../components/Segmentado/Segmentado.jsx'
import { usePacientes } from '../../hooks/usePacientes.js'
import estilos from './Pacientes.module.css'

const SEM_FILTROS = { busca: '', sexo: 'todos', situacao: 'todas' }
const SITUACOES = [
  { valor: 'todas', rotulo: 'Todos' },
  { valor: 'com-doenca', rotulo: 'Com doença cardíaca' },
  { valor: 'sem-doenca', rotulo: 'Sem doença' },
]
const SEXOS = [
  { valor: 'todos', rotulo: 'Ambos os sexos' },
  { valor: 'F', rotulo: 'Feminino' },
  { valor: 'M', rotulo: 'Masculino' },
]

export default function Pacientes() {
  const { pacientes, carregando, erro, tentarNovamente } = usePacientes()
  const [filtros, setFiltros] = useState(SEM_FILTROS)

  const visiveis = useMemo(() => {
    const busca = filtros.busca.trim().toUpperCase()
    return pacientes.filter(
      (p) =>
        p.id.includes(busca) &&
        (filtros.sexo === 'todos' || p.sexo === filtros.sexo) &&
        (filtros.situacao === 'todas' || p.doencaCardiaca === (filtros.situacao === 'com-doenca')),
    )
  }, [pacientes, filtros])

  const filtrar = (campo, valor) => setFiltros((atuais) => ({ ...atuais, [campo]: valor }))

  return (
    <>
      <CabecalhoPagina
        titulo="Pacientes"
        subtitulo="30 pacientes da base sintética do CardioIA (Fase 1), identificados só por pseudônimo."
      />

      <div className={estilos.filtros} role="search">
        <div className={estilos.busca}>
          <Campo rotulo="Buscar paciente por ID" rotuloOculto>
            {(props) => (
              <>
                <Search className={estilos.lupa} aria-hidden="true" />
                <input
                  {...props}
                  type="search"
                  placeholder="Buscar por ID, ex.: 0007"
                  value={filtros.busca}
                  onChange={(e) => filtrar('busca', e.target.value)}
                />
              </>
            )}
          </Campo>
        </div>
        <Segmentado
          rotulo="Situação"
          rotuloOculto
          opcoes={SITUACOES}
          valor={filtros.situacao}
          aoMudar={(valor) => filtrar('situacao', valor)}
        />
        <Segmentado rotulo="Sexo" rotuloOculto opcoes={SEXOS} valor={filtros.sexo} aoMudar={(valor) => filtrar('sexo', valor)} />
      </div>

      {erro && <MensagemErro mensagem={erro} aoTentarNovamente={tentarNovamente} />}

      {!erro && (
        <>
          <div className={estilos.resumo}>
            <p aria-live="polite">{carregando ? 'Carregando pacientes…' : `${visiveis.length} de ${pacientes.length} pacientes`}</p>
            <p className={estilos.chave}>
              <ArrowUp aria-hidden="true" />
              <ArrowDown aria-hidden="true" />
              fora da faixa de referência
            </p>
          </div>

          <div className={estilos.lista}>
            <div className={estilos.cabecalho} aria-hidden="true">
              <span>Paciente</span>
              {MEDIDAS.map((medida) => (
                <span key={medida.chave}>
                  <i style={{ '--cor': medida.cor }} />
                  {medida.rotulo}
                </span>
              ))}
              <span>Situação</span>
              <span />
            </div>

            {carregando ? (
              <div className={estilos.carregando}>
                <Esqueleto texto="Carregando pacientes…" quantidade={6} altura="2.75rem" />
              </div>
            ) : visiveis.length ? (
              <ul className={estilos.linhas}>
                {visiveis.map((paciente) => (
                  <LinhaPaciente key={paciente.id} paciente={paciente} />
                ))}
              </ul>
            ) : (
              <Vazio icone={UserRound} titulo="Nenhum paciente com esses filtros.">
                <Botao variante="secundario" tamanho="pequeno" onClick={() => setFiltros(SEM_FILTROS)}>
                  Limpar filtros
                </Botao>
              </Vazio>
            )}
          </div>
        </>
      )}
    </>
  )
}
