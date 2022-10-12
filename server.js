const express = require("express");
const https = require('https');
const request = require('request');
const fs = require('fs');
var bodyParser = require('body-parser');

app = express();

var key = fs.readFileSync(__dirname + '/certs/key.pem');
var cert = fs.readFileSync(__dirname + '/certs/cert.pem');
var options = {
  key: key,
  cert: cert
};

//app.listen(3000, () => {
//  console.log("Application started and Listening on port 3000");
//});

// server css as static
app.use(express.static(__dirname));
// get our app to use body parser
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  var myToken = req.body.token;
  var url = 'https://:6565/v1/sys/wrapping/unwrap';
  var headers = {'X-Vault-Token': myToken};
  request({ headers: headers, url: url, method: "POST" },
  function (e,r, body) {
    //console.log(body)
    var result = JSON.parse(body);
    if ('data' in result) {
      res.send(JSON.parse(body).data);
    } else {
      res.send("<p>Le token n'est plus valide, un attaquant l'a peut-être intercepté.</p><p>Veuillez signaler cet incident de sécurité (à l'adresse securite@fr.lactalis.com) en spécifiant le compte de service associé.</p><p>The token is no longer valid, an attacker may have intercepted it.</p><p>Please report this security incident by specifying the service account at the following address: securite@fr.lactalis.com</p>")
    }
  });
});

var server = https.createServer(options, app);
server.listen(3000, () => {
  console.log("server starting on port : " + 3000)
});