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
openssl genrsa -out $1.key 4096
#generate webapp CSR
openssl req -new -sha256 -key $1.key -subj "/C=FR/ST=P/O=IDF/CN=$1" -out $1.csr
#sign webapp CSR to get webapp certificate
openssl x509 -req -in $1.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out $1.crt -days 4000 -sha256 -extfile <(printf
"$extFile")
#Verify signature and webapp certificate 
openssl verify -verbose -CAfile rootCA.crt $1.crt