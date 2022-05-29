let queue = null;

module.exports = {
    addToQueue : function(value){
        queue = value;
        console.log(value, "added to que")
    },
    removeFromQuery : function(){
        return queue;
    },
    clearQueue : function(){
        queue =  null;
    },
    hasValue : function(){
        return (queue) ? true : false;
    }
}