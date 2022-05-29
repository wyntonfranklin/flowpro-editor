const settingsManager = require("../helpers/settingsManager");
let openFiles = [];
let openDirs = [];

module.exports =  {
    getFiles: function(){
      return openFiles;
    },
    getDir : function(){
        return openDirs;
    },
    hasFiles : function(){
        if(openFiles.length > 0){
            return true;
        }else{
            return false;
        }
    },
    removeFromRecent : function(filename){
        let recents = settingsManager.get("recent",[]);
        let newRecents = recents.filter( file=> file !== filename);
        settingsManager.set("recent", newRecents);
    },
    doesFileExists : function(file){
        let duplicate = false;
        openFiles.forEach((open_file)=>{
            if(open_file.name == file){
                duplicate = true;
            }
        });
        return duplicate;
    },
    addDir : function(filename){
        if ( openDirs.indexOf( filename ) === -1 ) {
            if(typeof filename == "string"){
                openDirs.push(filename);
            }
        }else{
            openDirs.splice (openDirs.indexOf(filename), 1);
        }
    },
    addFile : function(filename, content){
        let recents = settingsManager.get("recent",[]);
        let recentFilesExists = false;
        recents.forEach(rcfile=>{
            if(rcfile == filename){
                recentFilesExists = true;
            }
        });
        if(!recentFilesExists){
            if(recents.length > 20){
                recents.pop();
            }
            if(typeof filename == "string"){
                recents.push(filename);
            }
            settingsManager.set("recent",  recents);
           // console.log(settingsManager.get('recent'), "recent files");
        }
        if(!this.doesFileExists(filename)){
            openFiles.push({
                name : filename,
                content: content,
                history : [content],
            });
        }
    },
    getFile : function(filename){
        let searchedFile = null;
        for(let i=0; i< openFiles.length; i++){
            let open_file = openFiles[i];
            if(open_file.name == filename){
                searchedFile = open_file.name;
                break;
            }
        }
        return searchedFile;
    },
    getFileObject : function(filename){
        let searchedFileObject = {};
        for(let i=0; i< openFiles.length; i++){
            let open_file = openFiles[i];
            if(open_file.name == filename){
                searchedFileObject = open_file;
                break;
            }
        }
        return searchedFileObject;
    },
    getFileNamesAsArray : function(){
        let files = [];
        openFiles.forEach((open_file)=>{
            if(typeof open_file.name == "string"){
                files.push(open_file.name);
            }
        });
        return files;
    },
    saveFile : function(filename, content){
        let searchedFile = null;
        for(let i=0; i< openFiles.length; i++){
            let open_file = openFiles[i];
            if(open_file.name == filename){
                if(typeof content == "string"){
                    openFiles[i].content = content;
                }
                break;
            }
        }
        return searchedFile;
    },
    addToHistory : function(filename, content){
        let searchedFile = null;
        for(let i=0; i< openFiles.length; i++){
            let open_file = openFiles[i];
            if(open_file.name == filename){
                if(typeof content == "string"){
                    openFiles[i].history.push(content);
                }
                break;
            }
        }
        return searchedFile;
    },
    getHistory : function(filename){
        let searchedFile = null;
        for(let i=0; i< openFiles.length; i++){
            let open_file = openFiles[i];
            if(open_file.name == filename){
                return openFiles[i].history.pop();
            }
        }
        return searchedFile;
    },
    removeFiles : function(filename, currentFile){
        let removeIndex = null;
        let nextIndex = null;
        let nextFile = null;
        let myFiles = openFiles;
        if(myFiles.length > 0){
            for(let i=0; i< myFiles.length; i++){
                let open_file =myFiles[i];
                if(open_file.name == filename){
                    removeIndex = i;
                }
            }
            if(filename !== currentFile){
                nextFile = currentFile;
            }else if(openFiles.length > 1){
                if(removeIndex==0){
                    nextFile = openFiles[openFiles.length-1].name;
                }else{
                    nextFile = openFiles[removeIndex-1].name;
                }
            }
            openFiles.splice(removeIndex, 1);
        }else{
            myFiles = [];
        }
        return nextFile;
    }

}