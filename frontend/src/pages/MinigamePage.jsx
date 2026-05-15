import { useNavigate } from 'react-router-dom'
import './MinigamePage.css' // 아래에 추가해드릴 CSS와 매칭됩니다.

export default function MinigamePage() {
  const navigate = useNavigate()

  return (
    <div className="minigame-page">
      <header className="mg-header">
        <div className="mg-brand">
          <span className="mg-prompt">&gt;_</span>
          <span className="mg-logo">CommandCraftTutorial</span>
        </div>

        <div className="mg-header-right">
          <button
            className="mg-icon-button mg-back-button"
            onClick={() => navigate('/mode')}
            aria-label="카테고리로 돌아가기"
          >
            ←
          </button>
        </div>
      </header>

      {/* 메인 영역 */}
      <main className="mg-main">
        <section className="mg-hero">
          <p className="mg-kicker">MINI GAMES</p>
          <h1 className="mg-title">미니게임을 선택하세요</h1>
          <p className="mg-subtitle">
            Git 명령어를 활용한 다양한 미니게임으로 재미있게 실력을 키워보세요.
          </p>
        </section>

        {/* 미니게임 리스트 */}
        <section className="mg-list">
          
          {/* 1. 던전 게임 카드 */}
          <div 
            className="mg-card mg-card--active"
            onClick={() => navigate('/dungeon')}
          >
            <div className="mg-card-badge">LIVE</div>
            <div className="mg-card-icon">👾</div>
            <div className="mg-card-content">
              <h2 className="mg-card-title">던전 탐험</h2>
              <p className="mg-card-desc">
                숨겨진 파일을 찾아 키를 획득하여 탈출하세요
              </p>
            </div>
            <button className="mg-card-btn">던전 입장 →</button>
          </div>

          {/* 2. 준비 중인 미니게임 카드 (확장성 보여주기용) */}
          <div className="mg-card mg-card--locked">
            <div className="mg-card-badge mg-card-badge--coming">COMING SOON</div>
            <div className="mg-card-icon">⌨️</div>
            <div className="mg-card-content">
              <h2 className="mg-card-title">타이핑 러시 (준비 중)</h2>
              <p className="mg-card-desc">
                화면 아래로 떨어지는 Git 명령어들을 텍스트가 땅에 닿기 전에 빠르게 타이핑하여 파괴하는 스피드 게임입니다.
              </p>
            </div>
            <button className="mg-card-btn" disabled>잠김</button>
          </div>

        </section>
      </main>
    </div>
  )
}