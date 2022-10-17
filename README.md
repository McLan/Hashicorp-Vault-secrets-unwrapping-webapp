## Download
```
git clone https://github.com/McLan/Hashicorp-Vault-secrets-unwrapping-webapp.git
cd Hashicorp-Vault-secrets-unwrapping-webapp
```

## Installation :
```
npm install
```

## Generate certificates :
```
cd certs
chmod +x certgen.sh
./certgen.sh <hostname>
cd ..
```

## Run vault in container :
```
docker run --cap-add=IPC_LOCK -e 'VAULT_DEV_ROOT_TOKEN_ID=myroot' -e 'VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200' vault
In another terminal, retrieve Container IP with :
```
## Open another terminal and change vault's IP address in servers.js :
```
sed "s/172.17.0.3/$(docker exec -it $(docker ps | grep "vault" | awk '{print $1}') ifconfig eth0 | grep "inet " | awk -F'[: ]+' '{ print $4 }')/g" server.js
```

## Wrap data with vault :
```
curl -v -k --header "X-VAULT-TOKEN: myroot" -X POST --header "X-Vault-Wrap-TTL: 60m" --data '{"test":"password"}' http://172.17.0.2:8200/v1/sys/wrapping/wrap
```

## Run node app :
```
node server.js
```

## Browse on one of this urls and enter your token :
* https://127.0.0.1:3000
* https://hostname:3000
* https://IP:3000

![result schema](./images/result.jpg)


## Only Docker 
docker pull lanboy/vault-webapp-repo

docker run -p 49160:3000 -d lanboy/vault-webapp-repo
docker run -d lanboy/vault-webapp-repo

docker run --cap-add=IPC_LOCK -e 'VAULT_DEV_ROOT_TOKEN_ID=myroot' -e 'VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200' vault
