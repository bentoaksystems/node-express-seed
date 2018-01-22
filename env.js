const promise = Promise;
const bCrypt = require('bcrypt-nodejs');
const app = require('express')();
let env = app.get('env');
const options = {
  promiseLib: promise,
};
const pgp = require('pg-promise')(options);

if(env==='test')
  env='development';

const isProd = env==='production';
const isDev  = env==='development';

if (isDev)
  require('dotenv').config(); // loads env variables inside .env file into process.env

/**
 * read environment variable form env.process
 * in dev or test mode the enviornmnet variables are made from .env file
 * .env file must at least contains:
 * INIT_DB
 * DATABASE
 * PG_CONNECTION
 * REDIS_URL
 * for example:
 * PG_CONNECTION=postgres://postgres:some_password@localhost:5432/
 */



const connectionString = getEnvValue(process.env.PG_CONNECTION) + getEnvValue(process.env.DATABASE);
const test_db_name = getEnvValue(process.env.DATABASE + '_test');
const testConnectionString = getEnvValue(process.env.PG_CONNECTION) + test_db_name;
const initDb =  pgp(getEnvValue(process.env.PG_CONNECTION) + getEnvValue(process.env.INIT_DB));
const db = pgp(connectionString);
const testDb = pgp(testConnectionString);
const pgm = require('pg-monitor');
const color = require("cli-color");

const redisURL = getEnvValue(process.env.REDIS_URL);
const redisPassword = getEnvValue(process.env.REDIS_PASSWORD);


const pgmTheme = {
    time: color.bgBlack.whiteBright,
    value: color.black,
    cn: color.black.bold,
    tx: color.cyan,
    paramTitle: color.magenta,
    errorTitle: color.redBright,
    query: color.bgBlue.whiteBright.bold,
    special: color.bgYellowBright.black.bold,
    error: color.red
  };
pgm.setTheme(pgmTheme); // selecting your own theme;
pgm.attach(options);

/**
 *  in some cases env var name which is declared in .env file is not compatible with server env var in production mode.
 *  for example in Heroku the name of env var for database connection is DATABASE_URL, but it is declared as pg_connection in .env file
 *  To resolve this if the name of env var contains !! at first, its value will be extracted from name after this two character
 * @param procEnv
 * @returns {*}
 */
function getEnvValue(procEnv) {
  if (procEnv && procEnv.startsWith('!!'))
    return process.env[procEnv.substring(2)]; // remove two first char (!!)
  else
    return procEnv;
}


module.exports = {
  bCrypt,
  pgp,
  pgm,
  app,
  db,
  testDb,
  initDb,
  db_name: getEnvValue(process.env.DATABASE),
  test_db_name,
  isProd,
  isDev,
  redisURL,
  redisPassword
};