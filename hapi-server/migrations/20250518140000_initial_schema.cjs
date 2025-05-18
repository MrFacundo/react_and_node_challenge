exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('name').notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('todos', function(table) {
      table.increments('id').primary();
      table.string('state').notNullable().defaultTo('INCOMPLETE');
      table.text('description').notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('completedAt').nullable();
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('todos'),
    knex.schema.dropTableIfExists('users')
  ]);
};
