var certAuth = require('../mlCertAuth');

var optsGetTemplate = {
  "templateName": "acme-template"
};

certAuth.getTemplate(optsGetTemplate)
  .then(function (result) {
    console.log(result);
  })
  .catch(function (err) {
    console.log(JSON.stringify(err, null, 2));
  });


