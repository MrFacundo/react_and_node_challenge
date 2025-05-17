exports.up = function(knex) {
  return knex.schema.table('todos', function(table) {
    table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.table('todos', function(table) {
    table.dropColumn('userId');
  });
};
