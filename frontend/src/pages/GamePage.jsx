import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Terminal from '../components/Terminal/Terminal'
import { getStage, submitCommand, updateProgress } from '../services/api'

export default function GamePage() {
  const [stage, setStage] = useState(null)
  const [stageId, setStageId] = useState(1)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
  const navigate = useNavigate()
  //const [animClass, setAnimClass] = useState('')
  const [overlay, setOverlay] = useState(null) // 'success' | 'fail' | null

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!user.id) {
      navigate('/')
      return
    }
    getStage(stageId).then(res => setStage(res.data))
  }, [stageId])

  const handleCommand = async (command, term) => {
    try {
      const { data } = await submitCommand(stageId, command, user.id)
      term.writeln(data.output)

      if (data.passed) {
        const newScore = score + 100
        setScore(newScore)
        await updateProgress(user.id, data.nextStageId, newScore)
        setOverlay('success')
        setTimeout(() => setOverlay(null), 600)
        //setAnimClass('flash-success')
        //setTimeout(() => setAnimClass(''),600) 

        if (data.nextStageId && data.nextStageId <= 5) {
          term.writeln('🎉 성공! 다음 스테이지로 이동합니다...')
          setTimeout(() => setStageId(data.nextStageId), 1500)
        } else {
          term.writeln('🏆 모든 스테이지를 완료했습니다!')
          setTimeout(() => navigate('/clear'), 2000)
        }
      } else {
        setWrongCount(prev => prev + 1) 
        setOverlay('fail')
        setTimeout(() => setOverlay(null), 600)
        //setAnimClass('flash-fail')
        //setTimeout(() => setAnimClass(''), 600)
        term.writeln(`❌ 틀렸습니다. 힌트 버튼을 눌러보세요!`)
      }
    } catch (err) {
      term.writeln('❌ 서버 오류가 발생했습니다.')
    }
  }

  return (
    <div 
      //className = {animClass}
      style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      color: '#cdd6f4',
      fontFamily: 'Menlo, Monaco, monospace',
      // background:'#0f0f17'
      position: 'relative', 
    }}>

      {/* 오버레이 */}
      {overlay && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: overlay === 'success' ? 'rgba(166, 227, 161, 0.15)' : 'rgba(243, 139, 168, 0.15)',
          pointerEvents: 'none',
          zIndex: 999,
          animation: overlay === 'fail' ? 'shake 0.4s ease' : 'none',
        }} />
      )}

      {/* 상단 헤더 */}
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
          <button
            onClick={() => navigate('/stages')}
            style={{
             padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid #2a2a3d',
            background: 'transparent',
            color: '#a6adc8',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'Menlo, Monaco, monospace',
          }}
        >
          📋 목록
        </button>
        <span style={{ color: '#a6adc8', fontSize: '13px' }}>👤 {user.username}</span>
        <span style={{ color: '#f9e2af', fontSize: '13px' }}>🏆 {score}점</span>
      </div>
    </div>

      {/* 미션 패널 (위) */}
      <div style={{
        padding: '20px 24px',
        background: '#13131f',
        borderBottom: '1px solid #2a2a3d',
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
      }}>
        {/* 스테이지 번호 */}
        <div style={{
          minWidth: '60px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '11px',
            color: '#6c7086',
            marginBottom: '4px',
            letterSpacing: '1px',
          }}>STAGE</div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#a6e3a1',
            lineHeight: 1,
          }}>{String(stageId).padStart(2, '0')}</div>
        </div>

        {/* 구분선 */}
        <div style={{ width: '1px', background: '#2a2a3d', alignSelf: 'stretch' }} />

        {/* 미션 내용 */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#cdd6f4' }}>{stage?.title}</h2>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: stage?.difficulty === '기초' ? '#1a3a2a' : '#3a2a1a',
              color: stage?.difficulty === '기초' ? '#a6e3a1' : '#fab387',
              border: `1px solid ${stage?.difficulty === '기초' ? '#a6e3a1' : '#fab387'}`,
            }}>
              {stage?.difficulty}
            </span>
          </div>
          <p style={{ margin: '0 0 10px', color: '#a6adc8', fontSize: '13px', lineHeight: '1.6' }}>
            {stage?.description}
          </p>
          {/* 미션박스 */}
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
        </div>

        {/* 힌트 버튼 - 틀렸을 때만 표시 */}
        {wrongCount > 0 && (
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
                lineHeight: '1.6',
              }}>
                💡 {stage?.hint}
              </div>
            )}
          </div>
        )}


        {/* 진행률 */}
        <div style={{ minWidth: '120px' }}>
          <div style={{ fontSize: '11px', color: '#6c7086', marginBottom: '6px' }}>진행률</div>
          <div style={{
            background: '#2a2a3d',
            borderRadius: '4px',
            height: '6px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(stageId / 5) * 100}%`,
              height: '100%',
              background: '#a6e3a1',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{ fontSize: '11px', color: '#a6adc8', marginTop: '4px' }}>
            {stageId} / 5
          </div>
        </div>
      </div>

      {/* 터미널 (아래) */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Terminal onCommand={handleCommand} />
      </div>
    </div>
  )
}