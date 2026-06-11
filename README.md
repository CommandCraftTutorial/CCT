# 🖥️ CommandCraftTutorial (CCT)

> 터미널 명령어를 게임처럼 배우는 인터랙티브 학습 플랫폼

---

## 📖 프로젝트 소개

CommandCraftTutorial은 Git, Linux, GDB, PDB 등 개발자가 자주 사용하는 터미널 명령어를 게임 형식으로 학습할 수 있는 플랫폼입니다.

가상 터미널 환경에서 직접 명령어를 입력하며 학습할 수 있고, 경쟁 모드를 통해 다른 유저와 점수를 겨룰 수 있습니다.

---

## ✨ 주요 기능

### 📚 학습 모드 (Study Mode)
- Git, Linux, GDB, PDB 카테고리별 문제 제공
- 기초 / 중급 / 심화 난이도 단계별 학습
- 실시간 체크리스트로 진행 상황 확인
- 힌트 시스템 제공

### ⚔️ 경쟁 모드 (Competition Mode)
- 3분 제한 시간 내 최대한 많은 문제 풀기
- 콤보 시스템으로 보너스 점수 획득
- 실시간 랭킹 확인
- 중복 없는 랜덤 문제 출제

### 🏆 리더보드
- 경쟁 모드 최고 점수 기준 랭킹
- 상위 10명 플레이어 확인
- 내 순위 실시간 확인

### 🎮 가상 터미널 엔진
- 실제 터미널과 유사한 가상 환경 제공
- Git, Linux 파일시스템, GDB, PDB 명령어 시뮬레이션
- 시나리오형 심화 문제 (상태 기반 채점)

---

## 🛠️ 기술 스택

### Frontend
- React 18
- React Router DOM
- Axios
- Vite

### Backend
- Node.js
- Express
- Knex.js (Query Builder)
- PostgreSQL

---

## 📁 프로젝트 구조

```
CCT/
├── frontend/
│   └── src/
│       ├── components/
│       │   └── Terminal/
│       ├── pages/
│       │   ├── GamePage.jsx
│       │   ├── CompetitionPage.jsx
│       │   ├── LeaderboardPage.jsx
│       │   ├── CategoryPage.jsx
│       │   └── StageClearPage.jsx
│       └── services/
│           ├── api.js
│           └── stateStageApi.js
│
└── backend/
    └── src/
        ├── routes/
        │   ├── stage.js
        │   └── user.js
        └── services/
            ├── simulator/
            │   ├── engineManager.js
            │   ├── virtualFileSystem.js
            │   ├── virtualGitEngine.js
            │   ├── virtualGdbEngine.js
            │   └── virtualPdbEngine.js
            ├── grader/
            │   └── grader.js
            ├── parser/
            │   └── commandParser.js
            └── stages/
                └── stateStages.js
```
---

## 🚀 시작하기

### 사전 요구사항
- Node.js 18 이상
- PostgreSQL

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-repo/CCT.git
cd CCT
```

```bash
# 백엔드 설치
cd backend
npm install
```

```bash
# 프론트엔드 설치
cd frontend
npm install
```

### 환경 변수 설정

`backend/.env` 파일 생성:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/cct
PORT=3000
```

`frontend/.env` 파일 생성:

```env
VITE_API_URL=http://localhost:3000/api
```

### 실행

```bash
# 백엔드 실행
cd backend
npm run dev

# 프론트엔드 실행 (새 터미널)
cd frontend
npm run dev
```

---

## 🎯 지원 명령어

### Git
| 카테고리 | 명령어 예시 |
|---|---|
| 기초 | `git init`, `git add`, `git commit`, `git status` |
| 중급 | `git branch`, `git checkout`, `git merge`, `git log` |
| 심화 | `git rebase`, `git cherry-pick`, `git tag`, `git stash` |

### Linux
| 카테고리 | 명령어 예시 |
|---|---|
| 기초 | `ls`, `cd`, `mkdir`, `touch`, `rm`, `cp`, `mv` |
| 중급 | `grep`, `find`, `chmod`, `ps`, `df`, `du` |
| 심화 | `tar`, `sed`, `awk`, `curl`, `ssh`, `crontab` |

### GDB
| 카테고리 | 명령어 예시 |
|---|---|
| 기초 | `file`, `run`, `break`, `next`, `step` |
| 중급 | `print`, `backtrace`, `continue`, `where` |
| 심화 | `condition`, `watch`, `commands`, `alias` |

### PDB
| 카테고리 | 명령어 예시 |
|---|---|
| 기초 | `python -m pdb`, `n`, `s`, `c`, `q` |
| 중급 | `b`, `p`, `pp`, `w`, `l` |
| 심화 | `condition`, `until`, `tbreak`, `debug` |

---

## 🔑 채점 방식

### 일반 문제
- `answer`: 정확한 문자열 매칭
- `answer_regex`: 정규식 패턴 매칭

### 시나리오형 심화 문제
- 상태 기반 채점 (`clearCondition`)
- 체크리스트 항목별 진행 상황 표시
- 가상 파일시스템/엔진 상태로 판별

---

## 📊 점수 시스템

### 학습 모드
- 문제 클리어 시 +100점
- 누적 점수 저장

### 경쟁 모드
- 기본 +100점
- 콤보 3회: +50점
- 콤보 5회: +50점
- 콤보 10회: +100점
- 남은 시간 × 2점 보너스
- 오답 1회당 -10점 패널티
- 최고 점수만 저장 (누적 아님)

---

## 🌐 배포

- Frontend: [Vercel](https://cct-teal.vercel.app)
- Backend: 별도 서버 배포
