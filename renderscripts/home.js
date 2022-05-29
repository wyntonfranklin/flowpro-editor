let interact = require('interactjs');
const { ipcRenderer, clipboard,  shell } = require('electron')
let cmdContent;
const engineFunctions = require("../helpers/functions");
const settingsManager = require('../helpers/settingsManager');
const fileManager = require('../helpers/fileManager');
const world = require("../helpers/world");
const fileParser = require("../helpers/fileParser");
const UTILS = require("../helpers/utils");
const logs = require("../helpers/logs");
const dbHelper = require('../helpers/dbHelper');
const blockHandler = require("../blocks/core");
const flowEngine = require("../renderscripts/engine");
const path = require("path");
const fs = require("fs");
const openExplorer = require('open-file-explorer');
const rawBlocks = blockHandler.getBlocks();
const open = require('open');

let selectedInput = null;
let currentFile= null;
let activeCmdPanel = "console";
let selectedFilePath = null;
let currentProject = null;
let defaultDirPath = "";
let userHomeDirectory = "";
let savedCanvas = "";
let fileToCopy = null;
let modalAction = "";
let currentSelectedBlock = null;
let currentCanvas = 1;
let pauseSaving = false;
let loopStarted = false;
let intervalId = null;


ipcRenderer.on('external-file', function (evt, data) {
    if(data){
        onFileClicked(data, true)
    }
});


ipcRenderer.on('alert-data', function (evt, results) {
    let action = results.action;
    let btnvalues = results.properties;
    if(action == "Open flowpro"){
        if(btnvalues){
            //flowEngine.setCurrentFile(btnvalues);
            //flowEngine.sendToConsole(btnvalues)
            runAScriptFile(btnvalues);
        }
    }else if(action == "Open Link"){
        open(btnvalues);
    }else if(action == "Close Dialog"){

    }

});


document.addEventListener('DOMContentLoaded', function(e){
    init();
    if(currentFile){
        setInterval(updateCurrentFileData, 500);
    }

    // selectors on click actions

    document.getElementById("close").addEventListener("click", function(){
        flowEngine.closeRightCard();
    });


    document.getElementById("savebtn").addEventListener("click", function(){
        flowEngine.saveProperties();
    });

    document.getElementById("canvas").addEventListener("click", function(event){
        if(event.target.id =="canvas"){
            flowEngine.showCanvasProperties();
        }
    });

    document.getElementById("sideview").addEventListener("click", function(event){
        if(event.target.id =="viewer-content"){
            flowEngine.clearBlockSelectors();
            flowEngine.closeRightCard();
        }
    });

    document.getElementById("rp").addEventListener("click", function(event){
        toggleSideView();
    });

    document.getElementById("opwin").addEventListener("click", function(event){
        toggleOutputWindow();
    });

    document.addEventListener('engine.blockadded', e => {
        updateOnResize();
    });

    document.addEventListener('engine.runscript', e => {
        runForm();
    });

    document.addEventListener('engine.snapped', e => {
        if(currentFile){
            updateCurrentFileData();
            fileManager.addToHistory(currentFile, convertEngineToString());
        }

    });

    document.getElementById("cmd-close").addEventListener('click', e => {
        document.getElementById("cmd-layout").style.display = "none";
        updateOnResize();
    });

    document.getElementById("builder-info").addEventListener('click', e => {
        showReadMeWindow();
    });

    document.addEventListener('engine.published', e => {
        runScript();

    });

    document.addEventListener('engine.clearform', e => {
        flowEngine.clearBuilderForm();

    });

    document.getElementById("publish-loop").addEventListener("click", function(){
         runAndRepeat();
    });

    document.getElementById("publish-stop").addEventListener("click", function(){
        clearInterval(intervalId);
        loopStarted = false;
        flowEngine.setButtonAsComplete();
        logs.sendToConsole("The flow stop button has been pressed.");
        UTILS.progressStop();
        flowEngine.setExecutionState(false);
    });


    document.getElementById("view-console").addEventListener('click', e => {
        activeCmdPanel = "console";
        let cmdlay = document.getElementById("cmd-layout");
        if(cmdlay.style.display !== "block"){
            cmdlay.style.display = "block";
        }
        showConsoleMessages();
        refreshView();
    });



    document.getElementById("discard").addEventListener("click", function(){
        clearEngineCanvas();
    });


    document.getElementById("recent-projects").addEventListener("click", function(){
        showLeftPanel("rp-layout");
    });


    document.getElementById("my-blocks").addEventListener("click", function(){
        showLeftPanel("blocks-layout");
    });

    document.getElementById("directory").addEventListener("click", function(){
        showLeftPanel("dir-layout");
    });


    document.getElementById("tgcanvas").addEventListener("click", function(){
        toggleCanvasView();
    });


    document.getElementById("audit").addEventListener("click", function(){
        flowEngine.debugScript();
        logs.sendToConsole("Audit checks started: ------------>" + new Date().toUTCString());
        logs.sendToConsole(flowEngine.getAuditResults());
        logs.sendToConsole("Audit checks completed --------------------->" + new Date().toUTCString())
    });



    document.getElementById('cmd-layout-content').addEventListener('contextmenu', e=>{
        ipcRenderer.invoke('show-context-menu','cmd');
    });



    document.getElementById('viewer').addEventListener('contextmenu', e=>{
        if(e.target.classList.contains("form-input")){
            selectedInput = e.target;
            ipcRenderer.invoke('show-context-menu','input');
        }else{
            ipcRenderer.invoke('show-context-menu','builder');
        }
    });

    document.getElementById("proplist").addEventListener('contextmenu', e=>{
        if(e.target.classList.contains("prop-input")){
            selectedInput = e.target;
            ipcRenderer.invoke('show-context-menu','input');
        }
    });

    document.getElementById('canvas').addEventListener('contextmenu', e=>{
        let currentElement = e.target;
        let showMenu = 'canvas';
        let showMenuOptions = {};
        if(currentElement.classList.contains("block")){
            currentSelectedBlock = currentElement;
            let object = JSON.parse(currentSelectedBlock.getAttribute("data-object"));
            let hasId = (object._id) ? true: false;
            let canBuildFunc = (object.action == "action_file_function") ? true: false
            showMenu = 'block';
            showMenuOptions = { favorite: hasId, canbuild: canBuildFunc };
        }else if(currentElement.classList.contains("blockyname") || currentElement.classList.contains("blockyleft")){
            currentSelectedBlock = currentElement.closest(".block");
            let object = JSON.parse(currentSelectedBlock.getAttribute("data-object"));
            let hasId = (object._id) ? true: false;
            let canBuildFunc = (object.action == "action_file_function") ? true: false
            showMenu = "block";
            showMenuOptions = { favorite: hasId, canbuild: canBuildFunc };
        }else{
            currentSelectedBlock = null;
        }
        ipcRenderer.invoke('show-context-menu',showMenu, showMenuOptions);
    });


    document.getElementById("show-files-selector").addEventListener("change", function(e){
        let result = this.options[this.selectedIndex].value;
        if(result == "files"){
            fileParser.showAllFiles();
            refreshView();
        }else if(result == "project"){
            fileParser.showProjectFiles();
            refreshView();
        }

    });

// toggle console button
    document.getElementById("show-console").addEventListener('click', e=>{
        toggleCmdLayout();
        return false;
    });


    document.getElementById("search").addEventListener('change', e => {

    });

    document.getElementById("search-query").addEventListener('keydown',function(event) {
        if (event.keyCode == 13) {
            flowEngine.searchBlocks(event.target.value)
        }
    });

    document.getElementById("categories").addEventListener('change', e => {
        let currentFilter = e.target.value;
        flowEngine.filterBlocks(e.target.value)
    });



    document.getElementById("name-dir-input").addEventListener('keydown',function(event) {
        if (event.keyCode == 13) {
            let value = event.target.value;
            if(value){
                if(modalAction == "newdir"){
                    saveDirectory(value, function(path){
                        readFilesFromCurrentProject();
                        document.getElementById("new-dir-modal").style.display = "none";
                        event.target.value = "";
                    });
                }else if(modalAction == "paste"){
                    let copySrc = fileToCopy;
                    let desPath = "";
                    let destPathStats = fs.statSync(selectedFilePath);
                    let ext = path.extname(value);
                    let filename = "";
                    if(ext == ".flowpro" || ext == ".fpform"){
                        filename = value;
                    }else{
                        filename = value + ext;
                    }
                    if(!destPathStats.isDirectory()){
                        desPath = path.join(path.dirname(selectedFilePath), filename);
                    }else{
                        desPath = path.join(selectedFilePath, filename);
                    }
                    try{
                        fs.copyFileSync(copySrc, desPath,  fs.constants.COPYFILE_EXCL);
                        document.getElementById("new-dir-modal").style.display = "none";
                        refreshView();
                    }catch (e){
                        logs.sendToConsole(e);
                    }
                }else if(modalAction == "rename"){
                    let fileToRename = selectedFilePath;
                    let ftrStats = fs.statSync(fileToRename);
                    let newFile = path.join(path.dirname(fileToRename), value);
                    try{
                        fs.renameSync(fileToRename, newFile);
                    }catch (e){
                        logs.logger.error(e);
                    }finally {
                        if(currentFile == fileToRename && !ftrStats.isDirectory()){
                            currentFile = newFile;
                            fileManager.removeFiles(fileToRename);
                            onFileClicked(currentFile);
                        }
                        document.getElementById("new-dir-modal").style.display = "none";
                        refreshView();
                    }
                }else if(modalAction == "favorites"){
                    if(currentSelectedBlock){
                        let object = JSON.parse(currentSelectedBlock.getAttribute("data-object"));
                        object.title = value;
                        object.category = "favorites";
                        dbHelper.setCurrentDb("favorites");
                        dbHelper.insert(object);
                        document.getElementById("new-dir-modal").style.display = "none";
                        flowEngine.sendToConsole("Favorite successfully added")
                        refreshView();

                    }
                }else if(modalAction == "renameblock"){
                    if(currentSelectedBlock){
                        currentSelectedBlock.querySelector(".blockyname").innerText = value;
                        document.getElementById("new-dir-modal").style.display = "none";
                    }
                }
            }
        }
    });


    // save on close settings
    setInterval(function(){
        onCloseEvent();
    }, 15000);

    window.addEventListener("unhandledrejection", function(promiseRejectionEvent) {
        // handle error here, for example log
        logs.sendErrorToConsole(promiseRejectionEvent.reason)
        flowEngine.setButtonAsComplete();
        UTILS.progressStop();
        flowEngine.setExecutionState(false);
    });

    window.addEventListener("error", function(error){
        logs.sendErrorToConsole(error.message);
        flowEngine.setButtonAsComplete();
        UTILS.progressStop();
        flowEngine.setExecutionState(false);
    });

});


function clearAllFavorites(){
    dbHelper.setCurrentDb("favorites");
    dbHelper.removeAll(function(){
        flowEngine.sendToConsole("Favorites cleared")
    });
}

function clearLastFavorite(){
    dbHelper.setCurrentDb("favorites");
    dbHelper.removeLastRecord(function(){
        flowEngine.sendToConsole("Last record cleared")
    })
}

function openExportWindow(){
    ipcRenderer.invoke('open-window','export', {});
}

function openInExplorer(){
    let pathToOpen = null;
    let stats = fs.statSync(selectedFilePath);
    if(stats.isDirectory()){
        pathToOpen = selectedFilePath;
    }else{
        pathToOpen = path.dirname(selectedFilePath);
    }
    openExplorer(pathToOpen, err => {
        if(err) {
        }
        else {
            //Do Something
        }
    });
}

function toggleCanvasView(formview){
    let doc = document.getElementById("splitone");
    let docCanvas = document.getElementById("canvas");
    let sideView = document.getElementById("sideview");
    let fixedWidth =  document.getElementById("left").getBoundingClientRect().width;
    let appWidth = document.getElementById("app").getBoundingClientRect().width;
    if(doc.style.display == "block" || formview){
        doc.style.display = "none";
        sideView.style.width = appWidth - fixedWidth -10 + 'px';
        settingsManager.set("formview",true);
    }else{
        doc.style.display = "block";
        let half = (appWidth - fixedWidth) /2 ;
        doc.style.width = half + "px";
        docCanvas.style.width = half + "px";
        sideView.style.width = half + "px";
        settingsManager.set("formview",false);
        refreshView();
    }
}

function toggleOutputWindow(){
    ipcRenderer.invoke('open-window','toggle_screen', {});
}

function showReadMeWindow(){
    ipcRenderer.invoke('open-window','readme', flowEngine.getReadme());
}

function unsetBuild(){
    flowEngine.setBuild(null);

}



function clearTheWorld(){
    world.clear();
}

function viewBlockDetails(){
    let block = flowEngine.getSelectedBlock();
    if(block){
        let object = JSON.parse(block.getAttribute("data-object"));
        ipcRenderer.invoke('open-window','block', { details: object });
    }
}

function viewBlockDetailsCanvas(){
    let block = currentSelectedBlock;
    if(block){
        let object = JSON.parse(block.getAttribute("data-object"));
        ipcRenderer.invoke('open-window','block', { details: object });
    }
}

function getFilePathFromSystem(){
    if(selectedInput){
        ipcRenderer.invoke('show-open-file-dialog',
            { title:'Select a File',
                defaultPath: '', properties: ['openFile','promptToCreate'],   filters: [
                    { name: 'All Files', extensions: ['*'] },
                ] }, ).then((filename)=>{
            if(filename){
                selectedInput.value = filename;
            }
        });
    }
}


function getDirectoryPathFromSystem(){
    if(selectedInput){
        ipcRenderer.invoke('show-open-file-dialog',
            { title:'Select a Directory',
                defaultPath: '', properties: ['openDirectory','createDirectory'],   filters: [
                    { name: 'All Files', extensions: ['*'] },
                ] }, ).then((filename)=>{
            if(filename){
                selectedInput.value = filename;
            }
        });
    }
}


function toggleSideView(){
    let el = document.getElementById("sideview");
    if(el.style.display != "none"){
        el.style.display = "none";
    }else{
        el.style.display = "block";
        let sidePanelWidth = settingsManager.get("sidepanel", 395);
        if(sidePanelWidth == 0){
            sidePanelWidth = 395;
        }
        document.getElementById('sideview').style.width = sidePanelWidth + 'px';
    }
    refreshView();
}


function saveBlockToFavoritesList(){
    currentSelectedBlock = flowEngine.getSelectedBlock();
    saveBlockToFavorites();
}


function saveBlockToFavorites(){
   modalAction = "favorites";
    if(currentSelectedBlock){
        let object = JSON.parse(currentSelectedBlock.getAttribute("data-object"));
        openDirByWorkingDir("Save block as", object.title);
    }
}

function buildBlockFile(){
    if(currentSelectedBlock){
        let object = JSON.parse(currentSelectedBlock.getAttribute("data-object"));
        let properties = object.properties;
        let blockIncludeFile = UTILS.getPropertyValue(properties,0,"", false);
        flowEngine.buildSelectedFile(blockIncludeFile);
    }
}

function renameBlock(){
    if(currentSelectedBlock){
        modalAction = "renameblock";
        let object = JSON.parse(currentSelectedBlock.getAttribute("data-object"));
        openDirByWorkingDir("Change Block Title", object.title);
    }
}


function removeBlockFromFavoritesList(){
    currentSelectedBlock = flowEngine.getSelectedBlock();
    removeBlockFromFavorites();

}

function removeBlockFromFavorites(){
    if(currentSelectedBlock){
        let object = JSON.parse(currentSelectedBlock.getAttribute("data-object"));
       dbHelper.removeRecord(object._id, function(){
            // do something here
           refreshView();
       });
    }
}

function copyAFile(){
    fileToCopy = selectedFilePath;
}

function pasteAFile(){
    if(fileToCopy){
        modalAction = "paste";
        let tempName = path.basename(fileToCopy);
        openDirByWorkingDir("New file name", tempName);
    }
}

function renameAFile(){
    modalAction ="rename";
    let tempName = path.basename(selectedFilePath);
    openDirByWorkingDir("Rename selected file", tempName);
}

function createNewDirectory(){
    modalAction = "newdir";
    openDirByWorkingDir("New Directory Name", "");
}

function copyCanvas(){
    savedCanvas = convertEngineToString();
}

function pasteCanvas(){
    if(savedCanvas){
        importEngineFromString(savedCanvas);
    }
}


function closeSelectedTab(){
    closeTab(selectedFilePath);
}

function closeAllTabs(){
    fileManager.getFileNamesAsArray().forEach((file)=>{
        closeTab(file);
    });
}

function closeAllOtherTabs(){
    fileManager.getFileNamesAsArray().forEach((file)=>{
        if(file !== selectedFilePath){
            closeTab(file);
        }
    });
}

function historyUndo(){
    if(currentFile){
        let prev = fileManager.getHistory(currentFile);
        if(prev){
            flowy.deleteBlocks();
            importEngineFromString(prev);
        }
    }
}

function historyRedo(){

}




function init(){
    dbHelper.init(settingsManager.get("appDir"));
    dbHelper.setCurrentDb("favorites");

    // console.log(dbHelper.getCurrentDb(),"currennt db");

    document.getElementById('cmd-layout').style.height = settingsManager.get('cmdheight',200) + 'px';
    document.getElementById('propwrap').style.width = settingsManager.get("propwidth", 300) + 'px';
    document.getElementById("canvas").style.height = settingsManager.get("canvassize", 5024) + 'px';

    let sidePanelWidth = settingsManager.get("sidepanel", 395);
    if(sidePanelWidth==0){
        sidePanelWidth = 395;
    }
    let formViewValue = settingsManager.get("formview",false);
    if(formViewValue){
        toggleCanvasView(formViewValue);
    }
    document.getElementById('sideview').style.width = sidePanelWidth + 'px';

    if(settingsManager.get("cmdvisibility", false)){
        toggleCmdLayout();
    }
    let openFiles  = settingsManager.get("openfiles", []);
    let doOnce = false;
    flowEngine.init();
    loadRecentProjects();
    document.getElementById("close").click(); // seems to center
    currentProject = settingsManager.get("project");
    if(currentProject && defaultDirPath == ""){
        defaultDirPath = currentProject;
    }
    readFilesFromCurrentProject();
    let lastOpenFile = settingsManager.get("lastfile","");
    openFiles.forEach((file)=>{
        if(file == lastOpenFile){
            onFileClickedActions(file);
            doOnce = true;
        }else{
            fileManager.addFile(file, "");
        }
    });
    loadTabs();
    updateOnResize();
    let lastLeftPanel = settingsManager.get("leftpanel","blocks-layout");
    if(lastLeftPanel){
        showLeftPanel(lastLeftPanel);
    }
    window.addEventListener("click", function(event) {
        let isFocused = (document.activeElement === document.getElementById("name-dir-input"));
        if(!isFocused){
            document.getElementById("new-dir-modal").style.display = "none";
        }
    });
    let openBuild = settingsManager.get("build","");
    if(openBuild){
        flowEngine.buildSelectedFile(openBuild);
    }

    ipcRenderer.invoke('get-external-file');

}

function checkforfile(){
    ipcRenderer.invoke('get-external-file');
}

function clearBuilderForm(){
    flowEngine.clearBuilderForm();
}

function addToLogger(message){
    logs.logger.info(message);
}

function openSettingsWindow(){
    ipcRenderer.invoke('open-window','settings', { });
}

function saveDirectory(value, callback){
    let fullpath = path.join(defaultDirPath, value);
    fs.mkdir(fullpath, (err) => {
        if (err) {
            throw err;
        }
        if(callback){
            callback(path);
        }
    });
}

function readFilesFromCurrentProject(){
    let projectDir = currentProject;
    let directoryContent = "";
    document.getElementById("dir-layout").innerHTML = "";
    if(currentProject){
        fileParser.readFilesFromDir(projectDir, "", currentFile, fileManager.getDir(), function(html){
            // fileManager.addDir(projectDir);
            directoryContent += fileParser.createDirectoryLink("dir", projectDir);
            directoryContent += fileParser.openSubDirectory();
            directoryContent += html;
            directoryContent += fileParser.closeSubDirectory();
            document.getElementById("dir-layout").innerHTML = directoryContent;
            setDirectoryListeners();
        });
    }
}

function loadRecentProjects(){
    let output = '<ul class="rp-list">';
    let projects = settingsManager.get("recent");
    if(Array.isArray(projects)){
        projects.forEach(file=>{
            let fname = path.basename(file);
                output += `<li  title="${file}" class="rp-item" data-file="${file}"><img src="../assets/ic_text_file.png" style="width: 20px;"/> ${fname}</li>`;
        });
    }
    output += '</ul>';
    document.getElementById("rp-layout").innerHTML = output;
    const divs = document.querySelectorAll('.rp-item');
    divs.forEach( el => {
        el.addEventListener('dblclick', function(event){
            let clickedFile = event.target.getAttribute("data-file");
            onFileClicked(clickedFile,true);
        });
    });
}
function setStyling(){

}

function exportSelectedFile(){
    ipcRenderer.invoke('open-window','export', {
        file : selectedFilePath
    });
}

function createNewAction(){
    openSaveDialog();

}

function saveCurrentFile(){
    if(currentFile){
        saveToCurrentFile(currentFile, convertEngineToString());
    }else{
        saveToFile();
    }
}

function saveAsToFile(){
    let data = convertEngineToString()
    openSaveDialog(data);
}

function saveToFile(callback){
    if(currentFile){
        saveToCurrentFile(currentFile, convertEngineToString(), callback);
    }else{
        let data = convertEngineToString()
        openSaveDialog(data, callback);
    }
}

function saveAFile(filepath,content, callback) {
    try {
        if(content != undefined){
            fs.writeFileSync(filepath, content);
            if(callback){
                callback(filepath);
            }
        }
    } catch (err) {

    }
}

function openFileDialog(){
    ipcRenderer.invoke('show-open-file-dialog',
        { title:'Choose File to Upload',
            defaultPath: '', properties: ['openFile'],   filters: [
                { name: 'All Files', extensions: ['*'] },
                { name: 'FlowPro', extensions: ['flowpro'] }
            ] }, ).then((filename)=>{
        if(filename){
            onFileClicked(filename);
        }
    });
}

function startANewChart(){
    if(currentFile){
        saveToCurrentFile(currentFile);
    }
    currentFile = null;
    flowy.deleteBlocks();
    openSaveDialog();
}

function onFileClicked(filename, buildfile){
    flowEngine.engineCloseRightCard();
    let ext = path.extname(filename);
    if(ext == ".flowpro" || ext == ".fpform"){
        if(fileManager.getFiles().length == 0 && (convertEngineToString() != undefined)){
            ipcRenderer.invoke('show-open-file-dialog',{
                title: "Do you want to saved changes" ,
                buttons: ["Yes","No", "Cancel"],
                message: "You have unsaved changes to a canvas. Save to file?",
            }, "confirm_dialog").then((result) =>{
                if(result.response ===0){
                    saveToFile(function(){
                        onFileClickedActions(filename, buildfile);
                    });
                }else{
                    onFileClickedActions(filename, buildfile);
                }
            });
        }else{
            onFileClickedActions(filename,buildfile);
        }
    }
}

function onFileClickedActions(filename, buildfile){
    let fileType = path.extname(filename);
    if(fileType == ".fpform" || fileType == ".flowpro"){
        document.getElementById("canvas").scrollIntoView({block: "start", inline: "nearest"});
        flowEngine.setFormPath(null);
        if(fileType == ".fpform"){
            let results = importFormDataFromFile(filename);
            if(results){
                loadFlowProFile(results.build, buildfile);
                flowEngine.setFormPath(filename);
                // apply form values
                let formValues = results.data;
                Object.keys(formValues).forEach(key=>{
                   // console.log(document.getElementsByName(key)[0])
                    document.getElementsByName(key)[0].value =  formValues[key];
                });
            }
        }else{
            loadFlowProFile(filename, buildfile);
        }
    }else{
        // deal with other files
        let images = [".png",".jpeg",".gif",".jpg",".html"];
        if(images.indexOf(fileType) !== -1) {
            window.open(filename)
        }else{
            open(filename);
        }
    }
}

function importFormDataFromFile(filename){
    try {
        let buffer = fs.readFileSync(filename);
        let fileData = JSON.parse(buffer.toString("utf8"));
        return fileData;
    }catch (e){
        logs.sendErrorToConsole(e);
        return null;
    }
}

function loadFlowProFile(filename, buildfile){
    let shortname = path.basename(filename);
    currentFile = filename;
    world.clear();
    importEngineDataFromFile(filename);
    fileManager.addFile(filename, convertEngineToString());
    loadRecentProjects();
    updateOnResize();
    refreshView();
    flowEngine.setCurrentFile(filename);
    flowEngine.debugScript();
    document.getElementById("tab-reminder").innerText = shortname;
    if(buildfile){
        flowEngine.buildSelectedFile(filename);
    }
}

/*
function openFileOutSideApp(filepath){
    flowEngine.sendToConsole("opening external file" + filepath);
    onFileClicked(filepath);
}*/

function closeCurrentFile(){
    closeTab(currentFile);
}

function closeCurrentProject(){
    currentProject = null;
    settingsManager.set('project', "");
    readFilesFromCurrentProject();
}


function buildAndRun(){
    flowEngine.buildForms();
    runScript();
}


function runScript(){
    if(!loopStarted){
        flowEngine.setCurrentFile(currentFile);
        let filename = path.basename(currentFile);
        //flowEngine.sendToConsole("Script started: " + new Date().toUTCString() + ` (${filename})`, "console");
        flowEngine.startScriptMessage(filename);
        UTILS.progressStart();
        flowEngine.runScript(function(){
            //flowEngine.sendToConsole("Script Completed: "  + new Date().toUTCString(), "console");
            flowEngine.endScriptMessage();
            UTILS.progressStop();
            //  showConsoleMessages();
        });
    }
}


function runAScriptFile(file){
    if(!loopStarted){
        flowEngine.setCurrentFile(file);
        let filename = path.basename(file);
        //flowEngine.sendToConsole("Script started: " + new Date().toUTCString() + ` (${filename})`, "console");
        flowEngine.startScriptMessage(filename);
        UTILS.progressStart();
        flowEngine.runSelectedFile(file,function(){
            //flowEngine.sendToConsole("Script Completed: "  + new Date().toUTCString(), "console");
            flowEngine.endScriptMessage();
            UTILS.progressStop();
            //  showConsoleMessages();
        });
    }
}


function runForm(){
    //flowEngine.setCurrentFile(currentFile);
    if(flowEngine.getCurrentBuild()){
        let filename = path.basename(flowEngine.getCurrentBuild());
        flowEngine.sendToConsole("Script started: " + UTILS.getNowDate() + `(${filename})`, "console");
        UTILS.progressStart();
        flowEngine.runFlowForm(function(){
            flowEngine.sendToConsole("Script Completed: "  + UTILS.getNowDate(), "console");
            UTILS.progressStop();
        });
    }
}

function runFormRepeat(){
    ipcRenderer.invoke('show-open-file-dialog',{
        title: "Run a repeating script" ,
        buttons: ["Yes","No", "Cancel"],
        message: "Do you want to run repeat this script",
    }, "confirm_dialog").then((result) =>{
        if(result.response ===0){
            if(flowEngine.getCurrentBuild()){
                loopStarted = true;
                clearInterval(intervalId);
                let repeatTime = settingsManager.get("repeat",2000);
                intervalId = setInterval(function(){
                    flowEngine.sendToConsole("Script started: " + new Date().toUTCString() + " (place filename)", "console");
                    flowEngine.runFlowForm(function(){
                        flowEngine.sendToConsole("Script Completed: "  + new Date().toUTCString(), "console");
                        loopStarted = false;
                    });
                }, repeatTime);
            }
        }
    });
}

function runAndRepeat(){
    ipcRenderer.invoke('show-open-file-dialog',{
        title: "Run a repeating script" ,
        buttons: ["Yes","No", "Cancel"],
        message: "Do you want to run repeat this script",
    }, "confirm_dialog").then((result) =>{
        if(result.response ===0){
            flowEngine.setCurrentFile(currentFile);
            clearInterval(intervalId);
            let repeatTime = settingsManager.get("repeat",2000);
            intervalId = setInterval(function(){
                if(loopStarted == false){
                    flowEngine.sendToConsole("Script started: " + new Date().toUTCString() + " (place filename)", "console");
                    loopStarted = true;
                    flowEngine.runScript(function(){
                        flowEngine.sendToConsole("Script Completed: "  + new Date().toUTCString(), "console");
                        loopStarted = false;
                    });
                }
            }, repeatTime);
        }
    });

}


function buildSelectedFile(){
    if(selectedFilePath){
        flowEngine.buildSelectedFile(selectedFilePath);
    }
}

function buildForms(){
    flowEngine.buildForms();
}

function openSaveDialog(filedata, callback){
    currentFile = null;
    ipcRenderer.invoke('show-open-file-dialog',
        { title:'Create new flow chart',
            defaultPath: defaultDirPath, properties: [] }, "save").then((filename)=>{
        if(filename){
            var ext = path.extname(filename);
            if(ext != ".flowpro"){
                filename = filename + ".flowpro";
            }
            currentFile = filename;
            saveToCurrentFile(currentFile, filedata);
            onFileClicked(currentFile);
            if(callback){
                callback();
            }
        }
    });
}

function getFormSaveData(){
    const formData = new FormData(document.getElementById('viewer-content'));
    let dataObject = {};
    for (let pair of formData.entries()) {
        dataObject[pair[0]] =  pair[1];
    }
    let buildFile = flowEngine.getCurrentBuild();
    let filedata = {
        build: buildFile,
        data: dataObject
    }
    let fileContents = JSON.stringify(filedata);
    return fileContents;
}


function saveForm(){
    let fileContents = getFormSaveData();
    if(flowEngine.getFormPath()){
        saveAFile(flowEngine.getFormPath(), fileContents,function(){

        });
    }else{
        saveFormAsFile();
    }
}

function saveFormAsFile(){
    let fileContents = getFormSaveData();
    ipcRenderer.invoke('show-open-file-dialog',
        { title:'Save flowpro as form',
            defaultPath: defaultDirPath, properties: [] }, "save").then((filename)=>{
        if(filename){
            var ext = path.extname(filename);
            if(ext != ".fpform"){
                filename = filename + ".fpform";
            }
            saveAFile(filename, fileContents,function(){
                flowEngine.setFormPath(filename);
                refreshView();
            });
        }
    });

}


function loadTabs(){
    let taboutput = '';
    document.getElementById("tabscontent").innerHTML = "";
    fileManager.getFileNamesAsArray().forEach((tab)=>{
        let filename = path.basename(tab);
        if(tab == currentFile){
            taboutput += ` <li title="${tab}" class="tab active noselect" data-filename="${tab}"><a class="tab-open">${filename}</a> &nbsp;<a class="tab-close">&#xd7;&nbsp;&nbsp;</a></li>`;
        }else{
            taboutput += ` <li title="${tab}" class="tab noselect" data-filename="${tab}"><a class="tab-open">${filename}</a> &nbsp;<a class="tab-close">&#xd7;&nbsp;&nbsp;</a></li>`;
        }
    });
    document.getElementById("tabscontent").innerHTML = taboutput;
    const divs = document.querySelectorAll('.tab');
    divs.forEach( el => {
        let closeEl = el.querySelector(".tab-close");
        if(closeEl){
            closeEl.addEventListener('click',(event)=>{
                let selectedFileName = event.target.closest(".tab").getAttribute("data-filename");
                closeTab(selectedFileName);
                event.preventDefault();
            });
        }
        let tabOpenEl = el.querySelector(".tab-open");
        if(tabOpenEl){
            tabOpenEl.addEventListener('click', (event)=>{
                let selectedFileName = event.target.closest(".tab").getAttribute("data-filename");
                if(selectedFileName && selectedFileName !== ""){
                    onFileClicked(selectedFileName, true);
                }else{
                    if(currentFile){
                        saveToCurrentFile(currentFile);
                    }
                }
            });

            tabOpenEl.addEventListener('contextmenu', event=>{
                let selectedFileName = event.target.closest(".tab").getAttribute("data-filename");
                selectedFilePath = selectedFileName;
                var ext = path.extname(selectedFileName);
                ipcRenderer.invoke('show-context-menu',"tab", {
                    extension : ext
                });
            });

        }
    });

}


function deleteSelectedFile(){
    if(selectedFilePath){
        ipcRenderer.invoke('show-open-file-dialog',{
            title: "Delete a file" ,
            buttons: ["Yes","No", "Cancel"],
            message: "Are you sure you want to delete this file?",
        }, "confirm_dialog").then((result) =>{
            if(result.response ===0){
                pauseSaving = true;
                let file = selectedFilePath;
                let stats = fs.statSync(file);
                if(stats.isFile()){
                    try{
                        fs.unlinkSync(file);
                        onFileRemovedCallback(file);
                        pauseSaving = false;
                    }catch (e){

                    }
                    /*
                    ipcRenderer.invoke('remove-a-file', file).then((status)=>{
                        onFileRemovedCallback(file);
                    });*/
                }
            }
        });
    }
}

function refreshView(){
    loadTabs();
    readFilesFromCurrentProject();
    updateOnResize();
}

function onFileRemovedCallback(file){
    if(currentFile == file){
        flowy.deleteBlocks();
    }
    currentFile = null;
    let id = fileManager.removeFiles(file, currentFile);
    flowEngine.setFormPath(null);
    refreshView();
}

function closeTab(filename){
    let nextfile = fileManager.removeFiles(filename, currentFile);
    document.getElementById("tab-reminder").innerText = "No File";
    flowy.deleteBlocks();
    if(nextfile){
        onFileClicked(nextfile);
    }else if(fileManager.getFiles().length >= 1){
       onFileClicked(currentFile);
    }else{
        currentFile = null;
    }
   refreshView();
}

function saveToCurrentFile(filename, chartcontent, callback){
    let content = null;
    if(chartcontent == undefined){
        content = "";
    }else{
        content = chartcontent;
    }
    fileManager.saveFile(filename, content);
    saveAFile(filename, content, function(){
        if(callback){
            callback();
        }
    });
}

function convertEngineToString(){
    try{
        return JSON.stringify(flowy.output());
    }catch (e){
        return "";
    }
}

function importEngineFromString(data){
    let fileData = JSON.parse(data);
    addToCanvas(fileData);
}

function editFormScript(){
    let buildScript = flowEngine.getCurrentBuild();
    onFileClicked(buildScript);
}


function importEngineDataFromFile(file){
    let buffer = null;
    try{
        buffer = fs.readFileSync(file);
        let fileData = JSON.parse(buffer.toString("utf8"));
        addToCanvas(fileData);
        document.getElementById("sv-preview").innerHTML = fileData.html.replaceAll("block", "prev");
    }catch (e){
        //fileManager.removeFromRecent(file);
        addToCanvas("");
       // currentFile = null;
        //logs.logger.info(e);
    }
}

function addToCanvas(fileData){
    try{
        flowy.deleteBlocks();
        if(fileData){
            flowy.import(fileData);
        }
    }catch (e){
        logs.logger.info(e);
    }
}

function updateCurrentFileData() {
    if(currentFile && !pauseSaving){
        let dataToSave = convertEngineToString();
        if(dataToSave != null && dataToSave.length > 2){
            fileManager.saveFile(currentFile, convertEngineToString());
            saveCurrentFile();
        }
    }
}

function updateOnResize(){
    let navHeight = 26;
    var leftPanel = document.getElementById('left');
    var rightPanel = document.getElementById('right');
    var cmdPanel = document.getElementById('cmd-layout');
    let canvasPanel = document.getElementById('splitone');
    let canvas = document.getElementById('canvas');
    let canvasContainer = document.getElementById('canvas-container');
    var sidePanel = document.getElementById('sideview');
    var propertiesPanel = document.getElementById('propwrap');
    var tabsPanel = document.getElementById('tabs');
    let builderViewer = document.getElementById("viewer-content");
    var app = document.getElementById('app');
    var cmdHeight = cmdPanel.clientHeight;
    leftPanel.style.height =(app.clientHeight - 36) -cmdHeight +'px'
    rightPanel.style.height = (app.clientHeight - 36) - cmdHeight +'px';
    propertiesPanel.style.height = rightPanel.getBoundingClientRect().height  + 'px';
    document.getElementById('properties').style.height = propertiesPanel.style.height;
    let rightPanelWidth = ((app.clientWidth -10) -  (Math.round(leftPanel.getBoundingClientRect().width)));
    let middleWidth = app.getBoundingClientRect().width -leftPanel.getBoundingClientRect().width - sidePanel.getBoundingClientRect().width - 10;
    rightPanel.style.width = rightPanelWidth + "px";
    canvasPanel.style.width = (middleWidth)  + "px";
    canvas.style.width = (middleWidth) + "px";
    canvasContainer.style.width = (middleWidth) + "px";
    //canvas.style.paddingBottom = "30px";
    canvasPanel.style.top = navHeight + "px";
   // canvasPanel.style.left = sidePanel.getBoundingClientRect().right + 'px';
    builderViewer.style.height = rightPanel.getBoundingClientRect().height - 100 + 'px';
    sidePanel.style.top = navHeight + "px";
    sidePanel.style.right = "0px";
    tabsPanel.style.bottom = cmdHeight + navHeight + "px";
    tabsPanel.style.width = (middleWidth)  + "px";
    if(isOverflown(tabsPanel)){
        tabsPanel.style.height = "52px";
        canvasPanel.style.height = rightPanel.getBoundingClientRect().height - 70 +'px';
        canvasContainer.style.height = rightPanel.getBoundingClientRect().height - 70 +'px';
    }else{
        tabsPanel.style.height = "37px";
        canvasPanel.style.height = rightPanel.getBoundingClientRect().height - 55 +'px';
        canvasContainer.style.height = rightPanel.getBoundingClientRect().height - 55 +'px';
    }
}



function isOverflown(element) {
    return element.scrollWidth > element.clientWidth;
}


function showLeftPanel(panel){
    let panels = ["rp-layout","blocks-layout","dir-layout"];
    panels.forEach((el)=>{
        if(el == panel){
            document.getElementById(el).style.display = "block";
        } else{
            document.getElementById(el).style.display = "none";
        }
    });
    settingsManager.set("leftpanel", panel);
    if(panel == "blocks-layout"){
        document.getElementById("recent-projects").classList.remove("active");
        document.getElementById("directory").classList.remove("active");
        document.getElementById("my-blocks").classList.add("active");
    }else if(panel == "rp-layout"){
        document.getElementById("recent-projects").classList.add("active");
        document.getElementById("directory").classList.remove("active");
        document.getElementById("my-blocks").classList.remove("active");
    }else if(panel == "dir-layout"){
        document.getElementById("recent-projects").classList.remove("active");
        document.getElementById("my-blocks").classList.remove("active");
        document.getElementById("directory").classList.add("active");
    }
}


function copyFilePath(){
    if(selectedFilePath){
        clipboard.writeText(selectedFilePath);
    }
}

function setDirectoryListeners(){
    const divs = document.querySelectorAll('.file-link');
    divs.forEach(el => {
        // on context menu
        el.addEventListener('contextmenu', e=>{
            fileParser.undoDirectoryStyling();
            let file = e.target.getAttribute("data-path");
            selectedFilePath = file;
            e.target.classList.add("active");
            var ext = path.extname(file);
            ipcRenderer.invoke('show-context-menu',"file", {
                extension : ext,
                canpaste : !!(fileToCopy)
            });
        });


        el.addEventListener('click', event => {
            let file = event.target.getAttribute("data-path");
            let fileType = event.target.getAttribute("data-type");
            fileParser.undoDirectoryStyling();
            event.target.classList.add("active");
        });


        // on double click
        el.addEventListener('dblclick', event => {
            //selectedFileElement = event.target;
            let el = document.getElementById('code-input');
            let file = event.target.getAttribute("data-path");
            let fileType = event.target.getAttribute("data-type");
            if(fileType === "file"){
                onFileClicked(file, true);
            }else if(fileType === 'dir'){
                onDirectoryClickEvent(event, file);
            }
        })


    });
}

function onDirectoryClickEvent(e, file){
    //currentFile = null;
    fileManager.addDir(file);
    readFilesFromCurrentProject();
}


function clearEngineCanvas(){
    ipcRenderer.invoke('show-open-file-dialog',{
        title: "Clear current canvas" ,
        buttons: ["Yes","No", "Cancel"],
        message: "Clear the current canvas. You will lose unsaved changes",
    }, "confirm_dialog").then((result) =>{
        if(result.response ===0){
            flowEngine.engineDeleteBlocks();
        }
    });
}

function engineUndo(){
  //  historyUndo();
}



function openDirectory(){
    ipcRenderer.invoke('show-open-file-dialog',
        { title:'Choose Directory to Open',
            defaultPath: defaultDirPath, properties: ['openDirectory','createDirectory'] }, ).then((filename)=>{
        if(filename){
            settingsManager.set('project', filename);
            currentProject = filename;
            readFilesFromCurrentProject();
        }
    });
}



function createANewFile(){
    getCurrentWorkingDirectoryBySelectedFile();
    createNewAction();
}

function openDirByWorkingDir(title, placeholder){
    getCurrentWorkingDirectoryBySelectedFile();
    let dirDialog = document.getElementById("new-dir-modal");
    dirDialog.querySelector("p").innerText = title;
    dirDialog.querySelector("#name-dir-input").value = placeholder;
    dirDialog.style.left = window.innerWidth /2 + 'px';
    dirDialog.style.bottom = (window.innerHeight/2) +30 + 'px';
    dirDialog.style.display = "block";
}

function getCurrentWorkingDirectoryBySelectedFile(){
    if(selectedFilePath){
        let destPathStats = fs.statSync(selectedFilePath);
        if(!destPathStats.isDirectory()){
            defaultDirPath = path.dirname(selectedFilePath);
        }else{
            defaultDirPath = selectedFilePath;
        }
        return defaultDirPath;
    }
}


function toggleCmdLayout(){
    let cmdEl = document.getElementById("cmd-layout");
    if(cmdEl.style.display == "block"){
        cmdEl.style.display = "none";
    }else{
        cmdEl.style.display = "block";
    }
    updateOnResize();
}

function showConsole(){
    let cmdEl = document.getElementById("cmd-layout");
    cmdEl.style.display = "block";
    updateOnResize();
}


function showConsoleMessages(){
    let currentTextEl = document.getElementById('cmd-content');
    if(activeCmdPanel == "console"){
        currentTextEl.innerHTML = flowEngine.getCmdContent();
    }else if(activeCmdPanel == "logs"){
        let logfile = fs.readFileSync(path.join(settingsManager.get("appDir"), "error.log")).toString("utf8");
        currentTextEl.innerText = logfile;
    }
    currentTextEl.scrollIntoView({block: "end", inline: "nearest"});
}

function clearCmdBuffer(){
    document.getElementById('cmd-content').innerText = "";
    flowEngine.clearCmdContent();
}

function onCloseEvent(){
    let cmdPanel = document.getElementById('cmd-layout');
    let sidePanel = document.getElementById("sideview");
    let propertiesPanel = document.getElementById("propwrap");
    settingsManager.set('cmdwidth', cmdPanel.getBoundingClientRect().height);
    settingsManager.set("propwidth", propertiesPanel.getBoundingClientRect().width);
    if(cmdPanel.style.display == "block"){
        settingsManager.set('cmdvisibility', true);
    }else{
        settingsManager.set('cmdvisibility', false);
    }
    if(fileManager.getFileNamesAsArray().length > 0){
        if(!pauseSaving){
            settingsManager.set("openfiles", fileManager.getFileNamesAsArray());
        }
    }
    settingsManager.set("lastfile", currentFile);
    if(sidePanel.getBoundingClientRect().width > 50){
        settingsManager.set("sidepanel",sidePanel.getBoundingClientRect().width);
    }
    if(flowEngine.getCurrentBuild()){
        settingsManager.set("build", flowEngine.getCurrentBuild());
    }
    return true;
}


// on drag

interact('.resize-drag-top')
    .resizable({
        margin: 30,
        distance: 5,
        // resize from all edges and corners
        edges: {top: true },
        listeners: {
            move (event) {
                var target = event.target
                var x = (parseFloat(target.getAttribute('data-x')) || 0)
                var y = (parseFloat(target.getAttribute('data-y')) || 0)
                target.style.height = event.rect.height + 'px'
                y += event.deltaRect.top
                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)
                updateOnResize();
            }
        },
        modifiers: [
            // keep the edges inside the parent
            interact.modifiers.restrictEdges({
                outer: 'parent'
            }),
            // minimum size
            interact.modifiers.restrictSize({
                min: { width: 160, height: 50 }
            })
        ],
        inertia: true
    });



interact('.resize-drag')
    .resizable({
        margin: 30,
        distance: 5,
        edges: {right: true },
        listeners: {
            move (event) {
                var target = event.target
                var x = (parseFloat(target.getAttribute('data-x')) || 0)
                var y = (parseFloat(target.getAttribute('data-y')) || 0)
                target.style.width = event.rect.width + 'px'
                target.style.height = event.rect.height + 'px'
                x += event.deltaRect.left
                y += event.deltaRect.top
                target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
                updateOnResize();
            }
        },
        modifiers: [
            interact.modifiers.restrictEdges({
                outer: 'parent'
            }),
            interact.modifiers.restrictSize({
                min: { width: 160, height: 50 }
            })
        ],
        inertia: true
    })


interact('.resize-left')
    .resizable({
        margin: 30,
        distance: 3,
        edges: {left: true },
        listeners: {
            move (event) {
                var target = event.target
                var x = (parseFloat(target.getAttribute('data-x')) || 0)
                var y = (parseFloat(target.getAttribute('data-y')) || 0)
                target.style.width = event.rect.width + 'px'
                target.style.height = event.rect.height + 'px'
                x += event.deltaRect.left
                y += event.deltaRect.top
                //target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
                updateOnResize();
            }
        },
        modifiers: [
            interact.modifiers.restrictEdges({
                outer: 'parent'
            }),
            interact.modifiers.restrictSize({
                min: { width: 160, height: 100 }
            })
        ],
        inertia: true
    })
