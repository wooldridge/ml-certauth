# ml-certauth

Node.js-based tools for certificate-based authentication in MarkLogic.

## Background

Information on using certificate authentication with Node.js:
https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2#.gxmla9cbi

Information on certificate authorities:
http://www.davidpashley.com/articles/becoming-a-x-509-certificate-authority/

Root certs included with Node.js:
https://github.com/nodejs/node/blob/master/src/node_root_certs.h

OpenSSL Cookbook:
https://www.feistyduck.com/books/openssl-cookbook/

Client and Server Side SSL with NodeJS:
https://vanjakom.wordpress.com/2011/08/11/client-and-server-side-ssl-with-nodejs/

MIT course video on SSL and HTTPS:
https://www.youtube.com/watch?v=S2iBR2ZlZf0


## Steps to test

1. Copy `config_sample.js` to `config.js` and edit for your environment (HOSTNAME, USER_PASSWORD, ML_USER, ML_PASSWORD). Create a REST server and database by running:

  `node setup.js`

2. In the `examples` directory, execute `createAll.js` to:

   - Create a certificate authority and associate security credential
   - Create a certificate template
   - Create a host certificate using the security credential and template
   - Create a client certificate using the security credential and template
   ```
   cd examples
   node createAll.js
   ```

3. In the `examples` directory, excute `createPKCS12.js` to create a .pfx file that packages the client certificate and private key and protects it with a passphrase.

   `node createPKCS12.js`

4. Turn on certificate authentication for the REST server. In the Admin UI (http://localhost:8001), click Config -> App Servers -> ml-certauth-rest:8565 and configure the following:
  ```
  authentication: certificate
  ssl certificate template: cred-template
  ssl require client certificate: true
  ```
  At the bottom, click Show, click "Acme Corp", and check the checkbox. Click OK to save.

5. In the `examples` directory,  run the following to retrieve a document from the certificate-protected server:

  `node clientML.js`

6. To delete the REST server and database, run the following:

  `node teardown.js`
