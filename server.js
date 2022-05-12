const express = require('express');
const app = express();
const path = require('path');
//const pg = require('pg');
//const fs = require('fs');
//const fetch = require('node-fetch');

//If there is an api key that is needed the template for the packet requests is below
//as well as the path to the api key
//const api_key = fs.readFileSync('apikey.txt').toString('utf8');
//const packet = {
//  method: "GET",
//  headers: {
//    "Content-Type": "application/json",
//    'Authorization': ("Bearer " + api_key)
//  }
//};

/* API URL CONSTANTS */
//const apiURL = "enter URL here";

//Set the visible folders for the server
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.engine('.html', require('ejs').__express);
//app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.render('index');
});

app.get('/', function(req, res){
  res.render('index');
});

/* POST REQUESTS */

/* GET REQUESTS */
//app.get('/api/player/:id', getPlayerData);

app.listen(8080);
console.log("Server listening on port 8080!");

/* SERVER METHODS */
function error(res, msg) {
  res.sendStatus(500);
  console.error(msg);
}