var fs = require('fs'),
    https = require('https'),
    config = require('./config');

var options = {
    hostname: config.host,
    port: config.database.port,
    path: '/v1/documents?uri=/doc.json',
    method: 'GET',
    ca: fs.readFileSync('ca.cer')
};
// Non-cert auth with cert
options.auth        = 'admin:admin'
// Cert auth with cert
// options.pfx         = fs.readFileSync('portaltest.pfx');
// options.passphrase  = 'p';

var req = https.request(options, function(res) {
    res.on('data', function(data) {
        process.stdout.write(data);
    });
});
req.end();
