/**
 * Created by Amin on 31/01/2017.
 */
const env = require('./env');
const sql = require('./sql');
const promise = require('bluebird');
const options = {promiseLib: promise};

function dbTestCreate(){
  sql.db.create({dbName: env.test_db_name},true)
    .then(res=>{
      console.log(res);
      process.exit();
    })
    .catch(err=>{
      console.log(err.message);
      process.exit();
    });
}

sql.db.create({dbName: env.db_name})
  .then(res=>{
    console.log(res);
    if(env.isDev)
      dbTestCreate();
  })
  .catch(err=>{
    console.log(err.message);
    if(env.isDev)
      dbTestCreate();
  });
