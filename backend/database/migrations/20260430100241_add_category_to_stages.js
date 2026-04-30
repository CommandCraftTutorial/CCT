exports.up = function(knex) {
  return knex.schema.alterTable('stages', (table) => {
    table.string('category').defaultTo('git')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('stages', (table) => {
    table.dropColumn('category')
  })
}