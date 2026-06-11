const { parseCommand } = require('../parser/commandParser')

class VirtualGitEngine {
  constructor(vfs) {
    this.vfs = vfs
    this.reset()
  }

  reset() {
    this.initialized = false
    this.currentBranch = 'main'
    this.branches = { main: { commits: [] } }
    this.stagedFiles = []
    this.workingChanges = []
    this.remotes = {}
    this.stash = []
    this.tags = []
    this.config = {}
    this.trackedFiles = []
  }

  execute(parsed) {
    const { subcommand, args, options, flags } = parsed

    if (!subcommand) return { output: 'git: missing subcommand', success: false }

    switch (subcommand) {
      case '--version':
        return { output: 'git version 2.39.0', success: true }

      case 'init':
        this.initialized = true
        this.branches = { main: { commits: [] } }
        this.currentBranch = 'main'
        return {
          output: 'Initialized empty Git repository in .git/',
          success: true,
          stateChange: { initialized: true }
        }

      case 'status': {
        const changes = this.vfs
          ? Object.keys(this.vfs.getNode(this.vfs.currentPath)?.children || {})
          : []
        const staged = this.stagedFiles
        const unstaged = changes.filter(f => !staged.includes(f))

        let output = `On branch ${this.currentBranch}\n`
        if (staged.length > 0) {
          output += `\nChanges to be committed:\n${staged.map(f => `  modified: ${f}`).join('\n')}`
        }
        if (unstaged.length > 0) {
          output += `\nChanges not staged for commit:\n${unstaged.map(f => `  modified: ${f}`).join('\n')}`
        }
        if (staged.length === 0 && unstaged.length === 0) {
          output += '\nnothing to commit, working tree clean'
        }
        return { output, success: true }
      }

      case 'add': {
        if (!args[0]) {
          return {
            output: 'Nothing specified, nothing added.',
            success: false,
            feedback: 'git add 뒤에 파일명이나 . 을 입력하세요.'
          }
        }

        if (args[0] === '.') {
          const files = this.vfs
            ? Object.keys(this.vfs.getNode(this.vfs.currentPath)?.children || {})
            : []
          this.stagedFiles = [...new Set([...this.stagedFiles, ...files])]
          return {
            output: `Added ${this.stagedFiles.length} files to staging area`,
            success: true,
            stateChange: { stagedFiles: this.stagedFiles }
          }
        } else {
          const filesToAdd = args.filter(a => a)
          filesToAdd.forEach(f => {
            if (!this.stagedFiles.includes(f)) this.stagedFiles.push(f)
          })
          return {
            output: `Added '${filesToAdd.join(', ')}' to staging area`,
            success: true,
            stateChange: { stagedFiles: this.stagedFiles }
          }
        }
      }

      case 'commit': {
        if (this.stagedFiles.length === 0) {
          return {
            output: 'nothing to commit, working tree clean',
            success: false,
            feedback: '커밋할 파일이 없습니다. git add 로 파일을 스테이징하세요.'
          }
        }
        const message = options['m'] || options['message'] || 'no message'
        const commit = {
          hash: Math.random().toString(36).slice(2, 9),
          message,
          files: [...this.stagedFiles],
          timestamp: new Date().toISOString()
        }
        this.branches[this.currentBranch].commits.push(commit)
        this.trackedFiles = [...new Set([...this.trackedFiles, ...commit.files])]
        this.stagedFiles = []
        return {
          output: `[${this.currentBranch} ${commit.hash}] ${message}\n ${commit.files.length} file(s) changed`,
          success: true,
          stateChange: { commit }
        }
      }

      case 'log': {
        const commits = this.branches[this.currentBranch]?.commits || []
        if (commits.length === 0) {
          return { output: 'fatal: your current branch has no commits yet', success: false }
        }
        if (flags.includes('oneline') || options['oneline'] !== undefined) {
          const oneLines = commits.slice().reverse().map(c => `${c.hash} ${c.message}`)
          return { output: oneLines.join('\n'), success: true }
        }
        const logLines = commits.slice().reverse().map(c =>
          `commit ${c.hash}\n  ${c.message}`
        )
        return { output: logLines.join('\n\n'), success: true }
      }

      case 'branch': {
        if (flags.includes('d') || options['d']) {
          const target = args[0]
          if (!this.branches[target]) {
            return { output: `error: branch '${target}' not found`, success: false }
          }
          delete this.branches[target]
          return { output: `Deleted branch ${target}`, success: true }
        }
        if (!args[0]) {
          const list = Object.keys(this.branches)
            .map(b => b === this.currentBranch ? `* ${b}` : `  ${b}`)
            .join('\n')
          return { output: list, success: true }
        }
        if (this.branches[args[0]]) {
          return { output: `fatal: A branch named '${args[0]}' already exists`, success: false }
        }
        this.branches[args[0]] = { commits: [...(this.branches[this.currentBranch]?.commits || [])] }
        return { output: `Branch '${args[0]}' created`, success: true, stateChange: { newBranch: args[0] } }
      }

      case 'checkout': {
        if (flags.includes('b')) {
          const newBranch = args[0]
          if (!newBranch) return { output: 'error: missing branch name', success: false }
          this.branches[newBranch] = { commits: [...(this.branches[this.currentBranch]?.commits || [])] }
          this.currentBranch = newBranch
          return { output: `Switched to a new branch '${newBranch}'`, success: true, stateChange: { currentBranch: newBranch } }
        }
        const target = args[0]
        if (!target) return { output: 'error: missing branch name', success: false }
        if (!this.branches[target]) return { output: `error: pathspec '${target}' did not match any file(s) known to git`, success: false }
        this.currentBranch = target
        return { output: `Switched to branch '${target}'`, success: true, stateChange: { currentBranch: target } }
      }

      case 'switch': {
        const target = args[0]
        if (!target) return { output: 'error: missing branch name', success: false }
        if (!this.branches[target]) {
          if (flags.includes('c')) {
            this.branches[target] = { commits: [] }
          } else {
            return { output: `fatal: invalid reference: ${target}`, success: false }
          }
        }
        this.currentBranch = target
        return { output: `Switched to branch '${target}'`, success: true }
      }

      case 'merge': {
        const target = args[0]
        if (!target) return { output: 'error: missing branch name', success: false }
        if (!this.branches[target]) return { output: `merge: ${target} - not something we can merge`, success: false }
        const targetCommits = this.branches[target].commits
        this.branches[this.currentBranch].commits.push(...targetCommits)
        return { output: `Merge branch '${target}' into ${this.currentBranch}\nFast-forward`, success: true }
      }

      case 'diff':
        return { output: 'diff --git a/file.txt b/file.txt\n--- a/file.txt\n+++ b/file.txt', success: true }

      case 'remote': {
        if (args[0] === 'add') {
          this.remotes[args[1]] = args[2]
          return { output: `Remote '${args[1]}' added`, success: true }
        }
        if (flags.includes('v')) {
          const list = Object.entries(this.remotes)
            .map(([k, v]) => `${k}\t${v} (fetch)\n${k}\t${v} (push)`)
            .join('\n')
          return { output: list || '(no remotes)', success: true }
        }
        return { output: Object.keys(this.remotes).join('\n') || '(no remotes)', success: true }
      }

      case 'push': {
        const remote = args[0] || 'origin'
        const branch = args[1] || this.currentBranch
        if (!this.remotes[remote]) {
          return {
            output: `fatal: '${remote}' does not appear to be a git repository`,
            success: false,
            feedback: `원격 저장소를 먼저 추가하세요. git remote add ${remote} <url>`
          }
        }
        return { output: `Branch '${branch}' pushed to ${remote}`, success: true }
      }

      case 'pull': {
        const remote = args[0] || 'origin'
        const branch = args[1] || this.currentBranch
        return { output: `Already up to date. (${remote}/${branch})`, success: true }
      }

      case 'clone': {
        const url = args[0]
        if (!url) return { output: 'fatal: missing repository URL', success: false }
        return { output: `Cloning into '${url.split('/').pop()}'...\ndone.`, success: true }
      }

      case 'stash': {
        if (args[0] === 'pop') {
          if (this.stash.length === 0) return { output: 'No stash entries found.', success: false }
          const entry = this.stash.pop()
          this.stagedFiles = entry.files
          return { output: 'Dropped stash@{0}', success: true }
        }
        this.stash.push({ files: [...this.stagedFiles] })
        this.stagedFiles = []
        return { output: 'Saved working directory and index state', success: true }
      }

      case 'reset': {
        if (flags.includes('soft') || options['soft'] !== undefined) {
          const last = this.branches[this.currentBranch].commits.pop()
          this.stagedFiles = last?.files || []
          return { output: `HEAD is now at previous commit`, success: true }
        }
        if (flags.includes('hard') || options['hard'] !== undefined) {
          this.branches[this.currentBranch].commits.pop()
          this.stagedFiles = []
          return { output: `HEAD is now at previous commit`, success: true }
        }
        if (flags.includes('mixed') || options['mixed'] !== undefined) {
          const last = this.branches[this.currentBranch].commits.pop()
          this.stagedFiles = []
          return {
            output: `Unstaged changes after reset:\n${last?.files?.map(f => `M\t${f}`).join('\n') || ''}`,
            success: true
          }
        }
        if (flags.includes('staged') || options['staged'] !== undefined) {
          const file = args[0]
          this.stagedFiles = this.stagedFiles.filter(f => f !== file)
          return { output: `Unstaged '${file}'`, success: true }
        }
        // 기본값 --mixed
        this.stagedFiles = []
        return { output: '', success: true }
      }

      case 'restore': {
        if (options['staged']) {
          const file = args[0] || '.'
          if (file === '.') {
            this.stagedFiles = []
          } else {
            this.stagedFiles = this.stagedFiles.filter(f => f !== file)
          }
          return { output: ``, success: true, stateChange: { stagedFiles: this.stagedFiles } }
        }
        return { output: `Restored '${args[0]}'`, success: true }
      }

      case 'rebase': {
        const target = args[0]
        return { output: `Successfully rebased and updated refs/heads/${this.currentBranch}.`, success: true }
      }

      case 'tag': {
        if (!args[0]) {
          return { output: this.tags.join('\n') || '(no tags)', success: true }
        }
        const tagName = args[0]
        const message = options['m'] || options['message'] || ''
        this.tags.push(tagName)
        if (message) {
          return { output: `Tag '${tagName}' created with message '${message}'`, success: true }
        }
        return { output: `Tag '${tagName}' created`, success: true }
      }

      case 'config': {
        const key = args[0]
        const value = args[1]
        if (key && value) {
          this.config[key] = value
          return { output: `Config '${key}' set to '${value}'`, success: true }
        }
        return { output: Object.entries(this.config).map(([k, v]) => `${k}=${v}`).join('\n'), success: true }
      }

      case 'cherry-pick': {
        const hash = args[0]
        if (!hash) return { output: 'error: missing commit hash', success: false }
        return { output: `[${this.currentBranch} cherry-picked] ${hash}`, success: true }
      }

      case 'revert': {
        const target = args[0] || 'HEAD'
        return { output: `Revert "${target}"\n1 file changed`, success: true }
      }

      case 'bisect': {
        return { output: 'bisect: operation completed', success: true }
      }

      default:
        return { output: `git: '${subcommand}' is not a git command`, success: false }
    }
  }

  getState() {
    return {
      initialized: this.initialized,
      currentBranch: this.currentBranch,
      branches: this.branches,
      stagedFiles: this.stagedFiles,
      remotes: this.remotes,
      tags: this.tags,
      config: this.config,
      trackedFiles: this.trackedFiles,
      stash: this.stash.length
    }
  }
}

module.exports = VirtualGitEngine