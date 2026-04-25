import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#1e1e2e',
      color: '#cdd6f4'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>🖥️ CLI Tutorial</h1>
      <p style={{ color: '#a6adc8', marginBottom: '32px' }}>
        Git 명령어를 게임처럼 배워보세요
      </p>
      <input
        type="text"
        placeholder="닉네임 입력"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        style={{
          padding: '12px 20px',
          borderRadius: '8px',
          border: '1px solid #45475a',
          background: '#313244',
          color: '#cdd6f4',
          fontSize: '16px',
          marginBottom: '16px',
          width: '280px',
          outline: 'none'
        }}
      />
      <button
        onClick={handleLogin}
        style={{
          padding: '12px 40px',
          borderRadius: '8px',
          border: 'none',
          background: '#a6e3a1',
          color: '#1e1e2e',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '280px'
        }}
      >
        시작하기
      </button>
    </div>
  )
}