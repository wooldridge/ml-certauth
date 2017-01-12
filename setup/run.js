var config = require('../config'),
    config2 = require('./config'),
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

var script = process.argv[2];
var src = fs.readFileSync(
  process.cwd() + '/' + script,
  {encoding: 'utf8'}
);

var extVars = {};
switch(script) {
    case '1_CreateCA.xqy':
        extVars = config2.ca;
        break;
    case '2_CreateTemplate.xqy':
        extVars = config2.template;
        break;
    case '3_CreateHostTemplate.xqy':
        extVars = config2.host;
        break;
    case '4_CreateUserCert.xqy':
        extVars = config2.user;
        break;
}

fs.readFileSync(
  process.cwd() + '/' + process.argv[2],
  {encoding: 'utf8'}
);

console.log(src);

db.xqueryEval({
  source: src,
  variables: extVars
}).result().then(function (response){
  console.log('Promise resolved: ');
  console.log(JSON.stringify(response, null, 2));
}).catch(function (error) {
  console.log('Promise rejected, error: ');
  console.log(JSON.stringify(error, null, 2));
});
