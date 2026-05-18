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
    setHistory(prev => [...prev, { type: 'error', text: '⏰ 시간 초과! 게임 오버!' }])
    await updateProgress(user.id, 1, score, 'competition')
    fetchRankings()
  }

  const handleKeyDown = async (e) => {
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
        { type: 'success', text: `✅ 정답! +${gained}점${bonus > 0 ? ` (콤보 보너스 +${bonus})` : ''}` },
        { type: 'success', text: `🔥 콤보: ${newCombo}` },
      ])

      await updateProgress(user.id, 1, newScore, 'competition')
      fetchRankings()

      setTimeout(() => fetchRandomStage(), 1000)
    } else {
      const newWrong = wrongCount + 1
      setWrongCount(newWrong)
      setCombo(0)
      setHistory(prev => [...prev, { type: 'error', text: '❌ 틀렸습니다!' }])
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
    <div className="competition-layout">

      {/* 왼쪽 게임 영역 */}
      <div className="game-area">

        {/* 헤더 */}
        <div className="game-header">
          <span className="back-link" onClick={() => navigate('/mode')}>
            ← CommandCraftTutorial
          </span>
          <div className="header-right">
            <span className="header-score">🏆 {score}점</span>
            <span className="header-combo">🔥 콤보 {combo}</span>
            <span className="header-user">👤 {user.username}</span>
            <button
              className="exit-btn"
              onClick={() => navigate('/mode')}
              onMouseEnter={e => e.currentTarget.classList.add('exit-btn-hover')}
              onMouseLeave={e => e.currentTarget.classList.remove('exit-btn-hover')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* 미션 패널 */}
        <div className="mission-panel">
          <div className="mission-top">
            <div className="mission-badges">
              <span className={`difficulty-badge ${getDifficultyClass()}`}>
                {stage?.difficulty}
              </span>
              <span className="category-label">
                {stage?.category?.toUpperCase()}
              </span>
            </div>
            <div className="timer" style={{ color: getTimerColor() }}>
              ⏱️ {timer}s
            </div>
          </div>

          <h2 className="mission-title">랭크 미션 : 무작위 터미널</h2>
          <p className="mission-desc">모든 난이도의 미션이 무작위로 타겟팅됩니다.</p>

          <div className="mission-box">
            <span className="mission-label">🎯 미션</span>
            <span className="mission-text">{stage?.mission}</span>
          </div>

          {/* 힌트 */}
          <div className="hint-area">
            <button className="hint-btn" onClick={() => setShowHint(!showHint)}>
              💡 힌트 {showHint ? '숨기기' : '보기'}
            </button>
            {showHint && (
              <div className="hint-box">💡 {stage?.hint}</div>
            )}
          </div>
        </div>

        {/* 터미널 */}
        <div className="terminal" onClick={() => inputRef.current?.focus()}>
          {history.map((line, i) => (
            <div
              key={i}
              className={`terminal-line ${line.type === 'success' ? 'text-success' : line.type === 'error' ? 'text-error' : 'text-input'}`}
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
              <span className="prompt-tilde"> ~ </span>
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
                <button className="btn-exit" onClick={() => navigate('/mode')}>
                  나가기
                </button>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 오른쪽 랭킹 */}
      <div className="ranking-panel">
        <div className="ranking-header">🏆 실시간 랭킹</div>
        <div className="ranking-list">
          {rankings.map((player, i) => (
            <div
              key={player.id}
              className={`ranking-item ${player.username === user.username ? 'ranking-item-me' : ''}`}
            >
              <span className={`ranking-medal rank-${i}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </span>
              <span className={`ranking-name ${player.username === user.username ? 'ranking-name-me' : ''}`}>
                {player.username}
                {player.username === user.username && <span className="me-tag"> (나)</span>}
              </span>
              <span className="ranking-score">
                {player.competition_score ?? player.score}점
              </span>
            </div>
          ))}
        </div>
        <div className="ranking-footer">
          <button className="btn-leaderboard" onClick={() => navigate('/leaderboard')}>
            전체 랭킹 보기
          </button>
        </div>
      </div>
    </div>
  )
}