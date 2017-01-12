(: Create a Certificate Authority :)

xquery version "1.0-ml";

import module "http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
import module namespace pki = "http://marklogic.com/xdmp/pki" at "/MarkLogic/pki.xqy";

declare namespace x509 = "http://marklogic.com/xdmp/x509";

declare variable $countryName as xs:string external;
declare variable $organizationName as xs:string external;
declare variable $commonName as xs:string external;
declare variable $notAfter as xs:string external;
declare variable $credName as xs:string external;
declare variable $credDesc as xs:string external;
declare variable $path as xs:string external;

let $keys := xdmp:rsa-generate()
let $privkey := $keys[1]
let $dum := xdmp:save(concat($path, "capriv.pkey"), text{$privkey})
let $pubkey := $keys[2]
let $dum := xdmp:save(concat($path, "capub.pkey"), text{$pubkey})
let $subject :=
  element x509:subject {
  element x509:countryName      {$countryName},
  element x509:organizationName {$organizationName},
  element x509:commonName       {$commonName}
  }
let $x509 :=
  element x509:cert {
    element x509:version {2},
    element x509:serialNumber {pki:integer-to-hex(xdmp:random())
  },
  element x509:issuer {$subject/*},
  element x509:validity {
    element x509:notBefore {fn:current-dateTime()},
    element x509:notAfter  {fn:current-dateTime() + xs:dayTimeDuration($notAfter)}
  },
  $subject,
  element x509:publicKey {$pubkey},
  element x509:v3ext {
    element x509:basicConstraints {
    attribute critical {"false"},
    "CA:TRUE"
    },
    element x509:keyUsage {
    attribute critical {"false"},
    "Certificate Sign, CRL Sign"
    },
    element x509:nsCertType {
    attribute critical {"false"},
    "SSL Server"
    },
    element x509:subjectKeyIdentifier {
    attribute critical {"false"},
    pki:integer-to-hex(xdmp:random())
    }
  }
}
let $certificate := xdmp:x509-certificate-generate($x509, $privkey)
let $dum := xdmp:save(concat($path, "ca.cer"), text{$certificate})
return
  ( sec:create-credential(
    $credName, $credDesc,
    (), (), $certificate, $privkey,
    fn:true(), (), xdmp:permission("admin", "read")),
  pki:insert-trusted-certificates($certificate)
  )
