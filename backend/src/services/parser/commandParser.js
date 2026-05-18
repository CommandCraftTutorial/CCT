function parseCommand(input) {
  if (!input || !input.trim()) return null

  const trimmed = input.trim()
  const tokens = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || []

  const parsed = {
    raw: trimmed,
    base: tokens[0] || '',
    subcommand: null,
    args: [],
    options: {},
    flags: []
  }

  let i = 1

  // git, gdb 같은 경우 subcommand 파싱
  if (['git', 'gdb', 'python'].includes(parsed.base) && tokens[1]) {
    // --version, --help 같은 경우도 subcommand로 처리
    if (!tokens[1].startsWith('-') || tokens[1] === '--version' || tokens[1] === '--help') {
      parsed.subcommand = tokens[1]
      i = 2
    }
  }

  // 나머지 토큰 파싱
  while (i < tokens.length) {
    const token = tokens[i]

    if (token.startsWith('--')) {
      // --option=value 또는 --option value
      const [key, val] = token.slice(2).split('=')
      if (val !== undefined) {
        parsed.options[key] = val
      } else if (tokens[i + 1] && !tokens[i + 1].startsWith('-')) {
        parsed.options[key] = tokens[i + 1].replace(/^["']|["']$/g, '')
        i++
      } else {
        parsed.flags.push(key)
      }
    } else if (token.startsWith('-') && token.length === 2) {
      // -m "message" 같은 단일 옵션
      const key = token.slice(1)
      if (tokens[i + 1] && !tokens[i + 1].startsWith('-')) {
        parsed.options[key] = tokens[i + 1].replace(/^["']|["']$/g, '')
        i++
      } else {
        parsed.flags.push(key)
      }
    } else if (token.startsWith('-') && token.length > 2) {
      // -al 같은 복합 플래그
      token.slice(1).split('').forEach(f => parsed.flags.push(f))
    } else {
      parsed.args.push(token.replace(/^["']|["']$/g, ''))
    }

    i++
  }

  return parsed
}

module.exports = { parseCommand }