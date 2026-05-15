import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ModePage from './pages/ModePage'
import CategoryPage from './pages/CategoryPage'
import GamePage from './pages/GamePage'
import DifficultyPage from './pages/DifficultyPage'
import StageClearPage from './pages/StageClearPage'
import StageListPage from './pages/StageListPage'
import LeaderboardPage from './pages/LeaderboardPage'
import CompetitionPage from './pages/CompetitionPage'
import DungeonPage from './pages/DungeonPage'
import MinigamePage from './pages/MinigamePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/mode" element={<ModePage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/difficulty/:category" element={<DifficultyPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/clear" element={<StageClearPage />} />
      <Route path="/stages" element={<StageListPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/competition" element={<CompetitionPage />} />
      <Route path="/dungeon" element={<DungeonPage />} />
      <Route path="/minigames" element={<MinigamePage />} />
    </Routes>
  )
}

export default App