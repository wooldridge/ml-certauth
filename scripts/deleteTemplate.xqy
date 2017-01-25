xquery version "1.0-ml";
import module namespace pki = "http://marklogic.com/xdmp/pki"
  at "/MarkLogic/pki.xqy";

declare variable $templateName as xs:string external;

let $tid := pki:template-get-id(pki:get-template-by-name($templateName))

return pki:delete-template($tid)
