var ENABLE_LOGS = false;

function querylog(query){
    if(ENABLE_LOGS)
        console.log("Query " + query + " executed. " + new Date().toISOString());
}

function log(message){
    if(ENABLE_LOGS)
        console.log(message);
}

module.exports = {querylog, log}