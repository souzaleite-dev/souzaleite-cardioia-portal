import { Link } from 'react-router-dom'
import Botao from '../../components/Botao/Botao.jsx'
import Marca from '../../components/Marca/Marca.jsx'
import estilos from './NaoEncontrada.module.css'

export default function NaoEncontrada() {
  return (
    <main className={estilos.pagina}>
      <Marca />
      <h1>Página não encontrada</h1>
      <p>O endereço pode ter mudado ou não existe.</p>
      <Botao como={Link} to="/">
        Voltar ao início
      </Botao>
    </main>
  )
}
