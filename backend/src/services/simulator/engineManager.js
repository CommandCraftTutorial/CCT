const VirtualFileSystem = require('./virtualFileSystem')
const VirtualGitEngine = require('./virtualGitEngine')
const VirtualGdbEngine = require('./virtualGdbEngine')
const VirtualPdbEngine = require('./virtualPdbEngine')
const { parseCommand } = require('../parser/commandParser')

const sessions = {}

function getSession(userId) {
  if (!sessions[userId]) {
    const vfs = new VirtualFileSystem()
    sessions[userId] = {
      vfs,
      git: new VirtualGitEngine(vfs),
      gdb: new VirtualGdbEngine(),
      pdb: new VirtualPdbEngine(),
    }
  }
  return sessions[userId]
}

function resetSession(userId) {
  if (sessions[userId]) {
    sessions[userId].vfs.reset()
    sessions[userId].git.reset()
    sessions[userId].gdb.reset()
    sessions[userId].pdb.reset()
  }
}

function executeCommand(userId, command, category) {
  const session = getSession(userId)
  const parsed = parseCommand(command)

  if (!parsed) return { output: 'Empty command', success: false }

  // 카테고리별 엔진 선택
  let result

  if (category === 'git') {
    if (parsed.base === 'git') {
      result = session.git.execute(parsed)
    } else {
      result = session.vfs.execute(parsed)
    }
  } else if (category === 'linux') {
    result = session.vfs.execute(parsed)
  } else if (category === 'gdb') {
    if (parsed.base === 'gdb') {
      result = session.gdb.execute(parsed)
    } else {
    result = session.gdb.execute(parsed)
    }
  } else if (category === 'pdb') {
    result = session.pdb.execute(parsed)
  } else {
    result = { output: `Unknown category: ${category}`, success: false }
  }

  return {
    ...result,
    state: {
      vfs: session.vfs.getState(),
      git: session.git.getState(),
      gdb: session.gdb.getState(),
      pdb: session.pdb.getState(),
    }
  }
}

// 목표 상태 검증
function checkGoal(userId, stage) {
  const session = getSession(userId)

  if (!stage.goal) return null

  const goal = stage.goal
  const gitState = session.git.getState()
  const vfsState = session.vfs.getState()
  const gdbState = session.gdb.getState()
  const pdbState = session.pdb.getState()

  // Git 목표 검증
  if (goal.git) {
    if (goal.git.initialized && !gitState.initialized) return false
    if (goal.git.committed && gitState.branches[gitState.currentBranch]?.commits.length === 0) return false
    if (goal.git.branch && !gitState.branches[goal.git.branch]) return false
    if (goal.git.stagedFile && !gitState.stagedFiles.includes(goal.git.stagedFile)) {
      return { passed: false, feedback: `${goal.git.stagedFile}이 아직 staging area에 없습니다. git add ${goal.git.stagedFile}를 시도해보세요.` }
    }
    if (goal.git.notStagedFile && gitState.stagedFiles.includes(goal.git.notStagedFile)) return false
    if (goal.git.commitMessage) {
      const commits = gitState.branches[gitState.currentBranch]?.commits || []
      const hasMessage = commits.some(c => c.message === goal.git.commitMessage)
      if (!hasMessage)
        return { passed: false, feedback: `커밋 메시지가 '${goal.git.commitMessage}'이어야 합니다.` }
    }
    if (goal.git.trackedFile && !gitState.trackedFiles.includes(goal.git.trackedFile))
      return { passed: false, feedback: `'${goal.git.trackedFile}'이 아직 커밋되지 않았습니다.` }

    if (goal.git.notTrackedFile && gitState.trackedFiles.includes(goal.git.notTrackedFile))
      return { passed: false, feedback: `'${goal.git.notTrackedFile}'은 커밋에 포함되면 안 됩니다.` }

    if (goal.git.currentBranch && gitState.currentBranch !== goal.git.currentBranch)
      return { passed: false, feedback: `'${goal.git.currentBranch}' 브랜치로 전환하세요. git checkout ${goal.git.currentBranch}를 실행하세요.` }

    if (goal.git.remote && !gitState.remotes[goal.git.remote])
      return { passed: false, feedback: `'${goal.git.remote}' remote가 없습니다. git remote add ${goal.git.remote} <url>을 실행하세요.` }

    if (goal.git.mergedBranch) {
      const currentCommits = gitState.branches[gitState.currentBranch]?.commits || []
      const mergedCommits = gitState.branches[goal.git.mergedBranch]?.commits || []
      const isMerged = mergedCommits.every(mc => currentCommits.some(cc => cc.hash === mc.hash))
      if (!isMerged)
        return { passed: false, feedback: `'${goal.git.mergedBranch}' 브랜치를 병합하세요. git merge ${goal.git.mergedBranch}를 실행하세요.` }
    }
  }


  // VFS 목표 검증
  if (goal.vfs) {
    if (goal.vfs.fileExists) {
      const node = session.vfs.getNode(session.vfs.resolvePath(goal.vfs.fileExists))
      if (!node)
        return { passed: false, feedback: `'${goal.vfs.fileExists}' 파일이 없습니다. touch ${goal.vfs.fileExists}를 실행하세요.` }
    }

    if (goal.vfs.fileNotExists) {
      const node = session.vfs.getNode(session.vfs.resolvePath(goal.vfs.fileNotExists))
      if (node)
        return { passed: false, feedback: `'${goal.vfs.fileNotExists}' 파일을 삭제하세요. rm ${goal.vfs.fileNotExists}를 실행하세요.` }
    }

    if (goal.vfs.dirExists) {
      const node = session.vfs.getNode(session.vfs.resolvePath(goal.vfs.dirExists))
      if (!node || node.type !== 'dir')
        return { passed: false, feedback: `'${goal.vfs.dirExists}' 디렉토리가 없습니다. mkdir ${goal.vfs.dirExists}를 실행하세요.` }
    }
    if (goal.vfs.currentPath && vfsState.currentPath !== goal.vfs.currentPath)
      return { passed: false, feedback: `'${goal.vfs.currentPath}' 경로로 이동하세요. cd ${goal.vfs.currentPath}를 실행하세요.` }
  }

  // GDB 목표 검증
  if (goal.gdb) {
    if (goal.gdb.running && !gdbState.running)
      return { passed: false, feedback: '프로그램을 먼저 로드하세요. file <프로그램명> 또는 gdb <프로그램명>을 실행하세요.' }

    if (goal.gdb.breakpointSet && gdbState.breakpoints.length === 0)
      return { passed: false, feedback: '브레이크포인트를 설정하세요. break <위치>를 실행하세요.' }

    if (goal.gdb.breakpointAt) {
      const hasBreakpoint = gdbState.breakpoints.some(bp => bp.location === String(goal.gdb.breakpointAt))
      if (!hasBreakpoint)
        return { passed: false, feedback: `${goal.gdb.breakpointAt} 위치에 브레이크포인트를 설정하세요. break ${goal.gdb.breakpointAt}를 실행하세요.` }
    }

    if (goal.gdb.program && gdbState.program !== goal.gdb.program)
      return { passed: false, feedback: `'${goal.gdb.program}' 프로그램을 로드하세요. file ${goal.gdb.program}을 실행하세요.` }
  }

  return true
}

module.exports = { executeCommand, checkGoal, getSession, resetSession }