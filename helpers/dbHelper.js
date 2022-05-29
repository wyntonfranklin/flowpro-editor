const Datastore = require('nedb');
let currentDb = null;
let dbPath = null;
let dbReferences = {
    favorites: "favorites"
}

function getDbPath(name){
    return dbPath + '/'  + name + ".db";
}

function loadDatabase(){
    let db = {};
    db.table = new Datastore(getDbPath(currentDb));
    db.table.loadDatabase();
    return db;
}

function insertRecord(record){
    let db = loadDatabase();
    db.table.insert([record], function (err, newDocs) {

    });
}

function getRecords(callback){
    let db = loadDatabase();
    db.table.find({}, function (err, docs) {
        callback(docs);
    });
}

function removeRecord(id, callback){
    let db = loadDatabase();
    db.table.remove({ _id: id }, {}, function (err, numRemoved) {
        callback(numRemoved);
    });
}

module.exports = {
    init: function(homeDir){
        dbPath = homeDir
    },
    setCurrentDb : function(value){
        currentDb = value;
    },
    getCurrentDb : function(){
        return currentDb;
    },
    getRecords: getRecords,
    dbReferences,
    insert : insertRecord,
    removeRecord : removeRecord,
    removeAll : function(callback){
        let db = loadDatabase();
        db.table.remove({}, { multi: true }, function (err, numRemoved) {
            callback(numRemoved)
        });
    },
    removeLastRecord : function(callback){
        getRecords(function(docs){
            const lastItem = docs[docs.length - 1];
            removeRecord(lastItem._id, callback)
        });
    }
}