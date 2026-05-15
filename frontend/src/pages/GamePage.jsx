import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Terminal from '../components/Terminal/Terminal'
import { getStage, submitCommand, updateProgress, getStagesByCategory } from '../services/api'
import './GamePage.css'


export default function GamePage() {
  const [stage, setStage] = useState(null)
  const [stageId, setStageId] = useState(null)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
  const [overlay, setOverlay] = useState(null)

  const [stageIds, setStageIds] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [activeMode, setActiveMode] = useState('study');
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const gameConfig = JSON.parse(
    localStorage.getItem('gameConfig') || '{"category":"git","difficulty":"기초"}'
  )

  // 설명에서 정답 명령어를 찾아 가려주는 함수
  const filterDescription = (description, answer) => {
    if (!description || !answer) return description;
  
    // 정답 명령어(예: git init)와 일치하는 단어를 대소문자 구분 없이 찾아 "____"로 변경
    const regex = new RegExp(answer, 'gi');
    return description.replace(regex, '🔒 [COMMAND]');
  };


  useEffect(() => {
    if (!user.id) {
      navigate('/')
      return
    }

    const fetchStages = async () => {
      const res = await getStagesByCategory(
      gameConfig.category,
      gameConfig.difficulty
      )
      const data = res.data

      if (data.length > 0) {
        const ids = data.map(stage => stage.id)
        setStageIds(ids)
        setStageId(ids[currentIndex])
      }
    } 

    fetchStages()
  }, [gameConfig.category, gameConfig.difficulty, navigate, user.id])

  useEffect(() => {
    if (!stageId) return

    getStage(stageId).then(res => {
      setStage(res.data)
      setShowHint(false)
      setWrongCount(0)
    })
  }, [stageId])

  const handleCommand = async (command, term) => {
    try {
      const { data } = await submitCommand(stageId, command, user.id)

      if (data.passed) {
        const newScore = score + 100
        const isLastStage = currentIndex === stageIds.length - 1

        setScore(newScore)
        term.writeln(`🏆 +100점 획득! 현재 점수: ${newScore}점`)
        updateProgress(user.id, data.nextStageId, newScore)

        setOverlay('success')
        setTimeout(() => setOverlay(null), 600)

        if (!isLastStage) {
          term.writeln('🎉 성공! 다음 스테이지로 이동합니다...')

          setTimeout(() => {
            const nextIndex = currentIndex + 1
            setCurrentIndex(nextIndex)
            setStageId(stageIds[nextIndex])
          }, 1500)
        } else {
          term.writeln('🏆 모든 스테이지를 완료했습니다!')

          setTimeout(() => {
            navigate('/clear', {
              state: {
                total: stageIds.length,
                finalScore: newScore,
              },
            })
          }, 2000)
        }
      } else {
        term.writeln('❌ 틀렸습니다. 힌트 버튼을 눌러보세요!')
        setWrongCount(prev => prev + 1)

        setOverlay('fail')
        setTimeout(() => setOverlay(null), 600)
      }
    } catch (err) {
      term.writeln('❌ 서버 오류가 발생했습니다.')
    }
  }

  const progressRate = ((currentIndex + 1) / (stageIds.length || 1)) * 100

  return (
    <div className="game-page">
      {overlay && <div className={`game-overlay ${overlay}`} />}

      {showHint && (
        <div className="hint-backdrop" onClick={() => setShowHint(false)}>
          <div className="hint-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hint-header">
              <span className="hint-title">💡 HINT</span>
              <button className="hint-close-button" onClick={() => setShowHint(false)}>
                ✕
              </button>
            </div>

            <div className="hint-divider" />

            <p className="hint-content">{stage?.hint}</p>

            <button className="hint-confirm-button" onClick={() => setShowHint(false)}>
              확인
            </button>
          </div>
        </div>
      )}

      <header className="cct-header">
        <div className="cct-brand">
          <span className="cct-prompt">&gt;_</span>
          <span className="cct-logo">CommandCraftTutorial</span>
        </div>

        <div className="cct-header-right">
          <div className="cct-hud-pill">
            <span className="cct-hud-label">STAGE</span>
            <span className="cct-hud-value">
              {String(currentIndex + 1).padStart(2, '0')} / {stageIds.length}
            </span>
          </div>

          <div className="cct-pill">
            <span>👤</span>
            <span>{user.username || 'player01'}</span>
          </div>

          <button className="cct-icon-button" onClick={() => navigate('/stages')}>
            📋
          </button>

          <button className="cct-icon-button" onClick={() => navigate('/category')}>
            ✕
          </button>
        </div>
      </header>

      <main className="game-main">
        <section className="mission-grid">
          <div className="mission-card">
            <div className="section-label">› MISSION</div>

            {/* 1. 타이틀에서 정답 숨기기 */}
            <h1 className="mission-title">새로운 미션 달성하기</h1>

            <p className="mission-description">
              {"제시된 미션을 읽고 터미널에 올바른 명령어를 입력하여 저장소를 관리하세요."}
            </p>

            {/* 2. 미션 정답 박스 제어 */}
            <div className="mission-command">
              <span className="mission-command-label">🎯 미션</span>
              <code>{stage?.mission}</code>
            </div>
          </div>

          <aside className="mission-side-card">
            <div className="side-row">
              <span className="side-label">난이도</span>
              <span className={`difficulty-pill ${stage?.difficulty === '기초' ? 'basic' : 'normal'}`}>
                {stage?.difficulty}
              </span>
            </div>

            <button className="hint-button" onClick={() => setShowHint(true)}>
              💡 힌트 보기
            </button>

            <div className="side-row vertical">
              <span className="side-label">오답 횟수</span>
              <span className="wrong-count">{wrongCount} / 3</span>
            </div>
          </aside>
        </section>

        <section className="progress-card">
          <span className="progress-title">진행률</span>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressRate}%` }}
            />
          </div>

          <span className="progress-percent">
            {Math.round(progressRate)}% ({currentIndex + 1} / {stageIds.length || 1})
          </span>
        </section>

        <section className="terminal-panel">
          <div className="terminal-panel-header">
            <span className="terminal-dot" />
            <span className="terminal-title">TERMINAL</span>
            <button className="terminal-clear-button">CLEAR</button>
          </div>

          <div className="terminal-wrapper">
            <Terminal onCommand={handleCommand} />
          </div>
        </section>
      </main>
    </div>
  )
}