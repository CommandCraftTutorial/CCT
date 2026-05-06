import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import './LoginPage.css'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username.trim()) return

    const { data } = await loginUser(username)
    localStorage.setItem('user', JSON.stringify(data))
    navigate('/game')
  }

  return (
    <div className="login-page">
      <div className="login-bg-code">
        <span>$ git init</span>
        <span>$ git add .</span>
        <span>$ git commit -m</span>
        <span>$ git branch</span>
        <span>$ git checkout</span>
        <span>$ git push</span>
      </div>

      <main className="login-content">
        <h1 className="login-brand">
          <span className="login-prompt">&gt;_</span> CommandCraft
        </h1>

        <p className="login-subtitle">Git Command Adventure</p>
        <p className="login-message">터미널 훈련에 접속하세요.</p>

        <section className="login-card">
          <div className="login-card-header">
            <div className="window-dots">
              <span />
              <span />
              <span />
            </div>
            <span>ACCESS TERMINAL</span>
          </div>

          <label className="login-label" htmlFor="access-id">
            Access ID
          </label>

          <input
            id="access-id"
            className="login-input"
            type="text"
            placeholder="Access ID 입력..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          <button className="login-button" onClick={handleLogin}>
            &gt;_ ACCESS TERMINAL
          </button>

          <p className="login-help">
            Enter 키로 접속
          </p>
        </section>

        <p className="login-footer-text">
          💡 Git 명령어를 게임처럼 배우고, 미션을 클리어하세요!
        </p>
      </main>
    </div>
  )
}