import { LoaderCircle } from 'lucide-react'
import estilos from './Botao.module.css'

/**
 * Botão do sistema: variantes primario, secundario, fantasma, perigo e link; tamanhos normal e pequeno.
 * `como` troca o elemento (ex.: <Botao como={Link} to="/">) mantendo a aparência.
 */
export default function Botao({
  como: Elemento = 'button',
  variante = 'primario',
  tamanho = 'normal',
  icone: Icone,
  carregando = false,
  className = '',
  children,
  ...props
}) {
  const padrao = Elemento === 'button' ? { type: 'button' } : {}
  const classes = [estilos.botao, estilos[variante], tamanho === 'pequeno' && estilos.pequeno, className]
    .filter(Boolean)
    .join(' ')

  return (
    <Elemento {...padrao} {...props} className={classes} aria-busy={carregando || undefined}>
      {carregando ? <LoaderCircle className={estilos.girando} aria-hidden="true" /> : Icone && <Icone aria-hidden="true" />}
      {children}
    </Elemento>
  )
}
