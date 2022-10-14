#!/bin/bash
#./certgen.sh <hostname>

function gen_extfile()
{
domain=$1
cat << EOF
authorityKeyIdentifier=keyid,issuer\n
basicConstraints=CA:FALSE\n
keyUsage=digitalSignature,nonRepudiation,keyEncipherment,dataEncipherment\n
subjectAltName = @alt_names\n
[alt_names]\n
DNS.1 = $domain
EOF
}
extFile=$(gen_extfile $1)

#generate root CA key
openssl genrsa -out rootCA.key 4096
#generate root CA certificate
openssl req -new -x509 -nodes -sha256 -key rootCA.key -out rootCA.crt -days 1095
#generate webapp key
openssl genrsa -out key.pem 4096
#generate webapp CSR
openssl req -new -sha256 -key key.pem -subj "/C=FR/ST=P/O=IDF/CN=$1" -out cert.csr
#sign webapp CSR to get webapp certificate
openssl x509 -req -in cert.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out cert.pem -days 4000 -sha256 -extfile <(printf
"$extFile")
#Verify signature and webapp certificate 
openssl verify -verbose -CAfile rootCA.crt cert.pem