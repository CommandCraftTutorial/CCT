exports.seed = async function(knex) {
  await knex('stages').del()
  await knex('stages').insert([
    {
      title: '저장소 초기화',
      description: 'Git 저장소를 처음 만들 때 사용하는 명령어입니다.',
      mission: 'git init 을 입력하세요',
      answer: 'git init',
      hint: 'git init 명령어는 새 Git 저장소를 만듭니다',
      difficulty: '기초'
    },
    {
      title: '파일 추가하기',
      description: '변경된 파일을 스테이징 영역에 추가하세요.',
      mission: 'git add . 을 입력하세요',
      answer: 'git add .',
      hint: '. 은 현재 폴더의 모든 파일을 의미합니다',
      difficulty: '기초'
    },
    {
      title: '커밋 만들기',
      description: '스테이징된 파일을 커밋하세요.',
      mission: 'git commit -m "메시지" 형식으로 입력하세요',
      answer_regex: '^git commit -m ".+"$',
      hint: '메시지 내용은 자유롭게 작성해도 됩니다',
      difficulty: '기초'
    },
    {
      title: '브랜치 만들기',
      description: '새로운 브랜치를 생성하세요.',
      mission: 'git branch 브랜치이름 을 입력하세요',
      answer_regex: '^git branch .+$',
      hint: 'branch 뒤에 원하는 브랜치 이름을 입력하세요',
      difficulty: '중급'
    },
    {
      title: '브랜치 이동',
      description: '다른 브랜치로 이동하세요.',
      mission: 'git checkout 브랜치이름 을 입력하세요',
      answer_regex: '^git checkout .+$',
      hint: 'checkout 뒤에 이동할 브랜치 이름을 입력하세요',
      difficulty: '중급'
    },
  ])
}