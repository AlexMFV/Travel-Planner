const express = require('express');
const app = express();
const path = require('path');
const db = require('./serverjs/dbconnection');
const sha256 = require('js-sha256');
const session = require('express-session');
const { log } = require('./serverjs/logs');
var bodyParser = require('body-parser');
const { Resources } = require('./serverjs/messages');
const PORT = 8080;

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
app.use(session({secret: 'e767ed82b7415fdbbc3f1b026306d6b50f83e8c788a274bf41983cc775b7cc10', saveUninitialized: true,resave: true}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
app.post('/newTrip', createTrip);
app.post('/newFlight', createFlight);

/* GET REQUESTS */
app.get('/allTrips', getAllTrips);
app.get('/allCountries', getAllCountries);
app.get('/countriesEssencial', getCountriesEssencial);

app.listen(PORT);
console.log("Server listening on port " + PORT + "!");

/* SERVER METHODS */
async function processLogin(req, res){
  try {
    let enc_user = sha256(req.body.user);
    let enc_pass = sha256(req.body.pass);
    let userID = "";
    let user = undefined;
    let cookie = undefined;

    const exists = await db.checkUserLogin(enc_user, enc_pass);

    if(exists){      
      userID = await db.getUserID(enc_user, enc_pass);

      user = await db.getUserByID(userID);

      registerSessionUserID(req, userID, exists);

      const cookieCreated = await db.createCookie(userID);

      if(cookieCreated)
        cookie = await db.getCookieUUID(userID);
    }

    const content = cookie + "_" + enc_user + "_" + userID + "_" + enc_pass;

    var data = {
      exists: exists,
      cookie: content,
      user: user
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

async function createTrip(req, res) {
  try {
    const desc = req.body.desc;
    const start = req.body.start;
    const end = req.body.end;

    const exists = await db.checkTripExists(desc);
    if (exists)
      throw new Error(Resources.TRIP_ALREADY_EXISTS);

    const result = await db.createTrip(desc, start, end);

    if(result == 0)
      throw new Error(Resources.INSERT_ERROR);

    res.json(true);
  }
  catch (e) {
    error(res, e);
  }
}

async function createFlight(req, res) {
  try {
    const fromId = req.body.from;
    const toId = req.body.to;

    const exists = await db.checkFlightExists(fromId, toId);
    if (exists)
      throw new Error(Resources.FLIGHT_ALREADY_EXISTS);

    const result = await db.createFlight(fromId, toId);
    if(result == 0)
      throw new Error(Resources.INSERT_ERROR);

    res.json(true);
  }
  catch (e) {
    error(res, e);
  }
}

async function getAllTrips(req, res) {
  try {
    const trips = await db.getAllTrips();
    res.json(JSON.stringify(trips));
  }
  catch (e) {
    error(res, e);
  }
}

async function getAllCountries(req, res) {
  try {
    const trips = await db.getAllCountries();
    res.json(JSON.stringify(trips));
  }
  catch (e) {
    error(res, e);
  }
}

async function getCountriesEssencial(req, res) {
  try {
    const trips = await db.getCountriesEssencial();
    res.json(JSON.stringify(trips));
  }
  catch (e) {
    error(res, e);
  }
}

//Logs

function registerSessionUserID(req, userID, exists) {
  if(exists && req.session)
    req.session.userID = userID;
}

function getSessionUserID(req) {
  if(req.session)
    return req.session.userID;
}

function error(res, e) {
  //console.error(e);
  res.status(500).json(e.message);
}