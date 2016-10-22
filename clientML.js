var config = require('./config'),
    marklogic = require('marklogic'),
    fs = require('fs');

var db = marklogic.createDatabaseClient({
  host: config.host,
  port: config.database.port,
  user: config.auth.user,
  password: config.auth.password,
  authType: 'certificate',
  ssl: true,
  ca: fs.readFileSync('ca.cer'),
  pfx: fs.readFileSync('portaltest.pfx'),
  passphrase: 'p'
});

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
