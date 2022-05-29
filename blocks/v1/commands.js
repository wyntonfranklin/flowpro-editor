module.exports = [
    {
        type: "action",
        title: 'Basic Command',
        action: 'action_basic_command',
        category: "commands",
        description : 'Enter a basic command to execute',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Enter command to run here",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Long Command',
        action: 'action_basic_command',
        category: "commands",
        description : 'Enter a long command',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "longtext",
                label : "Enter command to run here",
                value : ""
            },
        ]
    },
]