import { RotateCcw, TriangleAlert } from 'lucide-react'
import Botao from '../Botao/Botao.jsx'
import estilos from './Estado.module.css'

/** Blocos que ocupam o lugar do conteúdo enquanto ele carrega. */
export function Esqueleto({ texto = 'Carregando…', quantidade = 3, altura = '3.5rem' }) {
  return (
    <div className={estilos.esqueleto} role="status" style={{ '--altura': altura }}>
      <span className="visualmente-oculto">{texto}</span>
      {Array.from({ length: quantidade }, (_, i) => (
        <span key={i} className={estilos.bloco} aria-hidden="true" />
      ))}
    </div>
  )
}

export function MensagemErro({ mensagem, aoTentarNovamente }) {
  return (
    <div className={estilos.erro} role="alert">
      <TriangleAlert aria-hidden="true" />
      <p>
        <strong>Não foi possível carregar os dados.</strong> {mensagem}
      </p>
      {aoTentarNovamente && (
        <Botao variante="secundario" tamanho="pequeno" icone={RotateCcw} onClick={aoTentarNovamente}>
          Tentar novamente
        </Botao>
      )}
    </div>
  )
}

export function Vazio({ icone: Icone, titulo, children }) {
  return (
    <div className={estilos.vazio}>
      {Icone && <Icone aria-hidden="true" />}
      <p className={estilos.tituloVazio}>{titulo}</p>
      {children}
    </div>
  )
}
