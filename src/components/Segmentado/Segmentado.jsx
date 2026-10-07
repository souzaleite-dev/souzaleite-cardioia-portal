import { useId } from 'react'
import estilos from './Segmentado.module.css'

/** Controle segmentado feito de rádios nativos: uma opção ativa entre poucas. */
export default function Segmentado({ rotulo, opcoes, valor, aoMudar, rotuloOculto = false }) {
  const nome = useId()

  return (
    <fieldset className={estilos.grupo}>
      <legend className={rotuloOculto ? 'visualmente-oculto' : estilos.rotulo}>{rotulo}</legend>
      <div className={estilos.trilho}>
        {opcoes.map((opcao) => (
          <label key={opcao.valor} className={estilos.opcao}>
            <input
              type="radio"
              name={nome}
              value={opcao.valor}
              checked={valor === opcao.valor}
              onChange={() => aoMudar(opcao.valor)}
            />
            <span>{opcao.rotulo}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
