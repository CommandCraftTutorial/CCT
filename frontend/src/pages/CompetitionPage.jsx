import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaderboard, updateProgress } from '../services/api'
import axios from 'axios'
import './CompetitionPage.css'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

export default function CompetitionPage() {
  const [stage, setStage] = useState(null)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timer, setTimer] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [rankings, setRankings] = useState([])
  const [showHint, setShowHint] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)

  const inputRef = useRef(null)
  const timerRef = useRef(null)
  const bottomRef = useRef(null)
  const gameOverCalledRef = useRef(false)

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const fetchRandomStage = async () => {
    try {
      gameOverCalledRef.current = false
      const res = await api.get('/stages/random')
      setStage(res.data)
      setTimer(30)
      setShowHint(false)
      setWrongCount(0)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchRankings = async () => {
    const res = await getLeaderboard('competition')
    setRankings(res.data.slice(0, 5))
  }

  useEffect(() => {
    if (!user.id) {
      navigate('/')
      return
    }

    fetchRandomStage()
    fetchRankings()
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (gameOver) return

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleGameOver()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [stage, gameOver])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleGameOver = async () => {
    if (gameOverCalledRef.current) return
    gameOverCalledRef.current = true

    setGameOver(true)
    clearInterval(timerRef.current)

    setHistory(prev => [
      ...prev,
      { type: 'error', text: '⏰ 시간 초과! 게임 오버!' }
    ])

    await updateProgress(user.id, 1, score, 'competition')
    fetchRankings()
  }

  const handleKeyDown = async e => {
    if (e.key !== 'Enter' || gameOver) return

    const command = input.trim()
    if (!command) return

    setHistory(prev => [...prev, { type: 'input', text: command }])
    setInput('')

    const res = await api.post(`/stages/${stage.id}/submit`, {
      command,
      userId: user.id,
      mode: 'competition',
      combo,
      timeLeft: timer
    })

    const { passed } = res.data

    if (passed) {
      const newCombo = combo + 1
      const bonus = newCombo >= 3 ? 50 : 0
      const gained = 100 + bonus
      const newScore = score + gained

      setCombo(newCombo)
      setScore(prev => prev + gained)
      clearInterval(timerRef.current)

      setHistory(prev => [
        ...prev,
        {
          type: 'success',
          text: `✅ 정답! +${gained}점${bonus > 0 ? ` (콤보 보너스 +${bonus})` : ''}`
        },
        { type: 'success', text: `🔥 콤보: ${newCombo}` }
      ])

      await updateProgress(user.id, 1, newScore, 'competition')
      fetchRankings()

      setTimeout(() => fetchRandomStage(), 1000)
    } else {
      const newWrong = wrongCount + 1
      setWrongCount(newWrong)
      setCombo(0)

      setHistory(prev => [
        ...prev,
        { type: 'error', text: '❌ 틀렸습니다!' }
      ])
    }
  }

  const getTimerColor = () => {
    if (timer > 20) return '#a6e3a1'
    if (timer > 10) return '#f9e2af'
    return '#f38ba8'
  }

  const getDifficultyClass = () => {
    if (stage?.difficulty === '기초') return 'badge-easy'
    if (stage?.difficulty === '중급') return 'badge-mid'
    return 'badge-hard'
  }

  return (
    <div className="competition-page">
      <header className="competition-header">
        <button
          className="competition-logo"
          onClick={() => navigate('/mode')}
        >
          <span className="logo-prompt">›_</span>
          CommandCraftTutorial
        </button>

        <div className="competition-header-right">
          <div className="header-pill">
            <span className="header-pill-label">SCORE</span>
            <span>{score}점</span>
          </div>

          <div className="header-pill">
            <span className="header-pill-label">COMBO</span>
            <span>{combo}</span>
          </div>

          <div className="header-user-pill">
            👤 {user.username}
          </div>

          <button
            className="header-exit-button"
            onClick={() => navigate('/mode')}
          >
            ✕
          </button>
        </div>
      </header>

      <main className="competition-main">
        <div className="competition-content">
          <section className="competition-top-grid">
            <div className="mission-card">
              <div className="card-kicker">› MISSION</div>

              <h2 className="mission-title">
                랭크 미션 : 무작위 터미널
              </h2>

              <p className="mission-desc">
                모든 난이도의 미션이 무작위로 타겟팅됩니다.
              </p>

              <div className="mission-box">
                <span className="mission-label">🎯 미션</span>
                <span className="mission-text">{stage?.mission}</span>
              </div>
            </div>

            <aside className="status-card">
              <div className="status-row">
                <span>난이도</span>
                <span className={`difficulty-badge ${getDifficultyClass()}`}>
                  {stage?.difficulty}
                </span>
              </div>

              <div className="status-row">
                <span>카테고리</span>
                <span className="category-label">
                  {stage?.category?.toUpperCase()}
                </span>
              </div>

              <div className="status-row">
                <span>남은 시간</span>
                <span className="timer" style={{ color: getTimerColor() }}>
                  {timer}s
                </span>
              </div>

              <div className="status-row">
                <span>오답 횟수</span>
                <strong>{wrongCount}</strong>
              </div>

              <button
                className="hint-btn"
                onClick={() => setShowHint(!showHint)}
              >
                💡 힌트 {showHint ? '숨기기' : '보기'}
              </button>

            </aside>
          </section>

          <section className="competition-score-card">
            <div className="score-stat">
              <span>현재 점수</span>
              <strong>{score}점</strong>
            </div>

            <div className="score-stat">
              <span>콤보</span>
              <strong>🔥 {combo}</strong>
            </div>

            <div className="score-stat">
              <span>제한 시간</span>
              <strong style={{ color: getTimerColor() }}>{timer}s</strong>
            </div>
          </section>

          <section className="competition-bottom-grid">
            <div
              className="terminal-card"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="terminal-header">
                <div className="terminal-title">
                  <span className="terminal-dot" />
                  TERMINAL
                </div>
                <button
                  className="terminal-clear"
                  onClick={e => {
                    e.stopPropagation()
                    setHistory([])
                  }}
                >
                  CLEAR
                </button>
              </div>

              <div className="terminal-tabs">
                <span className="terminal-tab active">⚡ bash</span>
                <span className="terminal-tab-actions">＋ ×</span>
              </div>

              <div className="terminal-body">
                {history.length === 0 && (
                  <div className="terminal-guide">
                    <p>🚀 경쟁 모드에 오신 것을 환영합니다.</p>
                    <p>💬 제한 시간 안에 명령어를 입력하세요.</p>
                  </div>
                )}

                {history.map((line, i) => (
                  <div
                    key={i}
                    className={`terminal-line ${
                      line.type === 'success'
                        ? 'text-success'
                        : line.type === 'error'
                          ? 'text-error'
                          : 'text-input'
                    }`}
                  >
                    {line.type === 'input' ? (
                      <span>
                        <span className="prompt-arrow">➜</span>
                        <span className="prompt-tilde"> ~ </span>
                        {line.text}
                      </span>
                    ) : (
                      <span>{line.text}</span>
                    )}
                  </div>
                ))}

                {!gameOver && (
                  <div className="input-row">
                    <span className="prompt-arrow">➜</span>
                    <span className="prompt-tilde">~</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="terminal-input"
                      autoFocus
                    />
                  </div>
                )}

                {gameOver && (
                  <div className="gameover-box">
                    <p className="gameover-title">🎮 게임 오버</p>
                    <p className="gameover-score">최종 점수: {score}점</p>

                    <div className="gameover-buttons">
                      <button
                        className="btn-restart"
                        onClick={() => {
                          setScore(0)
                          setCombo(0)
                          setGameOver(false)
                          setHistory([])
                          fetchRandomStage()
                        }}
                      >
                        🔄 다시 시작
                      </button>

                      <button
                        className="btn-exit"
                        onClick={() => navigate('/mode')}
                      >
                        나가기
                      </button>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            <aside className="ranking-card">
              <div className="ranking-header">
                🏆 실시간 랭킹
              </div>

              <div className="ranking-list">
                {rankings.map((player, i) => (
                  <div
                    key={player.id}
                    className={`ranking-item ${
                      player.username === user.username ? 'ranking-item-me' : ''
                    }`}
                  >
                    <span className={`ranking-medal rank-${i}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                    </span>

                    <span className={`ranking-name ${
                      player.username === user.username ? 'ranking-name-me' : ''
                    }`}
                    >
                      {player.username}
                      {player.username === user.username && (
                        <span className="me-tag"> (나)</span>
                      )}
                    </span>

                    <span className="ranking-score">
                      {player.competition_score ?? player.score}점
                    </span>
                  </div>
                ))}
              </div>

              <button
                className="btn-leaderboard"
                onClick={() => navigate('/leaderboard')}
              >
                전체 랭킹 보기
              </button>
            </aside>
          </section>
        </div>
      </main>

      {showHint && (
        <div
          className="hint-modal-backdrop"
          onClick={() => setShowHint(false)}
        >
          <div
            className="hint-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="hint-modal-header">
              <span>💡 Hint</span>

              <button
                className="hint-modal-close"
                onClick={() => setShowHint(false)}
              >
                ✕
              </button>
            </div>

            <div className="hint-modal-body">
              {stage?.hint}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}