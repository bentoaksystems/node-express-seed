/**
 * Created by Amin on 04/02/2017.
 */
let badPass = new Error("Incorrect password");
badPass.number = 401;

let noUser = new Error("User not found");
noUser.number = 400;

let adminOnly = new Error("Admin only functionality");
adminOnly.number = 403;

module.exports = {
  badPass: badPass,
  noUser: noUser,
  adminOnly: adminOnly,
};