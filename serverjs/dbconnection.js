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

//async function createNote(conID, userID, note_id, noteText, noteTitle, noteColor, titleColor,
//    dateCreated, baseFont, baseFontSize, baseFontColor, posX, posY, width, height, isClosed, isLocked){
//    try {
//        let numRows = await callProcedureNonQuery('createNote', [conID, userID, note_id, noteText, noteTitle, noteColor, titleColor,
//            dateCreated, baseFont, baseFontSize, baseFontColor, posX, posY, width, height, isClosed, isLocked]);
//
//        if(numRows == 1)
//            return true;
//        return false;
//
//    } catch (e) {
//        console.log(e);
//        return false;
//    }
//}
//
//async function updateNote(note_id, noteText, noteTitle, noteColor, titleColor,
//    baseFont, baseFontSize, baseFontColor, posX, posY, width, height, isClosed, isLocked){
//    try {
//        let numRows = await callProcedureNonQuery('updateNote', [note_id, noteText, noteTitle, noteColor, titleColor,
//            baseFont, baseFontSize, baseFontColor, posX, posY, width, height, isClosed, isLocked]);
//
//        if(numRows > 0)
//            return true;
//        return false;
//
//    } catch (e) {
//        console.log(e);
//        return false;
//    }
//}
//
//async function getNotesFromUser(userID){
//    let rows = await callProcedureRows('getNotesFromUser', [userID]);
//    return rows;
//}
//
//async function deleteNotesFromUser(userID, noteIDs){
//    try {
//        let idArray = noteIDs.split(',');
//        var numRows = 0;
//
//        for(var noteID of idArray){
//            numRows += await callProcedureNonQuery('deleteNotesFromUser', [userID, noteID]);
//        }
//
//        //If the number of altered rows (notes deleted)
//        //are the same as the number of noteID that were given
//        if (numRows/2 == idArray.length)
//            return true;
//        return false;
//
//    }
//    catch(e){
//        return false;
//    }
//}
//
//async function createCookie(id, user, cookie, expire){
//    try {
//        let numRows = await callProcedureNonQuery('createCookie', [id, user, cookie, expire]);
//
//        if (numRows == 1)
//            return true;
//        return false;
//    }
//    catch(e){
//        return false;
//    }
//}
//
//async function deleteCookie(user, cookie){
//    try {
//        let numRows = await callProcedureNonQuery('deleteCookie', [user, cookie]);
//
//        if (numRows == 1)
//            return true;
//        return false;
//
//    }
//    catch(e){
//        return false;
//    }
//}
//
//async function checkCookie(user, cookie){
//    let count = await callProcedureFirstRow('checkCookie', [user, cookie]);
//    return count.result > 0 ? true : false;
//}
//
//async function checkCookieExpire(){
//    try {
//        let numRows = await callProcedureNonQuery('checkCookieExpire', []);
//
//        if (numRows == 1)
//            return true;
//        return false;
//
//    }
//    catch(e){
//        return false;
//    }
//}
//
//async function checkUserExists(user){
//    let count = await callProcedureFirstRow('checkUserExists', [user]);
//    return count.result == 1 ? true : false;
//}
//
//async function getUserID(user){
//    let userData = await callProcedureFirstRow('getUserID', [user]);
//    return userData.user_id !== undefined ? userData.user_id : null;
//}

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
    let [rows] = await con.promise().query(formatQuery(name, parameters));
    return rows[0][0];
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

module.exports = { checkUserLogin, createUser, checkCookieExists, deleteExpiredCookies, createCookie, getUserID, getCookieUUID, getUserByID }