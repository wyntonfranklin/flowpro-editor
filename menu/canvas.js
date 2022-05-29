const {dialog} = require('electron')
const path = require ('path')

module.exports =  {
    createMenu : (mainDialog) => {
        return [
            /*
            { label: 'Build and Run',
                icon:   __dirname + "/../assets/ic_play_16.png",
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`buildAndRun()`)
                },
            },*/
            { label: 'Run Script',
                icon: path.join(__basedir, "/assets/ic_play_16.png"),
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`runScript()`)
                },
            },
            { label: 'Run and Repeat',
                icon: path.join(__basedir, "/assets/ic_repeat_16.png"),
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`runAndRepeat()`)
                },
            },
            { type: 'separator' },
            { label: 'Build Form',
                icon: path.join(__basedir, "/assets/ic_services_16.png"),
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`buildForms()`)
                },
            },
            {
                icon: path.join(__basedir, "/assets/ic_globe_16.png"),
                label: 'Clear World',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`clearTheWorld()`)
                },
            },
            { type: 'separator' },
            {
                label : 'Save',
                icon: path.join(__basedir, "/assets/ic_save_16.png"),
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`saveToFile()`)
                },
                accelerator: 'CTRL+S'
            },
            {
                label : 'Copy Canvas',
                icon: path.join(__basedir, "/assets/ic_copy_16.png"),
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`copyCanvas()`)
                },
            },
            {
                label : 'Paste to Canvas',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`pasteCanvas()`)
                },
            },
            { label: 'Clear Canvas',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`clearEngineCanvas()`)
                },
            },
            { type: 'separator' },
            {   label: 'Hide/Show Console',
                icon: path.join(__basedir, "/assets/ic_eye_16.png"),
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`toggleCmdLayout()`)
                },
            },
            { label: 'Clear Console',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`clearCmdBuffer()`)
                },
            },
            { type: 'separator' },
            {   label: 'Close File',
                icon: path.join(__basedir, "/assets/ic_x_mark_16.png"),
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`closeCurrentFile()`)
                },
            },
        ]
    }

}