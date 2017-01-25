var certAuth = require('../mlCertAuth');

var optsGetHostCert = {
  "templateName": "acme-template",
  "commonName": "macpro-3170"
};

certAuth.getHostCert(optsGetHostCert)
  .then(function (result) {
    console.log(result);
  })
  .catch(function (err) {
    console.log(JSON.stringify(err, null, 2));
  });


