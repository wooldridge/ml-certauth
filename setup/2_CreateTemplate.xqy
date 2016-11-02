(: Create a Certificate Template :)

xquery version "1.0-ml";

import module "http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
import module namespace pki = "http://marklogic.com/xdmp/pki" at "/MarkLogic/pki.xqy";

declare namespace x509 = "http://marklogic.com/xdmp/x509";

pki:insert-template(
  pki:create-template(
  "cred-template", "testing secure credentials",
  (), (),
  <req xmlns="http://marklogic.com/xdmp/x509">
    <version>0</version>
    <subject>
    <countryName>US</countryName>
    <stateOrProvinceName>CA</stateOrProvinceName>
    <localityName>San Carlos</localityName>
    <organizationName>Acme Corp</organizationName>
    </subject>
    <v3ext>
    <nsCertType critical="false">SSL Server</nsCertType>
    <subjectKeyIdentifier critical="false">{pki:integer-to-hex(xdmp:random())}</subjectKeyIdentifier>
    </v3ext>
  </req>))

