const {dialog} = require('electron')

module.exports =  {
    createMenu : (mainDialog) => {
        return [
            { role: 'selectAll' },
            { type: 'separator' },
            { role: 'copy'},
            { role: 'paste'},
            { type: 'separator' },
        ]
    }

}