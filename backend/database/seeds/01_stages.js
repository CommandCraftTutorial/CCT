exports.seed = async function(knex) {
  await knex('stages').del()
  await knex('stages').insert([

    // ── Git 기초 ──────────────────────────
    {
      title: '저장소 초기화',
      description: 'Git 저장소를 처음 만들 때 사용하는 명령어입니다.',
      mission: '새로운 Git 저장소를 초기화하세요',
      answer: 'git init',
      hint: 'git init 명령어는 새 Git 저장소를 만듭니다',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: '파일 추가하기',
      description: '변경된 파일을 스테이징 영역에 추가하세요.',
      mission: '모든 파일을 스테이징 영역에 추가하세요',
      answer: 'git add .',
      hint: '. 은 현재 폴더의 모든 파일을 의미합니다',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: '커밋 만들기',
      description: '스테이징된 파일을 커밋하세요.',
      mission: '스테이징된 파일을 메시지와 함께 커밋하세요',
      answer_regex: '^git commit -m ".+"$',
      hint: 'git commit -m "메시지" 형식으로 입력하세요. 예시) git commit -m "first commit"',
      difficulty: '기초',
      category: 'git'
    },

    // ── Git 중급 ──────────────────────────
    {
      title: '브랜치 만들기',
      description: '새로운 브랜치를 생성하세요.',
      mission: '새로운 브랜치를 생성하세요',
      answer_regex: '^git branch .+$',
      hint: 'git branch 뒤에 원하는 브랜치 이름을 입력하세요',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: '브랜치 이동',
      description: '다른 브랜치로 이동하세요.',
      mission: '생성한 브랜치로 이동하세요',
      answer_regex: '^git checkout .+$',
      hint: 'git checkout 뒤에 이동할 브랜치 이름을 입력하세요',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: '상태 확인하기',
      description: '현재 저장소의 상태를 확인하세요.',
      mission: '현재 저장소 상태를 확인하세요',
      answer: 'git status',
      hint: 'git status 명령어로 현재 상태를 확인할 수 있습니다',
      difficulty: '중급',
      category: 'git'
    },

    // ── Git 심화 ──────────────────────────
    {
      title: '커밋 로그 확인',
      description: '지금까지의 커밋 기록을 확인하세요.',
      mission: '커밋 히스토리를 확인하세요',
      answer: 'git log',
      hint: 'git log 명령어로 커밋 기록을 볼 수 있습니다',
      difficulty: '심화',
      category: 'git'
    },

    // ── Linux 기초 ──────────────────────────
    {
      title: '현재 위치 확인',
      description: '현재 내가 어느 폴더에 있는지 확인하세요.',
      mission: '현재 디렉토리 경로를 출력하세요',
      answer: 'pwd',
      hint: 'pwd는 Print Working Directory의 약자입니다',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '파일 목록 보기',
      description: '현재 폴더에 있는 파일 목록을 확인하세요.',
      mission: '현재 폴더의 파일 목록을 출력하세요',
      answer: 'ls',
      hint: 'ls 명령어로 파일 목록을 볼 수 있습니다',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '폴더 이동',
      description: '다른 폴더로 이동하세요.',
      mission: 'documents 폴더로 이동하세요',
      answer: 'cd documents',
      hint: 'cd 뒤에 이동할 폴더 이름을 입력하세요',
      difficulty: '기초',
      category: 'linux'
    },

    // ── Linux 중급 ──────────────────────────
    {
      title: '폴더 만들기',
      description: '새로운 폴더를 생성하세요.',
      mission: 'myfolder 라는 폴더를 만드세요',
      answer: 'mkdir myfolder',
      hint: 'mkdir 뒤에 만들 폴더 이름을 입력하세요',
      difficulty: '중급',
      category: 'linux'
    },
    {
      title: '파일 내용 보기',
      description: '파일의 내용을 출력하세요.',
      mission: 'readme.txt 파일의 내용을 출력하세요',
      answer: 'cat readme.txt',
      hint: 'cat 뒤에 파일 이름을 입력하세요',
      difficulty: '중급',
      category: 'linux'
    },

    // ── GDB 기초 ──────────────────────────
    {
      title: 'GDB 실행',
      description: 'GDB 디버거로 프로그램을 실행하세요.',
      mission: 'program 파일을 GDB로 실행하세요',
      answer: 'gdb program',
      hint: 'gdb 뒤에 실행할 프로그램 이름을 입력하세요',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: '브레이크포인트 설정',
      description: '특정 줄에 브레이크포인트를 설정하세요.',
      mission: 'main 함수에 브레이크포인트를 설정하세요',
      answer: 'break main',
      hint: 'break 뒤에 함수 이름이나 줄 번호를 입력하세요',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: '프로그램 실행',
      description: 'GDB에서 프로그램을 실행하세요.',
      mission: 'GDB에서 프로그램을 실행하세요',
      answer: 'run',
      hint: 'run 명령어로 프로그램을 실행할 수 있습니다',
      difficulty: '기초',
      category: 'gdb'
    },
  ])
}