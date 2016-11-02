var config = require('../config'),
    fs = require('fs'),
    marklogic = require('marklogic');

var db = marklogic.createDatabaseClient({
  host: 'localhost',
  port: config.database.port,
  user: config.auth.user,
  password: config.auth.pass,
  database: 'Security',
  authType: 'digest'
});

var src = fs.readFileSync(
  process.cwd() + '/' + process.argv[2],
  {encoding: 'utf8'}
);

console.log(src);

db.xqueryEval({
  source: src,
  variables: {}
}).result().then(function (response){
  console.log('Promise resolved: ');
  console.log(JSON.stringify(response, null, 2));
}).catch(function (error) {
  console.log('Promise rejected, error: ');
  console.log(JSON.stringify(error, null, 2));
});
