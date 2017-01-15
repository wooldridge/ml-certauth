(: Create a Host Template signed by the Certificate Authority :)

xquery version "1.0-ml";

import module "http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";

import module namespace pki = "http://marklogic.com/xdmp/pki" at "/MarkLogic/pki.xqy";
declare namespace x509 = "http://marklogic.com/xdmp/x509";

declare variable $templateID as xs:string external;
declare variable $hostName as xs:string external;
declare variable $credentialID as xs:string external;
declare variable $notAfter as xs:string external;

let $csr-pem :=
  xdmp:invoke-function(
  function() {
    (: Create a PEM-encoded X.509 certificate request from a template :)
    pki:generate-certificate-request(
    pki:get-template-by-name($templateID)/pki:template-id,
    $hostName, (), ())
  },
  <options xmlns="xdmp:eval">
    <transaction-mode>update-auto-commit</transaction-mode>
    <isolation>different-transaction</isolation>
  </options>)
(: Get the XML representation of the certificate request :)
let $csr-xml := xdmp:x509-request-extract($csr-pem)
let $ca-xml :=
  (: Get the XML representation of a security credential :)
  xdmp:x509-certificate-extract(
  xdmp:credential(xdmp:credential-id($credentialID))
    /sec:credential-certificate)
(: Create an XML representation of the certificate :)
let $cert-xml :=
  <cert xmlns="http://marklogic.com/xdmp/x509">
  <version>2</version>
  <serialNumber>{pki:integer-to-hex(xdmp:random())}</serialNumber>
  {$ca-xml/x509:issuer}
  <validity>
    <notBefore>{fn:current-dateTime()}</notBefore>
    <notAfter>{fn:current-dateTime() + xs:dayTimeDuration($notAfter)}</notAfter>
  </validity>
  {$csr-xml/x509:subject}
  {$csr-xml/x509:publicKey}
  {$csr-xml/x509:v3ext}
  </cert>
let $tmp := xdmp:log($cert-xml)
(: Create a PEM-encoded X.509 certificate using the security credential's private key :)
let $cert-pem :=
  xdmp:x509-certificate-generate(
  $cert-xml, (),
  <options xmlns="ssl:options">
    <credential-id>{xdmp:credential-id($credentialID)}</credential-id>
  </options>)
return
  (: Insert the signed certificate into the database :)
  xdmp:invoke-function(
  function() {
    pki:insert-signed-certificates($cert-pem)
  },
  <options xmlns="xdmp:eval">
    <transaction-mode>update-auto-commit</transaction-mode>
    <isolation>different-transaction</isolation>
  </options>)

