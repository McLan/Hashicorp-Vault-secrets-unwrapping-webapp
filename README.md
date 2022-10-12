Installation 

npm init

npm install express requests https body-parser request


Import vault certificate :
export NODE_EXTRA_CA_CERTS="/home/$USER/fullchain.pem"

Generate certificates 
openssl genrsa -out rootCA.key 4096
openssl req -new -x509 -nodes -sha256 -key rootCA.key -out rootCA.crt -days 1095

echo "
#!/bin/bash
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
openssl genrsa -out $1.key 4096
openssl req -new -sha256 -key $1.key -subj "/C=CA/ST=QC/O=Home/CN=$1" -out $1.csr
openssl x509 -req -in $1.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out $1.crt -days 4000 -sha256 -extfile <(printf
"$extFile")
openssl verify -verbose -CAfile rootCA.crt $1.crt" > certgen.sh

chmod +x certgen.sh

./certgen.sh <domain name or IP>
