const {dialog} = require('electron')

module.exports =  {
    createMenu : (mainDialog) => {
        return [
            {   label: 'Copy Variable',
                click: () => {
                    mainDialog.settings.webContents.executeJavaScript(`copyEnvAsVariable()`)
                },
            },
            {   label: 'Copy Contents',
                click: () => {
                    mainDialog.settings.webContents.executeJavaScript(`copyEnvContent()`)
                },
            },
            {   label: 'Delete Variable',
                click: () => {
                    mainDialog.settings.webContents.executeJavaScript(`removeEnv()`)
                },
            },
        ]
    }

}