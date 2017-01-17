var config = require('./config'),
    rp = require('request-promise'),
    https = require('https');

// Mgmt API on port 8002 uses self-signed certs for SSL
https.globalAgent.options.rejectUnauthorized = false;

function deleteUser() {
  var options = {
    method: 'DELETE',
    uri: 'https://' + config.host + ':8002/manage/v2/users/' + config.user.name,
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
    uri: 'https://' + config.host + ':8002/v1/rest-apis/' + config.database.name + "-rest" +
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
