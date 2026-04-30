import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Terminal from '../components/Terminal/Terminal'
import { getStage, submitCommand, updateProgress } from '../services/api'
import { useLocation } from 'react-router-dom'
import './GamePage.css'

export default function GamePage() {
  const [stage, setStage] = useState(null)
  const [stageId, setStageId] = useState(1)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
  const [overlay, setOverlay] = useState(null)

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // gameConfig 불러오기
  const gameConfig = JSON.parse(localStorage.getItem('gameConfig') || '{"category":"git","difficulty":"기초"}')
  // stageIds 상태 추가
  const [stageIds, setStageIds] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!user.id) {
      navigate('/')
      return
    }
    // 카테고리 + 난이도로 스테이지 목록 가져오기
    fetch(`http://localhost:3000/api/stages/category/${gameConfig.category}?difficulty=${gameConfig.difficulty}`)
      .then(res => res.json())
      .then(data => {
        setStageIds(data.map(s => s.id))
        if (data.length > 0) {
          getStage(data[0].id).then(res => {
            setStage(res.data))
            setShowHint(false)
            setWrongCount(0)
          })
          setStageId(data[0].id)
        }
      })
  }, [gameConfig.category, gameConfig.difficulty, stageId, navigate, user.id])

  const handleCommand = async (command, term) => {
    try {
      const { data } = await submitCommand(stageId, command, user.id)
      term.writeln(data.output)

      if (data.passed) {
        const newScore = score + 100
        setScore(newScore)

        const nextIndex = currentIndex + 1


        await updateProgress(user.id, data.nextStageId, newScore)

        setOverlay('success')
        setTimeout(() => setOverlay(null), 600)

        if (nextIndex < stageIds.length) {
          term.writeln('🎉 성공! 다음 스테이지로 이동합니다...')
          setTimeout(() => {
            setCurrentIndex(nextIndex)
            setStageId(stageIds[nextIndex])
            getStage(stageIds[nextIndex]).then(res => setStage(res.data))
            setShowHint(false)
            setWrongCount(0)
          }, 1500)
        } else {
          term.writeln('🏆 모든 스테이지를 완료했습니다!')
          setTimeout(() => navigate('/clear'), 2000)
        }
      } else {
        setWrongCount(prev => prev + 1)

        setOverlay('fail')
        setTimeout(() => setOverlay(null), 600)

        term.writeln('❌ 틀렸습니다. 힌트 버튼을 눌러보세요!')
      }
    } catch (err) {
      term.writeln('❌ 서버 오류가 발생했습니다.')
    }
  }

  return (
    <div className="game-page">
      {overlay && (
        <div className={`game-overlay ${overlay}`} />
      )}

      {showHint && (
        <div className="hint-backdrop" onClick={() => setShowHint(false)}>
          <div className="hint-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hint-header">
              <span className="hint-title">💡 힌트</span>
              <button className="hint-close-button" onClick={() => setShowHint(false)}>
                ✕
              </button>
            </div>

            <div className="hint-divider" />

            <p className="hint-content">
              {stage?.hint}
            </p>

            <button className="hint-confirm-button" onClick={() => setShowHint(false)}>
              닫기
            </button>
          </div>
        </div>
      )}

      <header className="game-header">
        <span className="game-logo">🖥️ CLI Tutorial</span>

        <div className="game-header-right">
          <button className="stage-list-button" onClick={() => navigate('/stages')}>
            📋 목록
          </button>
          <span className="user-name">👤 {user.username}</span>
          <span className="score">🏆 {score}점</span>
        </div>
      </header>

      <section className="mission-panel">
        <div className="stage-info">
          <div className="stage-label">STAGE</div>
          <div className="stage-number">{String(stageId).padStart(2, '0')}</div>
        </div>

        <div className="vertical-divider" />

        <div className="mission-content">
          <div className="mission-title-row">
            <h2 className="mission-title">{stage?.title}</h2>
            <span className={`difficulty-badge ${stage?.difficulty === '기초' ? 'basic' : 'normal'}`}>
              {stage?.difficulty}
            </span>
          </div>

          <p className="mission-description">
            {stage?.description}
          </p>

          <div className="mission-box">
            <span className="mission-label">🎯 미션</span>
            <span className="mission-text">{stage?.mission}</span>
          </div>
        </div>

        <div className="hint-button-area">
          <button className="hint-button" onClick={() => setShowHint(true)}>
            💡 힌트 보기
          </button>
        </div>

        <div className="progress-area">
          <div className="progress-label">진행률</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(stageId / 5) * 100}%` }}
            />
          </div>
          <div className="progress-text">{stageId} / 5</div>
        </div>
      </section>

      <main className="terminal-area">
        <Terminal onCommand={handleCommand} />
      </main>
    </div>
  )
}