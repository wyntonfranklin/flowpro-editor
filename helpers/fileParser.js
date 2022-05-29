const fs = require('fs');
const path = require('path');
let showProject = true;

function readFilesFromDirSync(dir, callback) {
    let files = fs.readdirSync(dir);
    callback(files);
}

function getAlternativeIconByFileType(ftype){
    let images = [".png",".jpeg",".gif"];
    let excel = [".xlsx",".csv","xls"];
    let code = [".php",".js",".py",".java",".cpp",".html",".jar"];
    if(images.indexOf(ftype) !== -1) {
        return "../assets/ic_picture_16.png";
    }else if(excel.indexOf(ftype) !== -1){
        return "../assets/ic_excel_16.png";
    }else if(code.indexOf(ftype) !== -1){
        return "../assets/ic_code_16.png";
    }else{
        return "../assets/ic_text_file_16.png";
    }
}

let createDirectoryLink = (type, file, styleclass) => {
    let fname = path.basename(file);
    let fileType = path.extname(file);
    let fileIcon = "../assets/ic_flowpro.png";
    if(fileType == ".fpform"){
        fileIcon = "../assets/ic_edit_pencil_16.png";
    }else if(fileType == ".flowpro"){
        fileIcon = "../assets/ic_water_16.png";
    }else{
        fileIcon = getAlternativeIconByFileType(fileType);
    }
    let  tempFolder = ` <li class="directory-parent"><a title="${fname}" data-type="dir" data-path="${file}" class="file-link ${styleclass}"><img src="../assets/ic_folder.png"> ${fname}</a></li>`;
    let  tempFile = ` <li class="directory-parent"><a draggable="true" title="${fname}" data-type="file" data-path="${file}" class="file-link ${styleclass}"><img src="${fileIcon}"> ${fname}</a></li>`;
    if(type === 'dir'){
        return tempFolder;
    }
    return tempFile;
}

let openSubDirectory = () => {
    return `<ul class="directory-lister-sub">`;
}


let closeSubDirectory = () => {
    return '</ul>';
}


function readFilesFromDir(dir, currentDirectory, currentFile, openDir, callback) {
    console.log(currentFile, "current file");
    let fileListing = '';
    let directoryListing = '';
    readFilesFromDirSync(dir, (files)=>{
        files.forEach(function (file) {
            file = path.resolve(dir, file);
            var stats = fs.statSync(file);
            if(stats.isDirectory()){
                if(currentDirectory === file){
                    directoryListing += createDirectoryLink("dir", file,"active");
                }else{
                    directoryListing += createDirectoryLink("dir", file,"");
                }
                if( openDir.indexOf( file) !== -1){
                    readFilesFromDir(file, "", currentFile,openDir,(html)=>{
                        directoryListing += openSubDirectory();
                        directoryListing += html;
                        directoryListing += closeSubDirectory();
                    });
                }
            }else{
                let ext = path.extname(file).replace(/\./g,' ').trim();
                //let fileObject = helper.getObjectFromArrayByKey(openFiles,'name', file);
                if(showProject  && (ext === "flowpro" || ext == "fpform")){
                    if(currentFile === file){
                        fileListing += createDirectoryLink("file", file,"active");
                    }else{
                        fileListing += createDirectoryLink("file", file,"");
                    }
                }else if(!showProject){
                    if(currentFile === file){
                        fileListing += createDirectoryLink("file", file,"active");
                    }else{
                        fileListing += createDirectoryLink("file", file,"");
                    }
                }
            }
        });
        callback(directoryListing + fileListing);
    })
}

function undoDirectoryStyling(){
    const divs = document.querySelectorAll('.file-link');
    divs.forEach( el => {
        el.classList.remove("active");
    })
}

module.exports =  {
     readFilesFromDir,
    undoDirectoryStyling,
    createDirectoryLink,
    openSubDirectory,
    closeSubDirectory,
    showAllFiles : function(){
         showProject = false;
    },
    showProjectFiles : function(){
         showProject = true;
    }
}