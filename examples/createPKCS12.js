var certAuth = require('../mlCertAuth');

var optsPKCS12 = {
  "cert": "client.crt",
  "privkey": "clientpriv.pem",
  "pfx": "clienttest.pfx"
};

certAuth.createPKCS12(optsPKCS12);
