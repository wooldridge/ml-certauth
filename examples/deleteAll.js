var certAuth = require('../mlCertAuth');

var optsDeleteCert = {
  "commonName": "Acme Corp CA"
};

var optsDeleteCred = {
  "credentialID": "acme-corp"
}

var optsDeleteTemplate = {
  "templateName": "acme-template"
}

var optsDeleteSignedCert = {
  "commonName": "macpro-3170"
}

certAuth.deleteCert(optsDeleteCert)
  .then(function (result) {
    console.log('certificate deleted');
    return certAuth.deleteCred(optsDeleteCred);
  })
  .then(function (result) {
    console.log('credential deleted');
    return certAuth.deleteTemplate(optsDeleteTemplate);
  })
  .then(function (result) {
    console.log('template deleted');
    return certAuth.deleteCert(optsDeleteSignedCert);
  })
  .then(function (result) {
    console.log('signed certificate deleted');
    return certAuth.deleteKeyFiles();
  })
  .then(function (result) {
    console.log('key files deleted');
    return certAuth.deleteCertFiles();
  })
  .then(function (result) {
    console.log('cert files deleted');
  })
  .catch(function (err) {
    console.log(JSON.stringify(err, null, 2));
  });
