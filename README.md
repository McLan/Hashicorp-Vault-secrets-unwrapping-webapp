git clone https://github.com/McLan/Hashicorp-Vault-secrets-unwrapping-webapp.git
cd Hashicorp-Vault-secrets-unwrapping-webapp

Installation 
$ npm install

Import vault certificate :
$ export NODE_EXTRA_CA_CERTS="/home/$USER/fullchain.pem"

Generate certificates :
$ chmod +x certgen.sh
$ ./certgen.sh <hostname>
