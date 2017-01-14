(: Create a new Certificate Authority in MarkLogic :)

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

(: Create public and private key pair :)
let $keys := xdmp:rsa-generate()
let $privkey := $keys[1]
let $dum := xdmp:save(concat($path, "capriv.pkey"), text{$privkey})
let $pubkey := $keys[2]
let $dum := xdmp:save(concat($path, "capub.pkey"), text{$pubkey})
let $subject :=
  <x509:subject xmlns:x509="http://marklogic.com/xdmp/x509">
    <x509:countryName>{$countryName}</x509:countryName>
    <x509:organizationName>{$organizationName}</x509:organizationName>
    <x509:commonName>{$commonName}</x509:commonName>
  </x509:subject>
(: Create XML representation of a X.509 certificate :)
let $x509 :=
  <x509:cert xmlns:x509="http://marklogic.com/xdmp/x509">
    <x509:version>2</x509:version>
    <x509:serialNumber>{pki:integer-to-hex(xdmp:random())}</x509:serialNumber>
    <x509:issuer>
      {$subject/*}
    </x509:issuer>
    <x509:validity>
      <x509:notBefore>{fn:current-dateTime()}</x509:notBefore>
      <x509:notAfter>{fn:current-dateTime() + xs:dayTimeDuration($notAfter)}</x509:notAfter>
    </x509:validity>
    {$subject}
    <x509:publicKey>{$pubkey}</x509:publicKey>
    <x509:v3ext>
      <x509:basicConstraints critical="false">CA:TRUE</x509:basicConstraints>
      <x509:keyUsage critical="false">Certificate Sign, CRL Sign</x509:keyUsage>
      <x509:nsCertType critical="false">SSL Server</x509:nsCertType>
      <x509:subjectKeyIdentifier critical="false">{pki:integer-to-hex(xdmp:random())}</x509:subjectKeyIdentifier>
    </x509:v3ext>
  </x509:cert>
(: Generate a PEM-encoded X.509 certificate :)
let $certificate := xdmp:x509-certificate-generate($x509, $privkey)
let $dum := xdmp:save(concat($path, "ca.cer"), text{$certificate})
return
  (
  (: Create new security credential :)
  sec:create-credential(
    $credName, $credDesc,
    (), (), $certificate, $privkey,
    fn:true(), (), xdmp:permission("admin", "read")),
  (: Insert certificate for new Certificate Authority :)
  pki:insert-trusted-certificates($certificate)
  )
