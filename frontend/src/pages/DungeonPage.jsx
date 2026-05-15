import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDungeonStage, sendDungeonCommand } from '../services/api'

export default function DungeonPage() {
  const [stage, setStage] = useState(null)
  const [stageId, setStageId] = useState(1)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [currentPath, setCurrentPath] = useState('/')
  const [cleared, setCleared] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getDungeonStage(stageId).then(res => {
      setStage(res.data)
      setHistory([
        { type: 'story', text: res.data.story },
        { type: 'system', text: '─────────────────────────' },
        { type: 'system', text: '명령어를 입력해서 던전을 탐험하세요!' },
      ])
      setCurrentPath('/')
      setCleared(false)
    })
  }, [stageId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleKeyDown = async (e) => {
    if (e.key !== 'Enter') return
    const command = input.trim()
    if (!command) return

    setHistory(prev => [...prev, { type: 'input', text: command, path: currentPath }])
    setInput('')

    try {
      const { data } = await sendDungeonCommand(stageId, command, user.id)
      setCurrentPath(data.currentPath)
      setHistory(prev => [...prev, { type: 'output', text: data.output }])

      if (data.passed) {
        setCleared(true)
        setHistory(prev => [
          ...prev,
          { type: 'success', text: '🎉 던전 스테이지 클리어!' },
          { type: 'success', text: `다음 스테이지로 이동합니다...` },
        ])
        setTimeout(() => {
          if (data.nextStageId) {
            setStageId(data.nextStageId)
          } else {
            setHistory(prev => [...prev, { type: 'success', text: '🏆 모든 던전을 클리어했습니다!' }])
          }
        }, 2000)
      }
    } catch {
      setHistory(prev => [...prev, { type: 'error', text: '❌ 서버 오류가 발생했습니다.' }])
    }
  }

  const getColor = (type) => {
    if (type === 'story') return '#f9e2af'
    if (type === 'input') return '#cdd6f4'
    if (type === 'output') return '#a6e3a1'
    if (type === 'success') return '#a6e3a1'
    if (type === 'error') return '#f38ba8'
    return '#6c7086'
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#0f0f17',
      color: '#cdd6f4',
      fontFamily: 'Menlo, Monaco, monospace',
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
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f9e2af' }}>
          🏰 파일 던전
        </span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: '#f9e2af', fontSize: '13px' }}>
            Stage {stageId} - {stage?.title}
          </span>
          <button
            onClick={() => navigate('/minigames')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #f38ba8',
              background: 'transparent',
              color: '#f38ba8',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'Menlo, Monaco, monospace',
            }}
          >
            ✕ 나가기
          </button>
        </div>
      </div>

      {/* 터미널 */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          cursor: 'text',
        }}
      >
        {history.map((line, i) => (
          <div key={i} style={{ color: getColor(line.type), lineHeight: '1.8' }}>
            {line.type === 'input' ? (
              <span>
                <span style={{ color: '#a6e3a1' }}>➜</span>
                <span style={{ color: '#89b4fa', margin: '0 8px' }}>{line.path}</span>
                {line.text}
              </span>
            ) : (
              <span style={{ whiteSpace: 'pre-wrap' }}>{line.text}</span>
            )}
          </div>
        ))}

        {/* 입력창 */}
        {!cleared && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ color: '#a6e3a1' }}>➜</span>
            <span style={{ color: '#89b4fa' }}>{currentPath}</span>
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
        <div ref={bottomRef} />
      </div>

      {/* 힌트 */}
      <div style={{
        padding: '12px 24px',
        background: '#13131f',
        borderTop: '1px solid #2a2a3d',
        fontSize: '12px',
        color: '#6c7086',
      }}>
        💡 힌트: {stage?.hint}
      </div>
    </div>
  )
}