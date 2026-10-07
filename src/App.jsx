import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import RotaPrivada from './components/RotaPrivada.jsx'
import Agendamento from './pages/Agendamento/Agendamento.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Login from './pages/Login/Login.jsx'
import NaoEncontrada from './pages/NaoEncontrada/NaoEncontrada.jsx'
import Pacientes from './pages/Pacientes/Pacientes.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RotaPrivada />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="agendamento" element={<Agendamento />} />
        </Route>
      </Route>
      <Route path="*" element={<NaoEncontrada />} />
    </Routes>
  )
}
