const { Sequelize: { Op } } = require('sequelize');
require('dotenv').config();

// ----------------------------------------
// Logger
// ----------------------------------------
let logger = false;
const cmd = process.argv[process.argv.length - 1];
if (!cmd.match(/db:/)) {
  const highlight = require('cli-highlight').highlight;
  logger = query => console.log(
    highlight(query, { language: 'sql', ignoreIllegals: true })
  );
}


module.exports = {
  "development": {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": "assignment_okodin_development",
    "host": "127.0.0.1",
    "dialect": "postgres",
    operatorsAliases: Op,
    "logging": logger
  },
  "test": {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": "assignment_okodin_test",
    "host": "127.0.0.1",
    "dialect": "postgres",
    operatorsAliases: Op,
    "logging": logger
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    operatorsAliases: Op,
    "logging": logger
  }
};
