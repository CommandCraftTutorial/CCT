const sessions = {}

function getSession(userId) {
  if (!sessions[userId]) {
    sessions[userId] = {
      initialized: false,
      stagedFiles: [],
      commits: [],
      branch: 'main',
    }
  }
  return sessions[userId]
}

function applyCommand(userId, command) {
  const state = getSession(userId)
  const trimmed = command.trim()

  if (trimmed === 'git init') {
    state.initialized = true
    return '✅ Initialized empty Git repository'
  }

  if (!state.initialized) {
    return '❌ fatal: not a git repository'
  }

  if (trimmed === 'git add .') {
    state.stagedFiles = ['all files']
    return '✅ Changes staged'
  }

  if (/^git commit -m ".+"$/.test(trimmed)) {
    if (state.stagedFiles.length === 0) {
      return '❌ nothing to commit'
    }
    const msg = trimmed.match(/"(.+)"/)[1]
    state.commits.push({ message: msg, time: new Date() })
    state.stagedFiles = []
    return `✅ [${state.branch}] ${msg}`
  }

  if (/^git branch .+$/.test(trimmed)) {
    const branchName = trimmed.split(' ')[2]
    return `✅ 브랜치 '${branchName}' 생성됨`
  }

  if (/^git checkout .+$/.test(trimmed)) {
    const branchName = trimmed.split(' ')[2]
    state.branch = branchName
    return `✅ '${branchName}' 브랜치로 이동`
  }

  return `❌ command not found: ${command}`
}

module.exports = { applyCommand, getSession }