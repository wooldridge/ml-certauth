var fs = require('fs'),
    https = require('https'),
    config = require('../config');

// authentication = 'certificate'
// require-client-certificate = true
var options1 = {
    hostname: config.host,
    port: config.database.port,
    path: '/v1/documents?uri=/doc.json',
    method: 'GET',
    ca: fs.readFileSync('../certs/ca.crt'),
    cert: fs.readFileSync('../certs/client.crt'),
    key:  fs.readFileSync('../keys/clientpriv.pem')
    // Alternative PKCS12 method
    // pfx: fs.readFileSync('certs/clienttest.pfx'),
    // passphrase: 'p'
};

// authentication != 'certificate'
// require-client-certificate = true
var options2 = {
    hostname: config.host,
    port: config.database.port,
    path: '/v1/documents?uri=/doc.json',
    method: 'GET',
    ca: fs.readFileSync('../certs/ca.crt'),
    auth: 'client:client'
};

var req = https.request(options1, function(res) {
    res.on('data', function(data) {
        process.stdout.write(data);
    });
});
req.end();
