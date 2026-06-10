class VirtualFileSystem {
  constructor(initialFiles = []) {
    this.initialFiles = initialFiles
    this.reset()
  }

  reset() {
    this.currentPath = '/home/user'

    const userFiles = {}
    this.initialFiles.forEach(filename => {
      userFiles[filename] = { type: 'file', content: '' }
    })

    this.structure = {
      '/': {
        type: 'dir',
        children: {
          'home': {
            type: 'dir',
            children: {
              'user': {
                type: 'dir',
                children: userFiles
              }
            }
          },
          'etc': { type: 'dir', children: {} },
          'tmp': { type: 'dir', children: {} },
        }
      }
    }
    this.history = []
  }

  getNode(path) {
    const parts = path === '/' ? [''] : path.split('/')
    let node = this.structure['/']
    for (let i = 1; i < parts.length; i++) {
      if (!parts[i]) continue
      if (!node.children || !node.children[parts[i]]) return null
      node = node.children[parts[i]]
    }
    return node
  }

  resolvePath(path) {
    if (!path) return this.currentPath
    if (path === '~') return '/home/user'

    // trailing slash 제거
    path = path.replace(/\/$/, '')

    if (path.startsWith('/')) return path

    const base = this.currentPath.split('/').filter(Boolean)
    const parts = path.split('/')

    for (const part of parts) {
      if (part === '..') base.pop()
      else if (part !== '.') base.push(part)
    }

    return '/' + base.join('/')
  }

  execute(parsed) {
    const { base, subcommand, args, flags, options } = parsed
    this.history.push(parsed.raw)

    switch (base) {
      case 'pwd':
        return { output: this.currentPath, success: true }

      case 'ls': {
        const path = args[0] ? this.resolvePath(args[0]) : this.currentPath
        const node = this.getNode(path)
        if (!node || node.type !== 'dir') {
          return { output: `ls: ${path}: No such file or directory`, success: false }
        }
        const showHidden = flags.includes('a')
        const items = Object.entries(node.children || {})
          .filter(([name]) => showHidden || !name.startsWith('.'))
          .map(([name, n]) => {
            if (flags.includes('l')) {
              return `${n.type === 'dir' ? 'd' : '-'}rwxr-xr-x  ${name}`
            }
            return n.type === 'dir' ? `\x1b[34m${name}\x1b[0m` : name
          })
        return { output: items.join('\n') || '(empty)', success: true }
      }

      case 'cd': {
        const target = args[0] || '/home/user'
        const newPath = this.resolvePath(target)
        const node = this.getNode(newPath)
        if (!node || node.type !== 'dir') {
          return { output: `cd: ${target}: No such file or directory`, success: false }
        }
        this.currentPath = newPath
        return { output: '', success: true, changedPath: newPath }
      }

      case 'mkdir': {
        if (!args[0]) return { output: 'mkdir: missing operand', success: false }
        const newPath = this.resolvePath(args[0])
        const parts = newPath.split('/').filter(Boolean)
        const dirName = parts.pop()
        const parentPath = '/' + parts.join('/')
        const parent = this.getNode(parentPath)
        if (!parent || parent.type !== 'dir') {
          return { output: `mkdir: cannot create directory '${args[0]}': No such file or directory`, success: false }
        }
        parent.children[dirName] = { type: 'dir', children: {} }
        return { output: `Directory '${args[0]}' created`, success: true, created: args[0] }
      }

      case 'touch': {
        if (!args[0]) return { output: 'touch: missing file operand', success: false }
        const newPath = this.resolvePath(args[0])
        const parts = newPath.split('/').filter(Boolean)
        const fileName = parts.pop()
        const parentPath = '/' + parts.join('/')
        const parent = this.getNode(parentPath)
        if (!parent || parent.type !== 'dir') {
          return { output: `touch: cannot touch '${args[0]}': No such file or directory`, success: false }
        }
        parent.children[fileName] = { type: 'file', content: '' }
        return { output: `File '${args[0]}' created`, success: true, created: args[0] }
      }

      case 'cat': {
        if (!args[0]) return { output: 'cat: missing operand', success: false }
        const filePath = this.resolvePath(args[0])
        const node = this.getNode(filePath)
        if (!node || node.type !== 'file') {
          return { output: `cat: ${args[0]}: No such file or directory`, success: false }
        }
        return { output: node.content, success: true, readFile: args[0] }
      }

      case 'rm': {
        if (!args[0]) return { output: 'rm: missing operand', success: false }
        const targetPath = this.resolvePath(args[0])
        const parts = targetPath.split('/').filter(Boolean)
        const name = parts.pop()
        const parentPath = '/' + parts.join('/')
        const parent = this.getNode(parentPath)
        if (!parent || !parent.children[name]) {
          return { output: `rm: cannot remove '${args[0]}': No such file or directory`, success: false }
        }
        delete parent.children[name]
        return { output: `'${args[0]}' removed`, success: true, removed: args[0] }
      }

      case 'mv': {
        if (args.length < 2) return { output: 'mv: missing destination', success: false }
        const srcPath = this.resolvePath(args[0])
        const dstPath = this.resolvePath(args[1])

        const srcParts = srcPath.split('/').filter(Boolean)
        const srcName = srcParts.pop()
        const srcParent = this.getNode('/' + srcParts.join('/'))

        if (!srcParent || !srcParent.children[srcName]) {
          return { output: `mv: '${args[0]}': No such file or directory`, success: false }
        }

        const dstNode = this.getNode(dstPath)

        // 목적지가 디렉토리면 그 안으로 이동
        if (dstNode && dstNode.type === 'dir') {
          dstNode.children[srcName] = srcParent.children[srcName]
          delete srcParent.children[srcName]
          return { output: `'${args[0]}' → '${args[1]}'`, success: true, moved: { from: args[0], to: args[1] } }
        }

        const dstParts = dstPath.split('/').filter(Boolean)
        const dstName = dstParts.pop()
        const dstParent = this.getNode('/' + dstParts.join('/'))

        if (!dstParent) {
          return { output: `mv: '${args[1]}': No such directory`, success: false }
        }

        dstParent.children[dstName] = srcParent.children[srcName]
        delete srcParent.children[srcName]
        return { output: `'${args[0]}' → '${args[1]}'`, success: true, moved: { from: args[0], to: args[1] } }
      }

      case 'cp': {
        if (args.length < 2) return { output: 'cp: missing destination', success: false }
        const srcPath = this.resolvePath(args[0])
        const dstPath = this.resolvePath(args[1])

        const srcNode = this.getNode(srcPath)
        if (!srcNode) return { output: `cp: '${args[0]}': No such file or directory`, success: false }

        const dstNode = this.getNode(dstPath)

        // 목적지가 디렉토리면 그 안으로 복사
        if (dstNode && dstNode.type === 'dir') {
          const srcParts = srcPath.split('/').filter(Boolean)
          const srcName = srcParts[srcParts.length - 1]
          dstNode.children[srcName] = JSON.parse(JSON.stringify(srcNode))
          return { output: `'${args[0]}' copied to '${args[1]}'`, success: true, copied: { from: args[0], to: args[1] } }
        }

        const dstParts = dstPath.split('/').filter(Boolean)
        const dstName = dstParts.pop()
        const dstParent = this.getNode('/' + dstParts.join('/'))

        if (!dstParent) return { output: `cp: '${args[1]}': No such directory`, success: false }

        dstParent.children[dstName] = JSON.parse(JSON.stringify(srcNode))
        return { output: `'${args[0]}' copied to '${args[1]}'`, success: true, copied: { from: args[0], to: args[1] } }
      }

      case 'grep': {
        if (args.length < 2) return { output: 'grep: missing pattern or file', success: false }
        const pattern = args[0]
        const filePath = this.resolvePath(args[1])
        const node = this.getNode(filePath)
        if (!node || node.type !== 'file') {
          return { output: `grep: ${args[1]}: No such file`, success: false }
        }
        const regex = new RegExp(pattern, flags.includes('i') ? 'gi' : 'g')
        const matches = node.content.split('\n').filter(line => regex.test(line))
        return {
          output: matches.length > 0 ? matches.join('\n') : '(no matches)',
          success: matches.length > 0,
          matches
        }
      }

      case 'chmod': {
        if (args.length < 2) return { output: 'chmod: missing operand', success: false }
        const mode = args[0]
        const filePath = this.resolvePath(args[1])
        const node = this.getNode(filePath)
        if (!node) return { output: `chmod: cannot access '${args[1]}': No such file`, success: false }
        node.permissions = mode
        return { output: `chmod: '${args[1]}' permissions changed to ${mode}`, success: true, chmod: { file: args[1], mode } }
      }

      case 'echo': {
        const text = args.join(' ')
        return { output: text, success: true }
      }

      case 'find': {
        const searchPath = args[0] || '.'
        const namePattern = options['name']
        const resolvedPath = this.resolvePath(searchPath)
        const results = []

        const search = (node, path) => {
          if (!node || !node.children) return
          Object.entries(node.children).forEach(([name, child]) => {
            const fullPath = `${path}/${name}`
            if (!namePattern || name.includes(namePattern.replace('*', ''))) {
              results.push(fullPath)
            }
            if (child.type === 'dir') search(child, fullPath)
          })
        }

        const startNode = this.getNode(resolvedPath)
        search(startNode, resolvedPath)
        return { output: results.join('\n') || '(no results)', success: true }
      }

      case 'ps':
        return {
          output: 'PID   TTY   TIME     CMD\n1234  pts/0 00:00:01 bash\n5678  pts/0 00:00:00 node',
          success: true
        }

      case 'df':
        return {
          output: 'Filesystem  Size  Used  Avail  Use%  Mounted on\n/dev/sda1   50G   20G   30G    40%   /',
          success: true
        }

      case 'du': {
        const target = args[0] || '.'
        const targetPath = this.resolvePath(target)
        const node = this.getNode(targetPath)
        if (!node) return { output: `du: cannot access '${target}': No such file or directory`, success: false }
        if (flags.includes('s') && flags.includes('h')) {
          return { output: `4.0K\t${target}`, success: true }
        }
        if (flags.includes('s')) {
          return { output: `4\t${target}`, success: true }
        }
        if (flags.includes('h')) {
          return { output: `4.0K\t${target}`, success: true }
        }
        return { output: `4\t${target}`, success: true }
      }

      case 'kill': {
        const pid = args[0]
        if (!pid) return { output: 'kill: missing PID', success: false }
        if (isNaN(pid)) return { output: `kill: ${pid}: not a valid PID`, success: false }
        return { output: ``, success: true }
      }

      case 'tar': {
        if (!args[0]) return { output: 'tar: missing operand', success: false }
        if (flags.includes('c') && flags.includes('z') && flags.includes('v') && flags.includes('f')) {
          return { output: `${args[0]}\n${args[1]}`, success: true }
        }
        if (flags.includes('x') && flags.includes('z') && flags.includes('v') && flags.includes('f')) {
          return { output: `${args[0]}`, success: true }
        }
        return { output: `tar: operation completed`, success: true }
      }

      case 'ln': {
        if (args.length < 2) return { output: 'ln: missing operand', success: false }
        if (!flags.includes('s')) return { output: 'ln: missing -s flag for symbolic link', success: false }
        return { output: `'${args[1]}' -> '${args[0]}'`, success: true }
      }

      case 'awk': {
        if (!args[0]) return { output: 'awk: missing program', success: false }
        return { output: `awk: executed`, success: true }
      }

      case 'sed': {
        if (!args[0]) return { output: 'sed: missing expression', success: false }
        return { output: `sed: executed`, success: true }
      }

      case 'curl': {
        if (!args[0]) return { output: 'curl: missing URL', success: false }
        return { output: `curl: (200) OK`, success: true }
      }

      case 'ssh': {
        if (!args[0]) return { output: 'ssh: missing destination', success: false }
        return { output: `ssh: connected to ${args[0]}`, success: true }
      }

      case 'crontab': {
        if (!flags.includes('e') && !args[0]) return { output: 'crontab: missing operand', success: false }
        if (flags.includes('e')) return { output: `crontab: opening editor...`, success: true }
        return { output: `crontab: executed`, success: true }
      }

      default:
        return { output: `${base}: command not found`, success: false }
    }
  }

  getState() {
    return {
      currentPath: this.currentPath,
      files: this.getNode(this.currentPath)?.children || {}
    }
  }
}

module.exports = VirtualFileSystem