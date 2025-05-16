exports.up = function(knex) {
  return knex.schema.createTable('todos', function(table) {
    table.increments('id').primary();
    table.string('state').notNullable().defaultTo('INCOMPLETE');
    table.text('description').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('completedAt').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('todos');
};
