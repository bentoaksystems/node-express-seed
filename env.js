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



const connectionString = process.env.PG_CONNECTION + process.env.DATABASE;
const test_db_name = process.env.DATABASE + '_test';
const testConnectionString = process.env.PG_CONNECTION + test_db_name;
const initDb =  pgp(process.env.PG_CONNECTION + process.env.INIT_DB);
const db = pgp(connectionString);
const testDb = pgp(testConnectionString);
const pgm = require('pg-monitor');
const color = require("cli-color");

const redisURL = process.env.REDIS_URL;
const redisPassword = process.env.REDIS_PASSWORD;


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

module.exports = {
  bCrypt,
  pgp,
  pgm,
  app,
  db,
  testDb,
  initDb,
  db_name: process.env.DATABASE,
  test_db_name,
  isProd,
  isDev,
  redisURL,
  redisPassword
};