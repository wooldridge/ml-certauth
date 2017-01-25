var config = require('./config'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    glob = require('glob'),
    xml2js = require('xml2js'),
    sanitize = require("sanitize-filename"),
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

/**
 * Create a certificate authority (CA) and associated security credential
 * @param {Object} options Config options
 * @param {string} options.countryName:         "US"
 * @param {string} options.stateOrProvinceName: "CA"
 * @param {string} options.localityName:        "San Carlos"
 * @param {string} options.organizationName:    "Acme Corp"
 * @param {string} options.commonName:          "Acme Corp CA"
 * @param {string} options.notAfter:            "P365D"
 * @param {string} options.credentialID:        "acme-corp"
 * @param {string} options.credDesc:            "Acme Certificate Authority"
 * @return {Promise}
 */
function createCA(options) {
  // Save to current directory by default
  if (!options.path) {
    options.path = __dirname + "/";
  }
  var script = getScript('createCA.xqy');
  return xqueryEval(script, options);
}

/**
 * Create a certificate template
 * @param {Object} options Config options
 * @param {string} options.templateName:        "acme-template"
 * @param {string} options.description:         "Acme secure credentials"
 * @param {string} options.countryName:         "US"
 * @param {string} options.stateOrProvinceName: "California"
 * @param {string} options.localityName:        "San Carlos"
 * @param {string} options.organizationName:    "Acme Corp"
 * @return {Promise}
 */
function createTemplate(options) {
  var script = getScript('createTemplate.xqy');
  return xqueryEval(script, options);
}

/**
 * Create a signed host certificate based on security credential of CA
 * @param {Object} options Config options
 * @param {string} options.templateName: "acme-template"
 * @param {string} options.hostName:     "example.org"
 * @param {string} options.credentialID: "acme-corp"
 * @param {string} options.notAfter:     "P365D"
 * @return {Promise}
 */
function createHostCert(options) {
  var script = getScript('createHostCert.xqy');
  return xqueryEval(script, options);
}

/**
 * Create a signed client certificate based on security credential of CA
 * @param {Object} options Config options
 * @param {string} options.countryName:  "US"
 * @param {string} options.organizationName:  "Acme Corp"
 * @param {string} options.commonName:   "someuser"
 * @param {string} options.credentialID: "acme-corp"
 * @param {string} options.notAfter:     "P365D"
 * @return {Promise}
 */
function createClientCert(options) {
  // Save to current directory by default
  if (!options.path) {
    options.path = __dirname + "/";
  }
  var script = getScript('createClientCert.xqy');
  return xqueryEval(script, options);
}

/**
 * Create a PKCS12 file with client certificate and private key and
 * protected by a passphrase
 * @param {Object} options Config options
 * @param {string} options.cert:       "client.crt"
 * @param {string} options.privkey:    "clientpriv.pem"
 * @param {string} options.pfx:        "clienttest.pfx"
 * @param {string} options.passphrase: "s3cr3t"
 * @return {Promise}
 */
function createPKCS12(options) {
  // Save to current directory by default
  if (!options.path) {
    options.path = __dirname + "/";
  }
  var cmdOpts = [ 'pkcs12', '-export',
    '-in',    options.path + 'certs/' + sanitize(options.cert),
    '-inkey', options.path + 'keys/'  + sanitize(options.privkey),
    '-out',   options.path + 'certs/' + sanitize(options.pfx)
  ];
  if (options.passphrase) {
    cmdOpts = cmdOpts.concat(['-passout', 'pass:' + options.passphrase]);
  }
  return new Promise(function (resolve, reject) {
    var openssl = spawn( 'openssl', cmdOpts);
    openssl.on( 'error', error => {
      reject(new Error(error.message));
    });
    openssl.on( 'exit', code => {
      if (code !== 0) {
        reject(new Error(`child process exited with code ${code}`));
      } else {
        resolve(`child process exited with code ${code}`);
      }
    });
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
