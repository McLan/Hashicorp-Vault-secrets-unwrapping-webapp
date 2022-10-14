git clone https://github.com/McLan/Hashicorp-Vault-secrets-unwrapping-webapp.git
cd Hashicorp-Vault-secrets-unwrapping-webapp

Installation 
$ npm install

Generate certificates :
$ cd certs
$ chmod +x certgen.sh
$ ./certgen.sh <hostname>

Browse on one of this urls accepting the certificate :
https://127.0.0.1:3000
https://<hostname>:3000
https://<IP>:3000