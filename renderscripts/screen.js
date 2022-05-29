const { ipcRenderer,clipboard } = require('electron')
const fs = require("fs");
const path = require("path");
let screenData = "";
let appEl = document.getElementById("app");


ipcRenderer.on('display', function (evt, results) {
    let styleEl = document.getElementById("stylingcontents");
    styleEl.innerText = styleEl.innerText + results.styling;
    document.getElementById('app-content').innerHTML = results.message;
    document.getElementById("screen-title").innerText = results.title;
    document.getElementById("screen-description").innerText = results.excerpt;
    if(!results.title){
        document.getElementById('screen-title').style.display = 'none';
    }else{
        document.getElementById('screen-title').style.display = 'block';
    }
    if(!results.excerpt){
        document.getElementById('screen-description').style.display = 'none';
    }else{
        document.getElementById('screen-description').style.display = 'none';
    }
    screenData = results.excerpt;
});


document.body.addEventListener('contextmenu', e=>{
    ipcRenderer.invoke('show-context-menu','screen');
});

function clearScreen(){
    document.getElementById('app-content').innerHTML = "";
    document.getElementById("screen-title").innerText = "";
    document.getElementById("screen-description").innerText = "";
}


function saveAsText(){
    let content = appEl.innerText;
    openFileDialog(content);
}

function saveAsHtml(){
    let content = appEl.innerHTML;
    openFileDialog(content);
}

function clipboardText(){
    let content = appEl.innerText;
    clipboard.writeText(content);
}

function clipboardHtml(){
    let content = appEl.innerHTML;
    clipboard.writeText(content);
}

function openFileDialog(content){
    ipcRenderer.invoke('show-open-file-dialog',
        { title:'Create nwe file',
            defaultPath: "", properties: [] }, "save").then((filename)=>{
        if(filename){
            var ext = path.extname(filename);
            saveAFile(filename, content, function(){

            });
        }
    });
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
      //  console.error(err)
    }
}