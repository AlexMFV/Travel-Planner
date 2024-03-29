const { param } = require('express/lib/request');
const mysql = require('mysql2');
var config = require('../config.json');
const { querylog, log } = require('./logs');
var con = mysql.createConnection(config);

async function checkUserLogin(user, pass){
    let rows = await callProcedureFirstRow('checkUser', [user, pass]);
    querylog("checkUser");
    return (rows != undefined && rows.coduser != undefined) ? true : false;
}

async function createUser(user, pass){
    try {
        let numRows = await callProcedureNonQuery('createUser', [user, pass]);
        querylog("createUser");

        if (numRows == 1)
            return true;
        return false;

    }
    catch(e){
        return false;
    }
}

async function getUserID(user, pass){
    let row = await callProcedureFirstRow('getUserID', [user, pass]);
    querylog("getUserID");
    return (row != undefined && row.coduser != undefined) ? row.coduser : '';
}

async function getUserByID(coduser){
    let row = await callProcedureFirstRow('getUserByID', [coduser]);
    querylog("getUserByID");
    return (row != undefined) ? row : null;
}

/* COOKIES */
async function createCookie(coduser) {
    try {
        let numRows = await callProcedureNonQuery('createCookie', [coduser]);
        querylog("createCookie");

        if (numRows == 1)
            return true;
        return false;

    }
    catch (e) {
        return false;
    }
}

async function getCookieUUID(coduser){
    let row = await callProcedureFirstRow('getCookieUUID', [coduser]);
    querylog("getCookieUUID");
    return (row != undefined && row.codcookie != undefined) ? row.codcookie : '';
}

async function checkCookieExists(userID){
    let rows = await callProcedureFirstRow('checkCookieExists', [userID]);
    querylog("checkCookieExists");
    return (rows != undefined && rows.codcookie != undefined) ? true : false;
}

async function deleteExpiredCookies(){
    let rows = await callProcedureNonQuery('deleteExpiredCookies');
    querylog("deleteExpiredCookies");
}

async function checkTripExists(desc){
    let rows = await callProcedureFirstRow('checkTripExists', [desc]);
    querylog("checkTripExists");
    return (rows != undefined && rows.trip_name != undefined) ? true : false;
}

async function createTrip(desc, start, end){
    try {
        let numRows = await callProcedureNonQuery('createTrip', [desc, start, end]);
        querylog("createTrip");

        if (numRows == 1)
            return true;
        return false;

    }
    catch(e){
        return false;
    }
}

async function createFlight(fromId, toId){
    try {
        let numRows = await callProcedureNonQuery('createFlight', [fromId, toId]);
        querylog("createFlight");

        if (numRows == 1)
            return true;
        return false;
    }
    catch(e){
        return false;
    }
}

async function createTripFlight(codtrip, codflight, date, value){
    try {
        let numRows = await callProcedureNonQuery('createTripFlight', [codtrip, codflight, date, value]);
        querylog("createTripFlight");

        if (numRows == 1)
            return true;
        return false;
    }
    catch(e){
        return false;
    }
}

async function createAttraction(codcountry, name, hasTicket, price, imageRef, latitude, longitude) {
    try {
        let row = await callProcedureFirstRow('createAttraction', [codcountry, name, hasTicket, price, imageRef, latitude, longitude]);
        querylog("createAttraction");
        console.log(row);
        return (row != undefined && row.attracId != undefined) ? row.attracId : null;
    }
    catch(e){
        return null;
    }
}

async function updateAttraction(id, codcountry, name, hasTicket, price, imageRef, latitude, longitude){
    try {
        let numRows = await callProcedureNonQuery('updateAttraction', [id, codcountry, name, hasTicket, price, imageRef, latitude, longitude]);
        querylog("updateAttraction");

        if (numRows == 1)
            return true;
        return false;
    }
    catch(e){
        return false;
    }
}

async function createTicket(codattrac, desc, npeople){
    try {
        let numRows = await callProcedureNonQuery('createTicket', [codattrac, desc, npeople]);
        querylog("createTicket");

        if (numRows == 1)
            return true;
        return false;
    }
    catch(e){
        return false;
    }
}

async function updateTicket(codticket, name, npeople){
    try {
        let numRows = await callProcedureNonQuery('updateTicket', [codticket, name, npeople]);
        querylog("updateTicket");

        if (numRows == 1)
            return true;
        return false;
    }
    catch(e){
        return false;
    }
}

async function deleteTicket(codticket){
    try {
        let row = await callProcedureNonQuery('deleteTicket', [codticket]);
        querylog("deleteTicket");
    }
    catch(e){
        return false;
    }
}

async function getAllTrips(){
    let rows = await callProcedureRows('getAllTrips', []);
    querylog("getAllTrips");
    return rows;
}

async function getAllCountries(){
    let rows = await callProcedureRows('getAllCountries', []);
    querylog("getAllCountries");
    return rows;
}

async function getAllFlights(){
    let rows = await callProcedureRows('getAllFlights', []);
    querylog("getAllFlights");
    return rows;
}

async function getAllAttractions(){
    let rows = await callProcedureRows('getAllAttractions', []);
    querylog("getAllAttractions");
    return rows;
}

async function getCountriesEssencial(){
    let rows = await callProcedureRows('getCountriesEssencial', []);
    querylog("getCountriesEssencial");
    return rows;
}

async function checkFlightExists(fromId, toId){
    let rows = await callProcedureFirstRow('checkFlightExists', [fromId, toId]);
    querylog("checkFlightExists");
    return (rows != undefined && rows.codflight != undefined) ? true : false;
}

async function getAllTripFlights(tripId){
    let rows = await callProcedureRows('getAllTripFlights', [tripId]);
    querylog("getAllTripFlights");
    return rows;
}

async function getTripInfo(tripId){
    let row = await callProcedureFirstRow('getTripInfo', [tripId]);
    querylog("getTripInfo");
    return row;
}

async function getAttracInfo(tripId){
    let row = await callProcedureFirstRow('getAttracInfo', [tripId]);
    querylog("getAttracInfo");
    return row;
}

async function getAttracTickets(tripId){
    let rows = await callProcedureRows('getAttracTickets', [tripId]);
    querylog("getAttracTickets");
    return rows;
}

async function getMonthlyFlightReportByYear(year){
    let rows = await callProcedureRows('getMonthlyFlightReportByYear', [year]);
    querylog("getMonthlyFlightReportByYear");
    return rows;
}

async function deleteTripFlight(codtripflight){
    try {
        let numRows = await callProcedureNonQuery('deleteTripFlight', [codtripflight]);
        querylog("deleteTripFlight");

        if (numRows == 1)
            return true;
        return false;
    }
    catch(e){
        return false;
    }
}

async function updateTripFlight(id, date, value){
    try {
        let numRows = await callProcedureNonQuery('updateTripFlight', [id, date, value]);
        querylog("updateTripFlight");

        if (numRows == 1)
            return true;
        return false;
    }
    catch(e){
        return false;
    }
}

/* STATIC FUNCTIONS */

/**
 * Gets all the rows returned by the called procedure.
 * @param {*} name Name of the procedure
 * @param {*} parameters Additional parameters for the procedure
 * @returns All rows returned from the database (JSON format)
 */
async function callProcedureRows(name, parameters){
    let [rows] = await con.promise().query(formatQuery(name, parameters));
    return rows[0];
}

/**
 * Gets the first row returned by the called procedure, ignores all other rows.
 * @param {*} name Name of the procedure
 * @param {*} parameters Additional parameters for the procedure
 * @returns First row returned from the database (JSON format)
 */
async function callProcedureFirstRow(name, parameters){
    try{
        let [rows] = await con.promise().query(formatQuery(name, parameters));
        return rows[0][0];
    }
    catch(error){
        console.log("callProcedureFirstRow (" + name + ") | Error: " + error);
        return undefined;
    }
}

/**
 * Gets the numbers of rows affected by the called procedure.
 * @param {*} name Name of the procedure
 * @param {*} parameters Additional parameters for the procedure
 * @returns An integer, representing the number of affected rows.
 */
async function callProcedureNonQuery(name, parameters){
    let [rows] = await con.promise().query(formatQuery(name, parameters));
    return rows.affectedRows;
}

function formatQuery(name, parameters){
    parameters = parameters.map((param) => `'${param}'`);
    return ('CALL <procName>(<parameters>);')
                        .replace('<procName>', name)
                        .replace('<parameters>', parameters.join(','));
}

module.exports = { checkUserLogin, createUser, checkCookieExists, deleteExpiredCookies,
    createCookie, getUserID, getCookieUUID, getUserByID, checkTripExists, createTrip,
    getAllTrips, getAllCountries, getCountriesEssencial, checkFlightExists, createFlight,
    getAllFlights, createTripFlight, getAllTripFlights, deleteTripFlight, getMonthlyFlightReportByYear,
    updateTripFlight, getTripInfo, createAttraction, createTicket, getAllAttractions, getAttracInfo,
    getAttracTickets, updateTicket, deleteTicket, updateAttraction }