import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStages } from '../services/api'
import './StageListPage.css'

export default function StageListPage() {
  const [stages, setStages] = useState([])
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!user.id) {
      navigate('/')
      return
    }

    getStages().then(res => setStages(res.data))
  }, [navigate, user.id])

  const isCleared = (stageId) => stageId < (user.current_stage || 1)
  const isCurrent = (stageId) => stageId === (user.current_stage || 1)
  const isLocked = (stageId) => stageId > (user.current_stage || 1)

  return (
    <div className="stage-list-page">
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

          <div className="cct-pill stage-list-score-pill">
            <span>🏆</span>
            <span>{user.score || 0} XP</span>
          </div>

          <button
            className="cct-icon-button cct-back-button"
            onClick={() => navigate('/game')}
            aria-label="게임 화면으로 돌아가기"
          >
            ←
          </button>
        </div>
      </header>

      <main className="stage-list-main">
        <section className="stage-list-hero">
          <p className="stage-list-kicker">STAGE LOG</p>

          <h1 className="stage-list-title">
            📋 스테이지 목록
          </h1>

          <p className="stage-list-command">
            $ stage --list
          </p>

          <p className="stage-list-description">
            스테이지를 선택해서 CommandCraftTutorial 미션을 진행하세요.
          </p>
        </section>

        <section className="stage-card-list">
          {stages.map((stage, index) => {
            const cleared = isCleared(stage.id)
            const current = isCurrent(stage.id)
            const locked = isLocked(stage.id)

            return (
              <article
                key={stage.id}
                className={[
                  'stage-card',
                  cleared ? 'cleared' : '',
                  current ? 'current' : '',
                  locked ? 'locked' : '',
                ].join(' ')}
                onClick={() => {
                  if (!locked) {
                    navigate('/game', { state: { stageId: stage.id } })
                  }
                }}
              >
                <div className={`stage-number-box ${cleared || current ? 'active' : ''}`}>
                  {cleared ? '✓' : String(index + 1).padStart(2, '0')}
                </div>

                <div className="stage-card-content">
                  <div className="stage-card-title-row">
                    <span className="stage-card-title">
                      {stage.title}
                    </span>

                    <span
                      className={`stage-difficulty-badge ${
                        stage.difficulty === '기초' ? 'basic' : 'normal'
                      }`}
                    >
                      {stage.difficulty}
                    </span>
                  </div>

                  <p className="stage-card-mission">
                    {stage.mission}
                  </p>
                </div>

                <div className="stage-status">
                  {cleared && (
                    <span className="status-cleared">완료 ✓</span>
                  )}

                  {current && (
                    <span className="status-current">진행중 ▶</span>
                  )}

                  {locked && (
                    <span className="status-locked">🔒 잠금</span>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      </main>

      <footer className="stage-list-footer">
        <button
          className="continue-button"
          onClick={() => navigate('/game')}
        >
          🎮 현재 스테이지 계속하기
        </button>
      </footer>
    </div>
  )
}