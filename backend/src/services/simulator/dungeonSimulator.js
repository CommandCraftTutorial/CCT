const sessions = {}

function getDungeonSession(userId, stageId) {
  const key = `dungeon_${userId}_${stageId}`
  return sessions[key]
}

function initDungeonSession(userId, stageId, filesystem) {
  const key = `dungeon_${userId}_${stageId}`
  sessions[key] = {
    currentPath: '/',
    filesystem: filesystem,
    commandHistory: [],
    createdFiles: [],
    createdDirs: [],
  }
  return sessions[key]
}

function resolvePath(currentPath, target) {
  if (target === '..') {
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    return '/' + parts.join('/')
  }
  if (target === '~') return '/'
  if (target.startsWith('/')) return target
  return currentPath === '/' ? `/${target}` : `${currentPath}/${target}`
}

function getNode(filesystem, path) {
  if (path === '/') return filesystem['/']
  const parts = path.split('/').filter(Boolean)
  let node = filesystem['/']
  for (const part of parts) {
    if (!node.children || !node.children[part]) return null
    node = node.children[part]
  }
  return node
}

function applyDungeonCommand(userId, stageId, command, filesystem) {
  let state = getDungeonSession(userId, stageId)
  if (!state) {
    state = initDungeonSession(userId, stageId, filesystem)
  }

  const trimmed = command.trim()
  const parts = trimmed.split(' ')
  const cmd = parts[0]
  const arg = parts[1]

  state.commandHistory.push(trimmed)

  // pwd
  if (cmd === 'pwd') {
    return {
      output: `✅ ${state.currentPath || '/'}`,
      state,
    }
  }

  // ls
  if (cmd === 'ls') {
    const node = getNode(state.filesystem, state.currentPath)
    if (!node || node.type !== 'dir') {
      return { output: '❌ 현재 위치를 찾을 수 없습니다', state }
    }

    const showHidden = arg === '-a'
    const items = Object.entries(node.children || {})
      .filter(([name]) => showHidden || !name.startsWith('.'))
      .map(([name, n]) => n.type === 'dir' ? `📁 ${name}` : `📄 ${name}`)

    // 생성된 파일/폴더도 표시
    const created = [
      ...state.createdDirs.filter(d => d.parent === state.currentPath).map(d => `📁 ${d.name}`),
      ...state.createdFiles.filter(f => f.parent === state.currentPath).map(f => `📄 ${f.name}`),
    ]

    const all = [...items, ...created]
    return {
      output: all.length > 0 ? `✅ ${all.join('  ')}` : '✅ (비어있는 폴더)',
      state,
    }
  }

  // cd
  if (cmd === 'cd') {
    if (!arg) return { output: '✅ 홈으로 이동', state }

    const newPath = resolvePath(state.currentPath, arg)
    const node = getNode(state.filesystem, newPath)
    const createdDir = state.createdDirs.find(d => d.parent === state.currentPath && d.name === arg)

    if ((!node || node.type !== 'dir') && !createdDir) {
      return { output: `❌ cd: ${arg}: 폴더가 없습니다`, state }
    }

    state.currentPath = newPath
    return { output: `✅ ${newPath} 로 이동`, state }
  }

  // cat
  if (cmd === 'cat') {
    if (!arg) return { output: '❌ cat: 파일명을 입력하세요', state }

    const filePath = resolvePath(state.currentPath, arg)
    const node = getNode(state.filesystem, filePath)

    if (!node || node.type !== 'file') {
      return { output: `❌ cat: ${arg}: 파일을 찾을 수 없습니다`, state }
    }

    return { output: `✅ ${node.content}`, state, readFile: arg }
  }

  // mkdir
  if (cmd === 'mkdir') {
    if (!arg) return { output: '❌ mkdir: 폴더명을 입력하세요', state }
    state.createdDirs.push({ name: arg, parent: state.currentPath })
    return { output: `✅ 📁 ${arg} 폴더 생성됨`, state, createdDir: arg }
  }

  // touch
  if (cmd === 'touch') {
    if (!arg) return { output: '❌ touch: 파일명을 입력하세요', state }
    state.createdFiles.push({ name: arg, parent: state.currentPath })
    return { output: `✅ 📄 ${arg} 파일 생성됨`, state, createdFile: arg }
  }

  // rm
  if (cmd === 'rm') {
    if (!arg) return { output: '❌ rm: 파일명을 입력하세요', state }
    state.createdFiles = state.createdFiles.filter(f => f.name !== arg)
    return { output: `✅ ${arg} 삭제됨`, state }
  }

  return { output: `❌ command not found: ${cmd}`, state }
}

function checkGoal(state, stage, lastResult) {
  if (stage.goal_command === 'cat' && lastResult.readFile === stage.goal_file) return true
  if (stage.goal_command === 'touch' && lastResult.createdFile === stage.goal_file) return true
  if (stage.goal_command === 'mkdir' && lastResult.createdDir === stage.goal_file) return true
  return false
}

module.exports = { applyDungeonCommand, checkGoal, initDungeonSession }