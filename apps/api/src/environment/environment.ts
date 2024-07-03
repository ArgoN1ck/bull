import { get } from 'env-var';

export const environment = {
  production: get('NODE_ENV').required().asString() === 'production',
  app: {
    port: get('PORT').required().asPortNumber(),
    host: get('HOST').required().asString(),
  },
  database: {
    username: get('PSQL_USERNAME').required().asString(),
    password: get('PSQL_PASSWORD').required().asString(),
    port: get('PSQL_PORT').required().asPortNumber(),
    host: get('PSQL_HOST').required().asString(),
    name: get('PSQL_DATABASE').required().asString(),
  },
  redis: {
    port: get('REDIS_PORT').required().asPortNumber(),
    host: get('REDIS_HOST').required().asString(),
  },
  pinoLogger: {
    level:
      get('NODE_ENV').required().asString() === 'production'
        ? 'debug'
        : 'trace',
  },
};
