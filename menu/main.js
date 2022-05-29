const path = require ('path')

module.exports =  {

    createMenu : (dialogs) => {
        return [
            {
                label: 'File',
                submenu: [
                    {
                        label : 'New Flowpro',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`createNewAction()`)
                        },
                    },
                    { type: 'separator' },
                    {
                        label : 'Open a File',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`openFileDialog()`)
                        },
                    },
                    {
                        label : 'Open Directory',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`openDirectory()`)
                        },
                    },
                    { type: 'separator' },
                    {
                        label : 'Save',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`saveToFile()`)
                        },
                        accelerator: 'CTRL+S'
                    },
                    {
                        label : 'Save As',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`saveAsToFile()`)
                        },
                    },
                    { type: 'separator' },
                    {
                        icon: path.join(__basedir, "/assets/ic_download_16.png"),
                        label : 'Export as Package',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`openExportWindow()`)
                        },
                    },
                    { type: 'separator' },
                    {
                        label : 'Close Current File',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`closeCurrentFile()`)
                        },
                    },
                    {
                        label : 'Close Current Directory',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`closeCurrentProject()`)
                        },
                    },
                    { type: 'separator' },
                    {
                        label : 'Settings',
                        icon: path.join(__basedir, "/assets/ic_gear_16.png"),
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`openSettingsWindow()`)
                        },
                    },
                    { type: 'separator' },
                    {role :  'Close' }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        label : 'Undo',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`historyUndo()`)
                        },
                        accelerator: 'CTRL+Z'
                    },
                    {
                        label : 'Redo',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`historyRedo()`)
                        },
                        accelerator: 'CTRL+SHIFT+Z'
                    },
                    { type: 'separator' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' },
                    { type: 'separator' },
                    {
                        label : 'Clear Last Favorite',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`clearLastFavorite()`)
                        },
                    },
                    {
                        label : 'Clear All Favorites',
                        click: () => {
                            dialogs.main.webContents.executeJavaScript(`clearAllFavorites()`)
                        },
                    },
                ]
            },
            { label: 'View',
                submenu: [
                    { role: 'reload' },
                  //  { role: 'toggleDevTools' },
                    { type: 'separator' },
                    { role: 'togglefullscreen' }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Help',
                        click: () => {
                            dialogs.help.show();
                        },
                    },
                    {
                        label: 'About',
                        click: () => {
                            dialogs.about.show();
                        },
                    },
                ]
            },
        ];
    }
}