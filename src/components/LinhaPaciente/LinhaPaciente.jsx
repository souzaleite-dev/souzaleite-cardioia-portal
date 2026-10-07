import { ArrowDown, ArrowUp, CalendarPlus, HeartPulse } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SEXO } from '../../services/pacientesApi.js'
import Botao from '../Botao/Botao.jsx'
import estilos from './LinhaPaciente.module.css'
import { MEDIDAS } from './medidas.js'

/** Uma linha da lista de pacientes: identificação, quatro sinais, situação e atalho para agendar. */
export default function LinhaPaciente({ paciente }) {
  const fatores = [paciente.fumante && 'fumante', paciente.diabetes && 'diabetes'].filter(Boolean)

  return (
    <li className={estilos.linha}>
      <div className={estilos.paciente}>
        <strong>{paciente.id}</strong>
        <span>
          {paciente.idade} anos · {SEXO[paciente.sexo]}
          {fatores.length > 0 && ` · ${fatores.join(' · ')}`}
        </span>
      </div>

      {MEDIDAS.map((medida) => {
        const fora = medida.fora(paciente)
        const Seta = fora === 'acima' ? ArrowUp : ArrowDown
        return (
          <div key={medida.chave} className={estilos.medida}>
            <span className={estilos.rotulo}>
              <i style={{ '--cor': medida.cor }} aria-hidden="true" />
              {medida.rotulo}
            </span>
            <span className={`${estilos.valor} ${fora ? estilos.fora : ''}`}>
              {medida.valor(paciente)}
              <small>{medida.unidade}</small>
              {fora && <Seta aria-hidden="true" />}
              {fora && <span className="visualmente-oculto"> ({fora} da referência)</span>}
            </span>
          </div>
        )
      })}

      <div className={estilos.situacao}>
        {paciente.doencaCardiaca ? (
          <span className={estilos.comDoenca}>
            <HeartPulse aria-hidden="true" />
            Doença cardíaca
          </span>
        ) : (
          <span className={estilos.semDoenca}>Sem doença</span>
        )}
      </div>

      <div className={estilos.acao}>
        <Botao
          como={Link}
          to={`/agendamento?paciente=${paciente.id}`}
          variante="fantasma"
          tamanho="pequeno"
          icone={CalendarPlus}
          aria-label={`Agendar consulta para ${paciente.id}`}
        >
          Agendar
        </Botao>
      </div>
    </li>
  )
}
