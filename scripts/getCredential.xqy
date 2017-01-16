xquery version "1.0-ml";
import module namespace sec = "http://marklogic.com/xdmp/security"
  at "/MarkLogic/security.xqy";

declare variable $credentialID as xs:string external;

sec:get-credential($credentialID)
