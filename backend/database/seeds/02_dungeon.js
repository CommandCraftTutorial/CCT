exports.seed = async function(knex) {
  await knex('dungeon_stages').del()
  await knex('dungeon_stages').insert([
    {
      title: '어둠의 입구',
      story: `🏰 당신은 어둠의 던전 입구에 서 있습니다. 
              탈출하려면 던전 안에 숨겨진 열쇠를 찾아야 합니다.
              먼저 현재 위치를 확인하고, 주변을 살펴보세요.`,
      filesystem: JSON.stringify({
        '/': {
          type: 'dir',
          children: {
            'dungeon': {
              type: 'dir',
              children: {
                'hint.txt': { type: 'file', content: '열쇠는 key_room 안에 있다...' },
                'key_room': {
                  type: 'dir',
                  children: {
                    'key.txt': { type: 'file', content: '🗝️ 탈출 열쇠: ESCAPE-2024' },
                  }
                }
              }
            }
          }
        }
      }),
      goal_command: 'cat',
      goal_file: 'key.txt',
      goal_content: '🗝️ 탈출 열쇠: ESCAPE-2024',
      hint: 'pwd → ls → cd dungeon → ls → cat hint.txt → cd key_room → cat key.txt 순서로 탐험하세요',
      order_num: 1,
    },
    {
      title: '비밀의 방',
      story: `🕯️ 당신은 비밀의 방에 들어왔습니다.
이 방에는 숨겨진 파일이 있다고 합니다.
숨겨진 파일을 찾아 내용을 확인하세요.
(힌트: 리눅스에서 . 으로 시작하는 파일은 숨겨진 파일입니다)`,
      filesystem: JSON.stringify({
        '/': {
          type: 'dir',
          children: {
            'secret_room': {
              type: 'dir',
              children: {
                'fake.txt': { type: 'file', content: '이건 가짜 파일이야...' },
                '.hidden_key': { type: 'file', content: '🗝️ 비밀 코드: HIDDEN-9999' },
              }
            }
          }
        }
      }),
      goal_command: 'cat',
      goal_file: '.hidden_key',
      goal_content: '🗝️ 비밀 코드: HIDDEN-9999',
      hint: 'ls -a 명령어로 숨겨진 파일을 볼 수 있어요',
      order_num: 2,
    },
    {
      title: '미로의 중심',
      story: `🌀 당신은 미로의 중심에 갇혔습니다.
탈출하려면 새로운 폴더를 만들고
그 안에 탈출 신호 파일을 생성해야 합니다.
폴더 이름: escape_path
파일 이름: signal.txt`,
      filesystem: JSON.stringify({
        '/': {
          type: 'dir',
          children: {
            'maze': {
              type: 'dir',
              children: {
                'clue.txt': { type: 'file', content: 'mkdir escape_path 로 탈출로를 만들어라' },
              }
            }
          }
        }
      }),
      goal_command: 'touch',
      goal_file: 'signal.txt',
      goal_content: '',
      hint: 'cd maze → mkdir escape_path → cd escape_path → touch signal.txt',
      order_num: 3,
    },
  ])
}