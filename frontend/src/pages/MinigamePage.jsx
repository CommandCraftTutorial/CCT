import { useNavigate } from 'react-router-dom'
import './MinigamePage.css'

export default function MinigamePage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const minigames = [
    {
      id: 'dungeon',
      icon: '🏰',
      title: '던전 탐험',
      label: 'LIVE',
      command: '--game dungeon',
      description: '숨겨진 파일을 찾아\n키를 획득하여 탈출하세요',
      color: 'CBA6F7',
      locked: false,
      path: '/dungeon',
    },
    {
      id: 'typing',
      icon: '⌨️',
      title: '타이핑 러시',
      label: 'COMING SOON',
      command: '--game typing-rush',
      description: '떨어지는 Git 명령어를\n빠르게 입력하여 파괴하세요',
      color: 'F9E2AF',
      locked: true,
      path: null,
    },
  ]

  const handleSelect = (game) => {
    if (game.locked) return
    navigate(game.path)
  }

  return (
    <div
      className="mg-page-root"
      style={{
        '--mg-main-color': '#CBA6F7',
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
            onClick={() => navigate('/mode')}
            aria-label="모드 선택으로 돌아가기"
          >
            ←
          </button>
        </div>
      </header>

      <main className="mg-page-main">
        <section className="mg-page-hero">
          <div className="mg-page-hero-icon">🎮</div>

          <p className="mg-page-kicker">MINIGAME SELECT</p>

          <h1 className="mg-page-title">
            Mini Game Training
          </h1>

          <p className="mg-page-command">
            $ start commandcraft --mode minigame
          </p>

          <p className="mg-page-subtitle">
            미니게임을 선택하고 CLI 명령어를 게임처럼 연습하세요.
          </p>
        </section>

        <section className="mg-page-grid">
          {minigames.map((game) => (
            <article
              key={game.id}
              className={`mg-page-card ${game.locked ? 'mg-page-card-locked' : ''}`}
              onClick={() => handleSelect(game)}
              style={{
                '--mg-card-color': `#${game.color}`,
              }}
            >
              <div className="mg-page-card-header">
                <div className="mg-page-card-command">
                  <span className="mg-page-status-dot"></span>
                  <span>$ start minigame {game.command}</span>
                </div>

                <span className="mg-page-label">
                  {game.label}
                </span>
              </div>

              <div className="mg-page-card-body">
                <div className="mg-page-card-icon">
                  {game.icon}
                </div>

                <h2 className="mg-page-card-title">
                  {game.title}
                </h2>

                <p className="mg-page-card-description">
                  {game.description}
                </p>
              </div>

              <button
                className="mg-page-select-button"
                disabled={game.locked}
              >
                {game.locked ? '잠김' : '선택 →'}
              </button>
            </article>
          ))}
        </section>
      </main>

      <footer className="mg-page-footer">
        💡 미니게임은 명령어 학습을 더 재미있게 만드는 실습 모드입니다.
      </footer>
    </div>
  )
}