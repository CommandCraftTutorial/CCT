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
    if (goal.git.stagedFile && !gitState.stagedFiles.includes(goal.git.stagedFile)) return false
    if (goal.git.notStagedFile && gitState.stagedFiles.includes(goal.git.notStagedFile)) return false
  }

  // VFS 목표 검증
  if (goal.vfs) {
    if (goal.vfs.fileExists) {
      const node = session.vfs.getNode(session.vfs.resolvePath(goal.vfs.fileExists))
      if (!node) return false
    }
    if (goal.vfs.dirExists) {
      const node = session.vfs.getNode(session.vfs.resolvePath(goal.vfs.dirExists))
      if (!node || node.type !== 'dir') return false
    }
    if (goal.vfs.currentPath && vfsState.currentPath !== goal.vfs.currentPath) return false
  }

  // GDB 목표 검증
  if (goal.gdb) {
    if (goal.gdb.running && !gdbState.running) return false
    if (goal.gdb.breakpointSet && gdbState.breakpoints.length === 0) return false
  }

  return true
}

module.exports = { executeCommand, checkGoal, getSession, resetSession }