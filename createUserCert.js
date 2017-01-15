var config = require('../config'),
    spawn = require( 'child_process' ).spawn,
    openssl = spawn( 'openssl',
      [ 'pkcs12', '-export', '-in', config.mlpath + 'portal.cer', '-inkey',
      config.mlpath + 'portalpriv.pkey', '-out', 'portaltest.pfx' ] );

openssl.stdout.on( 'data', data => {
    console.log( `stdout: ${data}` );
});

openssl.stderr.on( 'data', data => {
    console.log( `stderr: ${data}` );
});

openssl.on( 'close', code => {
    console.log( `child process exited with code ${code}` );
});
