/**
 * Created by Amin on 01/02/2017.
 */
const sql = require('../sql');
const env = require('../env');
class User{
  username;
  password;
  secret;
  is_admin;
  user_id;

  import(username,password){
    return new env.promise( (resolve,reject)=> {
      this.password = password;
      sql.users.get({name:username})
        .then(data=>{
          this.username = data.name;
          this.secret = data.secret;
          this.user_id = data.uid;
          this.is_admin = data.name.toLowerCase() === 'admin';
          resolve(data);
        })
        .catch(reject);
    });
  }

  checkPassword(){
    return new env.promise( (resolve,reject) => {
      env.bcrypt.compare(this.password,this.secret,function(err,res){
        if(err)
          reject(err.message);
        else if(!res)
          reject("Incorrect password");
        else
          resolve();
      });
    });
  }

  export(){
    return new env.promise((resolve,reject) => {
      env.brypt.genSalt(101, (err, salt) => {
        if (err)
          reject(err);
        else
          this.secret = env.bcrypt.hash(this.password, salt, null, function (err, hash) {
            if (err)
              reject(err);
            else
              resolve({
                name: this.username,
                secret: this.secret,
              });

          });
    })
  }
}