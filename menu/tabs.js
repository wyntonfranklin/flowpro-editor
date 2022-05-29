const {dialog} = require('electron')
const path = require ('path')

module.exports =  {
    createMenu : (mainDialog, options) => {
        return [
            {
                icon: path.join(__basedir, "/assets/ic_services_16.png"),
                label: 'Build File',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`buildSelectedFile()`)
                },
            },
            { type: 'separator' },
            { label: 'Close Tab',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`closeSelectedTab()`)
                },
            },
            { label: 'Close All Other Tabs',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`closeAllOtherTabs()`)
                },
            },
            { label: 'Close All Tabs',
                click: () => {
                   mainDialog.main.webContents.executeJavaScript(`closeAllTabs()`)
                },
            },
            { type: 'separator' },
            { label: 'Copy File Path',
                click: () => {
                     mainDialog.main.webContents.executeJavaScript(`copyFilePath()`)
                },
                enabled : (options.extension == ".flowpro") ? true : false,
            },

        ]
    }

}