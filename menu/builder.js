const {dialog} = require('electron')

module.exports =  {
    createMenu : (mainDialog) => {
        return [
            {   icon: __dirname + "/../assets/ic_info_16.png",
                label: 'About this form',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`showReadMeWindow()`)
                },
            },
            { type: 'separator' },
            {   label: 'Run Build',
                icon: __dirname + "/../assets/ic_play_16.png",
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`runForm()`)
                },
            },
            {   label: 'Run and Repeat',
                icon: __dirname + "/../assets/ic_repeat_16.png",
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`runFormRepeat()`)
                },
            },
            { type: 'separator' },
            /*
            {   label: 'Build Form',
                icon: __dirname + "/../assets/ic_services_16.png",
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`buildForms()`)
                },
            },*/
            {   label: 'Save Form',
                icon: __dirname + "/../assets/ic_save_16.png",
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(` saveForm()`)
                },
            },
            {   label: 'Save Form As',
                icon: __dirname + "/../assets/ic_save_16.png",
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`saveFormAsFile()`)
                },
            },
            {   label: 'Edit Script',
                icon: __dirname + "/../assets/ic_edit_16.png",
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`editFormScript()`)
                },
            },
            { type: 'separator' },
            {   label: 'Clear Form',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`clearBuilderForm()`)
                },
            },
            {
                icon: __dirname + "/../assets/ic_globe_16.png",
                label: 'Clear World',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`clearTheWorld()`)
                },
            },
            {   label: 'Hide Builder',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`toggleSideView()`)
                },
            },
            { type: 'separator' },
            {   label: 'Unset Build',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`unsetBuild()`)
                },
            },
        ]
    }

}