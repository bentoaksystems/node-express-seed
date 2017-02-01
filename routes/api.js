var express = require('express');
var router = express.Router();

/* GET api listing. */

function apiResponse(dbPromise, adminOnly, reqFuncs){
  var args = Array.prototype.slice.call(arguments, 3);
  return(function(req, res, next) {
    var user = req.user ? req.user.toLowerCase() : req.user;
    if(adminOnly && user !== 'admin') {
      res.status(403)
        .send('Only admin can do this.');
    }
    else {
      var dynamicArgs = [];
      for (var i in reqFuncs)
        dynamicArgs.push(reqFuncs[i](req))

      args = dynamicArgs.concat(args);

      dbPromise.apply(null, args)
        .then(function (data) {
          res.status(200)
            .json(data);
        })
        .catch(
          function (err) {
            console.log(dbPromise.name + ':', err);
            res.status(500)
              .send(err.message || err);
          });
    }
  });
}

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
