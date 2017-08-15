/**
 * Created by ali71 on 05/08/2017.
 */
const User = require('../lib/user.model');
const env = require('../env');
const redis = require('../redis');

//Define namespace without authentication needs
let userIO;
let _io;

let setup = (io, socketSessionParser) => {
  _io = io;

  //Initialize defined namespaces
  userIO = _io.of('/user');
  let userConnection = userIO.on('connection', socket => {
    //Listen on specific event
    socket.on('bmsg', message => {
      socket.broadcast.emit('bres', message);
    });
  });
  userConnection.use(socketSessionParser);

  getAllNamespace()
    .then(res => {
      for(let ns of res) {
        _io.of(ns).on('connection', socket => {
          //Write any code must execute after any clients connected to specific namespace
        });
      }
  });

  //Define other routes (namespace for socket)
};

let saveNamespace = (namespace) => {
  return new Promise((resolve, reject) => {
    redis.redis_client.saddAsync('namespaces', namespace)
      .then(res => {
        _io.of(namespace).on('connection', socket => {
          //Write any code must execute after any clients connected to specific namespace
        });
        resolve();
      })
      .catch(err => {
        reject('Cannot store namespace on redis');
      });
  });
};

let isNamespaceExist = (namespace) => {
  return new Promise((resolve, reject) => {
    redis.redis_client.sismemberAsync('namespaces', namespace)
      .then(res => {
        if(res)
          resolve(_io.of(namespace));
        else
          reject(null);
      })
      .catch(err => reject(null))
  });
};

let getAllNamespace = () => {
  return redis.redis_client.smembersAsync('namespaces');
};

let deleteNamespace = (namespace) => {
  return redis.redis_client.sremAsync('namespaces', namespace);
};

let getUserIO = () => {
  return userIO;
};

module.exports = {
  setup,
  getUserIO,
  saveNamespace,
  isNamespaceExist,
  deleteNamespace,
};