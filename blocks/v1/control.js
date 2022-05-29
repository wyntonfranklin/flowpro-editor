module.exports = [
    {
        type: "conditional",
        title: 'If Do',
        action: 'action_if_do',
        category: "conditional",
        description : 'If condition execute block',
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
                value : ""
            },
            {
                type : "text",
                label : "Input 2",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'If Else',
        action: 'action_if_else',
        category: "conditional",
        description : 'If Else statements',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Field1",
                value : ""
            },
            {
                type : "dropdown",
                label : "Operator",
                options : ["==","<","<=",">=","!=", ">"],
                value : "=="
            },
            {
                type : "text",
                label : "Field2",
                value : ""
            },
            {
                type : "text",
                label : "Output",
                value : ""
            },
            {
                type : "text",
                label : "Else (Output)",
                value : ""
            },
        ]
    },
    {
        type: "conditional",
        title: 'If Null',
        action: 'action_if_null',
        category: "conditional",
        description : 'If input is null',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Input",
                value : ""
            },
        ]
    },
    {
        type: "conditional",
        title: 'If Not Null',
        action: 'action_if_not_null',
        category: "conditional",
        description : 'If input is not null',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Input",
                value : ""
            },
        ]
    },
    {
        type: "conditional",
        title: 'If Exists in World',
        action: 'action_if_world_exists',
        category: "conditional",
        description : 'If variable exists in the world',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Input",
                value : ""
            },
        ]
    },
    {
        type: "conditional",
        title: 'Multiple IF Do',
        action: 'action_if_multiple',
        category: "conditional",
        description : 'Multiple Conditions',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Conditions String",
                value : ""
            },
        ]
    },
    {
        type: "conditional",
        title: 'If String Contains',
        action: 'action_string_contains',
        category: "conditional",
        description : 'Multiple Conditions',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Value to compare",
                value : ""
            },
            {
                type : "text",
                label : "Comparison",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'End If',
        action: 'endif',
        category: "conditional",
        description : 'End If statement',
        icon : 'ic_flow.png',
        properties: [

        ]
    },
]