const path = require("path");
const settingsManager = require('../helpers/settingsManager');


function addToConsole(message){
    let consoleEl = document.getElementById("cmd-content");
    if(typeof message == 'object'){
        message = JSON.stringify(message);
    }else if(Array.isArray(message)){
        message = message.toString();
    }
    consoleEl.innerHTML += "<br>" + message + "<br>";
    consoleEl.scrollIntoView({block: "end", inline: "nearest"});
}


module.exports = {
    sendToConsole: addToConsole,
    sendErrorToConsole: function(message){
        addToConsole("ERROR: " + message);
    }
}
