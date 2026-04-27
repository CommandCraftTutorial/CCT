import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStages } from '../services/api'

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
  }, [])

  const isCleared = (stageId) => stageId < (user.current_stage || 1)
  const isCurrent = (stageId) => stageId === (user.current_stage || 1)

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
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#a6e3a1' }}>
          🖥️ CLI Tutorial
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#a6adc8', fontSize: '13px' }}>👤 {user.username}</span>
          <span style={{ color: '#f9e2af', fontSize: '13px' }}>🏆 {user.score || 0}점</span>
        </div>
      </div>

      {/* 메인 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 24px',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
      }}>
        <h2 style={{
          fontSize: '20px',
          color: '#cdd6f4',
          marginBottom: '8px',
        }}>
          📋 스테이지 목록
        </h2>
        <p style={{ color: '#6c7086', fontSize: '13px', marginBottom: '32px' }}>
          스테이지를 선택해서 시작하세요
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stages.map((stage) => (
            <div
              key={stage.id}
              onClick={() => navigate('/game', { state: { stageId: stage.id } })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '20px 24px',
                background: '#13131f',
                border: `1px solid ${
                  isCurrent(stage.id) ? '#a6e3a1'
                  : isCleared(stage.id) ? '#2a2a3d'
                  : '#2a2a3d'
                }`,
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: stage.id > (user.current_stage || 1) ? 0.4 : 1,
              }}
            >
              {/* 번호 */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: isCleared(stage.id) ? '#1a3a2a'
                           : isCurrent(stage.id) ? '#1a3a2a'
                           : '#1a1a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                color: isCleared(stage.id) ? '#a6e3a1'
                      : isCurrent(stage.id) ? '#a6e3a1'
                      : '#6c7086',
                flexShrink: 0,
              }}>
                {isCleared(stage.id) ? '✓' : String(stage.id).padStart(2, '0')}
              </div>

              {/* 내용 */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}>
                  <span style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    {stage.title}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: stage.difficulty === '기초' ? '#1a3a2a' : '#3a2a1a',
                    color: stage.difficulty === '기초' ? '#a6e3a1' : '#fab387',
                    border: `1px solid ${stage.difficulty === '기초' ? '#a6e3a1' : '#fab387'}`,
                  }}>
                    {stage.difficulty}
                  </span>
                </div>
                <span style={{ color: '#6c7086', fontSize: '12px' }}>
                  {stage.mission}
                </span>
              </div>

              {/* 상태 */}
              <div style={{ flexShrink: 0 }}>
                {isCleared(stage.id) && (
                  <span style={{ color: '#a6e3a1', fontSize: '12px' }}>완료 ✓</span>
                )}
                {isCurrent(stage.id) && (
                  <span style={{ color: '#f9e2af', fontSize: '12px' }}>진행중 ▶</span>
                )}
                {stage.id > (user.current_stage || 1) && (
                  <span style={{ color: '#6c7086', fontSize: '12px' }}>🔒 잠금</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{
        padding: '16px 24px',
        background: '#13131f',
        borderTop: '1px solid #2a2a3d',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <button
          onClick={() => navigate('/game')}
          style={{
            padding: '12px 48px',
            borderRadius: '8px',
            border: 'none',
            background: '#a6e3a1',
            color: '#0f0f17',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'Menlo, Monaco, monospace',
          }}
        >
          🎮 현재 스테이지 계속하기
        </button>
      </div>
    </div>
  )
}