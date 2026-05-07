const sessions = {}

function getSession(userId, category) {
  const key = `${userId}_${category}`
  if (!sessions[key]) {
    sessions[key] = {
      // Git 상태
      initialized: false,
      stagedFiles: [],
      commits: [],
      branch: 'main',
      remotes: {},
      stash: [],
      tags: [],

      // Linux 상태
      currentDir: '~',
      files: ['readme.txt', 'file.txt', 'old.txt'],
      dirs: ['documents', 'myfolder'],

      // GDB 상태
      gdbRunning: false,
      breakpoints: [],
      program: null,

      // PDB 상태
      pdbRunning: false,
      pdbBreakpoints: [],
    }
  }
  return sessions[key]
}

function applyCommand(userId, command, category = 'git') {
  const state = getSession(userId, category)
  const trimmed = command.trim()

  if (category === 'git') return handleGit(trimmed, state)
  if (category === 'linux') return handleLinux(trimmed, state)
  if (category === 'gdb') return handleGdb(trimmed, state)
  if (category === 'pdb') return handlePdb(trimmed, state)

  return `❌ 알 수 없는 카테고리: ${category}`
}

// ─────────────────────────────────────────────
// Git 명령어 처리
// ─────────────────────────────────────────────
function handleGit(cmd, state) {
  if (cmd === 'git init') {
    state.initialized = true
    return '✅ Initialized empty Git repository in .git/'
  }

  if (cmd === 'git --version') {
    return '✅ git version 2.39.0'
  }

  if (cmd === 'git status') {
    if (!state.initialized) return '❌ fatal: not a git repository'
    if (state.stagedFiles.length > 0) return '✅ Changes to be committed:\n  modified: ' + state.stagedFiles.join(', ')
    return '✅ On branch ' + state.branch + '\nnothing to commit, working tree clean'
  }

  if (cmd === 'git add .') {
    if (!state.initialized) return '❌ fatal: not a git repository'
    state.stagedFiles = ['all files']
    return '✅ Changes staged'
  }

  if (/^git add (?!\.$).+$/.test(cmd)) {
    if (!state.initialized) return '❌ fatal: not a git repository'
    const file = cmd.split(' ')[2]
    state.stagedFiles.push(file)
    return `✅ ${file} staged`
  }

  if (/^git commit -m ".+"$/.test(cmd)) {
    if (!state.initialized) return '❌ fatal: not a git repository'
    if (state.stagedFiles.length === 0) return '❌ nothing to commit'
    const msg = cmd.match(/"(.+)"/)[1]
    state.commits.push({ message: msg, time: new Date() })
    state.stagedFiles = []
    return `✅ [${state.branch}] ${msg}`
  }

  if (cmd === 'git log') {
    if (!state.initialized) return '❌ fatal: not a git repository'
    if (state.commits.length === 0) return '❌ fatal: your current branch has no commits yet'
    return '✅ ' + state.commits.map((c, i) => `commit ${i + 1}\n  ${c.message}`).join('\n')
  }

  if (cmd === 'git log --oneline') {
    if (!state.initialized) return '❌ fatal: not a git repository'
    if (state.commits.length === 0) return '❌ fatal: your current branch has no commits yet'
    return '✅ ' + state.commits.map((c, i) => `abc123${i} ${c.message}`).join('\n')
  }

  if (/^git config --global user\.name ".+"$/.test(cmd)) {
    const name = cmd.match(/"(.+)"/)[1]
    return `✅ user.name 설정됨: ${name}`
  }

  if (/^git config --global user\.email ".+"$/.test(cmd)) {
    const email = cmd.match(/"(.+)"/)[1]
    return `✅ user.email 설정됨: ${email}`
  }

  if (cmd === 'git branch') {
    if (!state.initialized) return '❌ fatal: not a git repository'
    return `✅ * ${state.branch}`
  }

  if (/^git branch [^\s-].*$/.test(cmd)) {
    if (!state.initialized) return '❌ fatal: not a git repository'
    const branchName = cmd.split(' ')[2]
    return `✅ 브랜치 '${branchName}' 생성됨`
  }

  if (/^git checkout (?!-b ).+$/.test(cmd)) {
    if (!state.initialized) return '❌ fatal: not a git repository'
    const branchName = cmd.split(' ')[2]
    state.branch = branchName
    return `✅ Switched to branch '${branchName}'`
  }

  if (/^git checkout -b .+$/.test(cmd)) {
    if (!state.initialized) return '❌ fatal: not a git repository'
    const branchName = cmd.split(' ')[3]
    state.branch = branchName
    return `✅ Switched to a new branch '${branchName}'`
  }

  if (/^git switch .+$/.test(cmd)) {
    if (!state.initialized) return '❌ fatal: not a git repository'
    const branchName = cmd.split(' ')[2]
    state.branch = branchName
    return `✅ Switched to branch '${branchName}'`
  }

  if (/^git merge .+$/.test(cmd)) {
    if (!state.initialized) return '❌ fatal: not a git repository'
    const branchName = cmd.split(' ')[2]
    return `✅ Merge made by the 'recursive' strategy.\n  ${branchName} merged into ${state.branch}`
  }

  if (cmd === 'git diff') {
    if (!state.initialized) return '❌ fatal: not a git repository'
    return '✅ diff --git a/file.txt b/file.txt\n  no changes'
  }

  if (/^git branch -d .+$/.test(cmd)) {
    if (!state.initialized) return '❌ fatal: not a git repository'
    const branchName = cmd.split(' ')[3]
    return `✅ Deleted branch ${branchName}`
  }

  if (/^git restore --staged .+$/.test(cmd)) {
    if (!state.initialized) return '❌ fatal: not a git repository'
    state.stagedFiles = []
    return '✅ 스테이징 취소됨'
  }

  if (/^git rm .+$/.test(cmd)) {
    if (!state.initialized) return '❌ fatal: not a git repository'
    const file = cmd.split(' ')[2]
    return `✅ rm '${file}'`
  }

  if (/^git remote add origin .+$/.test(cmd)) {
    const url = cmd.split(' ')[4]
    state.remotes['origin'] = url
    return `✅ origin 원격 저장소 등록됨: ${url}`
  }

  if (cmd === 'git remote -v') {
    if (Object.keys(state.remotes).length === 0) return '❌ 등록된 원격 저장소가 없습니다'
    return '✅ ' + Object.entries(state.remotes).map(([k, v]) => `${k}\t${v} (fetch)\n${k}\t${v} (push)`).join('\n')
  }

  if (/^git push origin .+$/.test(cmd)) {
    const branch = cmd.split(' ')[3]
    return `✅ Branch '${branch}' pushed to origin`
  }

  if (/^git pull origin .+$/.test(cmd)) {
    const branch = cmd.split(' ')[3]
    return `✅ Already up to date. (${branch})`
  }

  if (/^git clone .+$/.test(cmd)) {
    const url = cmd.split(' ')[2]
    return `✅ Cloning into repository...\n  ${url} cloned`
  }

  if (cmd === 'git stash') {
    if (!state.initialized) return '❌ fatal: not a git repository'
    state.stash.push({ files: state.stagedFiles })
    state.stagedFiles = []
    return '✅ Saved working directory and index state'
  }

  if (cmd === 'git stash pop') {
    if (state.stash.length === 0) return '❌ No stash entries found'
    const popped = state.stash.pop()
    state.stagedFiles = popped.files
    return '✅ Stash 복구됨'
  }

  if (cmd === 'git reset --soft HEAD~1') {
    if (state.commits.length === 0) return '❌ 되돌릴 커밋이 없습니다'
    const last = state.commits.pop()
    state.stagedFiles = ['all files']
    return `✅ HEAD~1 로 되돌아감. '${last.message}' 커밋 취소`
  }

  if (/^git rebase .+$/.test(cmd)) {
    const branch = cmd.split(' ')[2]
    return `✅ Successfully rebased onto '${branch}'`
  }

  if (/^git tag (?!-).+$/.test(cmd)) {
    const tag = cmd.split(' ')[2]
    state.tags.push(tag)
    return `✅ 태그 '${tag}' 생성됨`
  }

  return `❌ command not found: ${cmd}`
}

// ─────────────────────────────────────────────
// Linux 명령어 처리
// ─────────────────────────────────────────────
function handleLinux(cmd, state) {
  if (cmd === 'pwd') {
    return `✅ /home/user/${state.currentDir}`
  }

  if (cmd === 'ls') {
    return `✅ ${[...state.dirs, ...state.files].join('  ')}`
  }

  if (cmd === 'cd documents') {
    state.currentDir = 'documents'
    return '✅ documents 폴더로 이동됨'
  }

  if (cmd === 'cd ..') {
    state.currentDir = '~'
    return '✅ 상위 폴더로 이동됨'
  }

  if (cmd === 'cd ~') {
    state.currentDir = '~'
    return '✅ 홈 디렉토리로 이동됨'
  }

  if (cmd === 'mkdir myfolder') {
    state.dirs.push('myfolder')
    return '✅ myfolder 폴더 생성됨'
  }

  if (cmd === 'cat readme.txt') {
    return '✅ Hello, this is readme.txt!'
  }

  if (cmd === 'cp file.txt backup.txt') {
    state.files.push('backup.txt')
    return '✅ file.txt → backup.txt 복사됨'
  }

  if (cmd === 'mv old.txt new.txt') {
    state.files = state.files.filter(f => f !== 'old.txt')
    state.files.push('new.txt')
    return '✅ old.txt → new.txt 이름 변경됨'
  }

  if (cmd === 'rm temp.txt') {
    state.files = state.files.filter(f => f !== 'temp.txt')
    return '✅ temp.txt 삭제됨'
  }

  if (/^grep ".+" .+$/.test(cmd)) {
    return '✅ grep: 패턴 검색 완료'
  }

  if (/^find \. -name ".+"$/.test(cmd)) {
    return '✅ ./file.txt'
  }

  if (/^chmod 755 .+$/.test(cmd)) {
    const file = cmd.split(' ')[2]
    return `✅ ${file} 권한이 755로 변경됨`
  }

  if (cmd === 'ps aux') {
    return '✅ USER  PID  %CPU  %MEM  COMMAND\nuser  1234  0.0   0.1   bash'
  }

  if (cmd === 'df -h') {
    return '✅ Filesystem  Size  Used  Avail  Use%\n/dev/sda1   50G   20G   30G    40%'
  }

  return `❌ command not found: ${cmd}`
}

// ─────────────────────────────────────────────
// GDB 명령어 처리
// ─────────────────────────────────────────────
function handleGdb(cmd, state) {
  if (cmd === 'gdb program') {
    state.gdbRunning = true
    state.program = 'program'
    return '✅ GNU gdb (Ubuntu) 12.1\nReading symbols from program...\n(gdb)'
  }

  if (!state.gdbRunning && cmd !== 'gdb program') {
    return '❌ GDB가 실행되지 않았습니다. 먼저 gdb program 을 실행하세요'
  }

  if (cmd === 'break main') {
    state.breakpoints.push('main')
    return '✅ Breakpoint 1 at main'
  }

  if (/^break \d+$/.test(cmd)) {
    const line = cmd.split(' ')[1]
    state.breakpoints.push(line)
    return `✅ Breakpoint at line ${line}`
  }

  if (cmd === 'run') {
    return '✅ Starting program: program\nBreakpoint 1, main () at program.c:1'
  }

  if (cmd === 'quit') {
    state.gdbRunning = false
    state.breakpoints = []
    return '✅ GDB 종료됨'
  }

  if (cmd === 'info breakpoints') {
    if (state.breakpoints.length === 0) return '✅ No breakpoints set'
    return '✅ Num  Type        Disp  Enb  Address  What\n' +
      state.breakpoints.map((b, i) => `${i + 1}    breakpoint  keep  y    0x0000   ${b}`).join('\n')
  }

  if (cmd === 'next') {
    return '✅ 다음 줄로 이동\n2\t  printf("Hello");'
  }

  if (cmd === 'step') {
    return '✅ 함수 내부로 진입\nfoo () at program.c:10'
  }

  if (cmd === 'continue') {
    return '✅ Continuing.\nProgram exited normally.'
  }

  if (/^print .+$/.test(cmd)) {
    const varName = cmd.split(' ')[1]
    return `✅ $1 = 42  (${varName})`
  }

  if (cmd === 'backtrace') {
    return '✅ #0  main () at program.c:1\n#1  __libc_start_main ()'
  }

  if (/^watch .+$/.test(cmd)) {
    const varName = cmd.split(' ')[1]
    return `✅ Watchpoint set on ${varName}`
  }

  if (/^x .+$/.test(cmd)) {
    return '✅ 0x7fffffffe000: 0x00000000'
  }

  return `❌ Undefined command: "${cmd}". Try "help".`
}

// ─────────────────────────────────────────────
// PDB 명령어 처리
// ─────────────────────────────────────────────
function handlePdb(cmd, state) {
  if (cmd === 'l') {
    return '✅  1  ->  def main():\n  2        x = 10\n  3        y = 20\n  4        print(x + y)'
  }

  if (cmd === 'n') {
    return '✅ > program.py(2)main()\n-> x = 10'
  }

  if (cmd === 'q') {
    return '✅ PDB 종료됨'
  }

  if (cmd === 'w') {
    return '✅ > program.py(1)<module>()\n-> main()'
  }

  if (/^p .+$/.test(cmd)) {
    const varName = cmd.split(' ')[1]
    return `✅ 42  (${varName})`
  }

  if (cmd === 's') {
    return '✅ --Call--\n> program.py(1)foo()\n-> def foo():'
  }

  if (cmd === 'c') {
    return '✅ 다음 중단점까지 실행됨'
  }

  if (/^pp .+$/.test(cmd)) {
    const varName = cmd.split(' ')[1]
    return `✅ {'key': 'value'}  (${varName})`
  }

  if (/^b \d+$/.test(cmd)) {
    const line = cmd.split(' ')[1]
    state.pdbBreakpoints.push(line)
    return `✅ Breakpoint ${state.pdbBreakpoints.length} at line ${line}`
  }

  if (cmd === 'locals()') {
    return "✅ {'x': 10, 'y': 20}"
  }

  if (cmd === 'bt') {
    return '✅ > program.py(1)<module>()\n-> main()'
  }

  if (cmd === 'u') {
    return '✅ 상위 프레임으로 이동\n> program.py(1)<module>()'
  }

  if (cmd === 'd') {
    return '✅ 하위 프레임으로 이동\n> program.py(3)main()'
  }

  return `❌ *** 알 수 없는 명령어: ${cmd}`
}

module.exports = { applyCommand, getSession }