var config = require('../config'),
    spawn = require( 'child_process' ).spawn,
    cp = spawn( 'cp',
      [ config.mlpath + 'ca.cer', config.path ] );

// cp /home/usr/dir/{file1,file2,file3,file4} /home/usr/destination/

cp.stdout.on( 'data', data => {
    console.log( `stdout: ${data}` );
});

cp.stderr.on( 'data', data => {
    console.log( `stderr: ${data}` );
});

cp.on( 'close', code => {
    console.log( `child process exited with code ${code}` );
});
