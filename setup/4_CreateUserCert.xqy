(: Create a User Certificate by specifying the common name :)

xquery version "1.0-ml";
import module namespace pki = "http://marklogic.com/xdmp/pki" at "/MarkLogic/pki.xqy";
declare namespace x509 = "http://marklogic.com/xdmp/x509";

declare variable $countryName as xs:string external;
declare variable $organizationName as xs:string external;
declare variable $commonName as xs:string external;
declare variable $credentialID as xs:string external;
declare variable $notAfter as xs:string external;
declare variable $path as xs:string external;

(: Create public and private key pair :)
let $keys := xdmp:rsa-generate()
let $privkey := $keys[1]
let $dum := xdmp:save(concat($path, $commonName, "priv.pkey"), text{$privkey})
let $pubkey := $keys[2]
let $dum := xdmp:save(concat($path, $commonName, "pub.pkey"), text{$pubkey})
let $subject :=
  element x509:subject {
    element x509:countryName      {$countryName},
    element x509:organizationName {$organizationName},
    element x509:commonName       {$commonName}
  }
let $validity :=
  element x509:validity {
    element x509:notBefore {fn:current-dateTime()},
    element x509:notAfter  {fn:current-dateTime() + xs:dayTimeDuration($notAfter)}
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
(: Generate a PEM-encoded X.509 certificate :)
let $certificate :=
  xdmp:x509-certificate-generate($x509, (),
    <options xmlns="ssl:options">
      <credential-id>{xdmp:credential-id($credentialID)}</credential-id>
    </options>)
return
  xdmp:save(concat($path, $commonName, ".cer"), text{$certificate})
