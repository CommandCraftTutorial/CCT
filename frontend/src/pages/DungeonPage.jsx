import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDungeonStage, sendDungeonCommand } from '../services/api'
import './DungeonPage.css'

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
          { type: 'success', text: '다음 스테이지로 이동합니다...' },
        ])

        setTimeout(() => {
          if (data.nextStageId) {
            setStageId(data.nextStageId)
          } else {
            setHistory(prev => [
              ...prev,
              { type: 'success', text: '🏆 모든 던전을 클리어했습니다!' },
            ])
          }
        }, 2000)
      }
    } catch {
      setHistory(prev => [
        ...prev,
        { type: 'error', text: '❌ 서버 오류가 발생했습니다.' },
      ])
    }
  }

  return (
    <div className="dungeon-page">
      <header className="cct-header">
        <div className="cct-brand">
          <span className="cct-prompt">&gt;_</span>
          <span className="cct-logo">CommandCraftTutorial</span>
        </div>

        <div className="cct-header-right">
          <div className="cct-pill dungeon-stage-pill">
            <span>🏰</span>
            <span>Stage {stageId} - {stage?.title || 'Loading...'}</span>
          </div>

          <button
            className="cct-icon-button cct-back-button"
            onClick={() => navigate('/minigames')}
            aria-label="미니게임 페이지로 돌아가기"
          >
            ←
          </button>
        </div>
      </header>

      <main className="dungeon-main">
        <section className="dungeon-panel">
          <div className="dungeon-panel-header">
            <div>
              <p className="dungeon-kicker">FILE DUNGEON</p>
              <h1 className="dungeon-title">
                🏰 파일 던전
              </h1>
            </div>

            <div className="dungeon-command-chip">
              $ explore dungeon --stage {stageId}
            </div>
          </div>

          <div
            className="dungeon-terminal"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((line, i) => (
              <div
                key={i}
                className={`dungeon-line dungeon-line-${line.type}`}
              >
                {line.type === 'input' ? (
                  <>
                    <span className="dungeon-prompt">➜</span>
                    <span className="dungeon-path">{line.path}</span>
                    <span>{line.text}</span>
                  </>
                ) : (
                  <span>{line.text}</span>
                )}
              </div>
            ))}

            {!cleared && (
              <div className="dungeon-input-line">
                <span className="dungeon-prompt">➜</span>
                <span className="dungeon-path">{currentPath}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="dungeon-input"
                  autoFocus
                />
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </section>
      </main>

      <footer className="dungeon-footer">
        <span>💡 힌트:</span>
        <span>{stage?.hint}</span>
      </footer>
    </div>
  )
}