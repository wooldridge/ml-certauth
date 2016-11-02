# ml-certauth

## Background

Information on using certificate authentication with Node.js:

https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2#.gxmla9cbi

Information on certificate authorities:

http://www.davidpashley.com/articles/becoming-a-x-509-certificate-authority/

## Steps

1. Import `CertAuthWorkspace.xml` into QConsole and run the scripts against the Security database to generate a certificate authority, certificates, and keys.

  This configures MarkLogic for certificate authentication. Certificates, private keys, and public keys are saved in the root directory of Marklogic (e.g., on a Mac, ~/Library/MarkLogic) and in the Security database.

2. Create a user named `portal` with a password `p` and appropriate privileges (e.g. `rest-reader`).

3. Generate a PKCS12 file from the private key and certificate of the user using openssl from the root directory:

  `openssl pkcs12 -export -in portal.cer -inkey portalpriv.pkey -out portaltest.pfx`

  A `portaltest.pfx` file is saved in the root directory. This packages both the user certificate and private key as a single file.

4. Copy the following files to the `ml-certauth` root folder:
  ```
  `ca.cer`
  `portaltest.pfx`
  ```
5. Copy `config_sample.js` to `config.js` and edit for your environment (/PATH/TO/MARKLOGIC/, HOSTNAME, ML_USER, ML_PASSWORD). Create a REST server and database by running:

  `node setup.js`

6. Turn on certificate authentication for the REST server. In the Admin UI (http://localhost:8001), click Config -> App Servers -> ml-certauth-rest:8565 and configure the following:
  ```
  authentication: certificate
  ssl certificate template: cred-template
  ssl require client certificate: true
  ```
  At the bottom, click Show and check the `Acme Corp` checkbox. Click OK to save.

7. Run the following to retrieve a document from the certificate-protected server:

  `node clientML.js`

8. To delete the REST server and database, run the following:

  `node teardown.js`
