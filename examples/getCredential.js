var certAuth = require('../mlCertAuth');

var optsGetCredential = {
  "credentialID": "acme-corp"
};

certAuth.getCredential(optsGetCredential)
  .then(function (result) {
    console.log(result);
  })
  .catch(function (err) {
    console.log(JSON.stringify(err, null, 2));
  });


