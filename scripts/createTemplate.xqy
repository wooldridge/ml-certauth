(: Create a certificate request template :)

xquery version "1.0-ml";

import module "http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
import module namespace pki = "http://marklogic.com/xdmp/pki" at "/MarkLogic/pki.xqy";

declare namespace x509 = "http://marklogic.com/xdmp/x509";

declare variable $templateID as xs:string external;
declare variable $description as xs:string external;
declare variable $countryName as xs:string external;
declare variable $stateOrProvinceName as xs:string external;
declare variable $localityName as xs:string external;
declare variable $organizationName as xs:string external;

(: Create and insert a X.509 certificate request template :)
pki:insert-template(
  pki:create-template(
  $templateID, $description,
  (), (),
  <req xmlns="http://marklogic.com/xdmp/x509">
    <version>0</version>
    <subject>
    <countryName>{$countryName}</countryName>
    <stateOrProvinceName>{$stateOrProvinceName}</stateOrProvinceName>
    <localityName>{$localityName}</localityName>
    <organizationName>{$organizationName}</organizationName>
    </subject>
    <v3ext>
    <nsCertType critical="false">SSL Server</nsCertType>
    <subjectKeyIdentifier critical="false">{pki:integer-to-hex(xdmp:random())}</subjectKeyIdentifier>
    </v3ext>
  </req>))

