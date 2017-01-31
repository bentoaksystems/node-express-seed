/**
 * Created by Amin on 31/01/2017.
 */
const env = require('./env');
const connectionString = env.config.pgConnection;
const promise = require('bluebird');
const options = {promiseLib: promise};
const pgp = require('pg-promise')(options);
const db = pgp(connectionString);

function dbTestCreate(){
  db.query('create database ' + env.test_db_name)
    .then(res=>{
      console.log(res);
      process.exit();
    })
    .catch(err=>{
      console.log(err.message);
      process.exit();
    });
}

db.query('create database ' + env.db_name)
  .then(res=>{
    console.log(res);
    if(app.get('env')==='development')
      dbTestCreate();
  })
  .catch(err=>{
    console.log(err.message);
    if(app.get('env')==='development')
      dbTestCreate();
  });
