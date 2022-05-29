let UTILS = require("../helpers/utils");
let currentVersion = UTILS.getCurrentVersion();

let genBlocks = require(`./${currentVersion}/general`);
let numBlocks = require(`./${currentVersion}/numeric`);
let inputBlocks = require(`./${currentVersion}/input`);
let mathBlocks = require(`./${currentVersion}/math`);
let outputBlocks = require(`./${currentVersion}/output`);
let stringBlocks = require(`./${currentVersion}/string`);
let structureBlocks = require(`./${currentVersion}/structures`);
let controlBlocks = require(`./${currentVersion}/control`);
let loopBlocks = require(`./${currentVersion}/loops`);
let htmlBlocks = require(`./${currentVersion}/html`);
let commandsBlocks = require(`./${currentVersion}/commands`);
let databaseBlocks = require(`./${currentVersion}/database`);
let builderBlocks = require(`./${currentVersion}/builder`);
let datetimeBlocks = require(`./${currentVersion}/datetime`);
let fileBlocks = require(`./${currentVersion}/files`);
let ftpBlocks = require(`./${currentVersion}/ftp`);

module.exports = {
    joinBlocks : function(){
        let blocks = [].concat(
            genBlocks,
            builderBlocks,
            numBlocks,
            stringBlocks,
            inputBlocks,
            mathBlocks,
            controlBlocks,
            loopBlocks,
            datetimeBlocks,
            structureBlocks,
            outputBlocks,
            fileBlocks,
            htmlBlocks,
            commandsBlocks,
            databaseBlocks,
            ftpBlocks);
        return blocks;
    },
    getBlocks : function(){
        return this.joinBlocks();
    }

}