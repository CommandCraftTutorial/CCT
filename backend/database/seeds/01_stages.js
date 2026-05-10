exports.seed = async function(knex) {
  await knex('stages').del()
  await knex('stages').insert([
 
    // ══════════════════════════════════════════════════════════════
    // GIT (30) - 기초 10 / 중급 10 / 심화 10
    // ══════════════════════════════════════════════════════════════
 
    // ── Git 기초 ──────────────────────────
    {
      title: '저장소 초기화',
      description: 'Git 저장소를 처음 만들 때 사용하는 명령어.',
      mission: '새로운 Git 저장소를 생성하세요',
      answer: 'git init',
      hint: 'init 은 initialize(초기화)의 줄임말입니다',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: 'Git 버전 확인',
      description: '설치된 Git의 버전을 확인하는 명령어.',
      mission: '현재 설치된 Git 버전을 출력하세요',
      answer: 'git --version',
      hint: '대시(-) 두 개와 version 키워드를 사용합니다',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: '현재 상태 확인',
      description: '저장소의 현재 상태(스테이징/변경 사항)를 확인하는 명령어.',
      mission: '저장소의 상태를 확인하세요',
      answer: 'git status',
      hint: '"상태"의 영어 단어를 떠올려보세요',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: '모든 파일 스테이징',
      description: '변경된 모든 파일을 스테이징 영역에 추가하는 명령어.',
      mission: '모든 파일을 스테이징 영역에 추가하세요',
      answer: 'git add .',
      hint: '. 은 현재 폴더의 모든 파일을 의미합니다',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: '특정 파일 스테이징',
      description: '특정 파일만 스테이징 영역에 추가하는 명령어.',
      mission: '특정 파일 하나를 스테이징 영역에 추가하세요 (git add 파일명)',
      answer_regex: '^git add (?!\\.$).+$',
      hint: 'add 뒤에 파일 이름을 입력하세요',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: '커밋 만들기',
      description: '스테이징된 파일을 메시지와 함께 커밋하는 명령어.',
      mission: '스테이징된 파일을 메시지와 함께 커밋하세요',
      answer_regex: '^git commit -m ".+"$',
      hint: 'git commit -m "메시지" 형식으로 입력하세요',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: '커밋 히스토리 보기',
      description: '지금까지 만든 커밋 기록을 확인하는 명령어.',
      mission: '커밋 히스토리를 출력하세요',
      answer: 'git log',
      hint: '"기록"을 의미하는 영어 단어를 사용합니다',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: '한 줄 로그 보기',
      description: '커밋 히스토리를 한 줄씩 간략하게 보는 옵션.',
      mission: '커밋 히스토리를 한 줄씩 출력하세요',
      answer: 'git log --oneline',
      hint: 'log 뒤에 --oneline 옵션을 붙여보세요',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: '사용자 이름 설정',
      description: '커밋에 기록될 사용자 이름을 설정하는 명령어.',
      mission: '전역 사용자 이름을 설정하세요 (git config --global user.name "이름")',
      answer_regex: '^git config --global user\\.name ".+"$',
      hint: 'git config --global user.name "이름" 형식입니다',
      difficulty: '기초',
      category: 'git'
    },
    {
      title: '이메일 설정',
      description: '커밋에 기록될 이메일을 설정하는 명령어.',
      mission: '전역 사용자 이메일을 설정하세요',
      answer_regex: '^git config --global user\\.email ".+"$',
      hint: 'user.email 키를 사용합니다',
      difficulty: '기초',
      category: 'git'
    },
 
    // ── Git 중급 ──────────────────────────
    {
      title: '브랜치 목록 보기',
      description: '현재 저장소의 모든 브랜치를 확인하는 명령어.',
      mission: '브랜치 목록을 확인하세요',
      answer: 'git branch',
      hint: '옵션 없이 branch 만 입력합니다',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: '브랜치 만들기',
      description: '새로운 브랜치를 생성하는 명령어.',
      mission: '새로운 브랜치를 생성하세요',
      answer_regex: '^git branch [^\\s-].*$',
      hint: 'branch 뒤에 만들 브랜치 이름을 입력하세요',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: '브랜치 이동',
      description: '다른 브랜치로 이동하는 명령어.',
      mission: '특정 브랜치로 이동하세요 (git checkout 브랜치명)',
      answer_regex: '^git checkout (?!-b ).+$',
      hint: 'checkout 뒤에 이동할 브랜치 이름을 입력하세요',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: '브랜치 생성 + 이동',
      description: '브랜치를 만들고 동시에 그 브랜치로 이동하는 명령어.',
      mission: '새 브랜치를 만들고 동시에 이동하세요',
      answer_regex: '^git checkout -b .+$',
      hint: 'checkout 에 -b 옵션을 추가하면 만들면서 이동합니다',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: 'switch로 브랜치 이동',
      description: '최신 Git에서 권장하는 브랜치 이동 명령어.',
      mission: 'switch 명령어로 브랜치를 이동하세요',
      answer_regex: '^git switch .+$',
      hint: 'checkout 의 대체 명령어로 switch 가 있습니다',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: '브랜치 병합',
      description: '다른 브랜치의 변경 사항을 현재 브랜치에 합치는 명령어.',
      mission: '특정 브랜치를 현재 브랜치에 병합하세요',
      answer_regex: '^git merge .+$',
      hint: '"합치다"라는 의미의 영어 단어를 사용합니다',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: '변경 사항 비교',
      description: '아직 스테이징되지 않은 변경 내용을 확인하는 명령어.',
      mission: '워킹 디렉토리의 변경 사항을 확인하세요',
      answer: 'git diff',
      hint: '"차이"를 의미하는 영어 단어의 줄임말입니다',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: '브랜치 삭제',
      description: '필요 없어진 브랜치를 삭제하는 명령어.',
      mission: '특정 브랜치를 삭제하세요 (git branch -d 브랜치명)',
      answer_regex: '^git branch -d .+$',
      hint: 'branch 에 -d 옵션을 붙입니다 (delete)',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: '스테이징 취소',
      description: '실수로 스테이징한 파일을 다시 워킹 디렉토리로 되돌립니다.',
      mission: '스테이징을 취소하세요 (git restore --staged 파일명)',
      answer_regex: '^git restore --staged .+$',
      hint: 'restore 명령어와 --staged 옵션을 사용합니다',
      difficulty: '중급',
      category: 'git'
    },
    {
      title: '파일 삭제',
      description: 'Git 추적 파일을 삭제하고 변경을 스테이징합니다.',
      mission: '추적 중인 파일을 Git에서 삭제하세요',
      answer_regex: '^git rm .+$',
      hint: 'remove의 줄임말 명령어를 사용합니다',
      difficulty: '중급',
      category: 'git'
    },
 
    // ── Git 심화 ──────────────────────────
    {
      title: '원격 저장소 등록',
      description: 'GitHub 등 원격 저장소를 origin 이라는 이름으로 등록합니다.',
      mission: 'origin 이라는 이름으로 원격 저장소를 추가하세요',
      answer_regex: '^git remote add origin .+$',
      hint: 'git remote add <이름> <URL> 형식입니다',
      difficulty: '심화',
      category: 'git'
    },
    {
      title: '원격 저장소 목록',
      description: '등록된 원격 저장소를 자세히 확인합니다.',
      mission: '원격 저장소 목록을 자세히 확인하세요',
      answer: 'git remote -v',
      hint: 'remote 뒤에 -v(verbose) 옵션을 붙입니다',
      difficulty: '심화',
      category: 'git'
    },
    {
      title: '원격으로 푸시',
      description: '로컬 커밋을 원격 저장소로 업로드합니다.',
      mission: 'origin 의 특정 브랜치로 푸시하세요 (git push origin 브랜치명)',
      answer_regex: '^git push origin .+$',
      hint: 'push 뒤에 원격 이름과 브랜치 이름을 적습니다',
      difficulty: '심화',
      category: 'git'
    },
    {
      title: '원격에서 풀',
      description: '원격 저장소의 변경 사항을 가져와서 합칩니다.',
      mission: 'origin 의 특정 브랜치를 풀 받으세요',
      answer_regex: '^git pull origin .+$',
      hint: 'pull 뒤에 원격 이름과 브랜치 이름을 적습니다',
      difficulty: '심화',
      category: 'git'
    },
    {
      title: '저장소 복제',
      description: '원격 저장소를 로컬로 통째로 복제합니다.',
      mission: '특정 원격 저장소를 클론하세요',
      answer_regex: '^git clone .+$',
      hint: '"복제하다"라는 영어 단어를 사용합니다',
      difficulty: '심화',
      category: 'git'
    },
    {
      title: '작업 임시 저장',
      description: '작업 중인 변경 사항을 임시로 저장해 두는 명령어.',
      mission: '현재 변경 사항을 stash 에 저장하세요',
      answer: 'git stash',
      hint: '"숨겨두다"라는 영어 단어입니다',
      difficulty: '심화',
      category: 'git'
    },
    {
      title: '임시 저장 복구',
      description: 'stash 에 저장한 변경 사항을 다시 꺼내옵니다.',
      mission: '가장 최근의 stash 를 복구하세요',
      answer: 'git stash pop',
      hint: 'stash 뒤에 pop 을 붙입니다',
      difficulty: '심화',
      category: 'git'
    },
    {
      title: '직전 커밋 되돌리기',
      description: '직전 커밋을 취소하되 변경 사항은 워킹 디렉토리에 남깁니다.',
      mission: '직전 커밋을 soft 모드로 되돌리세요 (HEAD~1)',
      answer: 'git reset --soft HEAD~1',
      hint: 'reset 의 --soft 옵션과 HEAD~1 을 함께 사용합니다',
      difficulty: '심화',
      category: 'git'
    },
    {
      title: '리베이스',
      description: '커밋 히스토리를 깔끔하게 정리하기 위한 명령어.',
      mission: '특정 브랜치 위로 rebase 하세요',
      answer_regex: '^git rebase .+$',
      hint: '"기반을 다시 잡다"라는 의미의 명령어입니다',
      difficulty: '심화',
      category: 'git'
    },
    {
      title: '태그 만들기',
      description: '특정 커밋에 버전 태그를 붙이는 명령어.',
      mission: '새로운 태그를 생성하세요 (git tag 태그명)',
      answer_regex: '^git tag (?!-).+$',
      hint: 'tag 뒤에 v1.0 같은 태그 이름을 입력하세요',
      difficulty: '심화',
      category: 'git'
    },
 
    // ══════════════════════════════════════════════════════════════
    // LINUX (30) - 기초 10 / 중급 10 / 심화 10
    // ══════════════════════════════════════════════════════════════
 
    // ── Linux 기초 ──────────────────────────
    {
      title: '현재 위치 확인',
      description: '현재 내가 어느 폴더에 있는지 확인합니다.',
      mission: '현재 디렉토리 경로를 출력하세요',
      answer: 'pwd',
      hint: 'pwd는 Print Working Directory의 약자입니다',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '파일 목록 보기',
      description: '현재 폴더에 있는 파일 목록을 확인합니다.',
      mission: '현재 폴더의 파일 목록을 출력하세요',
      answer: 'ls',
      hint: 'ls 명령어로 파일 목록을 볼 수 있습니다',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '폴더 이동',
      description: '다른 폴더로 이동합니다.',
      mission: 'documents 폴더로 이동하세요',
      answer: 'cd documents',
      hint: 'cd 뒤에 이동할 폴더 이름을 입력하세요',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '상위 폴더로 이동',
      description: '현재 폴더의 상위 폴더로 이동합니다.',
      mission: '상위 폴더로 이동하세요',
      answer: 'cd ..',
      hint: '.. 은 상위 폴더를 의미합니다',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '홈 디렉토리로 이동',
      description: '어느 위치에 있든 홈 디렉토리로 바로 이동합니다.',
      mission: '홈 디렉토리로 이동하세요',
      answer: 'cd ~',
      hint: '~ 은 홈 디렉토리를 의미합니다',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '숨김 파일까지 보기',
      description: '점(.)으로 시작하는 숨김 파일까지 모두 출력합니다.',
      mission: '숨김 파일을 포함한 모든 파일을 출력하세요',
      answer: 'ls -a',
      hint: 'ls 에 -a(all) 옵션을 붙입니다',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '자세한 목록 보기',
      description: '권한, 소유자, 크기, 날짜까지 포함된 자세한 정보로 파일 목록을 출력합니다.',
      mission: '자세한 정보로 파일 목록을 출력하세요',
      answer: 'ls -l',
      hint: 'ls 에 -l(long) 옵션을 붙입니다',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '터미널 화면 지우기',
      description: '터미널에 출력된 내용을 모두 지웁니다.',
      mission: '터미널 화면을 깨끗이 지우세요',
      answer: 'clear',
      hint: '"지우다, 깨끗하게 하다"라는 영어 단어입니다',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '문자열 출력',
      description: '터미널에 원하는 문자열을 출력합니다.',
      mission: 'echo 명령어로 임의의 문자열을 출력하세요',
      answer_regex: '^echo .+$',
      hint: 'echo 뒤에 출력할 내용을 입력하세요',
      difficulty: '기초',
      category: 'linux'
    },
    {
      title: '현재 사용자 확인',
      description: '지금 로그인한 사용자의 이름을 출력합니다.',
      mission: '현재 로그인한 사용자 이름을 출력하세요',
      answer: 'whoami',
      hint: '"나는 누구인가?"라는 의미의 한 단어 명령어입니다',
      difficulty: '기초',
      category: 'linux'
    },
 
    // ── Linux 중급 ──────────────────────────
    {
      title: '폴더 만들기',
      description: '새로운 폴더를 생성합니다.',
      mission: 'myfolder 라는 폴더를 만드세요',
      answer: 'mkdir myfolder',
      hint: 'mkdir 뒤에 만들 폴더 이름을 입력하세요',
      difficulty: '중급',
      category: 'linux'
    },
    {
      title: '파일 내용 보기',
      description: '파일의 내용을 출력합니다.',
      mission: 'readme.txt 파일의 내용을 출력하세요',
      answer: 'cat readme.txt',
      hint: 'cat 뒤에 파일 이름을 입력하세요',
      difficulty: '중급',
      category: 'linux'
    },
    {
      title: '파일 복사',
      description: '파일을 다른 위치로 복사합니다.',
      mission: 'file.txt 를 backup.txt 로 복사하세요',
      answer: 'cp file.txt backup.txt',
      hint: 'cp 원본파일 복사할파일 형식입니다',
      difficulty: '중급',
      category: 'linux'
    },
    {
      title: '파일 이동/이름 변경',
      description: '파일을 이동하거나 이름을 바꿉니다.',
      mission: 'old.txt 를 new.txt 로 이름을 변경하세요',
      answer: 'mv old.txt new.txt',
      hint: 'mv 원본 대상 형식입니다',
      difficulty: '중급',
      category: 'linux'
    },
    {
      title: '파일 삭제',
      description: '파일을 삭제합니다.',
      mission: 'temp.txt 파일을 삭제하세요',
      answer: 'rm temp.txt',
      hint: 'rm 뒤에 삭제할 파일 이름을 입력하세요',
      difficulty: '중급',
      category: 'linux'
    },
    {
      title: '빈 파일 만들기',
      description: '비어있는 새 파일을 생성합니다.',
      mission: '새로운 빈 파일을 생성하세요',
      answer_regex: '^touch .+$',
      hint: '"건드리다"라는 의미의 영어 단어 명령어입니다',
      difficulty: '중급',
      category: 'linux'
    },
    {
      title: '빈 폴더 삭제',
      description: '비어있는 폴더를 삭제합니다.',
      mission: '비어있는 폴더를 삭제하세요',
      answer_regex: '^rmdir .+$',
      hint: 'rm + dir 의 결합입니다',
      difficulty: '중급',
      category: 'linux'
    },
    {
      title: '파일 앞부분 보기',
      description: '파일의 앞부분(기본 10줄)만 출력합니다.',
      mission: '파일의 앞부분을 출력하세요',
      answer_regex: '^head .+$',
      hint: '"머리"라는 의미의 영어 단어입니다',
      difficulty: '중급',
      category: 'linux'
    },
    {
      title: '파일 뒷부분 보기',
      description: '파일의 뒷부분(기본 10줄)만 출력합니다.',
      mission: '파일의 뒷부분을 출력하세요',
      answer_regex: '^tail .+$',
      hint: '"꼬리"라는 의미의 영어 단어입니다',
      difficulty: '중급',
      category: 'linux'
    },
    {
      title: '줄 수 세기',
      description: '파일의 줄/단어/문자 수를 세어 출력합니다.',
      mission: '파일의 줄 수를 세어 출력하세요',
      answer_regex: '^wc .+$',
      hint: 'word count 의 줄임말입니다',
      difficulty: '중급',
      category: 'linux'
    },
 
    // ── Linux 심화 ──────────────────────────
    {
      title: '파일 내용 검색',
      description: '파일에서 특정 패턴을 가진 줄을 찾아냅니다.',
      mission: 'grep 으로 특정 패턴을 파일에서 찾으세요',
      answer_regex: '^grep ".+" .+$',
      hint: 'grep "패턴" 파일명 형식입니다',
      difficulty: '심화',
      category: 'linux'
    },
    {
      title: '파일 찾기',
      description: '디렉토리 안에서 이름으로 파일을 찾습니다.',
      mission: '현재 디렉토리에서 특정 이름의 파일을 찾으세요',
      answer_regex: '^find \\. -name ".+"$',
      hint: 'find . -name "파일명" 형식입니다',
      difficulty: '심화',
      category: 'linux'
    },
    {
      title: '권한 변경',
      description: '파일의 읽기/쓰기/실행 권한을 변경합니다.',
      mission: '파일의 권한을 755로 변경하세요',
      answer_regex: '^chmod 755 .+$',
      hint: 'chmod 다음에 권한 숫자와 파일명을 입력하세요',
      difficulty: '심화',
      category: 'linux'
    },
    {
      title: '프로세스 확인',
      description: '현재 실행 중인 프로세스 목록을 확인합니다.',
      mission: '현재 실행 중인 모든 프로세스를 출력하세요',
      answer: 'ps aux',
      hint: 'ps 뒤에 aux 옵션을 붙입니다',
      difficulty: '심화',
      category: 'linux'
    },
    {
      title: '디스크 사용량 확인',
      description: '디스크 사용량을 사람이 읽기 쉬운 형태로 출력합니다.',
      mission: '디스크 사용량을 확인하세요',
      answer: 'df -h',
      hint: 'df 뒤에 -h(human-readable) 옵션을 붙입니다',
      difficulty: '심화',
      category: 'linux'
    },
    {
      title: '폴더 크기 확인',
      description: '특정 폴더가 차지하는 디스크 용량을 사람이 읽기 좋게 출력합니다.',
      mission: '폴더의 총 사용량을 사람이 읽기 좋게 확인하세요',
      answer_regex: '^du -sh .+$',
      hint: 'du 에 -sh(summary, human) 옵션을 붙입니다',
      difficulty: '심화',
      category: 'linux'
    },
    {
      title: '프로세스 종료',
      description: '특정 프로세스 ID(PID)를 가진 프로세스를 종료합니다.',
      mission: '특정 PID를 가진 프로세스를 종료하세요',
      answer_regex: '^kill \\d+$',
      hint: 'kill 뒤에 종료할 프로세스 번호(PID)를 입력하세요',
      difficulty: '심화',
      category: 'linux'
    },
    {
      title: '파일 압축',
      description: '여러 파일이나 폴더를 .tar.gz 형식으로 압축합니다.',
      mission: 'tar 명령어로 폴더를 압축하세요 (tar -czvf 압축파일명 대상)',
      answer_regex: '^tar -czvf .+ .+$',
      hint: 'tar -czvf 결과파일.tar.gz 압축할대상 형식입니다',
      difficulty: '심화',
      category: 'linux'
    },
    {
      title: '압축 풀기',
      description: '.tar.gz 형식으로 압축된 파일을 풀어냅니다.',
      mission: 'tar 명령어로 .tar.gz 파일의 압축을 푸세요',
      answer_regex: '^tar -xzvf .+$',
      hint: 'tar -xzvf 압축파일명 형식입니다 (x=extract)',
      difficulty: '심화',
      category: 'linux'
    },
    {
      title: '심볼릭 링크 생성',
      description: '원본 파일/폴더를 가리키는 바로가기(심볼릭 링크)를 만듭니다.',
      mission: '원본 파일을 가리키는 심볼릭 링크를 생성하세요',
      answer_regex: '^ln -s .+ .+$',
      hint: 'ln -s 원본 링크이름 형식입니다',
      difficulty: '심화',
      category: 'linux'
    },
 
    // ══════════════════════════════════════════════════════════════
    // GDB (30) - 기초 10 / 중급 10 / 심화 10
    // ══════════════════════════════════════════════════════════════
 
    // ── GDB 기초 ──────────────────────────
    {
      title: 'GDB 실행',
      description: 'GDB 디버거로 프로그램을 실행합니다.',
      mission: 'program 파일을 GDB로 실행하세요',
      answer: 'gdb program',
      hint: 'gdb 뒤에 실행할 프로그램 이름을 입력하세요',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: '메인 함수에 중단점',
      description: 'main 함수 진입 시 멈추도록 중단점을 설정합니다.',
      mission: 'main 함수에 브레이크포인트를 설정하세요',
      answer: 'break main',
      hint: 'break 뒤에 함수 이름을 입력하세요',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: '프로그램 실행',
      description: 'GDB 안에서 로드된 프로그램을 실행합니다.',
      mission: 'GDB에서 프로그램을 실행하세요',
      answer: 'run',
      hint: '"실행하다"라는 영어 단어, 세 글자입니다',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: 'GDB 종료',
      description: 'GDB 세션을 종료합니다.',
      mission: 'GDB를 종료하세요',
      answer: 'quit',
      hint: '"종료"를 의미하는 영어 단어입니다',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: '중단점 목록 보기',
      description: '설정된 모든 중단점을 확인합니다.',
      mission: '설정된 중단점 목록을 확인하세요',
      answer: 'info breakpoints',
      hint: 'info 뒤에 breakpoints를 입력합니다',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: 'GDB 도움말',
      description: '사용 가능한 명령어 목록과 설명을 출력합니다.',
      mission: 'GDB 도움말을 출력하세요',
      answer: 'help',
      hint: '"도와주다"라는 영어 단어입니다',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: '소스 코드 보기',
      description: '현재 실행 위치 주변의 소스 코드를 보여줍니다.',
      mission: '현재 위치 주변의 소스 코드를 출력하세요',
      answer: 'list',
      hint: '"목록"을 의미하는 영어 단어입니다',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: '프로그램 로드',
      description: '실행 중인 GDB에 디버깅할 프로그램 파일을 로드합니다.',
      mission: '특정 실행 파일을 GDB에 로드하세요',
      answer_regex: '^file .+$',
      hint: 'file 뒤에 실행 파일 이름을 입력합니다',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: '메인부터 시작',
      description: 'main 함수 진입 시 자동으로 멈추면서 프로그램을 실행합니다.',
      mission: 'main 진입 시 자동 정지되도록 프로그램을 시작하세요',
      answer: 'start',
      hint: '"시작하다"라는 영어 단어입니다',
      difficulty: '기초',
      category: 'gdb'
    },
    {
      title: '함수 목록 보기',
      description: '프로그램에 정의된 모든 함수의 목록을 출력합니다.',
      mission: '프로그램의 함수 목록을 출력하세요',
      answer: 'info functions',
      hint: 'info 뒤에 functions를 입력합니다',
      difficulty: '기초',
      category: 'gdb'
    },
 
    // ── GDB 중급 ──────────────────────────
    {
      title: '줄 번호로 중단점 설정',
      description: '특정 줄 번호에서 실행을 멈추도록 설정합니다.',
      mission: '특정 줄 번호에 중단점을 설정하세요',
      answer_regex: '^break \\d+$',
      hint: 'break 뒤에 줄 번호를 입력합니다',
      difficulty: '중급',
      category: 'gdb'
    },
    {
      title: '다음 줄 실행',
      description: '함수 호출은 건너뛰고 다음 줄로 이동합니다.',
      mission: '함수 안에 들어가지 않고 다음 줄을 실행하세요',
      answer: 'next',
      hint: '"다음"이라는 영어 단어입니다',
      difficulty: '중급',
      category: 'gdb'
    },
    {
      title: '함수 안으로 들어가기',
      description: '함수 호출 시 그 함수 내부로 들어갑니다.',
      mission: '함수 안으로 한 단계 들어가세요',
      answer: 'step',
      hint: '"한 걸음"이라는 영어 단어입니다',
      difficulty: '중급',
      category: 'gdb'
    },
    {
      title: '변수 값 출력',
      description: '특정 변수의 현재 값을 출력합니다.',
      mission: '변수의 현재 값을 출력하세요',
      answer_regex: '^print .+$',
      hint: 'print 다음에 변수 이름을 입력합니다',
      difficulty: '중급',
      category: 'gdb'
    },
    {
      title: '계속 실행',
      description: '다음 중단점을 만날 때까지 프로그램을 계속 실행합니다.',
      mission: '다음 중단점까지 계속 실행하세요',
      answer: 'continue',
      hint: '"계속하다"라는 영어 단어입니다',
      difficulty: '중급',
      category: 'gdb'
    },
    {
      title: '중단점 삭제',
      description: '특정 번호의 중단점을 삭제합니다.',
      mission: '특정 번호의 중단점을 삭제하세요',
      answer_regex: '^delete \\d+$',
      hint: 'delete 뒤에 중단점 번호를 입력합니다',
      difficulty: '중급',
      category: 'gdb'
    },
    {
      title: '현재 함수 끝까지 실행',
      description: '현재 함수의 끝까지 실행한 후 호출자 위치로 돌아갑니다.',
      mission: '현재 함수가 끝날 때까지 실행하세요',
      answer: 'finish',
      hint: '"끝내다, 마치다"라는 영어 단어입니다',
      difficulty: '중급',
      category: 'gdb'
    },
    {
      title: '지역 변수 보기',
      description: '현재 함수의 모든 지역 변수와 그 값을 출력합니다.',
      mission: '현재 함수의 모든 지역 변수를 출력하세요',
      answer: 'info locals',
      hint: 'info 뒤에 locals 를 입력합니다',
      difficulty: '중급',
      category: 'gdb'
    },
    {
      title: '함수 인자 보기',
      description: '현재 함수의 인자(매개변수)와 그 값을 출력합니다.',
      mission: '현재 함수의 인자 값을 출력하세요',
      answer: 'info args',
      hint: 'info 뒤에 args(arguments)를 입력합니다',
      difficulty: '중급',
      category: 'gdb'
    },
    {
      title: '변수 값 변경',
      description: '디버깅 중에 특정 변수의 값을 강제로 변경합니다.',
      mission: '변수 값을 강제로 변경하세요 (set var 변수=값)',
      answer_regex: '^set var .+=.+$',
      hint: 'set var 변수명=값 형식입니다',
      difficulty: '중급',
      category: 'gdb'
    },
 
    // ── GDB 심화 ──────────────────────────
    {
      title: '콜 스택 보기',
      description: '함수 호출 스택을 출력해서 어디서 호출됐는지 추적합니다.',
      mission: '현재 함수 호출 스택을 출력하세요',
      answer: 'backtrace',
      hint: '"역추적"이라는 의미의 단어입니다',
      difficulty: '심화',
      category: 'gdb'
    },
    {
      title: '변수 감시',
      description: '특정 변수의 값이 변할 때마다 자동으로 멈춥니다.',
      mission: '특정 변수를 감시하도록 설정하세요',
      answer_regex: '^watch .+$',
      hint: '"지켜보다"라는 영어 단어입니다',
      difficulty: '심화',
      category: 'gdb'
    },
    {
      title: '메모리 값 확인',
      description: '특정 메모리 주소의 값을 직접 확인합니다.',
      mission: '특정 변수의 메모리 주소 값을 확인하세요',
      answer_regex: '^x .+$',
      hint: 'x 명령어로 메모리를 검사(eXamine)할 수 있습니다',
      difficulty: '심화',
      category: 'gdb'
    },
    {
      title: '레지스터 확인',
      description: 'CPU 레지스터의 현재 값을 모두 출력합니다.',
      mission: '모든 CPU 레지스터의 값을 출력하세요',
      answer: 'info registers',
      hint: 'info 뒤에 registers 를 입력합니다',
      difficulty: '심화',
      category: 'gdb'
    },
    {
      title: '어셈블리 보기',
      description: '현재 함수의 어셈블리 코드를 출력합니다.',
      mission: '현재 함수의 어셈블리 코드를 출력하세요',
      answer: 'disassemble',
      hint: '"분해하다"라는 영어 단어입니다',
      difficulty: '심화',
      category: 'gdb'
    },
    {
      title: '예외 발생 시 멈춤',
      description: 'C++ 예외(throw)가 발생하는 순간 프로그램을 멈춥니다.',
      mission: '예외 발생을 감지해서 멈추도록 설정하세요',
      answer: 'catch throw',
      hint: 'catch 뒤에 throw 를 붙입니다',
      difficulty: '심화',
      category: 'gdb'
    },
    {
      title: '조건부 중단점',
      description: '특정 조건이 참일 때만 멈추도록 중단점에 조건을 부여합니다.',
      mission: '특정 중단점에 조건을 부여하세요 (condition 번호 조건식)',
      answer_regex: '^condition \\d+ .+$',
      hint: 'condition 중단점번호 조건식 형식입니다',
      difficulty: '심화',
      category: 'gdb'
    },
    {
      title: '임시 중단점',
      description: '한 번만 멈추고 자동으로 사라지는 일회용 중단점을 설정합니다.',
      mission: '임시 중단점을 설정하세요',
      answer_regex: '^tbreak .+$',
      hint: 'temporary break 의 줄임말입니다',
      difficulty: '심화',
      category: 'gdb'
    },
    {
      title: '함수에서 즉시 리턴',
      description: '현재 함수의 나머지 부분을 건너뛰고 즉시 리턴합니다.',
      mission: '현재 함수에서 즉시 리턴하세요',
      answer: 'return',
      hint: '"되돌리다"라는 영어 단어입니다',
      difficulty: '심화',
      category: 'gdb'
    },
    {
      title: '코어 덤프 분석',
      description: '프로그램이 비정상 종료되며 남긴 코어 덤프 파일을 분석합니다.',
      mission: '특정 코어 덤프 파일을 분석하세요',
      answer_regex: '^core .+$',
      hint: 'core 뒤에 코어 덤프 파일 이름을 입력합니다',
      difficulty: '심화',
      category: 'gdb'
    },
 
    // ══════════════════════════════════════════════════════════════
    // PDB (30) - 기초 10 / 중급 10 / 심화 10
    // ══════════════════════════════════════════════════════════════
 
    // ── PDB 기초 ──────────────────────────
    {
      title: '코드 보기',
      description: '현재 멈춰있는 위치 주변의 코드를 출력합니다.',
      mission: '(Pdb) 프롬프트에서 현재 코드를 출력하세요',
      answer: 'l',
      hint: 'list의 첫 글자입니다',
      difficulty: '기초',
      category: 'pdb'
    },
    {
      title: '다음 줄 실행',
      description: '함수 안으로 들어가지 않고 다음 줄로 이동합니다.',
      mission: '함수 안에 들어가지 않고 다음 줄을 실행하세요',
      answer: 'n',
      hint: 'next의 첫 글자입니다',
      difficulty: '기초',
      category: 'pdb'
    },
    {
      title: '디버거 종료',
      description: 'PDB 세션을 종료합니다.',
      mission: 'PDB를 종료하세요',
      answer: 'q',
      hint: 'quit의 첫 글자입니다',
      difficulty: '기초',
      category: 'pdb'
    },
    {
      title: '현재 위치 확인',
      description: '현재 실행 중인 줄과 호출 스택을 함께 출력합니다.',
      mission: '현재 실행 위치와 스택을 확인하세요',
      answer: 'w',
      hint: 'where의 첫 글자입니다',
      difficulty: '기초',
      category: 'pdb'
    },
    {
      title: '변수 출력',
      description: '변수의 현재 값을 출력합니다.',
      mission: '특정 변수의 값을 출력하세요',
      answer_regex: '^p .+$',
      hint: 'print의 첫 글자, 그 다음에 변수명을 입력하세요',
      difficulty: '기초',
      category: 'pdb'
    },
    {
      title: 'PDB 도움말',
      description: '사용 가능한 PDB 명령어 목록을 출력합니다.',
      mission: 'PDB 도움말을 출력하세요',
      answer: 'h',
      hint: 'help의 첫 글자입니다',
      difficulty: '기초',
      category: 'pdb'
    },
    {
      title: '함수 전체 코드 보기',
      description: '현재 위치한 함수의 전체 코드를 출력합니다.',
      mission: '현재 함수의 전체 코드를 출력하세요',
      answer: 'll',
      hint: 'longlist의 줄임말입니다 (l을 두 번)',
      difficulty: '기초',
      category: 'pdb'
    },
    {
      title: '함수 인자 보기',
      description: '현재 함수에 전달된 인자들을 출력합니다.',
      mission: '현재 함수의 인자 값을 출력하세요',
      answer: 'a',
      hint: 'args의 첫 글자입니다',
      difficulty: '기초',
      category: 'pdb'
    },
    {
      title: '함수 끝까지 실행',
      description: '현재 함수가 리턴할 때까지 실행을 계속합니다.',
      mission: '현재 함수가 끝날 때까지 실행하세요',
      answer: 'r',
      hint: 'return의 첫 글자입니다',
      difficulty: '기초',
      category: 'pdb'
    },
    {
      title: '마지막 반환값 보기',
      description: '직전에 종료된 함수의 반환값을 출력합니다.',
      mission: '직전 함수의 반환값을 출력하세요',
      answer: 'retval',
      hint: 'return value 의 줄임말입니다',
      difficulty: '기초',
      category: 'pdb'
    },
 
    // ── PDB 중급 ──────────────────────────
    {
      title: '함수 안으로',
      description: '함수 호출 시 그 함수 내부로 들어갑니다.',
      mission: '함수 안으로 한 단계 들어가세요',
      answer: 's',
      hint: 'step의 첫 글자입니다',
      difficulty: '중급',
      category: 'pdb'
    },
    {
      title: '계속 실행',
      description: '다음 중단점까지 프로그램을 계속 실행합니다.',
      mission: '다음 중단점까지 계속 실행하세요',
      answer: 'c',
      hint: 'continue의 첫 글자입니다',
      difficulty: '중급',
      category: 'pdb'
    },
    {
      title: '변수 자세히 보기',
      description: '변수를 보기 좋게(pretty-print) 출력합니다.',
      mission: '변수를 pretty-print로 출력하세요',
      answer_regex: '^pp .+$',
      hint: 'p를 두 번 입력합니다 (pretty print)',
      difficulty: '중급',
      category: 'pdb'
    },
    {
      title: '중단점 추가',
      description: '특정 줄 번호에 중단점을 설정합니다.',
      mission: '특정 줄 번호에 중단점을 설정하세요',
      answer_regex: '^b \\d+$',
      hint: 'break의 첫 글자와 줄 번호를 입력하세요',
      difficulty: '중급',
      category: 'pdb'
    },
    {
      title: '지역 변수 모두 보기',
      description: '현재 스코프의 모든 지역 변수를 딕셔너리로 출력합니다.',
      mission: '현재 스코프의 모든 지역 변수를 출력하세요',
      answer: 'locals()',
      hint: 'locals 함수를 호출합니다',
      difficulty: '중급',
      category: 'pdb'
    },
    {
      title: '모든 중단점 삭제',
      description: '설정된 모든 중단점을 한 번에 제거합니다.',
      mission: '모든 중단점을 삭제하세요',
      answer: 'cl',
      hint: 'clear의 줄임말입니다',
      difficulty: '중급',
      category: 'pdb'
    },
    {
      title: '중단점 비활성화',
      description: '특정 중단점을 삭제하지 않고 잠시 비활성화합니다.',
      mission: '특정 번호의 중단점을 비활성화하세요',
      answer_regex: '^disable \\d+$',
      hint: 'disable 뒤에 중단점 번호를 입력합니다',
      difficulty: '중급',
      category: 'pdb'
    },
    {
      title: '중단점 활성화',
      description: '비활성화했던 중단점을 다시 활성화합니다.',
      mission: '특정 번호의 중단점을 활성화하세요',
      answer_regex: '^enable \\d+$',
      hint: 'enable 뒤에 중단점 번호를 입력합니다',
      difficulty: '중급',
      category: 'pdb'
    },
    {
      title: '전역 변수 모두 보기',
      description: '현재 모듈의 모든 전역 변수를 딕셔너리로 출력합니다.',
      mission: '현재 모듈의 전역 변수를 출력하세요',
      answer: 'globals()',
      hint: 'globals 함수를 호출합니다',
      difficulty: '중급',
      category: 'pdb'
    },
    {
      title: '특정 줄로 점프',
      description: '실행 흐름을 특정 줄 번호로 강제로 이동합니다.',
      mission: '특정 줄 번호로 점프하세요 (j 줄번호)',
      answer_regex: '^j \\d+$',
      hint: 'jump의 첫 글자와 줄 번호를 입력합니다',
      difficulty: '중급',
      category: 'pdb'
    },
 
    // ── PDB 심화 ──────────────────────────
    {
      title: '콜 스택 보기',
      description: '현재 함수 호출 스택 전체를 출력합니다.',
      mission: '현재 함수 호출 스택을 출력하세요',
      answer: 'bt',
      hint: 'backtrace의 줄임말입니다',
      difficulty: '심화',
      category: 'pdb'
    },
    {
      title: '상위 프레임으로 이동',
      description: '콜 스택에서 한 단계 위(호출자) 프레임으로 이동합니다.',
      mission: '상위 프레임으로 이동하세요',
      answer: 'u',
      hint: 'up의 첫 글자입니다',
      difficulty: '심화',
      category: 'pdb'
    },
    {
      title: '하위 프레임으로 이동',
      description: '콜 스택에서 한 단계 아래 프레임으로 이동합니다.',
      mission: '하위 프레임으로 이동하세요',
      answer: 'd',
      hint: 'down의 첫 글자입니다',
      difficulty: '심화',
      category: 'pdb'
    },
    {
      title: '조건부 중단점',
      description: '특정 조건이 참일 때만 멈추도록 중단점에 조건을 부여합니다.',
      mission: '중단점에 조건을 부여하세요 (condition 번호 조건식)',
      answer_regex: '^condition \\d+ .+$',
      hint: 'condition 중단점번호 조건식 형식입니다',
      difficulty: '심화',
      category: 'pdb'
    },
    {
      title: '중단점 명령어 추가',
      description: '특정 중단점에 도달했을 때 자동으로 실행할 명령을 등록합니다.',
      mission: '특정 중단점에 자동 명령어를 추가하세요',
      answer_regex: '^commands \\d+$',
      hint: 'commands 뒤에 중단점 번호를 입력합니다',
      difficulty: '심화',
      category: 'pdb'
    },
    {
      title: '다음 줄까지 실행',
      description: '현재 줄 번호보다 큰 줄에 도달할 때까지 실행을 계속합니다.',
      mission: '현재 줄 이후로 실행을 진행하세요',
      answer: 'unt',
      hint: 'until의 줄임말입니다',
      difficulty: '심화',
      category: 'pdb'
    },
    {
      title: '임시 중단점',
      description: '한 번만 멈추고 자동으로 제거되는 일회용 중단점을 설정합니다.',
      mission: '특정 줄에 임시 중단점을 설정하세요',
      answer_regex: '^tbreak \\d+$',
      hint: 'temporary break 의 줄임말입니다',
      difficulty: '심화',
      category: 'pdb'
    },
    {
      title: '중단점 무시 횟수 설정',
      description: '특정 중단점을 N번 동안 무시하도록 설정합니다.',
      mission: '특정 중단점을 일정 횟수 무시하도록 설정하세요',
      answer_regex: '^ignore \\d+ \\d+$',
      hint: 'ignore 중단점번호 무시할횟수 형식입니다',
      difficulty: '심화',
      category: 'pdb'
    },
    {
      title: '명령어 별명 만들기',
      description: '자주 쓰는 PDB 명령어를 짧은 별명으로 만들어 사용합니다.',
      mission: '특정 명령어에 별명을 부여하세요 (alias 별명 명령어)',
      answer_regex: '^alias .+ .+$',
      hint: 'alias 별명 실제명령어 형식입니다',
      difficulty: '심화',
      category: 'pdb'
    },
    {
      title: '표현식 디버깅',
      description: '특정 표현식 안으로 재귀적으로 디버거를 진입시킵니다.',
      mission: '특정 표현식을 디버깅 모드로 실행하세요',
      answer_regex: '^debug .+$',
      hint: 'debug 뒤에 디버깅할 표현식을 입력합니다',
      difficulty: '심화',
      category: 'pdb'
    },
  ])
}