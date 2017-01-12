(: Create a User Certificate by specifying the common name :)
(: Here the common name is 'portal' :)

xquery version "1.0-ml";
import module namespace sec = "http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
import module namespace pki = "http://marklogic.com/xdmp/pki" at "/MarkLogic/pki.xqy";
declare namespace x509 = "http://marklogic.com/xdmp/x509";

declare variable $countryName as xs:string external;
declare variable $organizationName as xs:string external;
declare variable $commonName as xs:string external;
declare variable $credentialID as xs:string external;
declare variable $notAfter as xs:string external;
declare variable $path as xs:string external;

declare function local:create-credential(
  $sec-cred-name as xs:string,
  $username as xs:string,
  $password as xs:string,
  $common-name as xs:string,
  $validity as element(x509:validity)?,
  $auth-types as xs:string*
)
{
  let $keys := xdmp:rsa-generate()
  let $privkey := $keys[1]
  let $dum := xdmp:save(concat($path, $common-name, "priv.pkey"), text{$privkey})
  let $pubkey := $keys[2]
  let $dum := xdmp:save(concat($path, $common-name, "pub.pkey"), text{$pubkey})
  let $subject :=
    element x509:subject {
      element x509:countryName      {$countryName},
      element x509:organizationName {$organizationName},
      element x509:commonName       {$common-name}
    }
  let $x509 :=
    element x509:cert {
      element x509:version {2},
      element x509:serialNumber {pki:integer-to-hex(xdmp:random())},
      $validity,
      $subject,
      element x509:publicKey {$pubkey},
      element x509:v3ext {
        element x509:subjectKeyIdentifier {
          attribute critical {"false"},
          pki:integer-to-hex(xdmp:random())
        }
      }
    }
  let $certificate :=
    xdmp:x509-certificate-generate($x509, (),
      <options xmlns="ssl:options">
        <credential-id>{xdmp:credential-id($credentialID)}</credential-id>
      </options>)
  return
    xdmp:save(concat($path, $common-name, ".cer"), text{$certificate})
};

local:create-credential(
  "only-certificate", "", "", $commonName,
  element x509:validity {
  element x509:notBefore {fn:current-dateTime()},
  element x509:notAfter  {fn:current-dateTime() + xs:dayTimeDuration($notAfter)}
  },
  ("digest", "basic")
)
