import { useNavigate, useLocation } from 'react-router-dom'
import './StageClearPage.css'

export default function StageClearPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const total = location.state?.total || 5
  const finalScore = location.state?.finalScore || 0

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleRestart = () => {
    navigate('/category')
  }

  return (
    <div className="clear-page">
      <main className="clear-content">
        <section className="clear-hero">
          <div className="clear-trophy">🏆</div>

          <p className="clear-kicker">MISSION RESULT</p>

          <h1 className="clear-title">
            MISSION COMPLETE
          </h1>

          <p className="clear-subtitle">
            모든 스테이지를 완료했습니다!
          </p>
        </section>

        <section className="clear-score-card">
          <div className="clear-card-header">
            <span className="clear-status-dot"></span>
            <span>$ mission --complete</span>
          </div>

          <div className="score-row">
            <span className="score-label">플레이어</span>
            <span className="score-value">👤 {user.username || 'player01'}</span>
          </div>

          <div className="score-row">
            <span className="score-label">완료 스테이지</span>
            <span className="stage-clear-value">{total} / {total}</span>
          </div>

          <div className="score-row final-row">
            <span className="score-label">최종 점수</span>
            <span className="final-score">🏆 {finalScore} XP</span>
          </div>
        </section>

        <div className="clear-buttons">
          <button
            className="clear-secondary-button"
            onClick={handleRestart}
          >
            🎮 스테이지 선택
          </button>

          <button
            className="clear-primary-button"
            onClick={() => navigate('/game')}
          >
            🔄 다시하기
          </button>
        </div>

        <p className="clear-footer-text">
          💡 CommandCraftTutorial 미션을 다시 선택하거나 같은 미션을 다시 연습할 수 있습니다.
        </p>
      </main>
    </div>
  )
}