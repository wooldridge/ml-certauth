var config = require('./config'),
    rp = require('request-promise');

function deleteUser() {
  var options = {
    method: 'DELETE',
    uri: 'http://' + config.host + ':8002/manage/v2/users/' + config.user.name,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('User deleted: ' + config.user.name);
      deleteREST();
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

function deleteREST() {
  var options = {
    method: 'DELETE',
    uri: 'http://' + config.host + ':8002/v1/rest-apis/' + config.database.name + "-rest" +
         '?include=content&include=modules',
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('REST instance deleted: ' + config.database.name + "-rest");
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

function start() {
  deleteUser();
}

start();
