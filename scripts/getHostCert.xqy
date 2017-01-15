xquery version "1.0-ml";
import module namespace pki = "http://marklogic.com/xdmp/pki"
  at "/MarkLogic/pki.xqy";
declare namespace x509=  "http://marklogic.com/xdmp/x509";

declare variable $templateID as xs:string external;
declare variable $commonName as xs:string external;

let $tid := pki:template-get-id(pki:get-template-by-name($templateID))

return pki:get-certificate($tid, $commonName, (), ())
