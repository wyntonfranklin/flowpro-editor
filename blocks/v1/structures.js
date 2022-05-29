module.exports = [
    {
        type: "action",
        title: 'Filter an Array',
        action: 'action_filter_by_condition',
        category: "arrays",
        description : 'Filter an array',
        icon : 'ic_repeat.png',
        properties: [
            {
                type : "text",
                label : "Value to compare",
                value : ""
            },
            {
                type : "dropdown",
                label : "Comparison",
                options : ["==","<","<=",">=","!=", ">"],
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Get Value by index',
        action: 'action_get_value_by_index',
        category: "arrays",
        description : 'Get array value from index',
        icon : 'ic_edit.png',
        properties: [
            {
                type : "text",
                label : "Index",
                value : ""
            },
            {
                type : "text",
                label : "Array Name",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Get Value by key',
        action: 'action_get_value_by_key',
        category: "arrays",
        description : 'Get Object value by key',
        icon : 'ic_edit.png',
        properties: [
            {
                type : "text",
                label : "Index",
                value : ""
            },
            {
                type : "text",
                label : "Array Name",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Create an Object',
        action: 'action_create_object_from_string',
        category: "arrays",
        description : 'Get Object from string',
        icon : 'ic_edit.png',
        properties: [
            {
                type : "text",
                label : "Object values",
                value : ""
            },
            {
                type : "text",
                label : "Assign to",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Unpackage Object/Array',
        action: 'action_object_bulk_assignment',
        category: "arrays",
        description : 'Unpackage object to variables',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Object/Output",
                value : ""
            },
            {
                type : "text",
                label : "Values String",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Create an Array',
        action: 'action_create_array',
        category: "arrays",
        description : 'Create an array',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Variable Name",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Array Push',
        action: 'action_push_to_array',
        category: "arrays",
        description : 'Push item to array',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Array Input",
                value : ""
            },
            {
                type : "text",
                label : "Value to add",
                value : ""
            },
            {
                type : "text",
                label : "Assign to",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Add to object',
        action: 'action_push_to_object',
        category: "arrays",
        description : 'Add key and value to object',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Object to update",
                value : ""
            },
            {
                type : "text",
                label : "Values to add",
                value : ""
            },
            {
                type : "text",
                label : "Assign to",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Object/Array Length',
        action: 'action_get_object_length',
        category: "arrays",
        description : 'Get length of object or array',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Input/Output",
                value : ""
            },
        ]
    },
]