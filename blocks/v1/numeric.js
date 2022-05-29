module.exports = [
    {
        type: "action",
        category: "numeric",
        title: 'Add Values',
        description : 'Add Values',
        icon : 'ic_math.png',
        action: 'add_two_numbers',
        properties : [
            {
                type : "text",
                label : "Values",
                value : ""
            },
        ]
    },
    {
        type: "action",
        category: "numeric",
        title: 'Addition',
        description : 'Add previous and current output',
        icon : 'ic_math.png',
        action: 'action_add_numbers',
        properties : [

        ]
    },
    {
        type: "action",
        category: "numeric",
        title: 'Subtract Values',
        description : 'Subtract values',
        icon : 'ic_math.png',
        action: 'subtract_two_numbers',
        properties : [
            {
                type : "text",
                label : "Numbers",
                value : ""
            },
        ]
    },
    {
        type: "action",
        category: "numeric",
        title: 'Multiply values',
        description : 'Multiply Values',
        icon : 'ic_math.png',
        action: 'action_multiply_two_numbers',
        properties : [
            {
                type : "text",
                label : "Numbers",
                value : ""
            },
        ]
    },
    {
        type: "action",
        category: "numeric",
        title: 'Divide Values',
        description : 'Divide Values',
        icon : 'ic_math.png',
        action: 'action_divide_two_numbers',
        properties : [
            {
                type : "text",
                label : "Numbers",
                value : ""
            },
        ]
    },
    {
        type: "action",
        category: "numeric",
        title: 'Sum of Numbers',
        description : 'Sum numbers in an array',
        icon : 'ic_math.png',
        action: 'action_add_numbers_array',
        properties : [

        ]
    },
    {
        type: "action",
        category: "numeric",
        title: 'Round Number',
        description : 'Round number',
        icon : 'ic_math.png',
        action: 'action_round_number',
        properties : [
            {
                type : "text",
                label : "Input (optional)",
                value : ""
            },
        ]
    },
    {
        type: "action",
        category: "numeric",
        title: 'Ceil',
        description : 'Returns x rounded up to its nearest integer',
        icon : 'ic_math.png',
        action: 'action_math_ceil',
        properties : [
            {
                type : "text",
                label : "Input (optional)",
                value : ""
            },
        ]
    },
    {
        type: "action",
        category: "numeric",
        title: 'Random Number',
        description : 'Generate random number',
        icon : 'ic_math.png',
        action: 'action_random_number',
        properties : [
            {
                type : "text",
                label : "Min",
                value : ""
            },
            {
                type : "text",
                label : "Max",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Increment Number',
        action: 'action_increment_number',
        category: "numeric",
        description : 'Increment Number',
        icon : 'ic_math.png',
        properties: [
            {
                type : "text",
                label : "Increment Number",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Decrement Number',
        action: 'action_decrement_number',
        category: "numeric",
        description : 'Decrement Number',
        icon : 'ic_math.png',
        properties: [
            {
                type : "text",
                label : "Decremente Number",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Modulus',
        action: 'action_modulus_numbers',
        category: "numeric",
        description : 'Modulus of two numbers',
        icon : 'ic_math.png',
        properties: [
            {
                type : "text",
                label : "Number #1",
                value : ""
            },
            {
                type : "text",
                label : "Number #2",
                value : ""
            },
        ]
    },
]