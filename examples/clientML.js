var config = require('../config'),
    marklogic = require('marklogic'),
    fs = require('fs');

// authentication = 'certificate'
// require-client-certificate = true
var options1 = {
  host: config.host,
  port: config.database.port,
  authType: 'certificate',
  ssl: true,
  ca: fs.readFileSync('../certs/ca.crt'),
  cert: fs.readFileSync('../certs/client.crt'),
  key:  fs.readFileSync('../keys/clientpriv.pem')
  // Alternative PKCS12 method
  // pfx: fs.readFileSync('../certs/clienttest.pfx'),
  // passphrase: 'p'
};

// authentication != 'certificate'
// require-client-certificate = true
var options2 = {
  host: config.host,
  port: config.database.port,
  user: config.user.name,
  password: config.user.pass,
  authType: 'digest',
  ssl: true,
  ca: fs.readFileSync('../certs/ca.crt'),
  cert: fs.readFileSync('../certs/client.crt'),
  key:  fs.readFileSync('../keys/clientpriv.pem')
  // Alternative PKCS12 method
  //pfx: fs.readFileSync('../certs/clienttest.pfx'),
  //passphrase: 'p'
};


// authentication != 'certificate'
// require-client-certificate = false
var options3 = {
  host: config.host,
  port: config.database.port,
  user: config.user.name,
  password: config.user.pass,
  authType: 'digest',
  ssl: true,
  ca: fs.readFileSync('../certs/ca.crt')
};

var db = marklogic.createDatabaseClient(options1);

db.setLogger('debug');

db.documents.read({
  uris: '/doc.json'
})
.result(
  function(response) {
    console.log('Read success: ');
    console.dir(response);
  },
  function(error) {
    console.log('Read failure: ');
    console.dir(error);
  }
);
