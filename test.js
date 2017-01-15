var certAuth = require('./mlCertAuth');

// var promise = certAuth.createKeys();

// promise.then(function (result) {
//   console.log('private key: ' + result[0].value);
//   console.log('public key: ' + result[1].value);
// })

var optsCreateCA = {
  "countryName": "US",
  "stateOrProvinceName": "CA",
  "localityName": "San Carlos",
  "organizationName": "Acme Corp",
  "commonName": "Acme Corp CA",
  "notAfter": "P365D",
  "credentialID": "acme-corp",
  "credDesc": "Acme Certificate Authority"
};

var optsCreateTemplate = {
  "templateID": "acme-template",
  "description": "Acme secure credentials",
  "countryName": "US",
  "stateOrProvinceName": "CA",
  "localityName": "San Carlos",
  "organizationName": "Acme Corp"
};

var optsCreateHostCert = {
  "templateID": "acme-template",
  "hostName": "macpro-3170",
  "credentialID": "acme-corp",
  "notAfter": "P365D"
};

var optsCreateUserCert = {
  "countryName": "US",
  "organizationName": "Acme Corp",
  "commonName": "portal",
  "credentialID": "acme-corp",
  "notAfter": "P365D"
};

var optsCreateUserPKCS12 = {
  "cert": "portal.crt",
  "privkey": "portalpriv.pem",
  "pfx": "portaltest.pfx"
};

certAuth.createCA(optsCreateCA)
  .then(function (result) {
    console.log('CA created');
    return certAuth.createTemplate(optsCreateTemplate);
  })
  .then(function (result) {
    console.log('template created');
    return certAuth.createHostCert(optsCreateHostCert);
  })
  .then(function (result) {
    console.log('host cert created');
    return certAuth.createUserCert(optsCreateUserCert);
  })
  .then(function (result) {
    console.log('user cert created');
    return certAuth.createUserPKCS12(optsCreateUserPKCS12);
  })
  .then(function (result) {
    console.log('pkcs12 file created');
  })
  .catch(function (err) {
    console.log(JSON.stringify(err, null, 2));
  });


