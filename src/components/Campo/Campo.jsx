import { TriangleAlert } from 'lucide-react'
import { useId } from 'react'
import estilos from './Campo.module.css'

/**
 * Rótulo + controle + mensagem, ligados por id (o leitor de tela anuncia o erro junto do campo).
 * Uso: <Campo rotulo="E-mail" erro={erro}>{(props) => <input {...props} />}</Campo>
 */
export default function Campo({ rotulo, erro, dica, rotuloOculto = false, children }) {
  const id = useId()
  const idMensagem = `${id}-mensagem`
  const mensagem = erro || dica

  return (
    <div className={estilos.campo}>
      <label className={rotuloOculto ? 'visualmente-oculto' : estilos.rotulo} htmlFor={id}>
        {rotulo}
      </label>
      {children({
        id,
        className: estilos.controle,
        'aria-invalid': erro ? true : undefined,
        'aria-describedby': mensagem ? idMensagem : undefined,
      })}
      {mensagem && (
        <p id={idMensagem} className={erro ? estilos.erro : estilos.dica}>
          {erro && <TriangleAlert aria-hidden="true" />}
          {mensagem}
        </p>
      )}
    </div>
  )
}
