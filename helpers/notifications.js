let notifier = new AWN({position: "top-right"});

module.exports =  {
    success : function(message){
        notifier.success(message,{
            labels : {success: "Nice!"},
        });
    },
    error: function(message){
        notifier.alert(message, {
            labels : {alert: "Hold On!",},
        });
    },
    info : function (message){
        notifier.info(message,{
            labels : {info: "Hey there!"},
        });
    },
    warning : function (message){
        notifier.warning(message,{
            labels : {info: "Hey there!"},
        });
    }

}