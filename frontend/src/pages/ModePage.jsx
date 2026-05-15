import { useNavigate } from 'react-router-dom'
import './ModePage.css'

export default function ModePage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="mode-page">
      {/* 헤더 */}
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

      {/* 메인 */}
      <main className="mode-main">
        <section className="mode-hero">
          <p className="mode-kicker">SELECT MODE</p>
          <h1 className="mode-title">모드를 선택하세요</h1>
          <p className="mode-subtitle">
            {/* 💡 문구에 미니 게임도 살짝 녹여줬습니다 */}
            학습 모드로 명령어를 배우고, 경쟁 모드와 미니 게임으로 실력을 증명하세요.
          </p>
        </section>

        <section className="mode-cards">
          {/* 학습 모드 */}
          <div
            className="mode-card mode-card--study"
            onClick={() => navigate('/category')}
          >
            <div className="mode-card-icon">📚</div>
            <h2 className="mode-card-title">학습 모드</h2>
            <p className="mode-card-desc">
              카테고리와 난이도를 선택해서<br />
              단계별로 명령어를 학습하세요.
            </p>
            <ul className="mode-card-features">
              <li>✅ Git / Linux / GDB / PDB</li>
              <li>✅ 기초 / 중급 / 심화 난이도</li>
              <li>✅ 힌트 제공</li>
              <li>✅ 진행상황 저장</li>
            </ul>
            <button className="mode-card-button mode-card-button--study">
              학습 시작하기 →
            </button>
          </div>

          {/* 경쟁 모드 */}
          <div
            className="mode-card mode-card--competition"
            onClick={() => navigate('/competition')}
          >
            <div className="mode-card-icon">⚔️</div>
            <h2 className="mode-card-title">경쟁 모드</h2>
            <p className="mode-card-desc">
              랜덤 명령어를 맞추고<br />
              랭킹에서 실력을 겨뤄보세요.
            </p>
            <ul className="mode-card-features">
              <li>🎯 랜덤 명령어 출제</li>
              <li>🏆 실시간 랭킹 반영</li>
              <li>⏱️ 제한 시간 내 풀기</li>
              <li>🔥 콤보 보너스 점수</li>
            </ul>
            <button className="mode-card-button mode-card-button--competition">
              경쟁 시작하기 →
            </button>
          </div>

          {/* ⭐ 3. 미니 게임 모드 추가 */}
          <div
            className="mode-card mode-card--minigame"
            onClick={() => navigate('/minigames')} // 나중에 허브 페이지를 만들면 '/minigame'으로 변경 가능
          >
            <div className="mode-card-icon">🏰</div>
            <h2 className="mode-card-title">미니 게임</h2>
            <p className="mode-card-desc">
              색다른 게임 룰 속에서<br />
              Git 커맨드로 난관을 극복하세요.
            </p>
            <ul className="mode-card-features">
              <li>👾 몬스터 처치 던전 크롤러</li>
              <li>⚔️ 명령어 입력으로 턴제 전투</li>
              <li>💎 던전 클리어 보상</li>
              <li>🆕 다양한 모드 추가 예정</li>
            </ul>
            <button className="mode-card-button mode-card-button--minigame">
              게임 입장하기 →
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}