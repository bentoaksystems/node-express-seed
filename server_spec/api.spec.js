const request = require("request");
const base_url = "http://localhost:3000/api/";

describe("REST API", ()=>{
  describe("root", ()=>{
    it("returns 'respond with a resource'", done => {
      request.get(base_url, function (error, response) {
        expect(response.body).toBe("respond with a resource");
        done();
      })
    });

  })
});