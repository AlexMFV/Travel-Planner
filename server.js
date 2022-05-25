const express = require('express');
const app = express();
const path = require('path');
const db = require('./serverjs/dbconnection');
const sha256 = require('js-sha256');
const { resourceLimits } = require('worker_threads');
const { log } = require('./serverjs/logs');

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
app.use(express.static(path.join(__dirname, 'bootstrap')));
app.use(express.json());
app.engine('.html', require('ejs').__express);
//app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
  //Check if the user is logged in (if the cookie is set) and choose the correct page
  res.render('login');
});

/* POST REQUESTS */
app.post('/login', processLogin);
app.post('/checkCookie', checkCookie);

/* GET REQUESTS */
//app.get('/api/player/:id', getPlayerData);

app.listen(8080);
console.log("Server listening on port 8080!");

/* SERVER METHODS */
async function processLogin(req, res){
  try {
    let enc_user = sha256(req.body.user);
    let enc_pass = sha256(req.body.pass);
    const exists = await db.checkUserLogin(enc_user, enc_pass);

    //Add the user to the session, to remember sign in
    //if (exists)
    //req.session.userId = req.body.usr;

    let userID = "";
    let cookie = undefined;

    if(exists){
      userID = await db.getUserID(enc_user, enc_pass);
      const cookieCreated = await db.createCookie(userID);

      if(cookieCreated)
        cookie = await db.getCookieUUID(userID);
    }
    
    const content = cookie + "_" + enc_user + "_" + userID + "_" + enc_pass;

    var data = {
      exists: exists,
      cookie: content
    };

    res.json(data);
  }
  catch (e) {
    error(res, e);
  }
}

async function checkCookie(req, res) {
  try {    
    let cookieContent = [];
    let exists = false;

    if(req.body.cookie != undefined)
      cookieContent = req.body.cookie.split('_');

    if (cookieContent != undefined && cookieContent.length == 4)
    {
      let userID = cookieContent[2];
      
      exists = await db.checkCookieExists(userID);

      if(!exists)
        await db.deleteExpiredCookies();
    }
    res.json(exists);
  }
  catch (e) {
    error(res, e);
  }
}

function error(res, msg) {
  res.sendStatus(500);
  console.error(msg);
}