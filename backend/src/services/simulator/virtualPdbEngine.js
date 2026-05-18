class VirtualPdbEngine {
  constructor() {
    this.reset()
  }

  reset() {
    this.running = false
    this.currentLine = 1
    this.breakpoints = []
    this.callStack = ['<module>']
    this.variables = { x: 10, y: 20, result: 30 }
    this.frames = [{ name: '<module>', line: 1 }]
    this.currentFrame = 0
    this.sourceCode = [
      '1: def main():',
      '2:     x = 10',
      '3:     y = 20',
      '4:     result = x + y',
      '5:     print(result)',
      '6: ',
      '7: main()',
    ]
  }

  execute(parsed) {
    const { base, args, options } = parsed
    const cmd = base

    switch (cmd) {
      case 'l':
      case 'list': {
        const start = Math.max(0, this.currentLine - 2)
        const end = Math.min(this.sourceCode.length, start + 5)
        return {
          output: this.sourceCode.slice(start, end).join('\n'),
          success: true
        }
      }

      case 'n':
      case 'next': {
        this.currentLine = Math.min(this.currentLine + 1, this.sourceCode.length)
        return {
          output: `> program.py(${this.currentLine})${this.frames[this.currentFrame]?.name || 'main'}()\n-> ${this.sourceCode[this.currentLine - 1]?.split(': ')[1] || ''}`,
          success: true
        }
      }

      case 's':
      case 'step': {
        const line = this.sourceCode[this.currentLine - 1]
        return {
          output: `--Call--\n> program.py(${this.currentLine})<function>\n-> ${line?.split(': ')[1] || ''}`,
          success: true
        }
      }

      case 'c':
      case 'continue': {
        if (this.breakpoints.length > 0) {
          const bp = this.breakpoints[0]
          this.currentLine = bp
          return { output: `> program.py(${bp})<module>()\n-> ${this.sourceCode[bp - 1]?.split(': ')[1] || ''}`, success: true }
        }
        return { output: 'The program finished and will be restarted', success: true }
      }

      case 'p':
      case 'print': {
        const varName = args[0]
        if (!varName) return { output: '*** SyntaxError: unexpected EOF', success: false }
        const val = this.variables[varName]
        if (val === undefined) return { output: `*** NameError: name '${varName}' is not defined`, success: false }
        return { output: String(val), success: true }
      }

      case 'pp': {
        const varName = args[0]
        if (!varName) return { output: '*** SyntaxError: unexpected EOF', success: false }
        const val = this.variables[varName]
        if (val === undefined) return { output: `*** NameError: name '${varName}' is not defined`, success: false }
        return { output: JSON.stringify(val, null, 2), success: true }
      }

      case 'b':
      case 'break': {
        const line = parseInt(args[0])
        if (isNaN(line)) return { output: `*** Breakpoint must be a number`, success: false }
        this.breakpoints.push(line)
        return {
          output: `Breakpoint ${this.breakpoints.length} at line ${line}`,
          success: true,
          stateChange: { breakpoints: this.breakpoints }
        }
      }

      case 'cl':
      case 'clear': {
        const line = parseInt(args[0])
        this.breakpoints = this.breakpoints.filter(b => b !== line)
        return { output: `Deleted breakpoint at line ${line}`, success: true }
      }

      case 'w':
      case 'where': {
        const stack = this.frames.map((f, i) =>
          `  ${i === this.currentFrame ? '>' : ' '} ${i}  ${f.name} at program.py:${f.line}`
        ).join('\n')
        return { output: stack, success: true }
      }

      case 'bt':
      case 'backtrace': {
        const stack = this.frames.map((f, i) =>
          `  ${i}  ${f.name} at program.py:${f.line}`
        ).join('\n')
        return { output: stack, success: true }
      }

      case 'u':
      case 'up': {
        if (this.currentFrame <= 0) return { output: 'Oldest frame', success: false }
        this.currentFrame--
        const f = this.frames[this.currentFrame]
        return { output: `> program.py(${f.line})${f.name}()`, success: true }
      }

      case 'd':
      case 'down': {
        if (this.currentFrame >= this.frames.length - 1) return { output: 'Newest frame', success: false }
        this.currentFrame++
        const f = this.frames[this.currentFrame]
        return { output: `> program.py(${f.line})${f.name}()`, success: true }
      }

      case 'a':
      case 'args': {
        return { output: Object.entries(this.variables).map(([k, v]) => `${k} = ${v}`).join('\n'), success: true }
      }

      case 'locals()': {
        return {
          output: JSON.stringify(this.variables),
          success: true
        }
      }

      case 'h':
      case 'help': {
        return {
          output: 'PDB Commands:\n  l (list)    - Show source\n  n (next)    - Next line\n  s (step)    - Step into\n  c (continue)- Continue\n  p <var>     - Print variable\n  b <line>    - Set breakpoint\n  w (where)   - Show stack\n  q (quit)    - Quit',
          success: true
        }
      }

      case 'q':
      case 'quit': {
        return { output: 'Quitting PDB...', success: true }
      }

      default:
        return { output: `*** ${cmd}: unknown command`, success: false }
    }
  }

  getState() {
    return {
      currentLine: this.currentLine,
      breakpoints: this.breakpoints,
      variables: this.variables,
      callStack: this.callStack,
      currentFrame: this.currentFrame
    }
  }
}

module.exports = VirtualPdbEngine