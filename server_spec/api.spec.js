const request = require("request");
const base_url = "http://localhost:3000/api/";
const test_query = '?test=tEsT';
const lib = require('../lib');
const sql = require('../sql');

describe("REST API", ()=>{
  describe("root", ()=>{
    it("returns 'respond with a resource'", done => {
      request.get(base_url, function (error, response) {
        expect(response.body).toBe("respond with a resource");
        done();
      })
    });
  });
  describe("user", ()=>{
    let uid;
    let teardown=false;
    let setup=true;
    beforeEach(done=>{
      if(setup) {
        u = new lib.User(true);
        u.username = 'amin';
        u.password = 'test';
        sql.test.users.create()
          .then(() => {
            u.save()
              .then(id => {
                uid = id;
                setup=false;
                done();
              })
          })
          .catch(err => {
            console.log(err.message);
            done();
          });
      }
      else{
        done();
      }
    });
    it("responds to 'loginCheck'", done => {
      request.post({url: base_url + 'loginCheck' + test_query, form:{username:'amin',password:'test'}}, function (error, response) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
    it("responds to incorrect login user", done => {
      request.post({url: base_url + 'loginCheck' + test_query, form:{username:'ami',password:'tes'}}, function (error, response) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });
    it("responds to incorrect login password", done => {
      request.post({
        url: base_url + 'loginCheck' + test_query,
        form: {username: 'amin', password: 'tes'}
      }, function (error, response) {
        expect(response.statusCode).toBe(401);
        done();
      })
    });
    it("doesn't save a new user if it is not admin", done => {
      request.put({url: base_url + 'user' + test_query, form:{username:'amin',password:'tes'}}, function(err,res){
        expect(res.statusCode).toBe(403);
        teardown=true;
        done();
      });
    });
    afterEach((done)=>{
      if(uid&&teardown)
        sql.test.users.drop().then(()=>done()).catch(err=>{console.log(err.message);done()});
      else done();
    });
  })
});