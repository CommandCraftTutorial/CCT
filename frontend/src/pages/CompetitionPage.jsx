import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaderboard, updateProgress } from '../services/api'
import axios from 'axios'

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
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // 랜덤 스테이지 불러오기
  const fetchRandomStage = async () => {
    try {
      const res = await api.get('/stages/random')
      setStage(res.data)
      setTimer(30)
      setShowHint(false)
      setWrongCount(0)
    } catch (err) {
      console.error(err)
    }
  }

  // 랭킹 불러오기
  const fetchRankings = async () => {
    const res = await getLeaderboard()
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

  // 타이머
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
    setGameOver(true)
    clearInterval(timerRef.current)
    setHistory(prev => [...prev, { type: 'error', text: '⏰ 시간 초과! 게임 오버!' }])
    await updateProgress(user.id, 1, score)
    fetchRankings()
  }

  const handleKeyDown = async (e) => {
    if (e.key !== 'Enter' || gameOver) return
    const command = input.trim()
    if (!command) return

    setHistory(prev => [...prev, { type: 'input', text: command }])
    setInput('')

    // 채점
    const res = await api.post(`/stages/${stage.id}/submit`, {
      command,
      userId: user.id,
      mode: 'competition',   
      combo,                 
      timeLeft: timer   
    })

    const { passed, score: gained, combo: newCombo } = res.data

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

      await updateProgress(user.id, 1, newScore)
      fetchRankings()

      setTimeout(() => fetchRandomStage(), 1000)
    } else {
      const newWrong = wrongCount + 1
      setWrongCount(newWrong)
      setCombo(0)
      setHistory(prev => [...prev, { type: 'error', text: '❌ 틀렸습니다!' }])
    }
  }

  const getColor = (type) => {
    if (type === 'input') return '#cdd6f4'
    if (type === 'success') return '#a6e3a1'
    if (type === 'error') return '#f38ba8'
    return '#6c7086'
  }

  const getTimerColor = () => {
    if (timer > 20) return '#a6e3a1'
    if (timer > 10) return '#f9e2af'
    return '#f38ba8'
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#0d0d14',
      color: '#cdd6f4',
      fontFamily: 'Menlo, Monaco, monospace',
      overflow: 'hidden',
    }}>

      {/* 왼쪽 게임 영역 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #2a2a3d',
      }}>

        {/* 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          background: '#13131f',
          borderBottom: '1px solid #2a2a3d',
        }}>
          <span
            onClick={() => navigate('/mode')}
            style={{ fontSize: '14px', color: '#a6e3a1', cursor: 'pointer' }}
          >
            ← CommandCraftTutorial
          </span>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ color: '#f9e2af' }}>🏆 {score}점</span>
            <span style={{ color: '#cba6f7' }}>🔥 콤보 {combo}</span>
            <span style={{ color: '#a6adc8' }}>👤 {user.username}</span>

            <button
              onClick={() => navigate('/mode')}
              style={{
                background: 'transparent',
                border: '1px solid #f38ba8',
                color: '#f38ba8',
                fontSize: '14px',
                fontWeight: 'bold',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Menlo, Monaco, monospace',
                transition: 'all 0.2s ease',
                marginLeft: '4px',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3a1a1a'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#f38ba8'
              }}
              >
                ✕
              </button>
          </div>
        </div>

        {/* 미션 패널 */}
        <div style={{
          padding: '20px 24px',
          background: '#13131f',
          borderBottom: '1px solid #2a2a3d',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: stage?.difficulty === '기초' ? '#1a3a2a'
                          : stage?.difficulty === '중급' ? '#2a2a1a' : '#3a1a1a',
                color: stage?.difficulty === '기초' ? '#a6e3a1'
                     : stage?.difficulty === '중급' ? '#f9e2af' : '#f38ba8',
                border: `1px solid ${stage?.difficulty === '기초' ? '#a6e3a1'
                       : stage?.difficulty === '중급' ? '#f9e2af' : '#f38ba8'}`,
              }}>
                {stage?.difficulty}
              </span>
              <span style={{ fontSize: '11px', color: '#6c7086' }}>
                {stage?.category?.toUpperCase()}
              </span>
            </div>

            {/* 타이머 */}
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: getTimerColor(),
              transition: 'color 0.3s',
            }}>
              ⏱️ {timer}s
            </div>
          </div>

          <h2 style={{ fontSize: '18px', margin: '0 0 8px', color: '#cdd6f4' }}>
            랭크 미션 : 무작위 터미널
          </h2>
          <p style={{ fontSize: '13px', color: '#a6adc8', margin: '0 0 12px' }}>
            모든 난이도의 미션이 무작위로 타겟팅됩니다.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1a2a1a',
            border: '1px solid #a6e3a1',
            borderRadius: '6px',
            padding: '8px 14px',
          }}>
            <span style={{ color: '#a6e3a1', fontSize: '12px' }}>🎯 미션</span>
            <span style={{ color: '#cdd6f4', fontSize: '13px', fontWeight: 'bold' }}>
              {stage?.mission}
            </span>
          </div>

          {/* 힌트 버튼 */}
          <div style={{ marginTop: '12px' }}>
            <button
              onClick={() => setShowHint(!showHint)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid #f9e2af',
                background: 'transparent',
                color: '#f9e2af',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'Menlo, Monaco, monospace',
              }}
            >
              💡 힌트 {showHint ? '숨기기' : '보기'}
            </button>
            {showHint && (
              <div style={{
                marginTop: '8px',
                padding: '10px 14px',
                background: '#2a2a1a',
                border: '1px solid #f9e2af',
                borderRadius: '6px',
                color: '#f9e2af',
                fontSize: '13px',
              }}>
                💡 {stage?.hint}
              </div>
            )}
          </div>
        </div>

        {/* 터미널 */}
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px',
            cursor: 'text',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {history.map((line, i) => (
            <div key={i} style={{ color: getColor(line.type), lineHeight: '1.8' }}>
              {line.type === 'input' ? (
                <span>
                  <span style={{ color: '#a6e3a1' }}>➜</span>
                  <span style={{ color: '#89b4fa', margin: '0 8px' }}>~</span>
                  {line.text}
                </span>
              ) : (
                <span>{line.text}</span>
              )}
            </div>
          ))}

          {!gameOver && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ color: '#a6e3a1' }}>➜</span>
              <span style={{ color: '#89b4fa' }}>~</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#cdd6f4',
                  fontFamily: 'Menlo, Monaco, monospace',
                  fontSize: '14px',
                  caretColor: '#f5c2e7',
                }}
                autoFocus
              />
            </div>
          )}

          {gameOver && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: '#13131f',
              border: '1px solid #f38ba8',
              borderRadius: '10px',
              textAlign: 'center',
            }}>
              <p style={{ color: '#f38ba8', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' }}>
                🎮 게임 오버
              </p>
              <p style={{ color: '#f9e2af', fontSize: '18px', margin: '0 0 16px' }}>
                최종 점수: {score}점
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setScore(0)
                    setCombo(0)
                    setGameOver(false)
                    setHistory([])
                    fetchRandomStage()
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: '1px solid #a6e3a1',
                    background: '#a6e3a1',
                    color: '#0d0d14',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: 'Menlo, Monaco, monospace',
                  }}
                >
                  🔄 다시 시작
                </button>
                <button
                  onClick={() => navigate('/mode')}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: '1px solid #6c7086',
                    background: 'transparent',
                    color: '#6c7086',
                    cursor: 'pointer',
                    fontFamily: 'Menlo, Monaco, monospace',
                  }}
                >
                  나가기
                </button>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 오른쪽 랭킹 */}
      <div style={{
        width: '280px',
        display: 'flex',
        flexDirection: 'column',
        background: '#13131f',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #2a2a3d',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#f9e2af',
        }}>
          🏆 실시간 랭킹
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {rankings.map((player, i) => (
            <div
              key={player.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                marginBottom: '8px',
                background: player.username === user.username ? '#1a2a1a' : '#0d0d14',
                border: `1px solid ${player.username === user.username ? '#a6e3a1' : '#2a2a3d'}`,
                borderRadius: '8px',
              }}
            >
              <span style={{
                fontSize: i < 3 ? '18px' : '13px',
                color: i === 0 ? '#f9e2af' : i === 1 ? '#a6adc8' : i === 2 ? '#f38ba8' : '#6c7086',
                minWidth: '24px',
                textAlign: 'center',
              }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </span>
              <span style={{
                flex: 1,
                fontSize: '12px',
                color: player.username === user.username ? '#a6e3a1' : '#cdd6f4',
              }}>
                {player.username}
                {player.username === user.username && (
                  <span style={{ color: '#a6e3a1', marginLeft: '4px' }}>(나)</span>
                )}
              </span>
              <span style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#f9e2af',
              }}>
                {player.score}점
              </span>
            </div>
          ))}
        </div>

        <div style={{
          padding: '12px',
          borderTop: '1px solid #2a2a3d',
        }}>
          <button
            onClick={() => navigate('/leaderboard')}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #2a2a3d',
              background: 'transparent',
              color: '#a6adc8',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'Menlo, Monaco, monospace',
            }}
          >
            전체 랭킹 보기
          </button>
        </div>
      </div>
    </div>
  )
}