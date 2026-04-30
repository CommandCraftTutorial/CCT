import { useNavigate, useLocation } from 'react-router-dom'; // 1. useLocation 추가 필수!

export default function StageClearPage() {
  const navigate = useNavigate();
  const location = useLocation(); // 2. 정상적으로 호출
  
  // 3. Optional Chaining(?.)을 사용해 데이터가 없을 때의 에러 방지
  const total = location.state?.total || 5;
  const finalScore = location.state?.finalScore || 0;

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleRestart = () => {
    // 주의: 유저 정보를 지우면 로그인이 풀릴 수 있으니, 
    // 게임 데이터만 초기화하고 싶다면 score만 0으로 바꾸는 것이 좋습니다.
    navigate('/category')
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0f0f17',
      color: '#cdd6f4',
      fontFamily: 'Menlo, Monaco, monospace',
      textAlign: 'center',
      gap: '24px',
    }}>

      {/* 트로피 */}
      <div style={{ fontSize: '80px', lineHeight: 1 }}>🏆</div>

      {/* 타이틀 */}
      <div>
        <h1 style={{
          fontSize: '32px',
          color: '#a6e3a1',
          margin: '0 0 8px',
          letterSpacing: '2px',
        }}>
          MISSION COMPLETE
        </h1>
        <p style={{ color: '#6c7086', fontSize: '14px', margin: 0 }}>
          모든 스테이지를 완료했습니다!
        </p>
      </div>

      {/* 점수 카드 */}
      <div style={{
        background: '#13131f',
        border: '1px solid #2a2a3d',
        borderRadius: '12px',
        padding: '24px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minWidth: '300px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '16px',
          borderBottom: '1px solid #2a2a3d',
        }}>
          <span style={{ color: '#6c7086', fontSize: '13px' }}>플레이어</span>
          <span style={{ color: '#cdd6f4', fontSize: '13px' }}>👤 {user.username}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '16px',
          borderBottom: '1px solid #2a2a3d',
        }}>
          <span style={{ color: '#6c7086', fontSize: '13px' }}>완료 스테이지</span>
          {/* 전달받은 total 값을 사용하여 표시 */}
          <span style={{ color: '#cdd6f4', fontSize: '13px' }}>{total} / {total}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: '#6c7086', fontSize: '13px' }}>최종 점수</span>
          <span style={{ color: '#f9e2af', fontSize: '20px', fontWeight: 'bold' }}>
            🏆 {finalScore}점
          </span>
        </div>
      </div>

      {/* 버튼들 */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleRestart}
          style={{
            padding: '12px 32px',
            borderRadius: '8px',
            border: '1px solid #a6e3a1',
            background: 'transparent',
            color: '#a6e3a1',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'Menlo, Monaco, monospace',
          }}
        >
          🎮 스테이지
        </button>
        <button
          onClick={() => navigate('/game')}
          style={{
            padding: '12px 32px',
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
          🔄 다시하기
        </button>
      </div>

    </div>
  )
}