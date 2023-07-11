

 const configs = {
    host: 'localhost',
    port:  5432,
    database: 'forums',
    username: 'postgres',
    password: 'postgres',
};



/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  configs: configs,
  development: {
    client: 'postgresql',
    connection: {
      host: configs.host,
      port: configs.port,
      database: configs.database,
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: configs.host,
      port: configs.port,
      database: configs.database,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: configs.host,
      port: configs.port,
      database: configs.database,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
