import { useNavigate, useParams } from 'react-router-dom'
import './DifficultyPage.css'

export default function DifficultyPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const categoryInfo = {
    git: { title: 'Git', icon: '🌿', color: 'A6E3A1', command: 'git init' },
    linux: { title: 'Linux', icon: '🐧', color: '89B4FA', command: 'ls -al' },
    gdb: { title: 'GDB', icon: '🔍', color: 'F38BA8', command: 'gdb ./main' },
    pdb: { title: 'PDB', icon: '🐍', color: 'F9E2AF', command: 'python -m pdb' },
  }

  const info = categoryInfo[category]

  const difficulties = [
    {
      id: '기초',
      icon: '🟢',
      title: '기초',
      label: 'BEGINNER',
      command: '--level basic',
      description: '처음 시작하는 분들을 위한\n기본 명령어 학습',
      color: 'A6E3A1',
    },
    {
      id: '중급',
      icon: '🟡',
      title: '중급',
      label: 'INTERMEDIATE',
      command: '--level normal',
      description: '기초를 익힌 분들을 위한\n심화 명령어 학습',
      color: 'F9E2AF',
    },
    {
      id: '심화',
      icon: '🔴',
      title: '심화',
      label: 'ADVANCED',
      command: '--level hard',
      description: '고급 사용자를 위한\n실전 명령어 학습',
      color: 'F38BA8',
    },
  ]

  const handleSelect = (difficulty) => {
    localStorage.setItem('gameConfig', JSON.stringify({ category, difficulty }))
    navigate('/game')
  }

  return (
    <div
      className="difficulty-page"
      style={{
        '--category-color': `#${info?.color || 'A6E3A1'}`,
      }}
    >
      <header className="cct-header">
        <div className="cct-brand">
          <span className="cct-prompt">&gt;_</span>
          <span className="cct-logo">CommandCraftTutorial</span>
        </div>

        <div className="cct-header-right">
          <div className="cct-pill">
            <span>👤</span>
            <span>{user.username || 'player01'}</span>
          </div>

          <button
            className="cct-icon-button cct-back-button"
            onClick={() => navigate('/category')}
            aria-label="카테고리로 돌아가기"
          >
            ←
          </button>
        </div>
      </header>

      <main className="difficulty-main">
        <section className="difficulty-hero">
          <div className="difficulty-category-icon">
            {info?.icon}
          </div>

          <p className="difficulty-kicker">DIFFICULTY SELECT</p>

          <h1 className="difficulty-title">
            {info?.title || 'Command'} Training
          </h1>

          <p className="difficulty-command">
            $ {info?.command || 'select command'} {category && `--category ${category}`}
          </p>

          <p className="difficulty-subtitle">
            난이도를 선택하고 CommandCraftTutorial 미션을 시작하세요.
          </p>
        </section>

        <section className="difficulty-grid">
          {difficulties.map((diff) => (
            <article
              key={diff.id}
              className="difficulty-card"
              onClick={() => handleSelect(diff.id)}
              style={{
                '--difficulty-color': `#${diff.color}`,
              }}
            >
              <div className="difficulty-card-header">
                <div className="difficulty-card-command">
                  <span className="difficulty-status-dot"></span>
                  <span>$ start mission {diff.command}</span>
                </div>

                <span className="difficulty-label">
                  {diff.label}
                </span>
              </div>

              <div className="difficulty-card-body">
                <div className="difficulty-icon">
                  {diff.icon}
                </div>

                <h2 className="difficulty-card-title">
                  {diff.title}
                </h2>

                <p className="difficulty-description">
                  {diff.description}
                </p>
              </div>

              <button className="difficulty-select-button">
                선택 →
              </button>
            </article>
          ))}
        </section>
      </main>

      <footer className="difficulty-footer">
        💡 난이도를 선택하면 해당 카테고리의 게임 미션으로 이동합니다.
      </footer>
    </div>
  )
}