class VirtualFileSystem {
  constructor() {
    this.reset()
  }

  reset() {
    this.currentPath = '/home/user'
    this.structure = {
      '/': {
        type: 'dir',
        children: {
          'home': {
            type: 'dir',
            children: {
              'user': {
                type: 'dir',
                children: {
                  'README.md': { type: 'file', content: '# Project\nHello World' },
                  'app.js': { type: 'file', content: 'console.log("hello")' },
                  'secret.env': { type: 'file', content: 'SECRET=1234' },
                }
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

  // 현재 노드 가져오기
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

  // 경로 정규화
  resolvePath(path) {
    if (!path) return this.currentPath
    if (path === '~') return '/home/user'
    if (path.startsWith('/')) return path

    const base = this.currentPath.split('/').filter(Boolean)
    const parts = path.split('/')

    for (const part of parts) {
      if (part === '..') base.pop()
      else if (part !== '.') base.push(part)
    }

    return '/' + base.join('/')
  }

  // 명령어 실행
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
        const namePattern = options['name'] || options['name']
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