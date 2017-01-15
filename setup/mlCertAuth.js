var config = require('../config'),
    fs = require('fs'),
    path = require('path'),
    spawn = require( 'child_process' ).spawn,
    marklogic = require('marklogic');

var db = marklogic.createDatabaseClient({
  host: config.host,
  port: config.database.port,
  user: config.auth.user,
  password: config.auth.pass,
  database: 'Security',
  authType: 'digest'
});

function getScript(script) {
  return fs.readFileSync(
    process.cwd() + '/scripts/' + script,
    {encoding: 'utf8'}
  );
}

function xqueryEval(src, extVars) {
  return db.xqueryEval({
    source: src,
    variables: extVars
  }).result()
}

function createKeys() {
  var script = getScript('createKeys.sjs');
  return xqueryEval(script, {});
}

function createCA(options) {
  // Save to current directory by default
  if (!options.path) {
    options.path = path.dirname(require.main.filename) + "/";
  }
  var script = getScript('createCA.xqy');
  return xqueryEval(script, options);
}

function createTemplate(options) {
  var script = getScript('createTemplate.xqy');
  return xqueryEval(script, options);
}

function createServerCert(options) {
  var script = getScript('createServerCert.xqy');
  return xqueryEval(script, options);
}

function createUserCert(options) {
  // Save to current directory by default
  if (!options.path) {
    options.path = path.dirname(require.main.filename) + "/";
  }
  var script = getScript('createUserCert.xqy');
  return xqueryEval(script, options);
}

function createUserPKCS12(options) {
  // Save to current directory by default
  if (!options.path) {
    options.path = path.dirname(require.main.filename) + "/";
  }
  openssl = spawn( 'openssl',
    [ 'pkcs12', '-export', '-in', options.path + options.cert, '-inkey',
    options.path + options.privkey, '-out', options.pfx ] );
  openssl.stdout.on( 'data', data => {
    console.log( `stdout: ${data}` );
  });
  openssl.stderr.on( 'data', data => {
    console.log( `stderr: ${data}` );
  });
  openssl.on( 'close', code => {
    console.log( `child process exited with code ${code}` );
  });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
      createKeys: createKeys,
      createCA: createCA,
      createTemplate: createTemplate,
      createServerCert: createServerCert,
      createUserCert: createUserCert,
      createUserPKCS12: createUserPKCS12
  };
}
