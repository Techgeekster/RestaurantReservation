require("dotenv").config();

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    connectionString: process.env.DATABASE_URL_DEVELOPMENT,
  }
});

knex.raw('SELECT 1')
  .then(() => {
    console.log('Database connection successful');
    knex.destroy();
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    knex.destroy();
  });