git clone https://github.com/McLan/Hashicorp-Vault-secrets-unwrapping-webapp.git
cd Hashicorp-Vault-secrets-unwrapping-webapp

Installation :
$ npm install

Generate certificates :
$ cd certs
$ chmod +x certgen.sh
$ ./certgen.sh <hostname>

Test vault-nodeApp connection :
$ docker run --cap-add=IPC_LOCK -e 'VAULT_DEV_ROOT_TOKEN_ID=myroot' -e 'VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200' vault
Retrieve Container ID with :
$ docker ps
Get vault container's IP address
$ docker exec -it <ContainerID> ip a

Modify container IP in server.js file at lign 27 :
    var url = 'https://<IP>:8200/v1/sys/wrapping/unwrap';

Wrap data :
curl -v -k --header "X-VAULT-TOKEN: myroot" -X POST --header "X-Vault-Wrap-TTL: 60m" --data '{"test":"password"}' http://<IP>:8200/v1/sys/wrapping/wrap

run node app :
node server.js

Browse on one of this urls and enter your token :
https://127.0.0.1:3000
https://<hostname>:3000
https://<IP>:3000
