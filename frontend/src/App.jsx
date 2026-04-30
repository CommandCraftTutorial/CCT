import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import GamePage from './pages/GamePage'
import DifficultyPage from './pages/DifficultyPage'
import StageClearPage from './pages/StageClearPage'
import StageListPage from './pages/StageListPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/difficulty/:category" element={<DifficultyPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/clear" element={<StageClearPage />} />
      <Route path="/stages" element={<StageListPage />} />
    </Routes>
  )
}

export default App