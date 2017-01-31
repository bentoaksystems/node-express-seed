/**
 * Created by Amin on 31/01/2017.
 */
const env = require("../../env");

describe("Env",()=> {
  describe("Database", ()=>{
    it("should have 'db' key", ()=>{
      expect(env.db).toBeDefined();
    });
    it("should have 'Database' as type",()=>{
      expect(env.db.constructor.name).toBe('Database');
    });
    it("should connect",done=>{
      env.db.one("SELECT 1 as res").then(res=>{expect(res.res).toBe(1);done()}).catch(err=>{fail(err.message);done()});
    });
  });
  describe("Test Database", ()=>{
    it("should have 'testDb' key", ()=>{
      expect(env.testDb).toBeDefined();
    });
    it("should have 'Database' as type",()=>{
      expect(env.testDb.constructor.name).toBe('Database');
    });
    it("should connect",done=>{
      env.testDb.one("SELECT 1 as res").then(res=>{expect(res.res).toBe(1);done()}).catch(err=>{fail(err.message);done()});
    });
  });
  describe("Test Database - creation",()=>{
    it("should create table,", done=>{
      env.testDb.query("CREATE TABLE users(uid serial not null primary key, name varchar(40) not null)")
        .then(res=>{
          expect(res).toBeTruthy();
          done();
        })
        .catch(err=>{
          fail(err.message);
          done();
        })
    });
    afterEach((done)=>{
      env.testDb.query("DROP TABLE users").then(res=>{expect(res).toBeTruthy();done()}).catch(err=>{fail(err.message);done()})
    });
  });
  describe("Config",()=>{
    it("should have 'pgConnection' key",()=>{
      expect(env.config.pgConnection).toBeDefined();
      expect(env.config.database).toBeDefined();
    })
  });
});