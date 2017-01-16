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
let $tmp := xdmp:save(concat($path, 'keys/', $commonName, "priv.pem"), text{$privkey})
let $pubkey := $keys[2]
let $tmp := xdmp:save(concat($path, 'keys/', $commonName, "pub.pem"), text{$pubkey})
let $x509 :=
  <x509:cert xmlns:x509="http://marklogic.com/xdmp/x509">
    <x509:version>2</x509:version>
    <x509:serialNumber>
      {pki:integer-to-hex(xdmp:random())}
    </x509:serialNumber>
    <x509:validity>
      <x509:notBefore>{fn:current-dateTime()}</x509:notBefore>
      <x509:notAfter>
        {fn:current-dateTime() + xs:dayTimeDuration($notAfter)}
      </x509:notAfter>
    </x509:validity>
    <x509:subject>
      <x509:countryName>{$countryName}</x509:countryName>
      <x509:organizationName>{$organizationName}</x509:organizationName>
      <x509:commonName>{$commonName}</x509:commonName>
    </x509:subject>
    <x509:publicKey>{$pubkey}</x509:publicKey>
    <x509:v3ext>
      <x509:subjectKeyIdentifier critical="false">
        {pki:integer-to-hex(xdmp:random())}
      </x509:subjectKeyIdentifier>
    </x509:v3ext>
  </x509:cert>
(: Generate a PEM-encoded X.509 certificate :)
let $certificate :=
  xdmp:x509-certificate-generate($x509, (),
    <options xmlns="ssl:options">
      <credential-id>{xdmp:credential-id($credentialID)}</credential-id>
    </options>)
return
  xdmp:save(concat($path, 'certs/', $commonName, ".crt"), text{$certificate})
