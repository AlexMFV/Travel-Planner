var ENABLE_LOGS = true;

function querylog(query){
    if(ENABLE_LOGS)
        console.log("Query " + query + " executed. " + new Date().toISOString());
}

function log(message){
    if(ENABLE_LOGS)
        console.log(message);
}

module.exports = {querylog, log}