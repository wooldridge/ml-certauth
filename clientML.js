var config = require('./config'),
    marklogic = require('marklogic'),
    fs = require('fs');

// authentication = 'certificate'
// require-client-certificate = true
var options1 = {
  host: config.host,
  port: config.database.port,
  authType: 'certificate',
  ssl: true,
  ca: fs.readFileSync('ca.cer'),
  pfx: fs.readFileSync('portaltest.pfx'),
  passphrase: 'p'
};

// authentication != 'certificate'
// require-client-certificate = true
var options2 = {
  host: config.host,
  port: config.database.port,
  user: 'portal',
  password: 'p',
  authType: 'basic',
  ssl: true,
  ca: fs.readFileSync('ca.cer'),
  pfx: fs.readFileSync('portaltest.pfx'),
  passphrase: 'p'
};

var db = marklogic.createDatabaseClient(options2);

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
