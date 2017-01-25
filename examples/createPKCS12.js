var certAuth = require('../mlCertAuth');

var optsPKCS12 = {
  "passphrase": "p",
  "cert": "client.crt",
  "privkey": "clientpriv.pem",
  "pfx": "clienttest.pfx"
};

certAuth.createPKCS12(optsPKCS12)
  .then(function (result) {
    console.log('PKCS12 created');
  })
  .catch(function (err) {
    console.log(err);
  });
