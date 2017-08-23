/**
 * Created by ali71 on 23/08/2017.
 */
const cookie = require('cookie');
const redis = require('../redis');

let secretKey = '*$d68s%2A2#$H+_CNfd3'; //The secret key for encrypt and decrypt the token
let isTest = false;
let isReqRequire = true;
let idField = 'id';
let tokenField = 'token';
let loadUserFunction = null;
let verifyCallbackFunction = null;
let authenticationFunction = null;

let setSecretKey = (sk) => {
  if(sk)
    secretKey = sk;
};

let loadUser = (value) => {
  loadUserFunction = value;
};

let verifyCallback = (value) => {
  verifyCallbackFunction = value;
};

let authentication = (value) => {
  authenticationFunction = value;
};

let auth = (request, response, next) => {
  let username = request.body.username;
  let password = request.body.password;

  let tempFunc = isReqRequire ? authenticationFunction(request, username, password, secretKey) : authenticationFunction(username, password, secretKey);
  tempFunc
    .then(res => {
      response.cookie(idField, res.tid, {maxAge: 900000, httpOnly: true});
      response.cookie(tokenField, res.token, {maxAge: 900000, httpOnly: true});
      request.user = res.user;
      next();
    })
    .catch(err => {
      console.log('Error when authenticate user: ', err);
      request.user = null;
      next();
    });
};

let jwt = (request, response, next) => {
  // let cookies = cookie.parse(request.cookies);
  let id = request.cookies[idField];
  let token = request.cookies[tokenField];

  if(!id || !token) {
    request.user = null;
    next();
  }
  else{
    if(isTest){
      let tempFunc = isReqRequire ? loadUserFunction(request, id) : loadUserFunction(id);
      tempFunc
        .then(user => {
          if(user){
            request.user = user;
            next();
          }
          else{
            response.status(404)
              .send('User not found');
          }
        })
        .catch(err => {
          response.status(500)
            .send('Cannot get user');
        })
    }
    else{
      redis.get(id)
        .then(user => {
          if(user){
            //The user is found in redis storage
            //Should check user token
            verifyCallbackFunction(token, user, secretKey)
              .then(res => {
                request.user = user;
                next();
              })
              .catch(err => {
                console.log('Error when decoding token: ', err);
                request.user = null;
                next();
              })
          }
          else{
            let tempFunc = isReqRequire ? loadUserFunction(request, id) : loadUserFunction(id);
            tempFunc
              .then(user => {
                redis.save(id, user);
                request.user = user;
                next();
              })
              .catch(err => {
                console.log('Error when fetching user: ', err);
                request.user = null;
                next();
              })
          }
        })
    }
  }
};

let setup = (idName, tokenName, options) => {
  tokenField = tokenName;
  idField = idName;
  isTest = (options && options.isTest) ? options.isTest : isTest;
  isReqRequire = (options && options.isReqRequire) ? options.isReqRequire : isReqRequire;
};

module.exports = {
  setup,
  loadUser,
  verifyCallback,
  authentication,
  jwt,
  auth,
  setSecretKey,
};