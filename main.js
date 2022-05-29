const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog,  shell} = require('electron')

let mainWindow, screenWindow, settingsWindow, blockWindow, readmeWindow, exportWindow,
    helpWindow, aboutWindow, alertWindow;
let mainMenu, cmdMenu, canvasMenu, fileMenu, tabsMenu, blockMenu,
    builderMenu, envMenu, inputMenu, libraryMenu, screenMenu, blockViewMenu;
let Datastore = require('nedb');
const settingsManager = require('./helpers/settingsManager');
const utils = require("./helpers/utils");

let dialogs = {}

settingsManager.set("appDir",app.getPath('userData'));

global.__basedir = __dirname;


ipcMain.handle('get-external-file', (event, fpath) => {
    if (process.platform === 'win32' &&  process.argv.length >= 2) {
        const filePath = process.argv[1];
        mainWindow.send('external-file', filePath);
        // In my app, I initialise a new window here and send filePath through
        // to the renderer process so it can be read and displayed.
        return filePath;

    } else {
        // Create whatever your default window is (in my case, an empty document)
    }
});

ipcMain.handle('alert-handler', (event,action, properties) => {
    alertWindow.hide();
    mainWindow.send('alert-data',properties);
    mainWindow.focus();
});



ipcMain.handle('open-window', (event,screen, message) => {
    if(screen == "screen"){
        screenWindow.send('display',message);
        screenWindow.show();
        screenWindow.focus();
    }else if(screen == 'settings'){
        settingsWindow.show();
        settingsWindow.focus();
    }else if (screen == "close_settings"){
        settingsWindow.hide();
        mainWindow.focus();
    }else if(screen == "block"){
        blockWindow.send("display", message);
        blockWindow.show();
        blockWindow.focus();
    }else if(screen == "toggle_screen"){
        if(!screenWindow.isVisible()){
            screenWindow.show();
            screenWindow.focus();
        }else{
            screenWindow.hide();
            mainWindow.focus();
        }
    }else if(screen == "readme"){
        readmeWindow.send('message',message);
        readmeWindow.show();
        readmeWindow.focus();
    }else if(screen == "export"){
        exportWindow.send('data',message);
        exportWindow.show();
        exportWindow.focus();
    }else if(screen == "export_close"){
        exportWindow.hide();
        mainWindow.focus();
    }else if(screen == "alert"){
        alertWindow.send('data',message);
        alertWindow.show();
        alertWindow.focus();
    }
});


ipcMain.handle('remove-a-file', (event, fpath) => {
   shell.trashItem(fpath).then(results=>{
      //  console.log(results);
    });
});

ipcMain.handle('show-context-menu', (event, menu, options) => {
    if(options == undefined){
        options = {};
    }
    if(menu == "cmd"){
        cmdMenu = Menu.buildFromTemplate(require('./menu/cmd').createMenu(dialogs));
        cmdMenu.popup(mainWindow);
    }
    if(menu == "canvas"){
        canvasMenu = Menu.buildFromTemplate(require('./menu/canvas').createMenu(dialogs));
        canvasMenu.popup(mainWindow);
    }
    if(menu == "file"){
        fileMenu = Menu.buildFromTemplate(require('./menu/file').createMenu(dialogs, options));
        fileMenu.popup(mainWindow);
    }
    if(menu == "tab"){
        tabsMenu = Menu.buildFromTemplate(require('./menu/tabs').createMenu(dialogs, options));
        tabsMenu.popup(mainWindow);
    }
    if(menu == "block"){
        blockMenu = Menu.buildFromTemplate(require('./menu/block').createMenu(dialogs, options));
        blockMenu.popup(mainWindow);
    }
    if(menu == "builder"){
        builderMenu = Menu.buildFromTemplate(require('./menu/builder').createMenu(dialogs, options));
        builderMenu.popup(mainWindow);
    }
    if(menu == "env"){
        envMenu = Menu.buildFromTemplate(require('./menu/env').createMenu(dialogs, options));
        envMenu.popup(mainWindow);
    }
    if(menu == "input"){
        inputMenu = Menu.buildFromTemplate(require('./menu/inputs').createMenu(dialogs, options));
        inputMenu.popup(mainWindow);
    }
    if(menu == "library"){
        libraryMenu = Menu.buildFromTemplate(require('./menu/library').createMenu(dialogs, options));
        libraryMenu.popup(mainWindow);
    }
    if(menu == "screen"){
        screenMenu = Menu.buildFromTemplate(require('./menu/screen').createMenu(dialogs,options))
        screenMenu.popup(mainWindow);
    }
    if(menu == "blockview"){
        blockViewMenu = Menu.buildFromTemplate(require('./menu/blockview').createMenu(dialogs,options))
        blockViewMenu.popup(mainWindow);
    }
});

ipcMain.handle('show-open-file-dialog',  async(event, options, action) => {
    if(action !== undefined && action == "save"){
        var filename = dialog.showSaveDialogSync(dialogs.main, options);
        if(filename) {
            // console.log(filename);
            return filename;
        }
    }else if(action == "confirm_dialog"){
        const results = await dialog.showMessageBox(dialogs.main, options);
        return results;
    }else{
        var filename = dialog.showOpenDialogSync(dialogs.main, options);
        if(filename) {
           // console.log(filename[0]);
            return filename[0];
        }
    }
});


function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: settingsManager.get('mwwidth', 800),
        height: settingsManager.get('mwheight', 600),
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            backgroundColor: '#3b3b3b'
        }
    });

    screenWindow = new BrowserWindow({
        width: 500, height: 600,
        parent: mainWindow,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            backgroundColor: '#3b3b3b'
        },
        modal: false,
        show: false,
    });

    settingsWindow = new BrowserWindow({
        width: 600, height: 600,
        parent: mainWindow,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            backgroundColor: '#3b3b3b'
        },
        modal: false,
        show: false,
    });

    blockWindow = new BrowserWindow({
        width: 500, height: 400,
        parent: mainWindow,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            backgroundColor: '#3b3b3b'
        },
        modal: false,
        show: false,
    });

    readmeWindow = new BrowserWindow({
        width: 450, height: 500,
        parent: mainWindow,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            backgroundColor: '#3b3b3b'
        },
        modal: false,
        show: false,
    });


    exportWindow = new BrowserWindow({
        width: 600, height: 600,
        parent: mainWindow,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            backgroundColor: '#3b3b3b'
        },
        modal: false,
        show: false,
    });



    aboutWindow = new BrowserWindow({
        width: 400, height: 150,
        parent: mainWindow,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            backgroundColor: '#3b3b3b'
        },
        modal: false,
        show: false,
    });

    helpWindow = new BrowserWindow({
        width: 400, height: 150,
        parent: mainWindow,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            backgroundColor: '#3b3b3b'
        },
        modal: false,
        show: false,
    });


    alertWindow = new BrowserWindow({
        width: 400, height: 170,
        parent: mainWindow,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            backgroundColor: '#3b3b3b'
        },
        modal: false,
        show: false,
    });




    dialogs.main = mainWindow;
    dialogs.screen = screenWindow;
    dialogs.settings = settingsWindow;
    dialogs.block = blockWindow;
    dialogs.readme = readmeWindow;
    dialogs.export = exportWindow;
    dialogs.help = helpWindow;
    dialogs.about = aboutWindow;
    dialogs.alert = alertWindow;


    // Export Window
    exportWindow.setMenuBarVisibility(false);
    exportWindow.loadFile('./layouts/export.html');
    //exportWindow.webContents.openDevTools();
    exportWindow.on("close", (e)=>{
        exportWindow.hide();
        mainWindow.focus();
        mainWindow.webContents.executeJavaScript('refreshView()');
        e.preventDefault();
    });


    // Readme Window
    readmeWindow.setMenuBarVisibility(false);
    readmeWindow.loadFile('./layouts/readme.html');
    // blockWindow.webContents.openDevTools();
    readmeWindow.on("close", (e)=>{
        readmeWindow.hide();
        mainWindow.focus();
        mainWindow.webContents.executeJavaScript('refreshView()');
        e.preventDefault();
    });

    // Block Window
    blockWindow.setMenuBarVisibility(false);
    blockWindow.loadFile('./layouts/block.html');
    // blockWindow.webContents.openDevTools();
    blockWindow.on("close", (e)=>{
        blockWindow.hide();
        mainWindow.focus();
        mainWindow.webContents.executeJavaScript('refreshView()');
        e.preventDefault();
    });

    // Settings Window
    settingsWindow.setMenuBarVisibility(false);
    settingsWindow.loadFile('./layouts/settings.html');
    //settingsWindow.webContents.openDevTools();
    settingsWindow.on('close',  (e) => {
        settingsWindow.hide();
        mainWindow.focus();
        mainWindow.webContents.executeJavaScript('refreshView()');
        e.preventDefault();
    });


    // Screen Output Window
    screenWindow.setMenuBarVisibility(false);
    screenWindow.loadFile('./layouts/screen.html');
    // screenWindow.webContents.openDevTools();
    screenWindow.on('close',  (e) => {
        screenWindow.hide();
        mainWindow.focus();
        mainWindow.webContents.executeJavaScript('refreshView()');
        e.preventDefault();
    });


    // help Window
    helpWindow.setMenuBarVisibility(false);
    helpWindow.loadFile('./layouts/help.html');
    helpWindow.on('close',  (e) => {
        helpWindow.hide();
        mainWindow.focus();
        // mainWindow.webContents.executeJavaScript('refreshView()');
        e.preventDefault();
    });

    // about Window
    aboutWindow.setMenuBarVisibility(false);
    aboutWindow.loadFile('./layouts/about.html');
    aboutWindow.on('close',  (e) => {
        aboutWindow.hide();
        mainWindow.focus();
        //   mainWindow.webContents.executeJavaScript('refreshView()');
        e.preventDefault();
    });

    // alert window
    alertWindow.setMenuBarVisibility(false);
    alertWindow.loadFile('./layouts/alert.html');
    alertWindow.on('close',  (e) => {
        alertWindow.hide();
        mainWindow.focus();
        //   mainWindow.webContents.executeJavaScript('refreshView()');
        e.preventDefault();
    });




    // Main window
    mainWindow.loadFile('./layouts/home.html');
    // mainWindow.webContents.openDevTools();
    mainMenu = Menu.buildFromTemplate( require('./menu/main').createMenu(dialogs) )
    Menu.setApplicationMenu(mainMenu)
    mainWindow.on('resize', function(){
        mainWindow.webContents.executeJavaScript('updateOnResize()');
    });
    mainWindow.on('resized', function(){
         mainWindow.webContents.executeJavaScript('updateOnResize()');
    });
    mainWindow.on('move', function(){
        mainWindow.webContents.executeJavaScript('updateOnResize()');
    });
    mainWindow.on('focus', function(){
        // mainWindow.webContents.executeJavaScript('onBlurEvents()');
    });
    mainWindow.webContents.on('devtools-opened', ()=>{
        mainWindow.webContents.executeJavaScript('updateOnResize()');
    });

    mainWindow.webContents.on('devtools-closed', ()=>{
        mainWindow.webContents.executeJavaScript('updateOnResize()');
    });

    mainWindow.on('close',  (e) => {
        // on close events
        settingsManager.set('mwheight', mainWindow.getBounds().height);
        settingsManager.set('mwwidth',mainWindow.getBounds().width);
        mainWindow.webContents.executeJavaScript('onCloseEvent()');
    });
}

const gotTheLock = app.requestSingleInstanceLock()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    if (!gotTheLock) {
       // app.quit()
    } else {
    }


    app.on('open-file', function (e, file) {
        mainWindow.send('external-file', file);
        mainWindow.show()
        mainWindow.focus();
    })

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    // remove menu from window
    app.on("browser-window-created", (e, win) => {
        win.removeMenu();
    });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
