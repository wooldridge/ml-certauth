(: Create a Certificate Authority :)

xquery version "1.0-ml";

import module "http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
import module namespace pki = "http://marklogic.com/xdmp/pki" at "/MarkLogic/pki.xqy";

declare namespace x509 = "http://marklogic.com/xdmp/x509";

let $keys := xdmp:rsa-generate()
let $privkey := $keys[1]
let $dum := xdmp:save("capriv.pkey", text{$privkey})
let $pubkey := $keys[2]
let $dum := xdmp:save("capub.pkey", text{$pubkey})
let $subject :=
  element x509:subject {
  element x509:countryName      {"US"},
  element x509:organizationName {"Acme Corp"},
  element x509:commonName       {"Acme Corp CA"}
  }
let $x509 :=
  element x509:cert {
  element x509:version {2},
  element x509:serialNumber {pki:integer-to-hex(xdmp:random())},
  element x509:issuer {$subject/*},
  element x509:validity {
    element x509:notBefore {fn:current-dateTime()},
    element x509:notAfter  {fn:current-dateTime() + xs:dayTimeDuration("P365D")}
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
let $dum := xdmp:save("ca.cer", text{$certificate})
return
  ( sec:create-credential(
    "acme-corp", "Acme Certificate Authority",
    (), (), $certificate, $privkey,
    fn:true(), (), xdmp:permission("admin", "read")),
  pki:insert-trusted-certificates($certificate)
  )
