var config = require('../config'),
    rp = require('request-promise'),
    fs = require('fs');

var pem = fs.readFileSync(
  process.cwd() + '/ca.cer',
  {encoding: 'utf8'}
);

var configServer = {
  "authentication": "certificate",
  "ssl-require-client-certificate": true,
  "ssl-certificate-template": "cred-template",
  "ssl-client-certificate-pems": {
    "ssl-client-certificate-pem": pem
  }
};

function configServerAsCert() {
  var options = {
    method: 'PUT',
    uri: 'http://' + config.host + ':8002/manage/v2/servers/' + config.database.name + '-rest' + '/properties/?group-id=Default',
    body: configServer,
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('Server configured: ' + config.user.name);
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

configServerAsCert();
