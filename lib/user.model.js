/**
 * Created by Amin on 01/02/2017.
 */
const sql = require('../sql');
const env = require('../env');
class User {
  constructor(test=false){
    this.sql = test ? sql.test : sql;
  }
  load(username, password) {
    return new env.promise((resolve, reject) => {
      this.password = password;
      this.sql.users.get({name: username})
        .then(data => {
          this.username = data[0].name;
          this.secret = data[0].secret;
          this.user_id = data[0].uid;
          this.is_admin = data[0].name && data[0].name.toLowerCase() === 'admin';
          resolve(data[0]);
        })
        .catch(reject);
    });
  }

  checkPassword() {
    return new env.promise((resolve, reject) => {
      if(!this.secret)
        reject("No password set up");
      env.bcrypt.compare(this.password, this.secret, (err, res) => {
        if(err)
          reject(err);
        else if (!res)
          reject("Incorrect password");
        else
          resolve();
      });
    });
  }

  exportData(){
    return new env.promise((resolve, reject) => {
      env.bcrypt.genSalt(101, (err, salt) => {
        if(err)
          reject(err);
        else
           env.bcrypt.hash(this.password, salt, null, (err, hash) => {
            if(err)
              reject(err);
            else
              this.secret = hash;
              resolve({
                name: this.username,
                secret: hash,
              });
          });
      });
    });
  }

  save() {
    return new env.promise((resolve, reject)=>
      this.exportData()
        .then(this.user_id ?
          data => {
            this.sql.users.update(data,this.user_id);
            resolve(this.user_id);
          }
          :
          this.sql.users.add
        )
        .catch(reject));
  }
}

module.exports = User;