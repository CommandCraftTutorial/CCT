exports.seed = async function(knex) {
  await knex('dungeon_stages').del()
  await knex('dungeon_stages').insert([
 
    // ══════════════════════════════════════════════════════
    // CHAPTER 1 - 기초 탐험 (ls, cd, cat)
    // ══════════════════════════════════════════════════════
 
    {
      title: '어둠의 입구',
      story: `🏰 당신은 어둠의 던전 입구에 서 있습니다.
던전 안에 숨겨진 열쇠를 찾아야 합니다.
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
 
    // ══════════════════════════════════════════════════════
    // CHAPTER 2 - 심화 탐험 (중첩 디렉토리, rm, 다중 단서)
    // ══════════════════════════════════════════════════════
 
    {
      title: '고대 도서관',
      story: `📚 당신은 고대 도서관에 들어왔습니다.
수천 권의 책 사이 어딘가에 마법의 주문서가 숨겨져 있습니다.
깊은 곳까지 탐험해야 합니다.
여러 폴더를 헤쳐나가 주문서를 찾으세요.`,
      filesystem: JSON.stringify({
        '/': {
          type: 'dir',
          children: {
            'library': {
              type: 'dir',
              children: {
                'section_a': {
                  type: 'dir',
                  children: {
                    'note.txt': { type: 'file', content: '주문서는 section_b의 깊은 곳에...' },
                  }
                },
                'section_b': {
                  type: 'dir',
                  children: {
                    'ancient': {
                      type: 'dir',
                      children: {
                        'spell.txt': { type: 'file', content: '🔮 마법 주문: ABRACADABRA-777' },
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }),
      goal_command: 'cat',
      goal_file: 'spell.txt',
      goal_content: '🔮 마법 주문: ABRACADABRA-777',
      hint: 'cd library → cd section_a → cat note.txt → cd .. → cd section_b → cd ancient → cat spell.txt',
      order_num: 4,
    },
 
    {
      title: '저주받은 보관실',
      story: `💀 당신은 저주받은 보관실에 들어왔습니다.
저주를 풀려면 가짜 열쇠 파일들을 삭제하고
진짜 열쇠가 담긴 폴더를 직접 만들어야 합니다.
폴더 이름: true_vault`,
      filesystem: JSON.stringify({
        '/': {
          type: 'dir',
          children: {
            'vault': {
              type: 'dir',
              children: {
                'fake_key1.txt': { type: 'file', content: '❌ 가짜 열쇠' },
                'fake_key2.txt': { type: 'file', content: '❌ 가짜 열쇠' },
                'clue.txt': { type: 'file', content: '진짜 보관함 이름은 true_vault 이다' },
              }
            }
          }
        }
      }),
      goal_command: 'mkdir',
      goal_file: 'true_vault',
      goal_content: '',
      hint: 'cd vault → cat clue.txt → rm fake_key1.txt → rm fake_key2.txt → mkdir true_vault',
      order_num: 5,
    },
 
    {
      title: '쌍둥이 탑',
      story: `🗼 당신 앞에 두 개의 탑이 서 있습니다.
왼쪽 탑과 오른쪽 탑, 어느 쪽에 보물이 있을까요?
두 탑을 모두 탐험하고 진짜 보물을 찾으세요.
숨겨진 파일에 주목하세요.`,
      filesystem: JSON.stringify({
        '/': {
          type: 'dir',
          children: {
            'left_tower': {
              type: 'dir',
              children: {
                'info.txt': { type: 'file', content: '이 탑에는 아무것도 없다...' },
                '.secret': { type: 'file', content: '보물은 오른쪽 탑 깊은 곳에 있다' },
              }
            },
            'right_tower': {
              type: 'dir',
              children: {
                'floor1': {
                  type: 'dir',
                  children: {
                    'floor2': {
                      type: 'dir',
                      children: {
                        'treasure.txt': { type: 'file', content: '💎 보물 발견: TWIN-TOWER-2025' },
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }),
      goal_command: 'cat',
      goal_file: 'treasure.txt',
      goal_content: '💎 보물 발견: TWIN-TOWER-2025',
      hint: 'cd left_tower → ls -a → cat .secret → cd .. → cd right_tower → cd floor1 → cd floor2 → cat treasure.txt',
      order_num: 6,
    },
 
    // ══════════════════════════════════════════════════════
    // CHAPTER 3 - 최종 보스 (복합 명령어)
    // ══════════════════════════════════════════════════════
 
    {
      title: '마왕의 성',
      story: `👹 드디어 마왕의 성에 도달했습니다.
성 안에는 마왕의 비밀 일지가 숨겨져 있습니다.
여러 개의 함정 파일들 사이에서
진짜 일지를 찾아 내용을 읽어야 합니다.
힌트 파일들을 따라가며 탐험하세요.`,
      filesystem: JSON.stringify({
        '/': {
          type: 'dir',
          children: {
            'castle': {
              type: 'dir',
              children: {
                'entrance.txt': { type: 'file', content: '일지는 throne_room 안에 숨겨져 있다' },
                'trap1.txt': { type: 'file', content: '❌ 함정이다!' },
                'trap2.txt': { type: 'file', content: '❌ 함정이다!' },
                'throne_room': {
                  type: 'dir',
                  children: {
                    '.diary': { type: 'file', content: '👹 마왕의 일지: 오늘도 용사를 물리쳤다... 코드: DEMON-KING-FINAL' },
                    'decoy.txt': { type: 'file', content: '가짜 일지' },
                  }
                }
              }
            }
          }
        }
      }),
      goal_command: 'cat',
      goal_file: '.diary',
      goal_content: '👹 마왕의 일지: 오늘도 용사를 물리쳤다... 코드: DEMON-KING-FINAL',
      hint: 'cd castle → cat entrance.txt → cd throne_room → ls -a → cat .diary',
      order_num: 7,
    },
 
    {
      title: '탈출 준비',
      story: `🚪 마지막 관문입니다!
성을 탈출하려면 탈출 캡슐을 직접 만들어야 합니다.
capsule 폴더를 생성하고
그 안에 launch.txt 파일을 만들어 발사 신호를 보내세요.`,
      filesystem: JSON.stringify({
        '/': {
          type: 'dir',
          children: {
            'exit_zone': {
              type: 'dir',
              children: {
                'manual.txt': { type: 'file', content: '탈출 순서: 1) capsule 폴더 생성 2) launch.txt 파일 생성' },
              }
            }
          }
        }
      }),
      goal_command: 'touch',
      goal_file: 'launch.txt',
      goal_content: '',
      hint: 'cd exit_zone → cat manual.txt → mkdir capsule → cd capsule → touch launch.txt',
      order_num: 8,
    },
 
  ])
}