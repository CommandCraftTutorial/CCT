import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaderboard } from '../services/api'

export default function LeaderboardPage() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getLeaderboard()
      .then(res => {
        setRankings(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getRankIcon = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}`
  }

  const getRankColor = (index) => {
    if (index === 0) return 'F9E2AF'
    if (index === 1) return 'A6ADB8'
    if (index === 2) return 'F38BA8'
    return '6C7086'
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
          ← 🖥️ CommandCraft Tutorial
        </span>
        <span style={{ color: '#a6adc8', fontSize: '13px' }}>👤 {user.username}</span>
      </div>

      {/* 메인 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 24px',
        gap: '24px',
        overflowY: 'auto', 
        height: 'calc(100vh - 53px)',
      }}>
        <h1 style={{ fontSize: '24px', color: '#f9e2af', margin: 0 }}>
          🏆 랭킹 대시보드
        </h1>
        <p style={{ color: '#6c7086', fontSize: '13px', margin: 0 }}>
          상위 10명의 플레이어
        </p>

        {loading ? (
          <p style={{ color: '#6c7086' }}>로딩 중...</p>
        ) : (
          <div style={{
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {/* 내 순위 */}
            {rankings.findIndex(r => r.username === user.username) !== -1 && (
              <div style={{
                padding: '12px 20px',
                background: '#1a2a1a',
                border: '1px solid #a6e3a1',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#a6e3a1',
                textAlign: 'center',
              }}>
                내 순위: {rankings.findIndex(r => r.username === user.username) + 1}위
                &nbsp;·&nbsp;
                {rankings.find(r => r.username === user.username)?.score}점
              </div>
            )}

            {/* 랭킹 목록 */}
            {rankings.map((player, index) => (
              <div
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  background: player.username === user.username ? '#1a2a1a' : '#13131f',
                  border: `1px solid ${player.username === user.username ? '#a6e3a1' : '#2a2a3d'}`,
                  borderRadius: '10px',
                }}
              >
                {/* 순위 */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: '#0f0f17',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: index < 3 ? '20px' : '14px',
                  fontWeight: 'bold',
                  color: `#${getRankColor(index)}`,
                  flexShrink: 0,
                }}>
                  {getRankIcon(index)}
                </div>

                {/* 유저 정보 */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: player.username === user.username ? '#a6e3a1' : '#cdd6f4',
                    marginBottom: '4px',
                  }}>
                    {player.username}
                    {player.username === user.username && (
                      <span style={{ fontSize: '11px', color: '#a6e3a1', marginLeft: '8px' }}>
                        (나)
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6c7086' }}>
                    스테이지 {player.current_stage} 진행중
                  </div>
                </div>

                {/* 점수 */}
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: `#${getRankColor(index)}`,
                }}>
                  {player.score}점
                </div>
              </div>
            ))}

            {rankings.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#6c7086',
                padding: '40px',
                fontSize: '13px',
              }}>
                아직 랭킹 데이터가 없어요
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}