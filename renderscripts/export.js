const { ipcRenderer,clipboard } = require('electron')
const fs = require("fs");
const path = require("path");
const UTILS = require("../helpers/utils");

let packageFiles = [];
let selectedFolderPath = "";


ipcRenderer.on('data', function (evt, results) {
    if(results.file){
        packageFiles.push(results.file);
        displayPackageListing();
    }
});


document.getElementById("add-file").addEventListener("click", function(){
    ipcRenderer.invoke('show-open-file-dialog',
        { title:'Select a File',
            defaultPath: '', properties: ['openFile'],   filters: [
                { name: 'All Files', extensions: ['*'] },
                { name: 'Flowpro', extensions: ['flowpro','fpform'] },
            ] }, ).then((filename)=>{
        if(filename){
            //onFileClicked(filename);
            packageFiles.push(filename);
            displayPackageListing();
        }
    });
});

document.getElementById("remove-files").addEventListener("click", function(){
    packageFiles.pop();
    displayPackageListing();
});


document.getElementById("select-folder").addEventListener("click", function(){
    ipcRenderer.invoke('show-open-file-dialog',
        { title:'Select a Directory',
            defaultPath: '', properties: ['openDirectory'],   filters: [
                { name: 'All Files', extensions: ['*'] },
            ] }, ).then((filename)=>{
        if(filename){
            document.getElementById("package-to").value = filename;
           selectedFolderPath = filename;
        }
    });
});


document.getElementById("export-project").addEventListener("click", function(){
    createPackage();
});

document.getElementById("export-cancel").addEventListener("click", function(){
    packageFiles = [];
    ipcRenderer.invoke('open-window','export_close', {});
});


function displayPackageListing(){
    let pl = document.getElementById("package-listing");
    let html = '';
    packageFiles.forEach(file=>{
        html += `<span class="ex-file noselect">${file}</span><br>`;
    });
    pl.innerHTML = html;
}


function createPackage(){
    let folderName = document.getElementById("folder-name").value;
    let projectPath = path.join(selectedFolderPath, folderName);
    if(folderName && projectPath && packageFiles.length > 0){
        fs.access(projectPath, (error) => {
            if (error) {
                fs.mkdir(projectPath, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        packageFiles.forEach(file=>{
                            let srcFile = file;
                            let destFile = path.join(projectPath, path.basename(file));
                            fs.copyFileSync(srcFile, destFile);
                        });
                        packageFiles = [];
                        console.log("New Directory created successfully !!");
                    }
                });
            } else {
                console.log("Given Directory already exists !!");
            }
        });
    }else{
        UTILS.errorNoise();
    }
}