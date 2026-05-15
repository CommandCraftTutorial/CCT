const axios = require('axios')
const cheerio = require('cheerio')
const knex = require('knex')
const config = require('../knexfile')
require('dotenv').config()

const db = knex(config.development)

const GIT_COMMANDS = [
  // 기초
  { cmd: 'init', mission: '새로운 Git 저장소를 초기화하세요', difficulty: '기초' },
  { cmd: 'clone', mission: '원격 저장소를 복제하세요', difficulty: '기초' },
  { cmd: 'add', mission: '파일을 스테이징 영역에 추가하세요', difficulty: '기초' },
  { cmd: 'commit', mission: '변경사항을 커밋하세요', difficulty: '기초' },
  { cmd: 'status', mission: '현재 저장소 상태를 확인하세요', difficulty: '기초' },
  { cmd: 'log', mission: '커밋 히스토리를 확인하세요', difficulty: '기초' },
  { cmd: 'config', mission: 'Git 설정을 확인하세요', difficulty: '기초' },
  // 중급
  { cmd: 'branch', mission: '브랜치를 관리하세요', difficulty: '중급' },
  { cmd: 'checkout', mission: '브랜치를 전환하세요', difficulty: '중급' },
  { cmd: 'merge', mission: '브랜치를 병합하세요', difficulty: '중급' },
  { cmd: 'remote', mission: '원격 저장소를 관리하세요', difficulty: '중급' },
  { cmd: 'fetch', mission: '원격 변경사항을 가져오세요', difficulty: '중급' },
  { cmd: 'pull', mission: '원격 변경사항을 가져와 병합하세요', difficulty: '중급' },
  { cmd: 'push', mission: '로컬 변경사항을 원격에 올리세요', difficulty: '중급' },
  { cmd: 'diff', mission: '변경사항을 비교하세요', difficulty: '중급' },
  // 심화
  { cmd: 'rebase', mission: '커밋을 재배치하세요', difficulty: '심화' },
  { cmd: 'stash', mission: '작업을 임시 저장하세요', difficulty: '심화' },
  { cmd: 'reset', mission: '커밋을 되돌리세요', difficulty: '심화' },
  { cmd: 'revert', mission: '커밋을 취소하세요', difficulty: '심화' },
  { cmd: 'tag', mission: '태그를 관리하세요', difficulty: '심화' },
  { cmd: 'cherry-pick', mission: '특정 커밋을 선택해 적용하세요', difficulty: '심화' },
  { cmd: 'bisect', mission: '이진 탐색으로 버그를 찾으세요', difficulty: '심화' },
]

async function crawlGitDoc(cmd) {
  try {
    const url = `https://git-scm.com/docs/git-${cmd}`
    const res = await axios.get(url, { timeout: 8000 })
    const $ = cheerio.load(res.data)

    // 설명 파싱
    const description = $('#_description p').first().text().trim() ||
      $('.sectionbody p').first().text().trim() ||
      `git ${cmd} 명령어입니다`

    // 옵션 파싱
    const options = []
    $('.dlist dt').each((i, el) => {
      const option = $(el).text().trim()
      if (option.startsWith('-') && options.length < 3) {
        options.push(option.split(',')[0].trim())
      }
    })

    return { description: description.slice(0, 200), options }
  } catch (err) {
    console.log(`  크롤링 실패: git ${cmd} - ${err.message}`)
    return { description: `git ${cmd} 명령어입니다`, options: [] }
  }
}

async function main() {
  console.log('Git 크롤링 시작...')
  const stages = []

  for (const cmdInfo of GIT_COMMANDS) {
    console.log(`크롤링 중: git ${cmdInfo.cmd}`)
    const { description, options } = await crawlGitDoc(cmdInfo.cmd)

    // 기본 스테이지
    stages.push({
      title: `git ${cmdInfo.cmd}`,
      description,
      mission: cmdInfo.mission,
      answer: cmdInfo.cmd === 'status' ? 'git status'
            : cmdInfo.cmd === 'log' ? 'git log'
            : cmdInfo.cmd === 'stash' ? 'git stash'
            : null,
      answer_regex: cmdInfo.cmd === 'status' ? null
            : `^git ${cmdInfo.cmd}.*$`,
      hint: `git ${cmdInfo.cmd} 명령어를 사용하세요`,
      difficulty: cmdInfo.difficulty,
      category: 'git'
    })

    // 옵션 스테이지
    options.slice(0, 2).forEach(option => {
      if (option && option.length < 15) {
        stages.push({
          title: `git ${cmdInfo.cmd} ${option}`,
          description: `git ${cmdInfo.cmd}의 ${option} 옵션 사용법입니다`,
          mission: `${option} 옵션을 사용해서 git ${cmdInfo.cmd} 명령어를 실행하세요`,
          answer_regex: `^git ${cmdInfo.cmd} \\${option.replace('-', '')}.*$`,
          hint: `git ${cmdInfo.cmd} ${option} 형식으로 입력하세요`,
          difficulty: cmdInfo.difficulty,
          category: 'git'
        })
      }
    })

    await new Promise(r => setTimeout(r, 1500))
  }

  console.log(`총 ${stages.length}개 스테이지 생성`)
  await db('stages').insert(stages)
  console.log('Git DB 삽입 완료!')
  await db.destroy()
}

main().catch(console.error)