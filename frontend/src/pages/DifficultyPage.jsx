import { useNavigate, useParams } from 'react-router-dom'

export default function DifficultyPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const categoryInfo = {
    git: { title: 'Git', icon: '🌿', color: 'F38BA8' },
    linux: { title: 'Linux', icon: '🐧', color: '89B4FA' },
    gdb: { title: 'GDB / FDB', icon: '🔍', color: 'CBA6F7' },
  }

  const info = categoryInfo[category]

  const difficulties = [
    {
      id: '기초',
      icon: '🟢',
      title: '기초',
      description: '처음 시작하는 분들을 위한\n기본 명령어 학습',
      color: 'A6E3A1',
    },
    {
      id: '중급',
      icon: '🟡',
      title: '중급',
      description: '기초를 익힌 분들을 위한\n심화 명령어 학습',
      color: 'F9E2AF',
    },
    {
      id: '심화',
      icon: '🔴',
      title: '심화',
      description: '고급 사용자를 위한\n실전 명령어 학습',
      color: 'F38BA8',
    },
  ]

  const handleSelect = (difficulty) => {
    localStorage.setItem('gameConfig', JSON.stringify({ category, difficulty }))
    navigate('/game')
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
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
        <span
          onClick={() => navigate('/category')}
          style={{ fontSize: '16px', fontWeight: 'bold', color: '#a6e3a1', cursor: 'pointer' }}
        >
          ← 🖥️ CLI Tutorial
        </span>
        <span style={{ color: '#a6adc8', fontSize: '13px' }}>👤 {user.username}</span>
      </div>

      {/* 메인 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        gap: '16px',
      }}>
        <div style={{ fontSize: '48px' }}>{info?.icon}</div>
        <h1 style={{ fontSize: '24px', color: `#${info?.color}`, margin: 0 }}>
          {info?.title}
        </h1>
        <p style={{ color: '#6c7086', fontSize: '13px', marginBottom: '24px' }}>
          난이도를 선택하세요
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '800px',
          width: '100%',
        }}>
          {difficulties.map((diff) => (
            <div
              key={diff.id}
              onClick={() => handleSelect(diff.id)}
              style={{
                flex: '1',
                minWidth: '200px',
                maxWidth: '240px',
                background: '#13131f',
                border: `1px solid #${diff.color}`,
                borderRadius: '12px',
                padding: '28px 20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '36px' }}>{diff.icon}</div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: `#${diff.color}`,
                margin: 0,
              }}>
                {diff.title}
              </h2>
              <p style={{
                fontSize: '12px',
                color: '#a6adc8',
                textAlign: 'center',
                lineHeight: '1.8',
                margin: 0,
                whiteSpace: 'pre-line',
              }}>
                {diff.description}
              </p>
              <button style={{
                marginTop: '8px',
                padding: '8px 24px',
                borderRadius: '8px',
                border: `1px solid #${diff.color}`,
                background: 'transparent',
                color: `#${diff.color}`,
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'Menlo, Monaco, monospace',
              }}>
                선택 →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}