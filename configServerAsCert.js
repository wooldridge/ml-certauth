var config = require('../config'),
    rp = require('request-promise'),
    fs = require('fs');

function findCertAuth(name, list) {
  console.log('in findCertAuth');
  for (var i = 0; i < list.length; i++) {
    console.log('checking: ' + list[i].nameref);
    if (list[i].nameref === name) {
      console.log('Found cert auth id: ' + list[i].idref);
      return list[i].idref;
    }
  }
  return null;
}

function getCertAuthId(name) {
  var options = {
    method: 'GET',
    uri: 'http://localhost:8002/manage/v2/certificate-authorities',
    json: true,
    body: {},
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log(parsedBody);
      var list = parsedBody['certificate-authorities-default-list']['list-items']['list-item'];
      console.log('Certificate authorities retrieved: ' + list.length + ' found');
      var id = findCertAuth('Acme Corp CA', list);
      if (id) {
        configServerAsCert(id);
      } else {
        'Certificate authority ID for Acme Corp CA not found';
      }
    })
    .catch(function (err) {
      console.log('getCertAuthId failed');
      console.log(err);
      console.log(JSON.stringify(err, null, 2));
    });
}

function configServerAsCert(id) {
  var pem = fs.readFileSync(
    process.cwd() + '/ca.cer',
    {encoding: 'utf8'}
  );
  var configServer = {
    "authentication": "certificate",
    "ssl-require-client-certificate": true,
    "ssl-certificate-template": "cred-template",
    "ssl-client-certificate-authority": [ id ]//,
    //"ssl-client-certificate-pem": [ pem ]
  };
  //console.log(JSON.stringify(configServer, null, 2));
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
    var configServer2 = {
      "ssl-client-certificate-pem": [ pem ]
    };
    //console.log(JSON.stringify(configServer2, null, 2));
    var options = {
      method: 'PUT',
      uri: 'http://' + config.host + ':8002/manage/v2/servers/' + config.database.name + '-rest' + '/properties/?group-id=Default',
      body: configServer2,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      },
      auth: config.auth
    };
    rp(options)
      .then(function (parsedBody) {
        console.log('Server2 configured: ' + config.user.name);
      })
      .catch(function (err) {
        console.log(JSON.stringify(err, null, 2));
      });
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

getCertAuthId();
