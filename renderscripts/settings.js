const { ipcRenderer, clipboard,  shell } = require('electron')
const settingsManager = require('../helpers/settingsManager');
const UTILS = require("../helpers/utils");

let activeMenu = "general";
let settingMenus = ['gen-settings','env-settings'];
let currentSettings = null;
let repeatDelayEl = document.getElementById("rpd");
let canvasSize = document.getElementById("canvassize");


const divs = document.querySelectorAll('.lp-item');
divs.forEach( el => {
    el.classList.remove("active");
    el.addEventListener('click', function(event){
        let menu = event.target.getAttribute("data-id");
        showMenu(menu);
        if(menu == "env-settings"){
            loadEnvSection();
        }else if(menu == "gen-settings"){
            loadGeneralSection();
        }
        unselectClassMenu();
        event.target.classList.add('active');
    });
});

loadGeneralSection();


function unselectClassMenu(){
    const divs = document.querySelectorAll('.lp-item');
    divs.forEach( el => {
        el.classList.remove('active');
    });
}
document.getElementById("save-env-var").addEventListener('click', function(){
   let desc = document.getElementById("env-desc").value;
   let content = document.getElementById("env-content").value;
   let name = document.getElementById("env-var").value;
   if(name && desc && content){
       saveEnv(name, desc, content);
       loadEnvSection();
   }
});

document.getElementById("ok-settings-btn").addEventListener('click', function(e){
    beforeCloseSave(function(){
        ipcRenderer.invoke('open-window','close_settings', { });
    })
});


document.getElementById("cancel-settings-btn").addEventListener('click', function(e){
    ipcRenderer.invoke('open-window','close_settings', { });
});


document.getElementById("apply-settings-btn").addEventListener('click', function(e){
    saveSettingsByMenu();
});


function beforeCloseSave(callback){
   saveSettingsByMenu();
   callback();
}

function saveSettingsByMenu(){
    if(activeMenu == "general"){
        saveGeneralSettings();
    }
}

function saveGeneralSettings(){
    settingsManager.set('repeat', repeatDelayEl.value);
    settingsManager.set("canvassize", canvasSize.value);
}


function saveEnvSettings(){

}

function showMenu(menu){
    document.getElementById(menu).style.display = "block";
    settingMenus.forEach(mu=>{
        if(mu != menu){
            document.getElementById(mu).style.display = "none";
        }
    })
}

function loadGeneralSection(){
    activeMenu = "general";
    let versions = UTILS.getAvailableVersions();
    let currentVersion = UTILS.getCurrentVersion();
    let options   = '';
    versions.forEach(ver=>{
        if(ver == currentVersion){
            options += `<option value="${ver}" selected="selected">${ver}</option>`;
        }else{
            options += `<option value="${ver}">${ver}</option>`;
        }
    });
    let delayTime = settingsManager.get("repeat",2000);
    repeatDelayEl.value = delayTime;
    document.getElementById("build-version").innerHTML = options;
    canvasSize.value = settingsManager.get("canvassize", 5024);
}

function loadEnvSection(){
    activeMenu = "env";
    let content = "";
    let settings = settingsManager.get("env", []);
    settings.forEach(setting=>{
        content += `<li class="simple-list-item" title='${setting.content}' data-object='${JSON.stringify(setting)}'>
            <span>${setting.name}</span><br>
            <span>${setting.description}</span></li>`;
    });
    document.getElementById("env-list").innerHTML = content;
    const divs = document.querySelectorAll('.simple-list-item');
    divs.forEach( el => {
        el.addEventListener('contextmenu', function(event){
            try{
                let settingItem = JSON.parse(event.currentTarget.getAttribute("data-object"));
                currentSettings = settingItem;
            }catch (e){
                console.log(e);
                currentSettings = null
            }
            ipcRenderer.invoke('show-context-menu','env');
        });
        el.addEventListener('click', function(event){
            try{
                let settingItem = JSON.parse(event.currentTarget.getAttribute("data-object"));
                currentSettings = settingItem;
                document.getElementById("env-desc").value = settingItem.description;
                document.getElementById("env-content").value = settingItem.content;
                document.getElementById("env-var").value = settingItem.name;
                clipboard.writeText(settingItem.name);
            }catch (e){
                currentSettings = null
            }
        });
    });

}


function copyEnvAsVariable(){
    if(currentSettings){
        clipboard.writeText(currentSettings.name);
    }
}

function copyEnvContent(){
    if(currentSettings){
        clipboard.writeText(currentSettings.content);
    }
}

function removeEnv(){
    if(currentSettings){
        let removeIndex = currentSettings.name;
        console.log(removeIndex,"settings");
        let settings = settingsManager.get("env", []);
        settings = settings.filter(set=> set.name !== removeIndex);
        settingsManager.set("env", settings);
        loadEnvSection();
    }
}

function saveEnv(name, description, content){
    let settings = settingsManager.get("env", []);
    let updateIndex = null;
    settings.forEach((set,i)=>{
        if(set.name.trim() === name.trim()){
            updateIndex = i;
        }
    });

    if(updateIndex != null && updateIndex >=0){
        settings[updateIndex] = {
            name : name.trim(),
            description : description,
            content : content
        }
    }else{
        settings.push({
            name : name.trim(),
            description : description,
            content : content
        });
    }
    settingsManager.set("env", settings);
}