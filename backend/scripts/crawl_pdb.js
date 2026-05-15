const axios = require('axios')
const cheerio = require('cheerio')
const knex = require('knex')
const config = require('../knexfile')
require('dotenv').config()

const db = knex(config.development)

const PDB_COMMANDS = [
  // 기초
  { cmd: 'h', mission: 'PDB 도움말을 확인하세요', answer: 'h', difficulty: '기초' },
  { cmd: 'l', mission: '현재 소스 코드를 출력하세요', answer: 'l', difficulty: '기초' },
  { cmd: 'n', mission: '다음 줄을 실행하세요', answer: 'n', difficulty: '기초' },
  { cmd: 'q', mission: 'PDB를 종료하세요', answer: 'q', difficulty: '기초' },
  { cmd: 'p', mission: '변수 값을 출력하세요', answer_regex: '^p .+$', difficulty: '기초' },
  // 중급
  { cmd: 's', mission: '함수 내부로 들어가세요', answer: 's', difficulty: '중급' },
  { cmd: 'c', mission: '다음 브레이크포인트까지 실행하세요', answer: 'c', difficulty: '중급' },
  { cmd: 'b', mission: '브레이크포인트를 설정하세요', answer_regex: '^b .+$', difficulty: '중급' },
  { cmd: 'pp', mission: '변수를 pretty-print로 출력하세요', answer_regex: '^pp .+$', difficulty: '중급' },
  { cmd: 'w', mission: '현재 위치를 확인하세요', answer: 'w', difficulty: '중급' },
  // 심화
  { cmd: 'u', mission: '상위 프레임으로 이동하세요', answer: 'u', difficulty: '심화' },
  { cmd: 'd', mission: '하위 프레임으로 이동하세요', answer: 'd', difficulty: '심화' },
  { cmd: 'bt', mission: '콜 스택을 출력하세요', answer: 'bt', difficulty: '심화' },
  { cmd: 'cl', mission: '브레이크포인트를 삭제하세요', answer_regex: '^cl .+$', difficulty: '심화' },
  { cmd: 'a', mission: '현재 함수의 인자를 출력하세요', answer: 'a', difficulty: '심화' },
]

async function crawlPdbDoc() {
  try {
    const url = 'https://docs.python.org/3/library/pdb.html'
    const res = await axios.get(url, { timeout: 8000 })
    const $ = cheerio.load(res.data)

    const descriptions = {}
    $('dl.std.function dt').each((i, el) => {
      const cmd = $(el).text().trim().split('(')[0].trim()
      const desc = $(el).next('dd').find('p').first().text().trim().slice(0, 200)
      if (cmd && desc) descriptions[cmd] = desc
    })

    return descriptions
  } catch {
    return {}
  }
}

async function main() {
  console.log('PDB 크롤링 시작...')
  console.log('Python 공식 문서 크롤링 중...')
  const descriptions = await crawlPdbDoc()

  const stages = PDB_COMMANDS.map(cmdInfo => ({
    title: `pdb ${cmdInfo.cmd}`,
    description: descriptions[cmdInfo.cmd] || `PDB ${cmdInfo.cmd} 명령어입니다`,
    mission: cmdInfo.mission,
    answer: cmdInfo.answer || null,
    answer_regex: cmdInfo.answer_regex || null,
    hint: `${cmdInfo.cmd} 명령어를 사용하세요`,
    difficulty: cmdInfo.difficulty,
    category: 'pdb'
  }))

  console.log(`총 ${stages.length}개 스테이지 생성`)
  await db('stages').insert(stages)
  console.log('PDB DB 삽입 완료!')
  await db.destroy()
}

main().catch(console.error)