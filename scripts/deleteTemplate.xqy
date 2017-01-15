xquery version "1.0-ml";
import module namespace pki = "http://marklogic.com/xdmp/pki"
  at "/MarkLogic/pki.xqy";

declare variable $templateID as xs:string external;

let $tid := pki:template-get-id(pki:get-template-by-name($templateID))

return pki:delete-template($tid)
