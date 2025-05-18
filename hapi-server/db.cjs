const knex = require("knex");

// Initialize knex connection

const db = knex({
  client: "sqlite3",
  connection: { filename: "./dev.sqlite3" },
  useNullAsDefault: true,
});

module.exports = db;
