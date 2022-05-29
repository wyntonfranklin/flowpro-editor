const { ipcRenderer} = require('electron')
const UTILS = require("../helpers/utils");
const world = require("../helpers/world");
const dbHelper = require('../helpers/dbHelper');
const blockHandler = require("../blocks/core");
const settingsManager = require('../helpers/settingsManager');
const logs = require("../helpers/logs");
const path = require("path");
const fs = require("fs");
const auditObjects = require(`../helpers/audit`);
const Os = require('os');
const VIEW_PREFIX = 3432343;
const canvasProperties =     {
        type: "action",
        title: 'Canvas',
        action: 'action_render_label',
        category: "builder",
        description : 'Canvas',
        icon : 'ic_keyboard.png',
        properties: [
        ]
    };

let stopExecution = false;
let selectedBlock = "";
// take note
let currentVersion = UTILS.getCurrentVersion();

const rawBlocks = blockHandler.getBlocks();
const engineFunctions = require("../functions/"+currentVersion);
const interact = require("interactjs");

// general globals
let favBlocks = null;

let viewerElement = document.getElementById('viewer');
let viewerContent = document.getElementById("viewer-content");

var autoIncrementId = 1;
var currentblock = null;
var outputResults = null;
var rightcard = false;
var tempblock;
var tempblock2;
let currentFilter = "all";
let cmdContent = null;
let formReadme = null;
let formReadmeType = null;
let formPath = null;
let auditResults = null;

let paths = [

];

let pathCount = 0;
let lastParent = null;
let blocksByPaths = [];
let currentBlocks = [];
let currentFile = null;
let loopOutput = null;
let loopIndex = null;
let loopComplete = null;
let currentFlowy = null;
let secondFlowy = null;
let currentCanvas = null;
let currentBuild = null;

function renderBlocks(raw, el){
    let output = "";

    raw.forEach((block, i)=>{
        output += `<div class="blockholder create-flowy noselect" data-object='${JSON.stringify(block)}'>
            <input type="hidden" name='blockelemtype' class="blockelemtype" value="${block.id}">
            <div class="blockin">
                <div class="blocktext">
                    <p class="blocktitle" title="${block.description}"><img class="noselect" style="width: 20px;" src="../assets/${block.icon}"/>&nbsp;&nbsp;${block.title}</p>
                </div>
            </div>
        </div>`;
    });
    el.innerHTML = output;
    addBlockListeners();
}



function clearBuilderForm() {
    document.getElementById("viewer-content").reset();
}

function getObjectAttributes(data){
    let output = null;
    data.forEach((row)=>{
        if(row["data-object"] !== undefined){
            output =  JSON.parse(row["data-object"]);
        }
    });
    return output;
}

function exitsInArray(arr, value) {
    for( var i = 0; i <= arr.length-1; i++){
        if ( arr[i] === value) {
            return true;
        }
    }
    return false;
}


function runScript(callback){
    stopExecution = false;
    setButtonAsRunning();
    applyEnvToWorld();
    let results = onRunClicked();
    runFlowPro(results, "", function(){
        setButtonAsComplete();
        callback();
    });
}

function runChoosenScript(file, callback){
    let data = getFlowDataFromFile(file)
    stopExecution = false;
    setButtonAsRunning();
    applyEnvToWorld();
    let results = onRunClicked(data);
    runFlowPro(results, "", function(){
        setButtonAsComplete();
        callback();
    });
}

function applyEnvToWorld(){
    let settings = settingsManager.get("env",[]);
    settings.forEach(set=>{
        world.addWorldVariable(set.name, set.content);
    });
    if(currentFile){
        world.addPrivateWorldVariable("_basedir_", path.dirname(currentFile));
    }
    world.addPrivateWorldVariable("_homedir_", Os.homedir());
}

function getHtmlAttributesFromObject(values){
    let attribute = "";
    let validKeys = ["placeholder"];
    for (const key in values) {
        if (validKeys.indexOf(key) > -1) {
            attribute += `${key}=` + values[key];
        }
    }
    return attribute;
}

function getAuditByBlock(block){
    let myblock = auditObjects.filter(query=> query.id === block.action);
    if(myblock.length > 0){
        myblock = myblock[0];
        if(myblock.severity == "high"){
            return `&#8594; ${myblock.message} <span style="background-color: darkred;">(${myblock.severity})</span><br>`
        }else if(myblock.severity == "medium"){
            return `&#8594; ${myblock.message} <span style="background-color: darkgoldenrod">(${myblock.severity})</span><br>`
        }else if(myblock.severity == "low"){
            return `&#8594; ${myblock.message} <span style="background-color: darkblue">(${myblock.severity})</span><br>`
        }
    }
    return "";
}


function debugScript(){
    auditResults = "";
    let results = onRunClicked();
    if(results){
        let paths = results.paths;
        let blocks = paths[0];
        let blocksEl = document.getElementById("canvas").querySelectorAll(".blockelem");
        if(blocks){
            blocks.forEach((block,i)=> {
                let action = block;
                let actionObject = getObjectAttributes(action.attr);
                let actionProperties = actionObject.properties;
                updateBlockWithTitle(blocksEl[block.id], actionProperties);
                auditResults += getAuditByBlock(actionObject);
            });
        }
    }
}

function updateBlockWithTitle(el, properties){
    if(properties.length > 0){
        let titledesc = "";
        properties.forEach(prop=>{
            titledesc += `${prop.label} => ${prop.value}\r\n`;
        });
        if(el){
            el.setAttribute('title', titledesc);
        }
    }
}

function buildChoosenFile(file){
    setBuild(file);
    try{
        let data = getFlowDataFromFile(file);
        let results = onRunClicked(data);
        createFormsFromPaths(results);
    }catch (e){
        logs.sendErrorToConsole(e);
    }
}

/*
function runChooseFile(file){
    try{
        let data = getFlowDataFromFile(file);
        let results = onRunClicked(data);
        createFormsFromPaths(results);
    }catch (e){
        logs.sendErrorToConsole(e);
    }
}
*/

function applyResizeToViews(){
    interact('.resize-view-drag-bottom')
        .resizable({
            margin: 30,
            distance: 5,
            // resize from all edges and corners
            edges: {bottom: true },
            listeners: {
                move (event) {
                    var target = event.target;
                    var x = (parseFloat(target.getAttribute('data-x')) || 0)
                    var y = (parseFloat(target.getAttribute('data-y')) || 0)
                    target.style.height = event.rect.height + 'px'
                    y += event.deltaRect.top
                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)
                    //target.style.height = y +'px';
                }
            },
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),
                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 160, height: 80 }
                })
            ],
            inertia: false
        });

}


function createFormsFromPaths(results){
    let paths = results.paths;
    let blocks = paths[0];
    let htmlContent = "";
    let topContent = "";
    let formColor = "";
    formReadme = "";
    formReadmeType = "";
    blocks.forEach((block,i)=>{
        let action = block;
        let actionObject = getObjectAttributes(action.attr);
        let actionProperties = actionObject.properties;
        let blockSettings = {
            name : actionObject.title,
            type : actionObject.type,
            id : action.id
        };
        if(actionObject.action == "build_form_readme"){
            let instructions = UTILS.getPropertyValue(actionProperties, 0, "", false);
            let instructionType = UTILS.getProperty(actionProperties, 1, "text", false);
            formReadme = instructions;
            formReadmeType =  instructionType;
        }
        if(actionObject.action == 'build_text_box'){
            let name = UTILS.getPropertyValue(actionProperties, 0, "", false);
            let label = UTILS.getPropertyValue(actionProperties, 1, "", false);
            let settings = UTILS.getPropertyValue(actionProperties, 2, "", false);
            let attributes = "";
            if(settings){
                let settingsObject = UTILS.convertQueryToObject(settings);
                attributes = getHtmlAttributesFromObject(settingsObject);
            }
            if(UTILS.propertiesValidation(actionObject,"0!=")){
                if(label){
                    htmlContent += `<label>${label}</label><br>`;
                }
                htmlContent += `<input class="form-input form-control" name='${name}' ${attributes}/><br>`;
            }
        }else if(actionObject.action == 'build_filename_box'){
            let name = UTILS.getPropertyValue(actionProperties, 0, "", false);
            let ext = UTILS.getPropertyValue(actionProperties, 1, "", false);
            let label = UTILS.getPropertyValue(actionProperties, 2, "", false);
            let settings = UTILS.getPropertyValue(actionProperties, 3, null, false);
            let attributes = "";
            if(settings){
                attributes = getHtmlAttributesFromObject(settings);
            }
            if(UTILS.propertiesValidation(actionObject,"0!=&1!=&2!=")){
                htmlContent += `<label>${label}</label><br><input class="form-input form-control" name='${name}' data-ext='${ext}' ${attributes} /><br>`;
            }

        }else if(actionObject.action == 'build_text_box_2'){
            let name = UTILS.getPropertyValue(actionProperties, 0, "", false);
            let label = UTILS.getPropertyValue(actionProperties, 1, "", false);
            let name2 = UTILS.getPropertyValue(actionProperties, 2, "", false);
            let label2 = UTILS.getPropertyValue(actionProperties, 3, "", false);
            if(UTILS.propertiesValidation(actionObject,"0!=&1!=")){
                htmlContent += '<table style="width: 96%"><tr>';
                htmlContent += `<td style="padding-right: 5px;"><label>${label}</label><br><input class="form-input form-control" name='${name}'/></td>`;
                htmlContent += `<td><label>${label2}</label><br><input class="form-input form-control" name='${name2}'/></td>`;
                htmlContent += '</tr></table><br>';
            }
        }else if(actionObject.action == 'build_number_box'){
            let name = UTILS.getPropertyValue(actionProperties, 0, "", false);
            let label = UTILS.getPropertyValue(actionProperties, 1, "", false);
            if(UTILS.propertiesValidation(actionObject, "0!=&1!=")){
                htmlContent += `<label>${label}</label><br><input type="number" class="form-input form-control" name='${name}'/><br>`;
            }
        }else if(actionObject.action == 'build_longtext_box'){
            let name = UTILS.getPropertyValue(actionProperties, 0, "", false);
            let label = UTILS.getPropertyValue(actionProperties, 1, "", false);
            if(UTILS.propertiesValidation(actionObject, "0!=&1!=")){
                htmlContent += `<label>${label}</label><br><textarea class="form-input form-control" rows="10" name='${name}'></textarea><br>`;
            }
       }else if(actionObject.action == 'build_dropdown_box'){
            let name = actionProperties[0].value;
            let label = actionProperties[1].value;
            let options = actionProperties[2].value;
            htmlContent += `<label>${label}</label><br><select class="form-control" name='${name}'>`;
            let opts = options.split(',');
            opts.forEach((opt)=>{
                let msg = opt.trim();
                htmlContent += `<option value="${msg}">${msg}</option>`;
            });
            htmlContent += '</select><br>'
        }else if(actionObject.action == 'build_check_box'){
            let name = UTILS.getPropertyValue(actionProperties, 0, "");
            let label = UTILS.getPropertyValue(actionProperties, 1, "");
            htmlContent += `<label>${label}</label><br><select name='${name}' class="form-control">`;
            htmlContent += `<option value="no">No</option><option value="yes">Yes</option></select><br>`;
        }else if(actionObject.action == 'build_form_settings'){
            let formTitle = UTILS.getProperty(actionProperties, 0, "", false);
            let formDescription = UTILS.getProperty(actionProperties, 1, "", false);
            formColor = UTILS.getProperty(actionProperties, 2, "white", false);
            topContent += `<h3>${formTitle}</h3>`;
            topContent += `<p>${formDescription}</p>`;
        }else if(actionObject.action == "build_date_box"){
            let name = UTILS.getPropertyValue(actionProperties, 0, "");
            let label = UTILS.getPropertyValue(actionProperties, 1, "");
            htmlContent += `<label>${label}</label><br><input class="form-control" type="date" name='${name}'/><br>`;
        }else if(actionObject.action == "build_datetime_box"){
            let name = UTILS.getPropertyValue(actionProperties, 0, "");
            let label = UTILS.getPropertyValue(actionProperties, 1, "");
            htmlContent += `<label>${label}</label><br><input class="form-control" type="datetime-local" name='${name}'/><br>`;
        }else if(actionObject.action == "build_time_box"){
            let name = UTILS.getPropertyValue(actionProperties, 0, "");
            let label = UTILS.getPropertyValue(actionProperties, 1, "");
            htmlContent += `<label>${label}</label><br><input class="form-control" type="time" name='${name}'/><br>`;
        }else if(actionObject.action == "build_button_input"){
            let fileName = UTILS.getPropertyValue(actionProperties, 0, "");
            let varName = UTILS.getPropertyValue(actionProperties, 1, "");
            let label = UTILS.getPropertyValue(actionProperties, 2, "");
            let buttonName = UTILS.getPropertyValue(actionProperties, 3, "");
            htmlContent += `<label>${label}</label>&nbsp;
                <button class="fp-form-action btn-primary btn-sm" type="button" data-file="${fileName}" data-id="${varName}">${buttonName}</button><br><br>`;
        }else if(actionObject.action == "build_button_load"){
            let fileName = UTILS.getPropertyValue(actionProperties, 0, "");
            let label = UTILS.getPropertyValue(actionProperties, 1, "");
            let buttonName = UTILS.getPropertyValue(actionProperties, 2, "");
            if(UTILS.propertiesValidation(actionObject, "0!=&1!=&2!=")){
                htmlContent += `<label>${label}</label>&nbsp;
                <button class="fp-form-build btn btn-primary btn-sm" type="button" data-file="${fileName}">${buttonName}</button><br><br>`;

            }
        }else if(actionObject.action == "action_render_label"){
            let label = UTILS.getPropertyValue(actionProperties, 0, "");
            if(UTILS.propertiesValidation(actionObject, "0!=")){
                htmlContent += `<label>${label}</label>&nbsp;<br>`
            }
        }else if(actionObject.action == "action_render_view"){
            let viewID = UTILS.getPropertyValue(actionProperties, 0, "", false); // parse and clean
            let finalViewId = VIEW_PREFIX + viewID;
            htmlContent += `<div class="builder-view resize-view-drag-bottom" id="${finalViewId}"></div><br>`;
        }
    });
    htmlContent += '<br><button id="run-script-button" type="button" class="btn-success btn-sm">Run Script</button>';
    htmlContent = topContent + htmlContent;
    viewerContent.innerHTML = htmlContent;
    viewerContent.style.background = formColor;
    applyResizeToViews();
    document.getElementById("run-script-button").addEventListener('click', e => {
        document.dispatchEvent(new CustomEvent("engine.runscript", {
            detail: {
            },
        }));
    });
    let btns = document.querySelectorAll(".fp-form-action");
    btns.forEach(btn=>{
        btn.addEventListener("click", function(event){
            let el = event.target;
            let fileToRun = el.getAttribute("data-file");
            let varNameToSave =  el.getAttribute("data-id");
            UTILS.progressStart();
            runFromFilePath(fileToRun,"", function(results){
                world.addWorldVariable(varNameToSave, results);
                UTILS.progressStop();
            });
        });
    });
    btns = document.querySelectorAll(".fp-form-build");
    btns.forEach(btn=>{
        btn.addEventListener("click", function(event){
            let el = event.target;
            let fileToRun = el.getAttribute("data-file");
            buildChoosenFile(fileToRun);
        });
    });
}

function buildForms(){
    setBuild(currentFile);
    let results = onRunClicked();
    createFormsFromPaths(results);
}

function assignFormToWorld(){
    /* old way
    const formData = new FormData(document.getElementById('viewer-content'));
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
        world.addWorldVariable(pair[0].replace(/\s/g, ''), pair[1])
    }
    */
    let formelements = Array.from(document.forms["viewer-content"].elements);
    formelements.forEach(el=>{
        let varName = "";
        let varValue = "";
        if(el.nodeName == "SELECT" || el.nodeName == "INPUT" || el.nodeName =="TEXTAREA"){
            if(el.getAttribute('data-ext')){
                varName = el.getAttribute("name");
                varValue = el.value  + "." + el.getAttribute("data-ext");
            }else{
                varName = el.getAttribute("name");
                varValue = el.value;
            }
            let cleanVarName = varName.replace(/\s/g, '');
            world.addWorldVariable(cleanVarName, varValue);
        }
    });

}

function runFlowForm(callback){
    setButtonAsRunning();
    applyEnvToWorld();
    // assign form to world
    assignFormToWorld();
    let data = getFlowDataFromFile(currentBuild);
    let results = onRunClicked(data);
    runFlowPro(results, "", function(){
        setButtonAsComplete();
        callback();
    });
}

function runFlowPro(results, output, cb){
    let paths = results.paths;
    var pathsOutput = [];
    if(output == undefined){
        output = null;
    }
    recursiveBlockHandler( paths[0],0, output, function(resp){
        cb(resp)
    });
}

function getFlowDataFromFile(file){
    try{
        const buffer = fs.readFileSync(file);
        let fileData = JSON.parse(buffer.toString("utf8"));
        return fileData;
    }catch (e){
        return null;
    }
}

function runFromFilePath(filename, output, cb){
    if(filename !== null && filename != undefined){
        var ext = path.extname(filename);
        if(ext == '.flowpro'){
            const buffer = fs.readFileSync(filename);
            let fileData = JSON.parse(buffer.toString("utf8"));
           runFlowPro(onRunClicked(fileData), output, function(res){
                    cb(res);
            });
        }
    }
}

let rBlockStop = false;


function skipToLoop(nextIndex, blocks,output, cb, action){
    let nextSkipIndex = null;
    for(let i=nextIndex; i < blocks.length; i++){
        let tempAction = blocks[i];
        let tempObject = getObjectAttributes(tempAction.attr);
        if(tempObject.action == action){
            nextSkipIndex = i;
            break;
        }
    }
    if(nextSkipIndex){
        recursiveBlockHandler(blocks, nextSkipIndex+1, output, cb);
    }
}

function showAlertDialog(properties, output){
    let message = UTILS.getPropertyValueAsString(properties, 0, "", true);
    let style = UTILS.getPropertyValue(properties, 1, "white", true);
    let buttonName = UTILS.getPropertyValue(properties, 2, "Click me", true);
    let buttonAction = UTILS.getPropertyValue(properties, 3, "Load Flowpro", false);
    let buttonProperties = UTILS.getPropertyValue(properties, 4, "", true);
    ipcRenderer.invoke('open-window','alert',
        {
            raw :  output,
            message : message,
            style : style,
            button : buttonName,
            action: buttonAction,
            properties : buttonProperties
        });
}

function recursiveBlockHandler(blocks, nextIndex, output, cb){
    if(nextIndex < (blocks.length)){
        let results = null;
        world.addPrivateWorldVariable("coutput", output);
        let action = blocks[nextIndex];
        let actionObject = getObjectAttributes(action.attr);
        let actionProperties = actionObject.properties;
        let blockSettings = {
            name : actionObject.title,
            type : actionObject.type,
            id : action.id
        };
        if(stopExecution == true){
            nextIndex = blocks.length-1;
            logs.sendToConsole(output);
            logs.sendErrorToConsole("Execution haulted");
        }
        if(actionObject.action == "action_stop_execution" ){
                nextIndex =   blocks.length-1;
                logs.sendToConsole(output);
        }
        if(actionObject.action == "action_validate_variables"){
            let conditions = UTILS.getPropertyValue(actionProperties,0, "", false);
            if(!UTILS.blockValidation(conditions,actionObject, true)){
                let actionToTake = UTILS.getPropertyValue(actionProperties, 1, "", false);
                if(actionToTake == "break"){
                    nextIndex =  blocks.length-1;
                    logs.sendToConsole(output);
                }
            }
        }
        if (actionObject.type === "screen") {
            if(actionObject.action == "action_print_output"){
                let userInput = UTILS.getPropertyValueAsString(actionProperties,0, "", true);
                let toOutput = userInput;
                let finalMessage = toOutput;
                logs.sendToConsole(finalMessage);
            }else if(actionObject.action == "action_print_world"){
                logs.sendToConsole(JSON.stringify(world.getWorld()));
              //  output = world.getWorld();
            }else if(actionObject.action == "output_results_in_window"){
                screenOutput(actionProperties, output);
            }else if(actionObject.action == "output_results"){
               logs.sendToConsole(output,"console");
            }else if(actionObject.action == "output_to_view"){
                let viewId = UTILS.getPropertyValue(actionProperties,0, "", false);
                let viewOption = UTILS.getPropertyValue(actionProperties,1, "overwrite", false);
                let finalViewId = VIEW_PREFIX + viewId;
                let myview = document.getElementById(finalViewId);
                if(myview){
                    if(viewOption == "overwrite"){
                        myview.innerHTML =  output;
                    }else{
                        myview.innerHTML = myview.innerHTML + output;
                    }
                }else{
                    logs.sendErrorToConsole(`View ${viewId} doesnt not exists`);
                }
              //  logs.sendToConsole(output,"console");
            }else if(actionObject.action == "action_alert_dialog"){
                showAlertDialog(actionProperties, output);
            }
            // nextIndex++;
        }
        if(actionObject.type == "loop"){
            if(actionObject.action == "forloop"){
                let max = UTILS.getPropertyValue(actionProperties,0, output, true);
                nextIndex++;
                handleForLoop(blocks, nextIndex, output, max);
                skipToLoop(nextIndex, blocks, output, cb, "action_end_loop");
                output = loopOutput;
                nextIndex = loopIndex;
                world.addPrivateWorldVariable("coutput", output);
            }else if(actionObject.action == "foreach"){
                nextIndex = nextIndex+1;
                let loopInput =  UTILS.getPropertyValue(actionProperties,0, output, true);
                handleForLoopByInput(blocks, nextIndex, loopInput);
                // skip to last loop
                skipToLoop(nextIndex, blocks, output, cb, "action_end_loop");
                output = loopOutput;
                nextIndex = loopIndex;
                world.addPrivateWorldVariable("coutput", output);
            }else if(actionObject.action == "action_while"){
                nextIndex++;
                handleWhileLoop(blocks, nextIndex, output, actionProperties);
                output = loopOutput;
                nextIndex = loopIndex;
                world.addPrivateWorldVariable("coutput", output);
            }else if(actionObject.action == "action_repeat_for"){
                nextIndex++;
                handleLoopBlocks(blocks,nextIndex, output, actionProperties);
                output = loopOutput;
                nextIndex = loopIndex;
            }else if(actionObject.action == "action_end_loop"){
                nextIndex = blocks.length;
                return true;
            }
        } else if(actionObject.type == "conditional"){

        }

        if(actionObject.type == "file"){
            if(actionObject.action == "action_file_function"){
                world.setToLocal();
            }
            let filename =  UTILS.getPropertyValueAsString(actionProperties, 0, "", true);

            if(filename == "" || filename == undefined){
               // logs.add("File name cannot be blank", blockSettings);
            }
            if(UTILS.propertiesValidation(actionObject, "0!=")){
                try{
                    runFromFilePath(filename, output, function(result){
                        output = result;
                        recursiveBlockHandler(blocks, nextIndex+1, output, cb);
                    });
                }catch (e){
                    //logs.logger.info(e);
                }
            }
            if(actionObject.action == "action_file_function"){
                world.setToWorld();
            }
            world.addPrivateWorldVariable("coutput", output);
        }else {
            if(engineFunctions[actionObject.action] !== undefined  && typeof engineFunctions[actionObject.action] == "function" && !rBlockStop){
                engineFunctions[actionObject.action](actionProperties, output, function(resp){
                    if(actionObject.type == "conditional"){
                        if(!resp){
                            let nextEndIfIndex = null;
                            for(let i=nextIndex; i < blocks.length; i++){
                                let tempAction = blocks[i];
                                let tempObject = getObjectAttributes(tempAction.attr);
                                if(tempObject.action == "endif"){
                                    nextEndIfIndex = i;
                                    break;
                                }
                            }
                            if(nextEndIfIndex){
                                recursiveBlockHandler(blocks, nextEndIfIndex+1, output, cb);
                            }
                        }else{
                            //output = resp;
                            nextIndex++;
                            loopOutput = output;
                            loopIndex = nextIndex;
                            recursiveBlockHandler(blocks, nextIndex, output, cb);
                        }
                    }else{
                        output = resp;
                        nextIndex++;
                        loopOutput = output;
                        loopIndex = nextIndex;
                        recursiveBlockHandler(blocks, nextIndex, output, cb);
                    }
                }, actionObject);
            }else{
                nextIndex++;
                recursiveBlockHandler(blocks, nextIndex, output, cb);
            }
        }
    }else{
        if(typeof cb == "function"){
            cb(output);
        }
    }
}


function handleConditionalBlock(blocks, nextIndex, output, properties){
    let tempAction = blocks[nextIndex];
    let tempObject = getObjectAttributes(tempAction.attr);
    if(tempObject.action == "endif"){

    }else{
        handleConditionalBlock(blocks, nextIndex, output, properties);
        recursiveBlockHandler(blocks, nextIndex, output, function(output){

        })
    }
}


function handleLoopBlocks(blocks, nextIndex, output, properties){
 setTimeout(function(){
     recursiveBlockHandler(blocks, nextIndex, output);
 },2000);
}


function handleWhileLoop(blocks, nextIndex, output, properties){
    let ip1 = UTILS.getPropertyValue(properties, 0, output, true);
    let condition = UTILS.getPropertyValue(properties, 1, "", false);
    let ip2 = UTILS.getPropertyValue(properties, 2, "", true);
     if (UTILS.compareByValue(ip1, condition, ip2)){
         recursiveBlockHandler(blocks, nextIndex, output);
         handleWhileLoop(blocks, nextIndex, output, properties);
         ip1 = UTILS.getPropertyValue(properties, 0, "", true);
     }
}


function handleForLoop(blocks, nextIndex, output, loops){
    let finalOutput = null;
    for(let i=1; i<= loops; i++){
        world.addPrivateWorldVariable("cindex", i);
        recursiveBlockHandler(blocks, nextIndex, output);
    }
}


function handleForLoopByInput(blocks, nextIndex, output){
    let original = output;
    let finalOutput = null;
    let prev = "";
    let index = 0;
    if(Array.isArray(output)){
        /*
        output.forEach((item, i)=>{
            world.addPrivateWorldVariable("cindex", i);
            recursiveBlockHandler(blocks, nextIndex, item);
        })*/
        handleLoopByArray(blocks,nextIndex, output);
    }else if(typeof output == "object"){
        for (const key in output) {
            world.addPrivateWorldVariable("cindex", key);
            recursiveBlockHandler(blocks, nextIndex, output[key]);
        }

    }
}

function handleLoopByArray(blocks, nextIndex, dataset){
    let currentInput = dataset.pop();
    recursiveBlockHandler(blocks, nextIndex, currentInput);
    if(dataset.length > 0){
        handleLoopByArray(blocks, nextIndex, dataset );
    }
}



function manageInputs(ip1){
    if(ip1 == null){
        return "";
    }else if(Array.isArray(ip1)){
        let o = "";
        ip1.forEach(input=>{
            o += input;
        })
        return o;
    }
    return ip1;
}

function getInputAsString(input){
    if(Array.isArray(input)){
        return input.toString();
    }
    return input;
}


function screenOutput(properties, output){
    let screenTitle = UTILS.getPropertyValue(properties,0,"", true);
    let screenDescription = UTILS.getPropertyValue(properties, 1, "", true);
    let screenStyling = UTILS.getPropertyValue(properties, 2, "", false);
    ipcRenderer.invoke('open-window','screen',
        {
            message :  output,
            styling: screenStyling,
            title: screenTitle,
            excerpt : screenDescription
        });
}

function setButtonAsRunning(){
    document.getElementById('publish').querySelector("img").src = "../assets/ic_play_16_red.png";
}

function setButtonAsComplete(){
    document.getElementById('publish').querySelector("img").src = "../assets/ic_play_16.png";
}


function getCurrentFileBaseName(){
    if(currentFile){
        return path.basename(currentFile);
    }
    return "";
}


function saveAction(){
    saveProperties();
}


// on publish get results

document.getElementById("publish").addEventListener("click", function(){
    document.dispatchEvent(new CustomEvent("engine.published", {
        detail: {
            paths : blocksByPaths,
        },
    }));
});


function onRunClicked(data){
    let treeData = null;
    if(data !== undefined){
        treeData = data;
    }else{
        try{
            treeData = flowy.output();
        }catch (e){
            treeData = null;
        }
    }
    if(treeData){
        let tree = treeData.blocks;
        let treeLength = tree.length;
        let stack = tree;
        let nodesCount = 0;
        let results= [];
        let currentParent= null;
        let nodeResults = [];
        let visited = [];
        currentBlocks = [];
        blocksByPaths = [];
        let initStart = stack.pop();
        currentParent = initStart.parent;
        let props = getObjectAttributes(initStart.attr);
        visited.push(initStart.id);
        currentBlocks.push(initStart);
        while(stack.length !== 0 && visited.length <= treeLength){
            for(let i=stack.length-1; i>=0; i--){
                let row = stack[i];
                if(currentParent == row.id){
                    let props = getObjectAttributes(row.attr);
                    nodeResults.push(props.id);
                    currentBlocks.push(row);
                    if(!exitsInArray(visited, row.id)){
                        visited.push(row.id);
                    }
                    currentParent = row.parent;
                }
            }
            if(nodeResults.length > 0){
                results[nodesCount] = nodeResults.reverse();
                nodeResults = [];
                blocksByPaths[nodesCount] = currentBlocks.reverse();
                currentBlocks = [];
                nodesCount++;
            }
            let initStart = stack.pop();
            if(stack.length >= 0 && !exitsInArray(visited, initStart.id)){
                if(initStart !== undefined){
                    currentParent = initStart.parent;
                    visited.push(initStart.id);
                    currentBlocks.push(initStart);
                }
            }
            if(visited.length == treeLength){

            }
        }
        if(nodeResults.length > 0){
            results[nodesCount] = nodeResults;
            blocksByPaths[nodesCount] = currentBlocks;
        }
        outputResults = results;
        return {
            paths : blocksByPaths,
        }
    }
}

function matches(text, partial) {
    return text.toLowerCase().indexOf(partial.toLowerCase()) > -1;
}

function filterBlocks(filter){

    let searchResults = [];
    currentFilter = filter;
    if(filter == "all"){
        searchResults = rawBlocks;
        renderBlocks(searchResults, document.getElementById('blocklist'));
    }else if(filter == "favorites"){
        dbHelper.getRecords(function(blocks){
            favBlocks = blocks;
            renderBlocks(blocks, document.getElementById('blocklist') )
        });
    }else{
        rawBlocks.forEach((block)=>{
            if(block.category == filter){
                searchResults.push(block);
            }
        })
        renderBlocks(searchResults, document.getElementById('blocklist'));
    }
}


function searchBlocks(query){
    let searchResults = [];
    let searchBlocks = null;
    if(currentFilter == "favorites"){
        searchBlocks = favBlocks;
    }else{
        searchBlocks = rawBlocks;
    }
    searchBlocks.forEach((block)=>{
        if(query){
            if(matches(block.title, query || matches(block.description, query))){
                if(currentFilter !== "all"){
                    if(block.category == currentFilter){
                        searchResults.push(block);
                    }
                }else{
                    searchResults.push(block);
                }
            }
        }else{
            if(currentFilter != "all"){
                if(block.category == currentFilter){
                    searchResults.push(block);
                }
            }else{
                searchResults.push(block);
            }
        }
    });
    renderBlocks(searchResults, document.getElementById('blocklist'));
}

function addEventListenerMulti(type, listener, capture, selector) {
    var nodes = document.querySelectorAll(selector);
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener(type, listener, capture);
    }
}




function engineStart(){
    let mainlist = document.getElementById('blocklist');
    renderBlocks(rawBlocks, mainlist);
    flowy(document.getElementById("canvas"), drag, release, snapping);

}


function snapping(drag, first) {
    drag.classList.remove("blockholder");
    drag.classList.add("blockelem");
    let blockin = drag.querySelector(".blockin");
    if(blockin.parentNode){
       blockin.parentNode.removeChild(blockin);
    }
    let object = JSON.parse(drag.getAttribute("data-object"));
    object.properties.forEach((prop)=> {
        prop.id = getAutoId()
    });
    drag.setAttribute("data-object", JSON.stringify(object));
    drag.innerHTML += `<div class='blockyleft '><img class="noselect" src='../assets/blue${object.icon}'>
                <p class='blockyname'>${object.title}</p></div>
                </div>`;
    document.dispatchEvent(new CustomEvent("engine.snapped", {}));
    return true;
}

function drag(block) {
    block.classList.add("blockdisabled");
    tempblock2 = block;
}

function release() {
    if (tempblock2) {
        tempblock2.classList.remove("blockdisabled");
        //tempblock2 = null;
    }
  // closeRightCard();
    document.dispatchEvent(new CustomEvent("engine.blockadded", {}));
   // addToHistory();
}
let disabledClick = function(){
    document.querySelector(".navactive").classList.add("navdisabled");
    document.querySelector(".navactive").classList.remove("navactive");
    this.classList.add("navactive");
    this.classList.remove("navdisabled");
    if (this.getAttribute("id") == "triggers") {

    }
}

addEventListenerMulti("click", disabledClick, false, ".side");


function engineDeleteBlocks(){
    flowy.deleteBlocks();
}

function engineCloseRightCard(){
    closeRightCard();
}

function clearBlockSelectors(){
    const divs = document.querySelectorAll('.blockelem');
    divs.forEach( el => {
        el.classList.remove("selectedblock");
    });
}

function closeRightCard(){
    if (rightcard) {
        rightcard = false;
        document.getElementById("properties").classList.remove("expanded");
        setTimeout(function(){
            document.getElementById("propwrap").classList.remove("itson");
        }, 300);
    }else{

    }
}


function addBlockListeners(){
    var beginTouch = function (event) {
        aclick = true;
        noinfo = false;
        if (event.target.closest(".create-flowy")) {
            noinfo = true;
        }
    }
    addEventListenerMulti("touchstart", beginTouch, false, ".block");


    var aclick = false;
    var noinfo = false;
    var beginTouch = function (event) {
        aclick = true;
        noinfo = false;
        if (event.target.closest(".create-flowy")) {
            noinfo = true;
        }
    }
    var checkTouch = function (event) {
        aclick = false;
    }
    var doneTouch = function (event) {
        if (event.type === "mouseup" && aclick && !noinfo) {
            if (event.target.closest(".block") && !event.target.closest(".block").classList.contains("dragging")) {
                if(currentblock !== null){
                    currentblock.classList.remove("selectedblock");
                }
                // clearBlockSelectors();
                tempblock = event.target.closest(".block");
                currentblock = tempblock;
                rightcard = true;
                document.getElementById("properties").classList.add("expanded");
                document.getElementById("propwrap").classList.add("itson");
                tempblock.classList.add("selectedblock");
                let object = JSON.parse(tempblock.getAttribute("data-object"));
                renderProperties(object);
            }
        }
    }
    addEventListener("mousedown", beginTouch, false);
    addEventListener("mousemove", checkTouch, false);
    addEventListener("mouseup", doneTouch, false);
    addEventListenerMulti("touchstart", beginTouch, false, ".block");
    addEventListenerMulti('contextmenu', function(e){
            selectedBlock = e.currentTarget;
            let object = JSON.parse(selectedBlock.getAttribute("data-object"));
            let hasId = (object._id) ? true: false;
            ipcRenderer.invoke('show-context-menu','library',  { favorite: hasId});
    }, false,'.blockholder')
}


function savePropertiesInterval(){
    if(document.getElementById("propwrap").classList.contains("itson")){
        saveProperties();
    }
}


function saveProperties(){
    let object = JSON.parse(currentblock.getAttribute("data-object"));
    // disable comment update
    /*
    if(object.title == "Comment"){
        let newTitle = object.properties[0].value;
        if(newTitle){
            currentblock.querySelector(".blockyname").setAttribute('title', newTitle);
        }
    }*/
    let titledesc = "";
    let objProperties = object.properties;
    if(objProperties.length > 0){
        objProperties.forEach(prop=>{
            titledesc += `${prop.label} => ${prop.value}\r\n`;
        });
       currentblock.setAttribute('title', titledesc);
    }
    object.properties.forEach((field, i)=>{
        var el = document.getElementById(object.properties[i].id);
        if(el){
            object.properties[i].value = el.value;
        }
    });
    currentblock.setAttribute("data-object", JSON.stringify(object));
}


function renderProperties(obj){
    let title = obj.title;
    document.getElementById("prop-header").innerText = title;
    let proplist = document.getElementById("proplist");
    proplist.innerHTML = "";
    let properties = obj.properties;
    properties.forEach((option, i)=>{
        if(option.type == "text" || option.type == "number"){
            proplist.innerHTML+= `<div><p class="inputlabel">${option.label}</p>
            <input style="height: 40px;" id="${option.id}" class="dropme prop-input" type="${option.type}" value="${option.value}"/></div>`
        }else if(option.type == "longtext"){
            proplist.innerHTML+= `<div><p class="inputlabel">${option.label}</p>
            <textarea id="${option.id}" rows="4" class="dropme prop-input" rows="2"/>${option.value}</textarea></div>`;
        }else if(option.type == "dropdown"){
            let selchtml ="";
            selchtml+= `<div><p class="inputlabel">${option.label}</p>
            <select style="height: 40px;"  id="${option.id}" class="dropme">`;
            option.options.forEach(op=>{
                if(option.value == op){
                    selchtml +=`<option value="${op}" selected="selected">${op}</option>`;
                }else{
                    selchtml +=`<option value="${op}">${op}</option>`;
                }
            });
            selchtml +=`</select></div>`;
            proplist.innerHTML += selchtml;

        }else if(option.type == "check"){

        }
    })
}

function getAutoId(){
    autoIncrementId++;
    return autoIncrementId;
}

function init(){
  engineStart();
  setInterval(savePropertiesInterval, 500);
    window.addEventListener('error', function(error){

    })
}


function sendToConsole(message){
    if(message !== undefined && typeof message !== "undefined"){
        if(Array.isArray(message)){
            message = message.toString();
        }else if(typeof message == "object"){
            message = JSON.stringify(message);
        }
        logs.sendToConsole(message);
    }else{
        logs.sendToConsole("NA");
    }
}

function setBuild(file){
    if(file){
        document.getElementById("build-title").innerText = path.basename(file);
        currentBuild = file;
    }else{
        document.getElementById("build-title").innerText = "No build set";
        currentBuild = file;
        document.getElementById("viewer-content").innerText = "";
    }
}

function startScriptMessage(value){
    sendToConsole("Script started: " + UTILS.getNowDate() + `(${value})`, "console")
}

function endScriptMessage(value){
   sendToConsole("Script Completed: "  + UTILS.getNowDate(), "console")
}

module.exports =  {
     init : init,
    debugScript: debugScript,
    closeRightCard,
    saveProperties,
    clearBlockSelectors,
    runScript,
    engineCloseRightCard,
    engineDeleteBlocks,
    filterBlocks,
    searchBlocks,
    sendToConsole,
    buildForms,
    runFlowForm,
    setButtonAsRunning,
    setButtonAsComplete,
    startScriptMessage,
    endScriptMessage,
    clearCmdContent : function(){
         cmdContent = "";
    },
    getCmdContent : function(){
      return cmdContent;
    },
    setCurrentFile : function(file){
         currentFile = file;
    },
    setBuild : setBuild,
    getCurrentBuild : function(){
         return currentBuild;
    },
    buildSelectedFile: buildChoosenFile,
    runSelectedFile : runChoosenScript,
    clearBuilderForm : clearBuilderForm,
    getSelectedBlock : function(){
         return selectedBlock;
    },
    setExecutionState: function(val){
         stopExecution = val;
    },
    getReadme : function(){
         return {
             type : formReadmeType,
             body: formReadme
         };
    },
    setFormPath : function(formpath){
         formPath = formpath;
    },
    getFormPath : function(){
         return formPath;
    },
    getAuditResults : function(){
         if(auditResults.length < 1){
             return "&#10003; <span style='background-color: darkgreen;'>Audit found no issues</span>";
         }else{
             return auditResults;
         }
    },
    getViewPrefix : function(){
         return VIEW_PREFIX;
    },
    showCanvasProperties: function(){
         renderProperties(canvasProperties);
    }


}