exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('username').notNullable()
    table.integer('current_stage').defaultTo(1)
    table.integer('score').defaultTo(0)
    table.timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};