module.exports = [
    {
        type: "action",
        title: 'NOW()',
        category: "datetime",
        description : 'Get Time NOW',
        icon : 'ic_time.png',
        action: 'action_get_time_now',
        properties: [

        ]
    },
    {
        type: "action",
        title: 'Parse Date',
        category: "datetime",
        description : 'Parse Date',
        icon : 'ic_time.png',
        action: 'action_parse_date',
        properties: [
            {
                type : "text",
                label : "Date Value",
                value : ""
            },
            {
                type : "text",
                label : "Expected Date Format",
                value : ""
            },
            {
                type : "text",
                label : "Convert To Format",
                value : ""
            },
        ]
    },

]