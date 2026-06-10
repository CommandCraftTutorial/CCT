class VirtualPdbEngine {
  constructor() {
    this.reset()
  }

  reset() {
    this.running = false
    this.program = null
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

      case 'python': {
        const module = parsed.options['m']
        if (module === 'pdb') {
          const script = parsed.args[0]
          if (!script) return { output: 'Usage: python -m pdb <script.py>', success: false }
          this.program = script
          this.running = false
          this.currentLine = 1
          return {
            output: `> ${script}(1)<module>()\n-> ${this.sourceCode[0]?.split(': ')[1] || ''}\n(Pdb)`,
            success: true,
            stateChange: { running: false, program: script }
          }
        }
        return { output: 'Usage: python -m pdb <script.py>', success: false }
      }

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
        this.running = true
        if (this.breakpoints.length > 0) {
          const bp = this.breakpoints[0]
          this.currentLine = bp
          return {
            output: `> program.py(${bp})<module>()\n-> ${this.sourceCode[bp - 1]?.split(': ')[1] || ''}`,
            success: true,
            stateChange: { running: true }
          }
        }
        return {
          output: 'The program finished and will be restarted',
          success: true,
          stateChange: { running: true }
        }
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

      case 'condition': {
        const bp = args[0]
        const cond = args.slice(1).join(' ')
        if (!bp) return { output: '*** condition: missing breakpoint number', success: false }
        return { output: `Breakpoint ${bp} now has condition '${cond}'`, success: true }
      }

      case 'commands': {
        const bp = args[0] || '1'
        return { output: `(com) end`, success: true }
      }

      case 'unt':
      case 'until': {
        const line = parseInt(args[0]) || this.currentLine + 1
        this.currentLine = line
        return { output: `> program.py(${line})<module>()`, success: true }
      }

      case 'tbreak': {
        const line = parseInt(args[0])
        if (isNaN(line)) return { output: '*** tbreak: missing line number', success: false }
        return { output: `Temporary breakpoint ${this.breakpoints.length + 1} at line ${line}`, success: true }
      }

      case 'ignore': {
        const bp = args[0]
        const count = args[1]
        if (!bp || !count) return { output: '*** ignore: missing arguments', success: false }
        return { output: `Will ignore next ${count} crossings of breakpoint ${bp}.`, success: true }
      }

      case 'alias': {
        const name = args[0]
        const cmd = args.slice(1).join(' ')
        if (!name) return { output: '*** alias: missing name', success: false }
        return { output: `alias ${name} = ${cmd}`, success: true }
      }

      case 'debug': {
        const expr = args.join(' ')
        if (!expr) return { output: '*** debug: missing expression', success: false }
        return { output: `> program.py(1)<module>()\n-> ${expr}`, success: true }
      }

      default:
        return { output: `*** ${cmd}: unknown command`, success: false }
    }
  }

  getState() {
    return {
      running: this.running,
      program: this.program,
      currentLine: this.currentLine,
      breakpoints: this.breakpoints,
      variables: this.variables,
      callStack: this.callStack,
      currentFrame: this.currentFrame
    }
  }
}

module.exports = VirtualPdbEngine