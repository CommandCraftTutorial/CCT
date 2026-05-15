const axios = require('axios')
const cheerio = require('cheerio')
const knex = require('knex')
const config = require('../knexfile')
require('dotenv').config()

const db = knex(config.development)

const GDB_COMMANDS = [
  // 기초
  { cmd: 'run', mission: 'GDB에서 프로그램을 실행하세요', answer: 'run', difficulty: '기초' },
  { cmd: 'quit', mission: 'GDB를 종료하세요', answer: 'quit', difficulty: '기초' },
  { cmd: 'help', mission: 'GDB 도움말을 확인하세요', answer: 'help', difficulty: '기초' },
  { cmd: 'break', mission: '브레이크포인트를 설정하세요', answer_regex: '^break .+$', difficulty: '기초' },
  { cmd: 'info breakpoints', mission: '브레이크포인트 목록을 확인하세요', answer: 'info breakpoints', difficulty: '기초' },
  // 중급
  { cmd: 'next', mission: '다음 줄을 실행하세요', answer: 'next', difficulty: '중급' },
  { cmd: 'step', mission: '함수 내부로 들어가세요', answer: 'step', difficulty: '중급' },
  { cmd: 'continue', mission: '다음 브레이크포인트까지 실행하세요', answer: 'continue', difficulty: '중급' },
  { cmd: 'print', mission: '변수 값을 출력하세요', answer_regex: '^print .+$', difficulty: '중급' },
  { cmd: 'list', mission: '소스 코드를 확인하세요', answer: 'list', difficulty: '중급' },
  { cmd: 'backtrace', mission: '함수 호출 스택을 확인하세요', answer: 'backtrace', difficulty: '중급' },
  // 심화
  { cmd: 'watch', mission: '변수를 감시하세요', answer_regex: '^watch .+$', difficulty: '심화' },
  { cmd: 'x', mission: '메모리 값을 확인하세요', answer_regex: '^x .+$', difficulty: '심화' },
  { cmd: 'frame', mission: '특정 프레임으로 이동하세요', answer_regex: '^frame .+$', difficulty: '심화' },
  { cmd: 'set', mission: '변수 값을 변경하세요', answer_regex: '^set .+$', difficulty: '심화' },
]

async function crawlGdbDoc(cmd) {
  try {
    const cmdSlug = cmd.replace(' ', '-')
    const url = `https://sourceware.org/gdb/current/onlinedocs/gdb/${cmdSlug}.html`
    const res = await axios.get(url, { timeout: 8000 })
    const $ = cheerio.load(res.data)

    const description = $('p').first().text().trim().slice(0, 200) ||
      `GDB ${cmd} 명령어입니다`

    return { description }
  } catch {
    return { description: `GDB ${cmd} 명령어입니다` }
  }
}

async function main() {
  console.log('GDB 크롤링 시작...')
  const stages = []

  for (const cmdInfo of GDB_COMMANDS) {
    console.log(`크롤링 중: ${cmdInfo.cmd}`)
    const { description } = await crawlGdbDoc(cmdInfo.cmd)

    stages.push({
      title: cmdInfo.cmd,
      description,
      mission: cmdInfo.mission,
      answer: cmdInfo.answer || null,
      answer_regex: cmdInfo.answer_regex || null,
      hint: `${cmdInfo.cmd} 명령어를 사용하세요`,
      difficulty: cmdInfo.difficulty,
      category: 'gdb'
    })

    await new Promise(r => setTimeout(r, 1500))
  }

  console.log(`총 ${stages.length}개 스테이지 생성`)
  await db('stages').insert(stages)
  console.log('GDB DB 삽입 완료!')
  await db.destroy()
}

main().catch(console.error)