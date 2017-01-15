var certAuth = require('./mlCertAuth');

// var promise = certAuth.createKeys();

// promise.then(function (result) {
//   console.log('private key: ' + result[0].value);
//   console.log('public key: ' + result[1].value);
// })

var options_createCA = {
  "countryName": "US",
  "organizationName": "Acme Corp",
  "commonName": "Acme Corp CA",
  "notAfter": "P365D",
  "credName": "acme-corp",
  "credDesc": "Acme Certificate Authority"
};

var options_createTemplate = {
  "templateName": "cred-template",
  "description": "testing secure credentials",
  "countryName": "US",
  "stateOrProvinceName": "CA",
  "localityName": "San Carlos",
  "organizationName": "Acme Corp"
};

var options_createServerCert = {
  "templateName": "cred-template",
  "credentialID": "acme-corp",
  "notAfter": "P365D"
};

var options_createUserCert = {
  "countryName": "US",
  "organizationName": "Acme Corp",
  "commonName": "portal",
  "credentialID": "acme-corp",
  "notAfter": "P365D"
};

var options_createUserPKCS12 = {
  "cert": "portal.cer",
  "privkey": "portalpriv.pkey",
  "pfx": "portaltest.pfx"
};

certAuth.createCA(options_createCA)
  .then(function (result) {
    console.log('CA created');
    return certAuth.createTemplate(options_createTemplate);
  })
  .then(function (result) {
    console.log('template created');
    return certAuth.createServerCert(options_createServerCert);
  })
  .then(function (result) {
    console.log('server cert created');
    return certAuth.createUserCert(options_createUserCert);
  })
  .then(function (result) {
    console.log('user cert created');
    return certAuth.createUserPKCS12(options_createUserPKCS12);
  })
  .catch(function (err) {
    console.log(JSON.stringify(err, null, 2));
  });


