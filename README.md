# 💻 CommandCraftTutorial

> "터미널 명령어를 게임처럼 즐겁게 배우는 인터랙티브 CLI 튜토리얼 서비스"

## 🚀 프로젝트 소개
**CommandCraftTutorial**은 초보 개발자가 Git과 Linux 등 필수 CLI(Command Line Interface) 명령어들을 가상의 터미널 환경에서 직접 입력하며 단계별로 정복해 나가는 교육용 서비스입니다. 단순 이론 학습에서 벗어나 실습 위주의 인터랙티브한 경험을 제공합니다.

## 🛠 주요 기능
* **가상 터미널 구현:** `xterm.js`를 활용하여 웹 브라우저 내에서 실제 터미널과 동일한 환경 제공
* **단계별 튜토리얼:** 기초(init, add)부터 심화(branch, merge)까지 이어지는 스테이지별 미션
* **학습 기록 관리:** 사용자별 학습 진도 및 정답 여부 실시간 DB 연동
* **실시간 랭킹 시스템:** 전체 사용자들의 학습 속도 및 클리어 현황 확인

## ⚙️ 기술 스택
* **Frontend:** React, Tailwind CSS, xterm.js
* **Backend/DB:** Firebase (Firestore, Auth)
* **Deployment:** Firebase Hosting, Vercel

## 폴더 구조

```
CCT/
├── frontend/                   # 프론트엔드 (React + xterm.js)
│   └── src/
│       ├── components/
│       │   ├── Terminal/       # 터미널 UI 컴포넌트
│       │   ├── StagePanel/     # 미션 설명 패널
│       │   └── FeedbackModal/  # 성공/실패 피드백
│       ├── hooks/              # 커스텀 훅
│       ├── pages/              # 페이지 컴포넌트
│       ├── services/           # API 호출
│       ├── store/              # 전역 상태 관리
│       └── utils/              # 유틸 함수
│
└── backend/                    # 백엔드 (Node.js + Express)
    ├── database/
    │   ├── migrations/         # DB 테이블 생성 스크립트
    │   └── seeds/              # 초기 데이터
    ├── src/
    │   ├── controllers/        # API 요청 처리
    │   ├── routes/             # API 라우터
    │   ├── services/
    │   │   ├── grader/         # 명령어 채점 로직
    │   │   └── simulator/      # Git 상태 시뮬레이션
    │   └── data/               # 스테이지 데이터
    └── knexfile.js
```
## 🤝 협업 가이드
* **Branch 전략:** `main` (배포), `develop` (통합), `feature/기능명` (개별 개발)
* **커밋 규칙:** `feat:`, `fix:`, `docs:` 등의 접두사를 사용하여 명확하게 작성
