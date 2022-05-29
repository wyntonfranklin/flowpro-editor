const {dialog} = require('electron')

module.exports =  {
    createMenu : (mainDialog, options) => {
        return [
            {   label: 'Run Flow',
                icon: __dirname + "/../assets/ic_play_16.png",
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`runScript()`)
                },
            },
            {   label: 'Build this file',
                icon: __dirname + "/../assets/ic_services_16.png",
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`buildBlockFile()`)
                },
                enabled : options.canbuild,
            },
            {   label: 'Rename Block Title',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`renameBlock()`)
                },
            },
            { type: 'separator' },
            {
                label : 'Save to favorites',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`saveBlockToFavorites()`)
                },
            },
            { type: 'separator' },
            {
                label : 'Remove from favorites',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`removeBlockFromFavorites()`)
                },
                enabled : options.favorite,
            },
            { type: 'separator' },
            {
                icon: __dirname + "/../assets/ic_info_16.png",
                label: 'Block Info',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`viewBlockDetailsCanvas()`)
                },
            },
        ]
    }

}