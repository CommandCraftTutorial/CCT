import { useNavigate } from 'react-router-dom'
import './ModePage.css'

export default function ModePage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="mode-page">
      <header className="cct-header">
        <div className="cct-brand">
          <span className="cct-prompt">&gt;_</span>
          <span className="cct-logo">CommandCraftTutorial</span>
        </div>

        <div className="cct-pill">
          <span>👤</span>
          <span>{user.username}</span>
        </div>
      </header>

      <main className="mode-main">
        <section className="mode-hero">
          <p className="mode-kicker">COMMAND MODE HUB</p>
          <h1 className="mode-title">Select Your Play Mode</h1>
          <p className="mode-subtitle">
            학습 방식과 플레이 스타일을 선택하고 명령어 훈련을 시작하세요.
          </p>
        </section>

        <section className="mode-grid">
          <article
            className="mode-card mode-card--study"
            onClick={() => navigate('/category')}
          >
            <div className="mode-card-command">
              <span className="mode-dot" />
              <span>$ start study</span>
              <span className="mode-badge">LEARN</span>
            </div>

            <div className="mode-card-body">
              <div className="mode-icon-box">📚</div>
              <div>
                <h2>Study Mode</h2>
                <p>카테고리와 난이도를 선택해서 단계별로 명령어를 학습하세요.</p>
              </div>
            </div>

            <div className="mode-log-box">
              <span>📋 Mode Log</span>
              <p>Git · Linux · GDB · PDB 명령어 학습</p>
            </div>

            <button className="mode-action-button">📚 학습 시작하기</button>
          </article>

          <article
            className="mode-card mode-card--competition"
            onClick={() => navigate('/competition')}
          >
            <div className="mode-card-command">
              <span className="mode-dot" />
              <span>$ start competition</span>
              <span className="mode-badge">RANK</span>
            </div>

            <div className="mode-card-body">
              <div className="mode-icon-box">⚔️</div>
              <div>
                <h2>Competition</h2>
                <p>랜덤 명령어를 제한 시간 안에 풀고 랭킹에서 실력을 겨뤄보세요.</p>
              </div>
            </div>

            <div className="mode-log-box">
              <span>📋 Mode Log</span>
              <p>랜덤 출제 · 실시간 랭킹 · 콤보 보너스</p>
            </div>

            <button className="mode-action-button">⚔️ 경쟁 시작하기</button>
          </article>
        </section>

        <section className="minigame-section">
          <article
            className="minigame-card"
            onClick={() => navigate('/minigames')}
          >
            <div className="mode-card-command minigame-command">
              <span className="mode-dot" />
              <span>$ enter dungeon</span>
              <span className="mode-badge">MINI GAME</span>
            </div>

            <div className="minigame-left">
              <div className="minigame-body">
                <div className="mode-icon-box">🎮</div>
                <div>
                  <h2>Mini Game</h2>
                  <p>
                    색다른 게임 룰 속에서 Git 커맨드로 몬스터를 처치하고 던전을 클리어하세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="minigame-right">
              <div className="mode-log-box">
                <span>📋 Dungeon Log</span>
                <p>턴제 전투 · 명령어 입력 · 클리어 보상 · 추가 모드 예정</p>
              </div>

              <button className="mode-action-button">🎮 게임 입장하기</button>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}