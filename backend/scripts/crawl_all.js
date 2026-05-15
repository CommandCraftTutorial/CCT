const { execSync } = require('child_process')

const scripts = [
  'crawl_git.js',
  'crawl_linux.js',
  'crawl_gdb.js',
  'crawl_pdb.js',
]

async function main() {
  for (const script of scripts) {
    console.log(`\n========== ${script} 실행 중 ==========`)
    try {
      execSync(`node scripts/${script}`, { stdio: 'inherit' })
    } catch (err) {
      console.error(`${script} 실패:`, err.message)
    }
  }
  console.log('\n모든 크롤링 완료!')
}

main()