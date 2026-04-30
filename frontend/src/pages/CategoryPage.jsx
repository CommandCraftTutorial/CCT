import { useNavigate } from 'react-router-dom'

export default function CategoryPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const categories = [
    {
      id: 'git',
      title: 'Git',
      icon: '🌿',
      description: 'Git 버전 관리 명령어를 배워보세요',
      color: 'F38BA8',
      stages: '기초 · 중급 · 심화',
    },
    {
      id: 'linux',
      title: 'Linux',
      icon: '🐧',
      description: 'Linux 터미널 명령어를 배워보세요',
      color: '89B4FA',
      stages: '기초 · 중급 · 심화',
    },
    {
      id: 'gdb',
      title: 'GDB / FDB',
      icon: '🔍',
      description: '디버거 사용법을 배워보세요',
      color: 'CBA6F7',
      stages: '기초 · 중급 · 심화',
    },
  ]

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
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#a6e3a1' }}>
          🖥️ CommandCraftTutorial
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
        <h1 style={{ fontSize: '24px', color: '#a6e3a1', marginBottom: '8px' }}>
          🎮 카테고리 선택
        </h1>
        <p style={{ color: '#6c7086', fontSize: '13px', marginBottom: '24px' }}>
          학습할 카테고리를 선택하세요
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '900px',
          width: '100%',
        }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/difficulty/${cat.id}`)}
              style={{
                flex: '1',
                minWidth: '240px',
                maxWidth: '280px',
                background: '#13131f',
                border: `1px solid #${cat.color}`,
                borderRadius: '12px',
                padding: '32px 24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', textAlign: 'center' }}>{cat.icon}</div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: `#${cat.color}`,
                textAlign: 'center',
                margin: 0,
              }}>
                {cat.title}
              </h2>
              <p style={{
                fontSize: '12px',
                color: '#a6adc8',
                textAlign: 'center',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {cat.description}
              </p>
              <div style={{
                fontSize: '11px',
                color: '#6c7086',
                textAlign: 'center',
                marginTop: '8px',
              }}>
                {cat.stages}
              </div>
              <button style={{
                marginTop: '8px',
                padding: '10px',
                borderRadius: '8px',
                border: `1px solid #${cat.color}`,
                background: 'transparent',
                color: `#${cat.color}`,
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'Menlo, Monaco, monospace',
                fontWeight: 'bold',
              }}>
                시작하기 →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}