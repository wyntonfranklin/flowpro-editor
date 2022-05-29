const {dialog} = require('electron')

module.exports =  {
    createMenu : (mainDialog) => {
        return [
            { label: 'Select File Path',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`getFilePathFromSystem()`)
                },
            },
            { label: 'Select Folder Path',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`getDirectoryPathFromSystem()`)
                },
            },
            { role: 'selectAll' },
            { type: 'separator' },
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut'},
            { role: 'copy'},
            { role: 'paste'},
            { type: 'separator' },
            { role: 'delete' },
        ]
    }

}