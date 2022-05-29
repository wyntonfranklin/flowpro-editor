const {dialog} = require('electron')
const path = require ('path')

module.exports =  {
    createMenu : (mainDialog, options) => {
        return [
            {
                label: 'New..',
                submenu: [
                    {
                        label : 'New FlowPro',
                        click: () => {
                            mainDialog.main.webContents.executeJavaScript(`createANewFile()`)
                        },
                        accelerator: 'CTRL+N'
                    },
                    { label: 'New Folder',
                        click: () => {
                            mainDialog.main.webContents.executeJavaScript(`createNewDirectory()`)
                        },
                    },
                ]
            },
            { type: 'separator' },
            { label: 'Build This File',
                icon: path.join(__basedir, "/assets/ic_services_16.png"),
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`buildSelectedFile()`)
                },
                enabled : (options.extension == ".flowpro") ? true : false,
            },
            { type: 'separator' },
            { label: 'Open in Explorer',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`openInExplorer()`)
                },
            },
            { label: 'Copy',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`copyAFile()`)
                },
                enabled : (options.extension == ".flowpro") ? true : false,
            },
            { label: 'Paste',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`pasteAFile()`)
                },
                enabled : options.canpaste,
            },
            { label: 'Rename',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`renameAFile()`)
                },
            },
            { type: 'separator' },
            { label: 'Copy File Path',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`copyFilePath()`)
                },
            },
            { label: 'Export this File',
                icon: path.join(__basedir, "/assets/ic_download_16.png"),
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`exportSelectedFile()`)
                },
                enabled : (options.extension == ".flowpro") ? true : false,
            },
            { type: 'separator' },
            { label: 'Delete',
                click: () => {
                     mainDialog.main.webContents.executeJavaScript(`deleteSelectedFile()`)
                },
            },
        ]
    }

}