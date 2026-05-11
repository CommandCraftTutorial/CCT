exports.up = function(knex) {
  return knex.schema.createTable('dungeon_stages', (table) => {
    table.increments('id')
    table.string('title').notNullable()
    table.text('story')                    // 스토리 설명
    table.json('filesystem')               // 가상 파일시스템
    table.string('goal_command')           // 클리어 조건 명령어
    table.string('goal_file')              // 클리어 조건 파일
    table.string('goal_content')           // 클리어 조건 내용
    table.text('hint')
    table.integer('order_num')             // 스테이지 순서
    table.timestamps(true, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('dungeon_stages')
}