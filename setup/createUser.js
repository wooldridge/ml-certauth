var config = require('../config'),
    rp = require('request-promise');

var configUser = {
  "user-name": config.user.name,
  "password": config.user.pass,
  "description": config.user.desc,
  "role": [ "rest-reader" ]
};

function createUser() {
  var options = {
    method: 'POST',
    uri: 'http://' + config.host + ':8002/manage/v2/users',
    body: configUser,
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('User created: ' + config.user.name);
    })
    .catch(function (err) {
      if (err.statusCode === 400) {
        console.log('error - user ' + config.user.name + ' may already exist')
      } else {
        console.log(JSON.stringify(err, null, 2));
      }
    });
}

createUser();
