class VirtualGdbEngine {
  constructor() {
    this.reset()
  }

  reset() {
    this.running = false
    this.program = null
    this.breakpoints = []
    this.watchpoints = []
    this.currentLine = 0
    this.variables = { x: 10, y: 20, result: 0 }
    this.callStack = ['main']
    this.bpCounter = 0
    this.sourceCode = [
      '1: int main() {',
      '2:   int x = 10;',
      '3:   int y = 20;',
      '4:   int result = x + y;',
      '5:   printf("%d\\n", result);',
      '6:   return 0;',
      '7: }',
    ]
  }

  execute(parsed) {
    const { base, subcommand, args } = parsed

    if (base === 'gdb') {
      const prog = subcommand || args[0]
      if (prog) {
        this.program = prog
        this.running = true
        return {
          output: `GNU gdb (Ubuntu) 12.1\nReading symbols from ${prog}...\n(gdb)`,
          success: true,
          stateChange: { running: true, program: prog }
        }
      }
      return { output: 'usage: gdb <program>', success: false }
    }

    const cmd = base

    switch (cmd) {

      case 'file': {
        const prog = args[0]
        if (!prog) return { output: 'Usage: file <executable>', success: false }
        this.program = prog
        this.running = true
        return {
          output: `Reading symbols from ${prog}...\n(No debugging symbols found in ${prog})`,
          success: true,
          stateChange: { running: true, program: prog }
        }
      }

      case 'run':
      case 'r': {
        if (!this.program) return { output: 'No executable file specified.', success: false }
        this.running = true
        this.currentLine = 1
        const activeBps = this.breakpoints.filter(bp => bp.enabled)
        if (activeBps.length > 0) {
          const bp = activeBps[0]
          return { output: `Starting program: ${this.program}\nBreakpoint ${bp.id}, ${bp.location} at line ${bp.line || 1}`, success: true }
        }
        return { output: `Starting program: ${this.program}\n[Inferior 1 exited normally]`, success: true }
      }

      case 'start': {
        if (!this.program) return { output: 'No executable file specified.', success: false }
        this.running = true
        this.currentLine = 1
        return { output: `Temporary breakpoint 1, main () at program.c:1\n${this.sourceCode[0]}`, success: true }
      }

      case 'attach': {
        const pid = args[0]
        if (!pid) return { output: 'Usage: attach <pid>', success: false }
        this.running = true
        return { output: `Attaching to process ${pid}\n(gdb)`, success: true }
      }

      case 'detach': {
        return { output: 'Detaching from program.', success: true }
      }

      case 'break':
      case 'b':
      case 'tbreak':
      case 'hbreak': {
        const location = args[0]
        if (!location) return { output: 'Argument required (function or line number).', success: false }
        this.bpCounter++
        const bp = {
          id: this.bpCounter,
          location,
          line: isNaN(location) ? null : parseInt(location),
          enabled: true,
          type: cmd === 'tbreak' ? 'temporary' : cmd === 'hbreak' ? 'hw breakpoint' : 'breakpoint'
        }
        this.breakpoints.push(bp)
        const note = cmd === 'tbreak' ? ' (temporary)' : ''
        return {
          output: `Breakpoint ${bp.id}${note} at ${location}`,
          success: true,
          stateChange: { breakpoints: this.breakpoints }
        }
      }

      case 'condition':
      case 'cond': {
        const bpId = parseInt(args[0])
        const expr = args.slice(1).join(' ')
        const bp = this.breakpoints.find(b => b.id === bpId)
        if (!bp) return { output: `No breakpoint number ${bpId}.`, success: false }
        bp.condition = expr || null
        return {
          output: expr
            ? `Condition for breakpoint ${bpId}: ${expr}`
            : `Breakpoint ${bpId} now unconditional.`,
          success: true
        }
      }

      case 'ignore': {
        const bpId = parseInt(args[0])
        const count = parseInt(args[1])
        const bp = this.breakpoints.find(b => b.id === bpId)
        if (!bp) return { output: `No breakpoint number ${bpId}.`, success: false }
        bp.ignoreCount = count
        return { output: `Will ignore next ${count} crossings of breakpoint ${bpId}.`, success: true }
      }

      case 'watch':
      case 'rwatch':
      case 'awatch': {
        const varName = args[0]
        if (!varName) return { output: 'Argument required', success: false }
        this.bpCounter++
        const wp = { id: this.bpCounter, name: varName, type: cmd }
        this.watchpoints.push(wp)
        const typeLabel = { watch: 'Write', rwatch: 'Read', awatch: 'Access' }[cmd]
        return { output: `${typeLabel} watchpoint ${wp.id}: ${varName}`, success: true }
      }

      case 'delete':
      case 'd': {
        if (!args[0] || args[0] === 'breakpoints') {
          this.breakpoints = []
          this.watchpoints = []
          return { output: 'All breakpoints and watchpoints deleted.', success: true }
        }
        const id = parseInt(args[0])
        const before = this.breakpoints.length + this.watchpoints.length
        this.breakpoints = this.breakpoints.filter(b => b.id !== id)
        this.watchpoints = this.watchpoints.filter(w => w.id !== id)
        const after = this.breakpoints.length + this.watchpoints.length
        return before === after
          ? { output: `No breakpoint number ${id}.`, success: false }
          : { output: `Deleted breakpoint ${id}`, success: true }
      }

      case 'clear': {
        const location = args[0]
        if (!location) {
          this.breakpoints = this.breakpoints.filter(b => b.line !== this.currentLine)
          return { output: `Cleared breakpoint at line ${this.currentLine}`, success: true }
        }
        const before = this.breakpoints.length
        this.breakpoints = this.breakpoints.filter(b => b.location !== location)
        return this.breakpoints.length < before
          ? { output: `Cleared breakpoint at ${location}`, success: true }
          : { output: `No breakpoint at ${location}`, success: false }
      }

      case 'disable': {
        if (!args[0]) {
          this.breakpoints.forEach(b => b.enabled = false)
          return { output: 'All breakpoints disabled.', success: true }
        }
        const id = parseInt(args[0])
        const bp = this.breakpoints.find(b => b.id === id)
        if (!bp) return { output: `No breakpoint number ${id}.`, success: false }
        bp.enabled = false
        return { output: `Breakpoint ${id} disabled.`, success: true }
      }

      case 'enable': {
        if (!args[0]) {
          this.breakpoints.forEach(b => b.enabled = true)
          return { output: 'All breakpoints enabled.', success: true }
        }
        const id = parseInt(args[0])
        const bp = this.breakpoints.find(b => b.id === id)
        if (!bp) return { output: `No breakpoint number ${id}.`, success: false }
        bp.enabled = true
        return { output: `Breakpoint ${id} enabled.`, success: true }
      }

      case 'info':
      case 'i': {
        const sub = args[0]
        switch (sub) {
          case 'breakpoints':
          case 'break':
          case 'b': {
            if (this.breakpoints.length === 0) return { output: 'No breakpoints or watchpoints.', success: true }
            const list = this.breakpoints.map(bp =>
              `${bp.id}  ${bp.type}  keep  ${bp.enabled ? 'y' : 'n'}  ${bp.location}${bp.condition ? ' if ' + bp.condition : ''}`
            ).join('\n')
            return { output: `Num  Type       Disp  Enb  What\n${list}`, success: true }
          }
          case 'watchpoints': {
            if (this.watchpoints.length === 0) return { output: 'No watchpoints.', success: true }
            return { output: this.watchpoints.map(w => `${w.id}  ${w.type}  ${w.name}`).join('\n'), success: true }
          }
          case 'locals': {
            return { output: Object.entries(this.variables).map(([k, v]) => `${k} = ${v}`).join('\n'), success: true }
          }
          case 'args': {
            return { output: 'No arguments.', success: true }
          }
          case 'frame':
          case 'f': {
            return { output: `#0  main () at program.c:${this.currentLine}`, success: true }
          }
          case 'stack': {
            return { output: this.callStack.map((fn, i) => `#${i}  ${fn} () at program.c:${i + 1}`).join('\n'), success: true }
          }
          case 'registers':
          case 'reg': {
            return { output: 'rax=0x0  rbx=0x0  rcx=0x0  rdx=0x0\nrsp=0x7fffffffe000  rbp=0x7fffffffe010  rip=0x400526', success: true }
          }
          case 'threads': {
            return { output: '* 1  Thread 0x7ffff7fc3740 (LWP 12345) "program" main () at program.c:1', success: true }
          }
          case 'source': {
            return { output: 'Current source file: program.c\nCompilation directory: /home/user', success: true }
          }
          case 'signals': {
            return { output: 'SIGHUP  Yes  Yes  Yes  Hangup\nSIGINT  Yes  No   Yes  Interrupt\nSIGKILL Yes  No   Yes  Killed', success: true }
          }
          default:
            return { output: `Subcommand '${sub}' not supported. Try: breakpoints, watchpoints, locals, args, frame, stack, registers, threads, source, signals`, success: false }
        }
      }

      case 'next':
      case 'n': {
        const count = parseInt(args[0]) || 1
        this.currentLine = Math.min(this.currentLine + count, this.sourceCode.length)
        return { output: this.sourceCode[this.currentLine - 1] || 'End of program', success: true }
      }

      case 'nexti':
      case 'ni': {
        return { output: `0x0000000000400527 <main+1>:  mov  eax, 0x0`, success: true }
      }

      case 'step':
      case 's': {
        const count = parseInt(args[0]) || 1
        this.currentLine = Math.min(this.currentLine + count, this.sourceCode.length)
        return { output: `Step into...\n${this.sourceCode[this.currentLine] || 'End of program'}`, success: true }
      }

      case 'stepi':
      case 'si': {
        return { output: `0x0000000000400526 <main>:  push rbp`, success: true }
      }

      case 'until':
      case 'u': {
        const line = parseInt(args[0])
        if (line) this.currentLine = Math.min(line, this.sourceCode.length)
        else this.currentLine = Math.min(this.currentLine + 1, this.sourceCode.length)
        return { output: this.sourceCode[this.currentLine - 1] || 'End of program', success: true }
      }

      case 'finish':
      case 'fin': {
        return { output: `Run till exit from #0  ${this.callStack[0]} ()\nValue returned is $1 = 0`, success: true }
      }

      case 'return': {
        const val = args[0] || '0'
        return { output: `Make ${this.callStack[0]} return now? (y or n) [answered Y]\n$1 = ${val}`, success: true }
      }

      case 'continue':
      case 'cont':
      case 'c': {
        return { output: `Continuing.\n[Inferior 1 exited normally]`, success: true }
      }

      case 'jump':
      case 'j': {
        const line = parseInt(args[0])
        if (!line) return { output: 'Usage: jump <line>', success: false }
        this.currentLine = Math.min(line, this.sourceCode.length)
        return { output: `Continuing at line ${line}.\n${this.sourceCode[this.currentLine - 1]}`, success: true }
      }

      case 'print':
      case 'p': {
        const expr = args.join(' ')
        if (!expr) return { output: 'Argument required', success: false }
        const evalExpr = expr.replace(/\b([a-z_]\w*)\b/g, (_, name) =>
          this.variables[name] !== undefined ? this.variables[name] : `"${name}"`
        )
        let result
        try { result = Function(`'use strict'; return (${evalExpr})`)() }
        catch { result = this.variables[expr] }
        if (result === undefined) return { output: `No symbol "${expr}" in current context`, success: false }
        return { output: `$1 = ${result}`, success: true }
      }

      case 'printf': {
        const fmt = (args[0] || '').replace(/^"|"$/g, '').replace(/\\n/g, '\n')
        return { output: fmt, success: true }
      }

      case 'display': {
        const varName = args[0]
        if (!varName) return { output: 'Argument required', success: false }
        const val = this.variables[varName]
        if (val === undefined) return { output: `No symbol "${varName}" in current context`, success: false }
        return { output: `1: ${varName} = ${val}`, success: true }
      }

      case 'undisplay': {
        return { output: 'Removed display expression.', success: true }
      }

      case 'set': {
        const cleanArgs = args.filter(a => a !== 'var' && a !== '=')
        if (cleanArgs.length >= 2) {
          const name = cleanArgs[0]
          const val = isNaN(cleanArgs[1]) ? cleanArgs[1] : parseInt(cleanArgs[1])
          this.variables[name] = val
          return { output: `${name} = ${val}`, success: true }
        }
        return { output: 'Usage: set [var] <name> <value>', success: false }
      }

      case 'list':
      case 'l': {
        const target = args[0]
        let start
        if (target && !isNaN(parseInt(target))) {
          start = Math.max(0, parseInt(target) - 3)
        } else {
          start = Math.max(0, this.currentLine - 2)
        }
        const end = Math.min(this.sourceCode.length, start + 5)
        return { output: this.sourceCode.slice(start, end).join('\n'), success: true }
      }

      case 'backtrace':
      case 'where':
      case 'bt': {
        return { output: this.callStack.map((fn, i) => `#${i}  ${fn} () at program.c:${i + 1}`).join('\n'), success: true }
      }

      case 'frame':
      case 'f': {
        const frameNum = parseInt(args[0]) || 0
        return { output: `#${frameNum}  ${this.callStack[frameNum] || 'unknown'} () at program.c:${this.currentLine}`, success: true }
      }

      case 'up': {
        const n = parseInt(args[0]) || 1
        return { output: `#${n}  ${this.callStack[n] || 'main'} ()`, success: true }
      }

      case 'down': {
        return { output: `#0  ${this.callStack[0]} ()`, success: true }
      }

      case 'x': {
        return { output: `0x7fffffffe000: 0x0000000a\t0x00000014\t0x00000000`, success: true }
      }

      case 'disassemble':
      case 'disas': {
        const func = args[0] || 'main'
        return {
          output: `Dump of assembler code for function ${func}:\n   0x0000000000400526 <+0>:\tpush   rbp\n   0x0000000000400527 <+1>:\tmov    rbp,rsp\n   0x000000000040052a <+4>:\tmov    eax,0x0\n   0x000000000040052f <+9>:\tpop    rbp\n   0x0000000000400530 <+10>:\tret\nEnd of assembler dump.`,
          success: true
        }
      }

      case 'registers':
      case 'reg': {
        return { output: 'rax=0x0  rbx=0x0  rcx=0x0  rdx=0x0\nrsp=0x7fffffffe000  rbp=0x7fffffffe010  rip=0x400526', success: true }
      }

      case 'thread': {
        const id = args[0]
        if (!id) return { output: '* 1  Thread 0x7ffff7fc3740 (LWP 12345) "program" main () at program.c:1', success: true }
        return { output: `[Switching to thread ${id}]`, success: true }
      }

      case 'signal': {
        const sig = args[0]
        if (!sig) return { output: 'Usage: signal <signal>', success: false }
        return { output: `Continuing with signal ${sig}.`, success: true }
      }

      case 'kill': {
        this.running = false
        this.currentLine = 0
        return { output: 'Kill the program being debugged? (y or n) [answered Y]', success: true, stateChange: { running: false } }
      }

      case 'source': {
        const file = args[0]
        if (!file) return { output: 'Usage: source <filename>', success: false }
        return { output: `Reading commands from ${file}...done.`, success: true }
      }

      case 'shell': {
        return { output: `[shell: ${args.join(' ')}] (simulated)`, success: true }
      }

      case 'pwd': {
        return { output: 'Working directory /home/user.', success: true }
      }

      case 'cd': {
        return { output: `Working directory set to ${args[0] || '/home/user'}.`, success: true }
      }

      case 'quit':
      case 'q': {
        this.running = false
        return { output: 'Quit', success: true, stateChange: { running: false } }
      }

      case 'help':
      case 'h': {
        return {
          output: [
            '── 파일/실행 ──────────────────────────────────────',
            '  file <prog>          - 실행 파일 로드',
            '  run (r) [args]       - 프로그램 실행',
            '  start                - 실행 후 main에서 정지',
            '  attach <pid>         - 실행 중인 프로세스 연결',
            '  detach               - 프로세스 연결 해제',
            '  kill                 - 프로그램 강제 종료',
            '',
            '── 브레이크포인트 ────────────────────────────────',
            '  break (b) <loc>      - 브레이크포인트 설정',
            '  tbreak <loc>         - 임시 브레이크포인트',
            '  hbreak <loc>         - 하드웨어 브레이크포인트',
            '  watch <var>          - 쓰기 감시점',
            '  rwatch <var>         - 읽기 감시점',
            '  awatch <var>         - 읽기/쓰기 감시점',
            '  condition <n> <expr> - 브레이크포인트 조건 설정',
            '  ignore <n> <cnt>     - N번 무시',
            '  delete (d) [n]       - 브레이크포인트 삭제',
            '  clear [loc]          - 위치의 브레이크포인트 삭제',
            '  disable [n]          - 비활성화',
            '  enable [n]           - 활성화',
            '',
            '── 스테핑 ────────────────────────────────────────',
            '  next (n) [cnt]       - 다음 줄 (함수 진입 X)',
            '  nexti (ni)           - 다음 명령어 (어셈블리)',
            '  step (s) [cnt]       - 함수 안으로 진입',
            '  stepi (si)           - 명령어 단위 진입',
            '  until (u) [line]     - 지정 줄까지 실행',
            '  finish (fin)         - 함수 반환까지 실행',
            '  return [val]         - 함수 강제 반환',
            '  continue (c)         - 계속 실행',
            '  jump (j) <line>      - 지정 줄로 점프',
            '',
            '── 변수/메모리 ───────────────────────────────────',
            '  print (p) <expr>     - 식/변수 출력',
            '  printf <fmt>         - 형식 출력',
            '  display <var>        - 매 정지마다 자동 출력',
            '  undisplay [n]        - 자동 출력 제거',
            '  set [var] <n> <val>  - 변수 값 변경',
            '  x [/fmt] <addr>      - 메모리 검사',
            '',
            '── 소스/어셈블리 ─────────────────────────────────',
            '  list (l) [line]      - 소스 코드 출력',
            '  disassemble (disas)  - 어셈블리 출력',
            '',
            '── 스택/프레임 ───────────────────────────────────',
            '  backtrace (bt)       - 콜 스택 출력',
            '  where                - backtrace 별칭',
            '  frame (f) [n]        - 스택 프레임 선택',
            '  up [n]               - 상위 프레임 이동',
            '  down [n]             - 하위 프레임 이동',
            '',
            '── 정보 조회 (info) ───────────────────────────────',
            '  info breakpoints     - 브레이크포인트 목록',
            '  info watchpoints     - 감시점 목록',
            '  info locals          - 지역 변수',
            '  info args            - 함수 인수',
            '  info frame           - 현재 프레임',
            '  info stack           - 스택',
            '  info registers       - 레지스터',
            '  info threads         - 스레드',
            '  info source          - 소스 파일',
            '  info signals         - 시그널',
            '',
            '── 기타 ──────────────────────────────────────────',
            '  registers            - 레지스터 출력',
            '  thread [id]          - 스레드 전환',
            '  signal <sig>         - 시그널 전송',
            '  source <file>        - GDB 스크립트 실행',
            '  shell <cmd>          - 셸 명령 실행',
            '  pwd                  - 작업 디렉토리 출력',
            '  cd <dir>             - 작업 디렉토리 변경',
            '  quit (q)             - GDB 종료',
          ].join('\n'),
          success: true
        }
      }

      default:
        return { output: `Undefined command: "${cmd}". Try "help".`, success: false }
    }
  }

  getState() {
    return {
      running: this.running,
      program: this.program,
      breakpoints: this.breakpoints,
      watchpoints: this.watchpoints,
      currentLine: this.currentLine,
      variables: this.variables,
      callStack: this.callStack
    }
  }
}

module.exports = VirtualGdbEngine