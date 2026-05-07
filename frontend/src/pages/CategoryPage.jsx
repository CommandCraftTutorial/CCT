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
      color: 'A6E3A1',
      stages: '기초 10개 · 중급 10개 · 심화 10개',
    },
    {
      id: 'linux',
      title: 'Linux',
      icon: '🐧',
      description: 'Linux 터미널 명령어를 배워보세요',
      color: '89B4FA',
      stages: '기초 5개 · 중급 5개 · 심화 5개',
    },
    {
      id: 'gdb',
      title: 'GDB',
      icon: '🔍',
      description: 'GNU 디버거 사용법을 배워보세요',
      color: 'F38BA8',
      stages: '기초 5개 · 중급 5개 · 심화 3개',
    },
    {
      id: 'pdb',
      title: 'PDB',
      icon: '🐍',
      description: 'Python 디버거 사용법을 배워보세요',
      color: 'F9E2AF',
      stages: '기초 5개 · 중급 5개 · 심화 3개',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/leaderboard')}
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
            🏆 랭킹
          </button>
          <span style={{ color: '#a6adc8', fontSize: '13px' }}>👤 {user.username}</span>
        </div>
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
        <h1 style={{ fontSize: '24px', color: '#a6e3a1', margin: '0 0 8px' }}>
          🎮 명령어 선택
        </h1>
        <p style={{ color: '#6c7086', fontSize: '13px', marginBottom: '24px' }}>
          학습할 명령어를 선택하세요
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          maxWidth: '700px',
          width: '100%',
        }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/difficulty/${cat.id}`)}
              style={{
                background: '#13131f',
                border: `1px solid #${cat.color}`,
                borderRadius: '12px',
                padding: '28px 24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '48px' }}>{cat.icon}</div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: `#${cat.color}`,
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
              }}>
                {cat.stages}
              </div>
              <button style={{
                marginTop: '4px',
                padding: '8px 24px',
                borderRadius: '8px',
                border: `1px solid #${cat.color}`,
                background: 'transparent',
                color: `#${cat.color}`,
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'Menlo, Monaco, monospace',
                fontWeight: 'bold',
                width: '100%',
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