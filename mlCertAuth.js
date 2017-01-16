var config = require('./config'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    glob = require('glob'),
    xml2js = require('xml2js'),
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
    __dirname + '/scripts/' + script, { encoding: 'utf8' }
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
    options.path = __dirname + "/";
  }
  var script = getScript('createCA.xqy');
  return xqueryEval(script, options);
}

function createTemplate(options) {
  var script = getScript('createTemplate.xqy');
  return xqueryEval(script, options);
}

function createHostCert(options) {
  var script = getScript('createHostCert.xqy');
  return xqueryEval(script, options);
}

function createClientCert(options) {
  // Save to current directory by default
  if (!options.path) {
    options.path = __dirname + "/";
  }
  var script = getScript('createClientCert.xqy');
  return xqueryEval(script, options);
}

function createPKCS12(options) {
  // Save to current directory by default
  if (!options.path) {
    options.path = __dirname + "/";
  }
  var openssl = spawn( 'openssl',
    [ 'pkcs12', '-export',
      '-in', options.path + 'certs/' + options.cert,
      '-inkey', options.path + 'keys/' + options.privkey,
      '-out', options.path + 'certs/' + options.pfx ]
  );
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

function deleteCert(options) {
  var script = getScript('deleteCert.xqy');
  return xqueryEval(script, options);
}

function deleteCred(options) {
  var script = getScript('deleteCred.xqy');
  return xqueryEval(script, options);
}

function deleteTemplate(options) {
  var script = getScript('deleteTemplate.xqy');
  return xqueryEval(script, options);
}

function getHostCert(options) {
  var script = getScript('getHostCert.xqy');
  return new Promise(function (resolve, reject) {
    xqueryEval(script, options)
      .then(function (result) {
        xml2js.parseString(result[0].value, function (err, result) {
          resolve(result);
        });
      });
  });
}

function getTemplate(options) {
  var script = getScript('getTemplate.xqy');
  return new Promise(function (resolve, reject) {
    xqueryEval(script, options)
      .then(function (result) {
        xml2js.parseString(result[0].value, function (err, result) {
          resolve(result);
        });
      });
  });
}

function getCredential(options) {
  var script = getScript('getCredential.xqy');
  return new Promise(function (resolve, reject) {
    xqueryEval(script, options)
      .then(function (result) {
        xml2js.parseString(result[0].value, function (err, result) {
          resolve(result);
        });
      });
  });
}

function deleteKeyFiles() {
  //var keysPath = path.dirname(require.main.filename) + "/keys/";
  var keysPath = __dirname + "/keys/";
  return new Promise(function (resolve, reject) {
    glob(keysPath + '*.pem', function(error, keys){
      keys.forEach(fs.unlinkSync);
      resolve(keys);
    });
  });
}

function deleteCertFiles() {
  //var certsPath = path.dirname(require.main.filename) + "/certs/";
  var certsPath = __dirname + "/certs/";
  return new Promise(function (resolve, reject) {
    glob(certsPath + '*(*.crt|*.pfx)', function(error, certs){
      certs.forEach(fs.unlinkSync);
      resolve(certs);
    });
  });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
      createKeys: createKeys,
      createCA: createCA,
      createTemplate: createTemplate,
      createHostCert: createHostCert,
      createClientCert: createClientCert,
      createPKCS12: createPKCS12,
      deleteCert: deleteCert,
      deleteCred: deleteCred,
      deleteTemplate: deleteTemplate,
      deleteKeyFiles: deleteKeyFiles,
      deleteCertFiles: deleteCertFiles,
      getCredential: getCredential,
      getHostCert: getHostCert,
      getTemplate: getTemplate
  };
}
