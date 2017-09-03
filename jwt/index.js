/**
 * Created by ali71 on 23/08/2017.
 */
const lib = require('../lib');
const authJWT = require('./authJWT');

let setup = (app) => {
  authJWT.setup('id', 'token');
                                        //The name of token field and id field (The name is variable that can fetch user by it from database)
                                        //The setup function gets third arguments as options (This is optional)
                                        //That you can specify jwt run in test mode or not by isTest property (default is false)
                                        //Also you can specify the loadUser and authentication functions should get request as first argument or not by isReqRequire (default is true)
  authJWT.loadUser(lib.User.loadUser);
  authJWT.authentication(lib.User.signToken);
  authJWT.verifyCallback(lib.User.verifyCallback);
  authJWT.setSecretKey(null);           //If you want to use your secret key, replace it with null
  app.use(authJWT.jwt);
};

module.exports = {
  setup,
  auth: authJWT.auth
};