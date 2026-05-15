const axios = require('axios')
const cheerio = require('cheerio')
const knex = require('knex')
const config = require('../knexfile')
require('dotenv').config()

const db = knex(config.development)

const LINUX_COMMANDS = [
  // 기초
  { cmd: 'pwd', mission: '현재 디렉토리 경로를 출력하세요', answer: 'pwd', difficulty: '기초' },
  { cmd: 'ls', mission: '현재 폴더의 파일 목록을 출력하세요', answer: 'ls', difficulty: '기초' },
  { cmd: 'cd', mission: '특정 디렉토리로 이동하세요', answer_regex: '^cd .+$', difficulty: '기초' },
  { cmd: 'mkdir', mission: '새 디렉토리를 생성하세요', answer_regex: '^mkdir .+$', difficulty: '기초' },
  { cmd: 'touch', mission: '새 파일을 생성하세요', answer_regex: '^touch .+$', difficulty: '기초' },
  { cmd: 'cat', mission: '파일 내용을 출력하세요', answer_regex: '^cat .+$', difficulty: '기초' },
  { cmd: 'echo', mission: '텍스트를 출력하세요', answer_regex: '^echo .+$', difficulty: '기초' },
  // 중급
  { cmd: 'cp', mission: '파일을 복사하세요', answer_regex: '^cp .+$', difficulty: '중급' },
  { cmd: 'mv', mission: '파일을 이동하거나 이름을 변경하세요', answer_regex: '^mv .+$', difficulty: '중급' },
  { cmd: 'rm', mission: '파일을 삭제하세요', answer_regex: '^rm .+$', difficulty: '중급' },
  { cmd: 'grep', mission: '파일에서 패턴을 검색하세요', answer_regex: '^grep .+$', difficulty: '중급' },
  { cmd: 'find', mission: '파일을 검색하세요', answer_regex: '^find .+$', difficulty: '중급' },
  { cmd: 'chmod', mission: '파일 권한을 변경하세요', answer_regex: '^chmod .+$', difficulty: '중급' },
  { cmd: 'chown', mission: '파일 소유자를 변경하세요', answer_regex: '^chown .+$', difficulty: '중급' },
  { cmd: 'ps', mission: '실행 중인 프로세스를 확인하세요', answer: 'ps aux', difficulty: '중급' },
  // 심화
  { cmd: 'awk', mission: 'awk로 텍스트를 처리하세요', answer_regex: '^awk .+$', difficulty: '심화' },
  { cmd: 'sed', mission: 'sed로 텍스트를 변환하세요', answer_regex: '^sed .+$', difficulty: '심화' },
  { cmd: 'tar', mission: '파일을 압축하거나 해제하세요', answer_regex: '^tar .+$', difficulty: '심화' },
  { cmd: 'curl', mission: 'URL로 데이터를 가져오세요', answer_regex: '^curl .+$', difficulty: '심화' },
  { cmd: 'ssh', mission: 'SSH로 원격 서버에 접속하세요', answer_regex: '^ssh .+$', difficulty: '심화' },
  { cmd: 'cron', mission: '반복 작업을 예약하세요', answer_regex: '^crontab .+$', difficulty: '심화' },
]

async function crawlManPage(cmd) {
  try {
    const url = `https://man7.org/linux/man-pages/man1/${cmd}.1.html`
    const res = await axios.get(url, { timeout: 8000 })
    const $ = cheerio.load(res.data)

    const description = $('p').first().text().trim().slice(0, 200) ||
      `${cmd} 명령어입니다`

    const options = []
    $('dt').each((i, el) => {
      const opt = $(el).text().trim()
      if (opt.startsWith('-') && options.length < 3) {
        options.push(opt.split(' ')[0].trim())
      }
    })

    return { description, options }
  } catch {
    return { description: `${cmd} 명령어입니다`, options: [] }
  }
}

async function main() {
  console.log('Linux 크롤링 시작...')
  const stages = []

  for (const cmdInfo of LINUX_COMMANDS) {
    console.log(`크롤링 중: ${cmdInfo.cmd}`)
    const { description, options } = await crawlManPage(cmdInfo.cmd)

    stages.push({
      title: cmdInfo.cmd,
      description,
      mission: cmdInfo.mission,
      answer: cmdInfo.answer || null,
      answer_regex: cmdInfo.answer_regex || null,
      hint: `${cmdInfo.cmd} 명령어를 사용하세요`,
      difficulty: cmdInfo.difficulty,
      category: 'linux'
    })

    options.slice(0, 2).forEach(option => {
      if (option && option.length < 10) {
        stages.push({
          title: `${cmdInfo.cmd} ${option}`,
          description: `${cmdInfo.cmd}의 ${option} 옵션 사용법입니다`,
          mission: `${option} 옵션을 사용해서 ${cmdInfo.cmd} 명령어를 실행하세요`,
          answer_regex: `^${cmdInfo.cmd} \\${option}.*$`,
          hint: `${cmdInfo.cmd} ${option} 형식으로 입력하세요`,
          difficulty: cmdInfo.difficulty,
          category: 'linux'
        })
      }
    })

    await new Promise(r => setTimeout(r, 1500))
  }

  console.log(`총 ${stages.length}개 스테이지 생성`)
  await db('stages').insert(stages)
  console.log('Linux DB 삽입 완료!')
  await db.destroy()
}

main().catch(console.error)