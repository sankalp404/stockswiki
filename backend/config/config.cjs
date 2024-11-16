'use strict';

require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USERNAME || 'your_dev_username',
    password: process.env.DB_PASSWORD || 'your_dev_password',
    database: process.env.DB_NAME || 'your_dev_database',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME || 'your_test_username',
    password: process.env.DB_PASSWORD || 'your_test_password',
    database: process.env.DB_NAME || 'your_test_database',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.PROD_DB_USERNAME || 'your_prod_username',
    password: process.env.PROD_DB_PASSWORD || 'your_prod_password',
    database: process.env.PROD_DB_NAME || 'your_prod_database',
    host: process.env.PROD_DB_HOST || '127.0.0.1',
    port: process.env.PROD_DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
};

console.log('Loaded Configuration:', config);

module.exports = config;
