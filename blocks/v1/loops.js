module.exports = [
    {
        type: "loop",
        title: 'Loop by number',
        action: 'forloop',
        category: "loops",
        description : 'Loop by a given amount',
        icon : 'ic_repeat.png',
        properties: [
            {
                type : "text",
                label : "Maximum Loops",
                value : ""
            },
        ]
    },
    {
        type: "loop",
        title: 'Loop by Input',
        action: 'foreach',
        category: "loops",
        description : 'Loop by given input',
        icon : 'ic_repeat.png',
        properties: [
            {
                type : "text",
                label : "Input",
                value : ""
            },
        ]
    },
    {
        type: "loop",
        title: 'End Loop',
        action: 'action_end_loop',
        category: "loops",
        description : 'End loop or if statement',
        icon : 'ic_repeat.png',
        properties: [

        ]
    },
    {
        type: "loop",
        title: 'While Do',
        action: 'action_while',
        category: "loops",
        description : 'Do While Condition is true',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Input 1 /Output",
                value : ""
            },
            {
                type : "dropdown",
                label : "Conditions",
                options : ["==","<","<=",">=","!=", ">"],
                value : "=="
            },
            {
                type : "text",
                label : "Input 2",
                value : ""
            },
        ]
    },
    {
        type: "loop",
        title: 'Repeat Section',
        action: 'action_repeat_for',
        category: "loops",
        description : 'Repeat section every',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Time (ms)",
                value : ""
            },
        ]
    },
]