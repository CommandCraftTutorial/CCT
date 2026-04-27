import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import GamePage from './pages/GamePage'
import StageClearPage from './pages/StageClearPage'
import StageListPage from './pages/StageListPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/clear" element={<StageClearPage />} />
      <Route path="/stages" element={<StageListPage />} />
    </Routes>
  )
}

export default App