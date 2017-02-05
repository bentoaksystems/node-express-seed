/**
 * Created by Amin on 01/02/2017.
 */
const sql = require('../sql');
const env = require('../env');
const helpers = require('./helpers');
const SqlTable = require('./sqlTable.model');
const error = require('./errors.list');

class User extends SqlTable{
  constructor(test=false){
    super('users', 'uid', test);
  }

  load(username,password){
    this.password = password;
    this.username = username.toLowerCase();
    return super.load({name:this.username});
  }

  importData(data) {
    this.secret = data.secret;
    this.uid = data.uid;
    this.is_admin = this.username && helpers.adminCheck(this.username);
  }

  exportData(){
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
      if(!this.secret)
        reject(new Error("No password is set up"));
      env.bcrypt.compare(this.password, this.secret, (err, res) => {
        if(err)
          reject(err);
        else if (!res)
          reject(error.badPass);
        else
          resolve();
      });
    });
  }

  loginCheck(username=this.username, password=this.password) {
    return new Promise((resolve,reject) => {
      this.load(username,password)
        .then(()=>this.checkPassword().then(resolve).catch(err=>reject(error.badPass)))
        .catch(err=>reject(error.noUser));
    })
  }

  insert(data){
    this.username = data.username;
    this.password = data.password;
    return this.save();
  }

  static serialize(user, done) {
    done(null, user);
  };

  static deserialize(user, done) {
    user.loginCheck()
      .then(() => done(null, user))
      .catch(err => {
        console.log(err.message);
        done(err);
      });
  };

  static passportLocalStrategy(req, username, password, done){
    let user = new User(helpers.isTestReq(req));
    user.loginCheck(username, password)
      .then(()=>done(null,user))
      .catch(err=>done(err,false));
  }
}

module.exports = User;