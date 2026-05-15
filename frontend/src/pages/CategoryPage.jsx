import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // 1. useState, useEffect 추가
import axios from 'axios'; // 2. axios 추가
import './CategoryPage.css';

export default function CategoryPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  // 3. 모든 카테고리의 통계를 저장할 상태 변수
  const [allStats, setAllStats] = useState({});

  useEffect(() => {
    console.log("카테고리 페이지 로딩됨 - API 호출 시작");
    // 4. 모든 카테고리의 데이터를 가져오는 로직 (백엔드 설계에 따라 다를 수 있음)
    // 여기서는 간단하게 기본 카테고리 리스트를 순회하며 각각 가져옵니다.
    const fetchStats = async () => {
      const categoryIds = ['git', 'linux', 'gdb', 'pdb'];
      const statsResult = {};

      for (const id of categoryIds) {
        try {

          //주소 확인 
          const res = await axios.get(`http://localhost:3000/api/stages/stats/${id}`);
          console.log(`${id} API 응답 원본:`, res.data);

          //기본값 설정
          const categoryMap = { 기초: 0, 중급: 0, 심화: 0 };

          // 에러 방지: 데이터가 배열인지 확인
          if (res.data && Array.isArray(res.data)) {
            res.data.forEach(item => {
              const key = item.difficulty;
              const count = parseInt(item.count) || 0;
              // DB의 difficulty 값이 '기초', '중급', '심화'와 일치해야 함
              if (key === '기초' || key === 'beginner') categoryMap['기초'] = count;
              if (key === '중급' || key === 'intermediate') categoryMap['중급'] = count;
              if (key === '심화' || key === 'advanced') categoryMap['심화'] = count;
            });
          }
          statsResult[id] = categoryMap;
        } catch (err) {
          console.error(`${id} 데이터 로딩 실패`, err);
          statsResult[id] = { 기초: 0, 중급: 0, 심화: 0 };
        }
      }
      console.log('최종 가공된 statsResult:', statsResult);
      setAllStats(statsResult);
    };
    fetchStats();
  }, []);


  // 5. 스테이지 정보를 동적으로 생성하는 헬퍼 함수 - 렌더링 함수
  const getStageText = (catId) => {
    const s = allStats[catId];
    console.log(`${catId}의 현재 상태:`, s);

    if (!s) return "데이터 로딩 중...";
    return `기초 ${s.기초}개 · 중급 ${s.중급}개 · 심화 ${s.심화}개`;
  };

 //카테고리 
  const categories = [
    {
      id: 'git',
      title: 'Git',
      icon: '🌿',
      command: 'git init',
      description: 'Git 버전 관리 명령어를 배워보세요',
      color: 'A6E3A1',
      difficulty: 'BEGINNER',
    },
    {
      id: 'linux',
      title: 'Linux',
      icon: '🐧',
      command: 'ls -al',
      description: 'Linux 터미널 명령어를 배워보세요',
      color: '89B4FA',
      difficulty: 'BASIC',
    },
    {
      id: 'gdb',
      title: 'GDB',
      icon: '🔍',
      command: 'gdb ./main',
      description: 'GNU 디버거 사용법을 배워보세요',
      color: 'F38BA8',
      difficulty: 'DEBUG',
    },
    {
      id: 'pdb',
      title: 'PDB',
      icon: '🐍',
      command: 'python -m pdb',
      description: 'Python 디버거 사용법을 배워보세요',
      color: 'F9E2AF',
      difficulty: 'PYTHON',
    },
  ]

  return (
    <div className="category-page">
      <header className="cct-header">
        <div className="cct-brand">
          <span className="cct-prompt">&gt;_</span>
          <span className="cct-logo">CommandCraftTutorial</span>
        </div>

        <div className="cct-header-right">
          <button
            className="cct-pill category-ranking-button"
            onClick={() => navigate('/leaderboard')}
          >
            🏆 Ranking
          </button>

          <div className="cct-pill">
            <span>👤</span>
            <span>{user.username || 'player01'}</span>
          </div>
        </div>
      </header>

      <main className="category-main">
        <section className="category-hero">
          <p className="category-kicker">COMMAND TRAINING HUB</p>
          <h1 className="category-title">
            Select Your Command Field
          </h1>
          <p className="category-subtitle">
            학습할 명령어 분야를 선택하고 미션을 시작하세요.
          </p>
        </section>

        <section className="category-grid">
          {categories.map((cat) => (
            <article
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/difficulty/${cat.id}`)}
              style={{
                '--category-color': `#${cat.color}`,
              }}
            >
              <div className="category-card-header">
                <div className="category-card-command">
                  <span className="category-status-dot"></span>
                  <span>$ {cat.command}</span>
                </div>

                <span className="category-difficulty">
                  {cat.difficulty}
                </span>
              </div>

              <div className="category-card-body">
                <div className="category-icon">
                  {cat.icon}
                </div>

                <div className="category-card-text">
                  <h2 className="category-card-title">
                    {cat.title}
                  </h2>

                  <p className="category-description">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="category-stage-info">
                <span>📋 Stage Log</span>
                <strong>{getStageText(cat.id)}</strong>
              </div>

              <button className="category-start-button">
                🎮 미션 선택하기
              </button>
            </article>
          ))}
        </section>

        {/* 던전 버튼 추가 */}
        <section
          onClick={() => navigate('/dungeon')}
          style={{
            marginTop: '24px',
            padding: '24px',
            background: '#13131f',
            border: '1px solid #f9e2af',
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '40px' }}>🏰</div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ color: '#f9e2af', fontSize: '18px', margin: '0 0 6px', fontFamily: 'Menlo, Monaco, monospace' }}>
              파일 던전 탐험
            </h2>
            <p style={{ color: '#a6adc8', fontSize: '12px', margin: 0, fontFamily: 'Menlo, Monaco, monospace' }}>
              CLI 명령어로 던전을 탐험하며 미션을 클리어하세요!
            </p>
          </div>
          <div style={{ marginLeft: 'auto', color: '#f9e2af', fontSize: '20px' }}>
            →
          </div>
        </section>

      </main>

      <footer className="category-footer">
        💡 카테고리를 선택하면 난이도 선택 화면으로 이동합니다.
      </footer>
    </div>
  )
}