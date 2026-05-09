import { useNavigate } from 'react-router-dom'
import './CategoryPage.css'

export default function CategoryPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const categories = [
    {
      id: 'git',
      title: 'Git',
      icon: '🌿',
      command: 'git init',
      description: 'Git 버전 관리 명령어를 배워보세요',
      color: 'A6E3A1',
      stages: '기초 10개 · 중급 10개 · 심화 10개',
      difficulty: 'BEGINNER',
    },
    {
      id: 'linux',
      title: 'Linux',
      icon: '🐧',
      command: 'ls -al',
      description: 'Linux 터미널 명령어를 배워보세요',
      color: '89B4FA',
      stages: '기초 5개 · 중급 5개 · 심화 5개',
      difficulty: 'BASIC',
    },
    {
      id: 'gdb',
      title: 'GDB',
      icon: '🔍',
      command: 'gdb ./main',
      description: 'GNU 디버거 사용법을 배워보세요',
      color: 'F38BA8',
      stages: '기초 5개 · 중급 5개 · 심화 3개',
      difficulty: 'DEBUG',
    },
    {
      id: 'pdb',
      title: 'PDB',
      icon: '🐍',
      command: 'python -m pdb',
      description: 'Python 디버거 사용법을 배워보세요',
      color: 'F9E2AF',
      stages: '기초 5개 · 중급 5개 · 심화 3개',
      difficulty: 'PYTHON',
    },
  ]

  return (
    <div className="category-page">
      <header className="cct-header">
        <div className="cct-brand">
          <span className="cct-prompt">&gt;_</span>
          <span className="cct-logo">CommandCraftTutorial</span>
        </div>

        <div className="cct-header-right">
          <button
            className="cct-pill category-ranking-button"
            onClick={() => navigate('/leaderboard')}
          >
            🏆 Ranking
          </button>

          <div className="cct-pill">
            <span>👤</span>
            <span>{user.username || 'player01'}</span>
          </div>
        </div>
      </header>

      <main className="category-main">
        <section className="category-hero">
          <p className="category-kicker">COMMAND TRAINING HUB</p>
          <h1 className="category-title">
            Select Your Command Field
          </h1>
          <p className="category-subtitle">
            학습할 명령어 분야를 선택하고 미션을 시작하세요.
          </p>
        </section>

        <section className="category-grid">
          {categories.map((cat) => (
            <article
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/difficulty/${cat.id}`)}
              style={{
                '--category-color': `#${cat.color}`,
              }}
            >
              <div className="category-card-header">
                <div className="category-card-command">
                  <span className="category-status-dot"></span>
                  <span>$ {cat.command}</span>
                </div>

                <span className="category-difficulty">
                  {cat.difficulty}
                </span>
              </div>

              <div className="category-card-body">
                <div className="category-icon">
                  {cat.icon}
                </div>

                <div className="category-card-text">
                  <h2 className="category-card-title">
                    {cat.title}
                  </h2>

                  <p className="category-description">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="category-stage-info">
                <span>📋 Stage Log</span>
                <strong>{cat.stages}</strong>
              </div>

              <button className="category-start-button">
                🎮 미션 선택하기
              </button>
            </article>
          ))}
        </section>
      </main>

      <footer className="category-footer">
        💡 카테고리를 선택하면 난이도 선택 화면으로 이동합니다.
      </footer>
    </div>
  )
}