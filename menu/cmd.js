const {dialog} = require('electron')

module.exports =  {
    createMenu : (mainDialog) => {
        return [
            { role: 'copy'},
            { label: 'Clear Buffer',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`clearCmdBuffer()`)
                },
            },
        ]
    }

}