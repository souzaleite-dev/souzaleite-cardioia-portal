import estilos from './Marca.module.css'

/** Logotipo do CardioIA: coração com traçado de ECG. */
export default function Marca() {
  return (
    <span className={estilos.marca}>
      <svg className={estilos.icone} viewBox="0 0 24 24" aria-hidden="true">
        <path
          className={estilos.coracao}
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
        <path className={estilos.ecg} d="M5 11.5h3l1.5-3 2.5 6 1.6-3H19" />
      </svg>
      CardioIA
    </span>
  )
}
