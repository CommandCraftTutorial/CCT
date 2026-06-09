// services/simulator/engineManager.js
const VirtualFileSystem = require('./virtualFileSystem')
const VirtualGitEngine  = require('./virtualGitEngine')
const VirtualGdbEngine  = require('./virtualGdbEngine')
const VirtualPdbEngine  = require('./virtualPdbEngine')
const { parseCommand }  = require('../parser/commandParser')

const sessions = {}

// ✅ stageId 포함 키로 스테이지별 독립 세션
function getSessionKey(userId, stageId) {
  return stageId ? `${userId}_${stageId}` : userId
}

function getSession(userId, stageId, initialFiles = [], category = '') {
  const key = getSessionKey(userId, stageId)
  if (!sessions[key]) {
    const vfs = new VirtualFileSystem(initialFiles)
    const git = new VirtualGitEngine(vfs)
    if (category === 'git') git.initialized = true
    sessions[key] = {
      vfs,
      git,
      gdb: new VirtualGdbEngine(),
      pdb: new VirtualPdbEngine(),
    }
  }
  return sessions[key]
}

// ✅ initialFiles로 세션 완전히 새로 생성
function resetSession(userId, stageId, initialFiles = [], category = '') {
  const key = getSessionKey(userId, stageId)
  const vfs = new VirtualFileSystem(initialFiles)
  const git = new VirtualGitEngine(vfs)
  if (category === 'git') git.initialized = true
  sessions[key] = {
    vfs,
    git,
    gdb: new VirtualGdbEngine(),
    pdb: new VirtualPdbEngine(),
  }
}

// ✅ 카테고리별 flat state 반환 (clearCondition에서 바로 사용 가능)
function getStateByCategory(session, category) {
  if (category === 'git')   return session.git.getState()
  if (category === 'linux') return session.vfs.getState()
  if (category === 'gdb')   return session.gdb.getState()
  if (category === 'pdb')   return session.pdb.getState()
  return {}
}

// ✅ stageId, initialFiles 파라미터 추가
function executeCommand(userId, command, category, stageId, initialFiles = []) {
  const session = getSession(userId, stageId, initialFiles, category)
  const parsed  = parseCommand(command)

  if (!parsed) return {
    output: 'Empty command',
    success: false,
    state: getStateByCategory(session, category)
  }

  let result

  if (category === 'git') {
    result = parsed.base === 'git'
      ? session.git.execute(parsed)
      : session.vfs.execute(parsed)
  } else if (category === 'linux') {
    result = session.vfs.execute(parsed)
  } else if (category === 'gdb') {
    result = session.gdb.execute(parsed)
  } else if (category === 'pdb') {
    result = session.pdb.execute(parsed)
  } else {
    result = { output: `Unknown category: ${category}`, success: false }
  }

  return {
    ...result,
    state: getStateByCategory(session, category)
  }
}

function checkGoal(userId, stage, stageId) {
  const session  = getSession(userId, stageId)
  if (!stage.goal) return null

  const goal     = stage.goal
  const gitState = session.git.getState()
  const vfsState = session.vfs.getState()
  const gdbState = session.gdb.getState()
  const pdbState = session.pdb.getState()

  if (goal.git) {
    if (goal.git.initialized && !gitState.initialized) return false
    if (goal.git.committed && gitState.branches[gitState.currentBranch]?.commits.length === 0) return false
    if (goal.git.branch && !gitState.branches[goal.git.branch]) return false
    if (goal.git.stagedFile && !gitState.stagedFiles.includes(goal.git.stagedFile))
      return { passed: false, feedback: `${goal.git.stagedFile}이 아직 staging area에 없습니다.` }
    if (goal.git.notStagedFile && gitState.stagedFiles.includes(goal.git.notStagedFile)) return false
    if (goal.git.commitMessage) {
      const commits = gitState.branches[gitState.currentBranch]?.commits || []
      if (!commits.some(c => c.message === goal.git.commitMessage))
        return { passed: false, feedback: `커밋 메시지가 '${goal.git.commitMessage}'이어야 합니다.` }
    }
    if (goal.git.trackedFile && !gitState.trackedFiles.includes(goal.git.trackedFile))
      return { passed: false, feedback: `'${goal.git.trackedFile}'이 아직 커밋되지 않았습니다.` }
    if (goal.git.notTrackedFile && gitState.trackedFiles.includes(goal.git.notTrackedFile))
      return { passed: false, feedback: `'${goal.git.notTrackedFile}'은 커밋에 포함되면 안 됩니다.` }
    if (goal.git.currentBranch && gitState.currentBranch !== goal.git.currentBranch)
      return { passed: false, feedback: `'${goal.git.currentBranch}' 브랜치로 전환하세요.` }
    if (goal.git.remote && !gitState.remotes[goal.git.remote])
      return { passed: false, feedback: `'${goal.git.remote}' remote가 없습니다.` }
    if (goal.git.mergedBranch) {
      const currentCommits = gitState.branches[gitState.currentBranch]?.commits || []
      const mergedCommits  = gitState.branches[goal.git.mergedBranch]?.commits || []
      const isMerged = mergedCommits.every(mc => currentCommits.some(cc => cc.hash === mc.hash))
      if (!isMerged)
        return { passed: false, feedback: `'${goal.git.mergedBranch}' 브랜치를 병합하세요.` }
    }
  }

  if (goal.vfs) {
    if (goal.vfs.fileExists) {
      const node = session.vfs.getNode(session.vfs.resolvePath(goal.vfs.fileExists))
      if (!node) return { passed: false, feedback: `'${goal.vfs.fileExists}' 파일이 없습니다.` }
    }
    if (goal.vfs.fileNotExists) {
      const node = session.vfs.getNode(session.vfs.resolvePath(goal.vfs.fileNotExists))
      if (node) return { passed: false, feedback: `'${goal.vfs.fileNotExists}' 파일을 삭제하세요.` }
    }
    if (goal.vfs.dirExists) {
      const node = session.vfs.getNode(session.vfs.resolvePath(goal.vfs.dirExists))
      if (!node || node.type !== 'dir')
        return { passed: false, feedback: `'${goal.vfs.dirExists}' 디렉토리가 없습니다.` }
    }
    if (goal.vfs.currentPath && vfsState.currentPath !== goal.vfs.currentPath)
      return { passed: false, feedback: `'${goal.vfs.currentPath}' 경로로 이동하세요.` }
  }

  if (goal.gdb) {
    if (goal.gdb.running && !gdbState.running)
      return { passed: false, feedback: '프로그램을 먼저 로드하세요.' }
    if (goal.gdb.breakpointSet && gdbState.breakpoints.length === 0)
      return { passed: false, feedback: '브레이크포인트를 설정하세요.' }
    if (goal.gdb.breakpointAt) {
      const hasBreakpoint = gdbState.breakpoints.some(bp => bp.location === String(goal.gdb.breakpointAt))
      if (!hasBreakpoint)
        return { passed: false, feedback: `${goal.gdb.breakpointAt} 위치에 브레이크포인트를 설정하세요.` }
    }
    if (goal.gdb.program && gdbState.program !== goal.gdb.program)
      return { passed: false, feedback: `'${goal.gdb.program}' 프로그램을 로드하세요.` }
  }

  return true
}

module.exports = { executeCommand, checkGoal, getSession, resetSession }