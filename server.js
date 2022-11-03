const express = require("express");
const https = require('https');
const request = require('request');
const fs = require('fs');
var bodyParser = require('body-parser');
const path = require("path");
//Uncomment these ligns to communicate in HTTPS with vault, and add the full CA certificates (intermediate until root) in the /certs/ folder when running the container (-v).
//require('ssl-root-cas/latest')
//    .inject()
//    .addFile(__dirname + '/certs/fullCACertchain.crt');

//Uncomment these ligns to communicate in HTTPS with vault, and add the full CA certificates (intermediate until root) in the /certs/ folder when running the container (-v).
//require('ssl-root-cas/latest')
//    .inject()
//    .addFile(__dirname + '/certs/fullCACertchain.crt');


app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/public/html"));

var key = fs.readFileSync(__dirname + '/certs/key.pem');
var cert = fs.readFileSync(__dirname + '/certs/cert.pem');
var options = {
    key: key,
    cert: cert
};

// server css as static
app.use(express.static(__dirname));
// get our app to use body parser
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    var myToken = req.query.token;
    //check if token is null
    if (myToken == '' || myToken == null ) {
        res.sendFile(__dirname + "/public/html/getPassword.html");}
    else {
        var url = 'http://172.17.0.3:8200/v1/sys/wrapping/unwrap';
        var headers = {'X-Vault-Token': myToken};
        //send unwrapping POST request to Vault API
        request({ headers: headers, url: url, method: "POST" },
        function (e,r, body) {
            //Uncomment next line to debug
            //console.log(e,r,body)
            var result = JSON.parse(body);
	            if ('data' in result) {
                 var pass = JSON.parse(body).data
                 //console.log(pass);
                 res.render("test", { message: pass.password });
            } else {
                 res.sendFile(__dirname + "/public/html/errors.html");}
        });
     }
});

app.post("/", (req, res) => {
    var myToken = req.body.token;
    //check if token is null
    if (myToken == '' || myToken == null ) {
        res.sendFile(__dirname + "/public/html/getPassword.html");}
    else {
        var url = 'http://172.17.0.3:8200/v1/sys/wrapping/unwrap';
        var headers = {'X-Vault-Token': myToken};
        //send unwrapping POST request to Vault API
        request({ headers: headers, url: url, method: "POST" },
        function (e,r, body) {
            //Uncomment next line to debug
            //console.log(e,r,body)
            var result = JSON.parse(body);
            if ('data' in result) {
                 var pass = JSON.parse(body).data
                //console.log(pass);
                res.render("test", { message: pass.password});
            }
            else {
                res.sendFile(__dirname + "/public/html/errors.html");}
        });
    }
});

var server = https.createServer(options, app);
server.listen(3000, () => {
    console.log("server starting on port : " + 3000 + ". Browse on https://127.0.0.1:3000")
});
