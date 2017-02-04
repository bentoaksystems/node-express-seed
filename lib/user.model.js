/**
 * Created by Amin on 01/02/2017.
 */
const sql = require('../sql');
const env = require('../env');
const SqlTable = require('./sqlTable.model');

class User extends SqlTable{

  constructor(test=false){
    super('users','user_id', 'uid', test);
  }

  load(username,password){
    this.password = password;
    this.username = username;
    return super.load({name:username});
  }

  importData(data) {
    this.secret = data.secret;
    this.user_id = data.uid;
    this.is_admin = data.name && data.name.toLowerCase() === 'admin';
  }

  exportData(){
    return new env.promise((resolve, reject) => {
      console.log(this.password);
      if(!this.password){
        this.secret='';
        resolve({name:this.username,secret:''});
      }
      else {
        env.bcrypt.genSalt(101, (err, salt) => {
          if (err)
            reject(err);
          else
            env.bcrypt.hash(this.password, salt, null, (err, hash) => {
              if (err)
                reject(err);
              else
                this.secret = hash;
              resolve({
                name: this.username,
                secret: hash,
              });
            });
        });
      }
    });
  }

  checkPassword() {
    return new env.promise((resolve, reject) => {
      if(!this.secret)
        reject(Error("No password is set up"));
      env.bcrypt.compare(this.password, this.secret, (err, res) => {
        if(err)
          reject(err);
        else if (!res)
          reject(Error("Incorrect password"));
        else
          resolve();
      });
    });
  }
}

module.exports = User;