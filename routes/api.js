const lib = require('../lib');
const express = require('express');
const router = express.Router();

/* GET api listing. */
function apiResponse(className, functionName, adminOnly, reqFuncs){
  let args = Array.prototype.slice.call(arguments, 4);
  let deepFind = function(obj, path){
    path = path.split('.');
    let len=path.length;
    for (let i=0; i<len; i++){
      obj = obj[path[i]];
    }
    return obj;
  };
  return(function(req, res) {
    let user = req.user ? req.user.toLowerCase() : req.user;
    let test = req.query.test==='tEsT';
    if(adminOnly && user !== 'admin') {
      res.status(403)
        .send('Only admin can do this.');
    }
    else {
      let dynamicArgs = [];
      for(let i in reqFuncs)
        dynamicArgs.push((typeof reqFuncs[i]==='function') ? reqFuncs[i](req) : deepFind(req,reqFuncs[i]));

      args = dynamicArgs.concat(args);
      let model = new lib[className](test);
      model[functionName].apply(model, args)
        .then(data=> {
          res.status(200)
            .json(data);
        })
        .catch(err=> {
            console.log(`${className}/${functionName}: `, err);
            res.status(err.number||500)
              .send(err.message || err);
          });
    }
  });
}

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/login', apiResponse('User','login',false,['body']));
router.put('/user',apiResponse('User','save',true,['body']));
module.exports = router;
