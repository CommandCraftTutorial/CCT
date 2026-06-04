// services/stages/stateStages.js

const allCommits = (state) =>
  Object.entries(state.branches || {}).flatMap(([branch, data]) =>
    (data.commits || []).map(c => ({ ...c, branch }))
  )

const commitsOnBranch = (state, branch) =>
  state.branches?.[branch]?.commits ?? []

const filesEverCommitted = (state) =>
  new Set(allCommits(state).flatMap(c => c.files ?? []))

// ─────────────────────────────────────────────

const stateStages = [

  // ══════════════════════════════════════════
  // GIT 심화
  // ══════════════════════════════════════════
  {
    id: "git-adv-1",
    category: 1090,
    difficulty: "심화",
    title: "선택적 파일 커밋",
    mission: "app.js와 README.md만 첫 커밋에 포함하고, secret.env는 절대 커밋하지 마세요.",
    description: "팀 프로젝트를 시작합니다. 민감한 환경변수 파일(secret.env)은 절대 커밋하면 안 됩니다.",
    initialFiles: ["app.js", "README.md", "secret.env"],
    clearCondition: (state) => {
      const committed = filesEverCommitted(state)
      return (
        state.initialized === true &&
        committed.has("app.js") &&
        committed.has("README.md") &&
        !committed.has("secret.env")
      )
    },
    checks: [
      {
        label: "Git 저장소 초기화됨",
        check: (state) => state.initialized === true,
        hint: "git init 을 먼저 실행하세요."
      },
      {
        label: "app.js 커밋됨",
        check: (state) => filesEverCommitted(state).has("app.js"),
        hint: "git add app.js 후 git commit 하세요."
      },
      {
        label: "README.md 커밋됨",
        check: (state) => filesEverCommitted(state).has("README.md"),
        hint: "git add README.md 후 git commit 하세요."
      },
      {
        label: "secret.env 커밋 안 됨",
        check: (state) => !filesEverCommitted(state).has("secret.env"),
        hint: "git add . 대신 파일명을 명시해서 add 하세요."
      }
    ],
    examples: ["git init", "git add app.js README.md", "git commit -m 'first commit'"]
  },

  {
    id: "git-adv-2",
    category: 1091,
    difficulty: "심화",
    title: "브랜치 전략 적용",
    mission: "feature/login 브랜치를 만들고 그 브랜치에서만 login.js를 커밋하세요.",
    description: "main 브랜치에 직접 커밋하지 않는 것이 팀 협업의 기본입니다.",
    initialFiles: ["login.js"],
    clearCondition: (state) =>
      Object.keys(state.branches || {}).includes("feature/login") &&
      commitsOnBranch(state, "feature/login").some(c => c.files?.includes("login.js")) &&
      !commitsOnBranch(state, "main").some(c => c.files?.includes("login.js")),
    checks: [
      {
        label: "feature/login 브랜치 존재함",
        check: (state) => Object.keys(state.branches || {}).includes("feature/login"),
        hint: "git checkout -b feature/login 으로 브랜치를 생성하세요."
      },
      {
        label: "feature/login 에서 login.js 커밋됨",
        check: (state) => commitsOnBranch(state, "feature/login").some(c => c.files?.includes("login.js")),
        hint: "feature/login 브랜치로 이동 후 커밋하세요."
      },
      {
        label: "main 에는 login.js 커밋 없음",
        check: (state) => !commitsOnBranch(state, "main").some(c => c.files?.includes("login.js")),
        hint: "main 브랜치에서 커밋하지 마세요."
      }
    ],
    examples: ["git init", "git checkout -b feature/login", "git add login.js", "git commit -m 'add login'"]
  },

  // ══════════════════════════════════════════
  // LINUX 심화
  // ══════════════════════════════════════════
  {
    id: "linux-adv-1",
    category: 1092,
    difficulty: "심화",
    title: "디렉토리 구조 만들기",
    mission: "src 디렉토리를 만들고, 그 안에 index.js를 생성한 뒤 logs 디렉토리도 만드세요.",
    description: "프로젝트 초기 디렉토리 구조를 직접 구성해봅니다.",
    initialFiles: [],
    clearCondition: (state) => {
      const files = state.files || {}
      return (
        files['src']?.type === 'dir' &&
        files['src']?.children?.['index.js']?.type === 'file' &&
        files['logs']?.type === 'dir'
      )
    },
    checks: [
      {
        label: "src 디렉토리 생성됨",
        check: (state) => (state.files || {})['src']?.type === 'dir',
        hint: "mkdir src 를 실행하세요."
      },
      {
        label: "src/index.js 파일 생성됨",
        check: (state) => (state.files || {})['src']?.children?.['index.js']?.type === 'file',
        hint: "touch src/index.js 를 실행하세요."
      },
      {
        label: "logs 디렉토리 생성됨",
        check: (state) => (state.files || {})['logs']?.type === 'dir',
        hint: "mkdir logs 를 실행하세요."
      }
    ],
    examples: ["mkdir src", "touch src/index.js", "mkdir logs"]
  },

  {
    id: "linux-adv-2",
    category: 1093,
    difficulty: "심화",
    title: "파일 정리하기",
    mission: "temp.log를 삭제하고, config.txt를 backup 디렉토리로 이동하세요.",
    description: "불필요한 파일을 정리하고, 중요한 파일을 안전한 위치로 옮기는 작업입니다.",
    initialFiles: ["temp.log", "config.txt"],
    clearCondition: (state) => {
      const files = state.files || {}
      return (
        !files['temp.log'] &&
        !files['config.txt'] &&
        files['backup']?.children?.['config.txt']?.type === 'file'
      )
    },
    checks: [
      {
        label: "temp.log 삭제됨",
        check: (state) => !(state.files || {})['temp.log'],
        hint: "rm temp.log 를 실행하세요."
      },
      {
        label: "backup 디렉토리 생성됨",
        check: (state) => (state.files || {})['backup']?.type === 'dir',
        hint: "mkdir backup 을 먼저 실행하세요."
      },
      {
        label: "config.txt가 backup 안으로 이동됨",
        check: (state) => (state.files || {})['backup']?.children?.['config.txt']?.type === 'file',
        hint: "mv config.txt backup/ 을 실행하세요."
      }
    ],
    examples: ["rm temp.log", "mkdir backup", "mv config.txt backup/"]
  },

  // ══════════════════════════════════════════
  // GDB 심화
  // ══════════════════════════════════════════
  {
    id: "gdb-adv-1",
    category: 1094,
    difficulty: "심화",
    title: "브레이크포인트 설정 후 실행",
    mission: "프로그램을 로드하고, main 함수에 브레이크포인트를 설정한 뒤 실행하세요.",
    description: "GDB로 프로그램 디버깅의 기본 흐름을 익힙니다.",
    initialFiles: [],
    clearCondition: (state) =>
      state.program !== null &&
      state.breakpoints?.some(bp => bp.location === 'main') &&
      state.running === true,
    checks: [
      {
        label: "프로그램이 로드됨",
        check: (state) => state.program !== null,
        hint: "file <프로그램명> 으로 로드하세요."
      },
      {
        label: "main에 브레이크포인트 설정됨",
        check: (state) => state.breakpoints?.some(bp => bp.location === 'main'),
        hint: "break main 을 실행하세요."
      },
      {
        label: "프로그램 실행됨",
        check: (state) => state.running === true,
        hint: "run 을 실행하세요."
      }
    ],
    examples: ["file program", "break main", "run"]
  },

  // ══════════════════════════════════════════
  // PDB 심화
  // ══════════════════════════════════════════
  {
    id: "pdb-adv-1",
    category: 1095,
    difficulty: "심화",
    title: "Python 디버깅 기본",
    mission: "스크립트를 로드하고, 5번째 줄에 브레이크포인트를 설정한 뒤 실행하세요.",
    description: "PDB로 Python 스크립트를 단계별로 디버깅합니다.",
    initialFiles: [],
    clearCondition: (state) =>
      state.program !== null &&
      state.breakpoints?.includes(5) &&
      state.running === true,
    checks: [
      {
        label: "스크립트가 로드됨",
        check: (state) => state.program !== null,
        hint: "python -m pdb <스크립트명> 으로 로드하세요."
      },
      {
        label: "5번째 줄에 브레이크포인트 설정됨",
        check: (state) => state.breakpoints?.includes(5),
        hint: "b 5 를 실행하세요."
      },
      {
        label: "프로그램 실행됨",
        check: (state) => state.running === true,
        hint: "c 를 실행하세요."
      }
    ],
    examples: ["python -m pdb script.py", "b 5", "c"]
  }
]

// ─────────────────────────────────────────────

function getStateStages()              { return stateStages }
function getStateStageById(id)         { return stateStages.find(s => s.id === String(id)) }
function getStateStagesByCategory(cat) { return stateStages.filter(s => s.category === cat) }

module.exports = {
  getStateStages,
  getStateStageById,
  getStateStagesByCategory
}