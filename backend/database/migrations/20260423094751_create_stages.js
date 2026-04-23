exports.up = function(knex) {
  return knex.schema.createTable('stages', (table) => {
    table.increments('id')
    table.string('title').notNullable()
    table.string('description').notNullable()
    table.string('mission').notNullable()
    table.string('answer')
    table.string('answer_regex')
    table.string('hint')
    table.string('difficulty')
    table.timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('stages')
};