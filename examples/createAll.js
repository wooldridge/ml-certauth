var certAuth = require('../mlCertAuth');

var optsCA = {
  "countryName": "US",
  "stateOrProvinceName": "California",
  "localityName": "San Carlos",
  "organizationName": "Acme Corp",
  "commonName": "Acme Corp CA",
  "notAfter": "P365D",
  "credentialID": "acme-corp",
  "credDesc": "Acme Certificate Authority"
};

var optsTemplate = {
  "templateName": "acme-template",
  "description": "Acme secure credentials",
  "countryName": "US",
  "stateOrProvinceName": "California",
  "localityName": "San Carlos",
  "organizationName": "Acme Corp"
};

var optsHostCert = {
  "templateName": "acme-template",
  "hostName": "macpro-3170",
  "credentialID": "acme-corp",
  "notAfter": "P365D"
};

var optsClientCert = {
  "countryName": "US",
  "organizationName": "Acme Corp",
  "commonName": "client",
  "credentialID": "acme-corp",
  "notAfter": "P365D"
};

certAuth.createCA(optsCA)
  .then(function (result) {
    console.log('CA created');
    return certAuth.createTemplate(optsTemplate);
  })
  .then(function (result) {
    console.log('template created');
    return certAuth.createHostCert(optsHostCert);
  })
  .then(function (result) {
    console.log('host cert created');
    return certAuth.createClientCert(optsClientCert);
  })
  .then(function (result) {
    console.log('user cert created');
  })
  .catch(function (err) {
    console.log(JSON.stringify(err, null, 2));
  });


