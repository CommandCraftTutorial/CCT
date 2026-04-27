import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import GamePage from './pages/GamePage'
import StageClearPage from './pages/StageClearPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/clear" element={<StageClearPage />} />
    </Routes>
  )
}

export default App