import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaderboard } from '../services/api'
import './LeaderboardPage.css'

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

  const myRankIndex = rankings.findIndex(r => r.username === user.username)
  const myRanking = rankings.find(r => r.username === user.username)

  return (
    <div className="leaderboard-page">
      <header className="leaderboard-header">
        <button
          className="leaderboard-back-brand"
          onClick={() => navigate('/category')}
        >
          <span className="leaderboard-back-arrow">←</span>
          <span className="leaderboard-prompt">&gt;_</span>
          <span className="leaderboard-logo">CommandCraftTutorial</span>
        </button>

        <div className="leaderboard-user-box">
          <span className="leaderboard-user-icon">👤</span>
          <span>{user.username || 'player01'}</span>
        </div>
      </header>

      <main className="leaderboard-main">
        <section className="leaderboard-hero">
          <p className="leaderboard-kicker">PLAYER RANKING</p>

          <h1 className="leaderboard-title">
            🏆 Ranking Dashboard
          </h1>

          <p className="leaderboard-command">
            $ leaderboard --top 10
          </p>

          <p className="leaderboard-subtitle">
            상위 10명의 플레이어와 내 현재 순위를 확인하세요.
          </p>
        </section>

        {loading ? (
          <section className="leaderboard-panel leaderboard-loading">
            <span className="leaderboard-loading-cursor">$</span>
            <span>랭킹 데이터를 불러오는 중...</span>
          </section>
        ) : (
          <section className="leaderboard-panel">
            <div className="leaderboard-panel-header">
              <div>
                <p className="leaderboard-panel-kicker">SCORE BOARD</p>
                <h2 className="leaderboard-panel-title">Top Players</h2>
              </div>

              <span className="leaderboard-panel-badge">
                TOP 10
              </span>
            </div>

            {myRankIndex !== -1 && (
              <div className="leaderboard-my-rank">
                <span className="leaderboard-my-rank-label">
                  내 순위
                </span>

                <strong>
                  {myRankIndex + 1}위 · {myRanking?.score}점
                </strong>
              </div>
            )}

            <div className="leaderboard-list">
              {rankings.map((player, index) => {
                const isMe = player.username === user.username

                return (
                  <article
                    key={player.id}
                    className={`leaderboard-row ${isMe ? 'is-me' : ''}`}
                    style={{
                      '--rank-color': `#${getRankColor(index)}`,
                    }}
                  >
                    <div className="leaderboard-rank">
                      {getRankIcon(index)}
                    </div>

                    <div className="leaderboard-player-info">
                      <div className="leaderboard-player-name">
                        {player.username}

                        {isMe && (
                          <span className="leaderboard-me-badge">
                            ME
                          </span>
                        )}
                      </div>

                      <div className="leaderboard-player-stage">
                        스테이지 {player.current_stage} 진행중
                      </div>
                    </div>

                    <div className="leaderboard-score">
                      {player.score}
                      <span> XP</span>
                    </div>
                  </article>
                )
              })}

              {rankings.length === 0 && (
                <div className="leaderboard-empty">
                  아직 랭킹 데이터가 없어요
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}