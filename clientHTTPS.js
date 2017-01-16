var fs = require('fs'),
    https = require('https'),
    config = require('./config');

// authentication = 'certificate'
// require-client-certificate = true
var options = {
    hostname: config.host,
    port: config.database.port,
    path: '/v1/documents?uri=/doc.json',
    method: 'GET',
    ca: fs.readFileSync('certs/ca.crt'),
    cert: fs.readFileSync('certs/portal.crt'),
    key:  fs.readFileSync('keys/portalpriv.pem')
    // pfx: fs.readFileSync('certs/portaltest.pfx'),
    // passphrase: 'p'
};

// authentication != 'certificate'
// require-client-certificate = true
// var options = {
//     hostname: config.host,
//     port: config.database.port,
//     path: '/v1/documents?uri=/doc.json',
//     method: 'GET',
//     ca: fs.readFileSync('certs/ca.crt'),
//     auth: 'portal:p'
// };
// Non-cert auth with cert
// options.auth        = 'portal:p'
// Cert auth with cert
// options.pfx         = fs.readFileSync('certs/portaltest.pfx');
// options.passphrase  = 'p';

var req = https.request(options, function(res) {
    res.on('data', function(data) {
        process.stdout.write(data);
    });
});
req.end();
