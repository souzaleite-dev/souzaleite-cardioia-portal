import estilos from './CabecalhoPagina.module.css'

/** Título da página com subtítulo opcional e área de ações à direita (children). */
export default function CabecalhoPagina({ sobretitulo, titulo, subtitulo, children }) {
  return (
    <header className={estilos.cabecalho}>
      <div className={estilos.textos}>
        {sobretitulo && <p className={estilos.sobretitulo}>{sobretitulo}</p>}
        <h1>{titulo}</h1>
        {subtitulo && <p className={estilos.subtitulo}>{subtitulo}</p>}
      </div>
      {children && <div className={estilos.acoes}>{children}</div>}
    </header>
  )
}
