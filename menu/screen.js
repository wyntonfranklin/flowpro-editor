const {dialog} = require('electron')

module.exports =  {
    createMenu : (mainDialog) => {
        return [
            { role: 'selectAll' },
            { role: 'copy'},
            { type: 'separator' },
            {   label: 'Save As Text',
                click: () => {
                    mainDialog.screen.webContents.executeJavaScript(`saveAsText()`)
                },
            },
            {   label: 'Save As HTML',
                click: () => {
                    mainDialog.screen.webContents.executeJavaScript(`saveAsHtml()`)
                },
            },
            { type: 'separator' },
            {   label: 'Copy to clipboard (Text)',
                click: () => {
                    mainDialog.screen.webContents.executeJavaScript(`clipboardText()`)
                },
            },
            {     label: 'Copy to clipboard (HTML)',
                click: () => {
                    mainDialog.screen.webContents.executeJavaScript(`clipboardHtml()`)
                },
            },
            { type: 'separator' },
           {    label: 'Clear Screen',
                click: () => {
                    mainDialog.screen.webContents.executeJavaScript(`clearScreen()`)
                },
            },
        ]
    }

}