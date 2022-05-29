module.exports = [
    {
        type: "action",
        title: 'Pow',
        action: 'action_math_pow',
        category: "math",
        description : 'End If statement',
        icon : 'ic_math.png',
        properties: [
            {
                type : "text",
                label : "X",
                value : ""
            },
            {
                type : "text",
                label : "Y",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Math.Ceil',
        action: 'action_math_ceil',
        category: "math",
        description : 'returns the smallest integer greater than or equal',
        icon : 'ic_math.png',
        properties: [
            {
                type : "text",
                label : "Input/Output",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Square Root',
        action: 'action_sqr_root',
        category: "math",
        description : 'Square Root',
        icon : 'ic_math.png',
        properties: [
            {
                type : "text",
                label : "X",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Sin',
        action: 'action_sin_cal',
        category: "math",
        description : 'Math.sin()',
        icon : 'ic_math.png',
        properties: [
            {
                type : "text",
                label : "X",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Cos',
        action: 'action_cos_cal',
        category: "math",
        description : 'Math.cos()',
        icon : 'ic_math.png',
        properties: [
            {
                type : "text",
                label : "X",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'PI',
        action: 'action_pi_cal',
        category: "math",
        description : 'Get PI',
        icon : 'ic_math.png',
        properties: [

        ]
    },
    {
        type: "action",
        title: 'Math Constants',
        action: 'action_math_constants',
        category: "math",
        description : 'Get the value for a constant',
        icon : 'ic_math.png',
        properties: [
            {
                type : "dropdown",
                label : "Select a constant",
                options : ["E","LN2","LN10","LOG2E","PI","SQRT1_2","SQRT2"],
                value : ""
            },
        ]
    },
]