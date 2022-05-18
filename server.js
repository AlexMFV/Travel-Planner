const express = require('express');
const app = express();
const path = require('path');
const db = require('./serverjs/dbconnection');
const sha256 = require('js-sha256');

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
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.json());
app.engine('.html', require('ejs').__express);
//app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
  //Check if the user is logged in (if the cookie is set) and choose the correct page
  res.render('index');
});

/* POST REQUESTS */
app.post('/login', processLogin);

/* GET REQUESTS */
//app.get('/api/player/:id', getPlayerData);

app.listen(8080);
console.log("Server listening on port 8080!");

/* SERVER METHODS */

async function processLogin(req, res){
  try{
      const exists = await db.checkUserLogin(req.body.user, req.body.pass);

      //Add the user to the session, to remember sign in
      //if (exists)
          //req.session.userId = req.body.usr;

      res.json(exists);
  }
  catch(e){
      error(res, e);
  }
}


function error(res, msg) {
  res.sendStatus(500);
  console.error(msg);
}