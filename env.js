const promise = require('bluebird');
const bCrypt = require('bcrypt-nodejs');
const options = {promiseLib: promise};
const pgp = require('pg-promise')(options);
const app = require('express')();
const config = require('./config.json')[app.get('env')];
const connectionString = config.pgConnection + config.database;
const test_db_name = config.database + '_test';
const testConnectionString = config.pgConnection + test_db_name;
const db = pgp(connectionString);
const testDb = pgp(testConnectionString);

module.exports = {
  bcrypt: bCrypt,
  pgp: pgp,
  app: app,
  config: config,
  db: db,
  testDb : testDb,
  db_name: config.database,
  test_db_name: test_db_name
};