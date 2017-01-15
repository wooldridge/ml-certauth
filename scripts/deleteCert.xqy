xquery version "1.0-ml";
import module namespace pki = "http://marklogic.com/xdmp/pki"
  at "/MarkLogic/pki.xqy";
declare namespace x509=  "http://marklogic.com/xdmp/x509";

declare variable $commonName as xs:string external;

let $cert-id := pki:get-certificates(pki:get-trusted-certificate-ids())
    [x509:cert/x509:subject/x509:commonName eq $commonName]
    /pki:certificate-id

return  pki:delete-certificate($cert-id)
