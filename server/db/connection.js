import knex from 'knex';

export const connection = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite3',
  },
  useNullAsDefault: true,
});

connection.on('query', ({sql, bindings }) => {
  console.log(connection.raw(sql, bindings).toQuery())
})