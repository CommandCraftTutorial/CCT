import { useState, useEffect } from 'react'
import Terminal from '../components/Terminal/Terminal'
import { getStage, submitCommand } from '../services/api'

export default function GamePage() {
  const [stage, setStage] = useState(null)
  const [stageId, setStageId] = useState(1)
  const userId = 'user_001' // 실제 구현 시 로그인 연동

  useEffect(() => {
    getStage(stageId).then(res => setStage(res.data))
  }, [stageId])

  const handleCommand = async (command, term) => {
    const { data } = await submitCommand(stageId, command, userId)

    term.writeln(data.output)

    if (data.passed) {
      term.writeln('\r\n🎉 성공! 다음 스테이지로 이동합니다...')
      setTimeout(() => setStageId(data.nextStageId), 1500)
    } else {
      term.writeln('❌ 다시 시도해보세요. 힌트: ' + stage?.hint)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1e1e2e' }}>
      {/* 왼쪽: 미션 패널 */}
      <div style={{ width: '300px', padding: '24px', color: '#cdd6f4' }}>
        <h2>Stage {stageId}</h2>
        <p>{stage?.description}</p>
        <p style={{ color: '#a6e3a1' }}>🎯 {stage?.mission}</p>
      </div>

      {/* 오른쪽: 터미널 */}
      <div style={{ flex: 1, padding: '16px' }}>
        <Terminal onCommand={handleCommand} />
      </div>
    </div>
  )
}