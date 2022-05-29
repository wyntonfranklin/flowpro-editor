const {dialog} = require('electron')
const path = require("path");

module.exports =  {
    createMenu : (mainDialog, options) => {
        return [
            {
                icon: path.join(__basedir, "/assets/ic_info_16.png"),
                label: 'Block Info',
                click: () => {
                      mainDialog.main.webContents.executeJavaScript(`viewBlockDetails()`)
                },
            },
            { label: 'Save To Favorites',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`saveBlockToFavoritesList()`)
                },
            },
            { label: 'Delete From Favorites',
                click: () => {
                    mainDialog.main.webContents.executeJavaScript(`removeBlockFromFavoritesList()`)
                },
                enabled : options.favorite,
            },
        ]
    }

}