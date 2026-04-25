import { useState, useRef, useEffect } from 'react'

export default function TerminalComponent({ onCommand }) {
  const [history, setHistory] = useState([
    { type: 'system', text: '🚀 Git 튜토리얼에 오신 것을 환영합니다!' },
    { type: 'system', text: '📖 위쪽 미션을 읽고 명령어를 입력하세요.' },
    { type: 'system', text: '' },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const command = input.trim()
      if (!command) return

      setHistory(prev => [
        ...prev,
        { type: 'input', text: command }
      ])

      onCommand(command, {
        writeln: (text) => {
          setHistory(prev => [...prev, { type: 'output', text }])
        }
      })

      setInput('')
    }
  }

  const getColor = (line) => {
    if (line.type === 'system') return '#6c7086'
    if (line.type === 'input') return '#cdd6f4'
    if (line.text.startsWith('✅')) return '#a6e3a1'
    if (line.text.startsWith('❌')) return '#f38ba8'
    if (line.text.startsWith('💡')) return '#f9e2af'
    if (line.text.startsWith('🎉') || line.text.startsWith('🏆') || line.text.startsWith('🎊')) return '#a6e3a1'
    return '#cdd6f4'
  }

  return (
    <div
      style={{
        height: '100%',
        background: '#1e1e2e',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: '13px',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* 터미널 탭 바 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#181825',
        borderBottom: '1px solid #2a2a3d',
        padding: '0',
        minHeight: '35px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0 16px',
          height: '35px',
          background: '#1e1e2e',
          borderRight: '1px solid #2a2a3d',
          borderTop: '1px solid #a6e3a1',
          color: '#cdd6f4',
          fontSize: '12px',
        }}>
          <span style={{ fontSize: '10px' }}>⚡</span>
          bash
        </div>
        <div style={{
          marginLeft: 'auto',
          padding: '0 12px',
          display: 'flex',
          gap: '12px',
          color: '#6c7086',
          fontSize: '14px',
        }}>
          <span style={{ cursor: 'pointer' }}>+</span>
          <span style={{ cursor: 'pointer' }}>×</span>
        </div>
      </div>

      {/* 터미널 출력 영역 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
        {history.map((line, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            color: getColor(line),
            lineHeight: '1.6',
            minHeight: line.text === '' ? '12px' : 'auto',
          }}>
            {line.type === 'input' && (
              <>
                <span style={{ color: '#a6e3a1', userSelect: 'none' }}>➜</span>
                <span style={{ color: '#89b4fa', userSelect: 'none' }}>~</span>
                <span style={{ color: '#cdd6f4' }}>{line.text}</span>
              </>
            )}
            {line.type !== 'input' && (
              <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {line.text}
              </span>
            )}
          </div>
        ))}

        {/* 현재 입력 줄 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '2px',
        }}>
          <span style={{ color: '#a6e3a1', userSelect: 'none' }}>➜</span>
          <span style={{ color: '#89b4fa', userSelect: 'none' }}>~</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#cdd6f4',
              fontFamily: 'Menlo, Monaco, "Courier New", monospace',
              fontSize: '13px',
              caretColor: '#f5c2e7',
              lineHeight: '1.6',
            }}
            autoFocus
          />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  )
}