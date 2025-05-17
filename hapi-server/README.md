## Setting Up the Database

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the database migrations to create the necessary tables:
   ```bash
   npx knex migrate:latest --knexfile knexfile.cjs
   ```

This will generate the SQLite database file (`dev.sqlite3`) and set up the required tables.