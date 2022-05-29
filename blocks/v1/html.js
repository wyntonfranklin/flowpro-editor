module.exports = [
    {
        type: "action",
        title: 'Paragraph',
        category: "html",
        description : 'Add short text',
        icon : 'ic_keyboard.png',
        action: 'action_create_p_element',
        properties: [
            {
                type : "text",
                label : "Enter text",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Create Simple HTML Table',
        category: "html",
        description : 'Create a table',
        icon : 'ic_keyboard.png',
        action: 'action_create_simple_html_table',
        properties: [
            {
                type : "text",
                label : "Headers",
                value : ""
            },
            {
                type : "longtext",
                label : "Body",
                value : ""
            },
            {
                type : "text",
                label : "Styling",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Simple Page',
        category: "html",
        description : 'Create a simple web page',
        icon : 'ic_keyboard.png',
        action: 'short_text_input',
        properties: [
            {
                type : "text",
                label : "Enter text",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Display Data Table',
        category: "html",
        description : 'Disable table from data',
        icon : 'ic_keyboard.png',
        action: 'action_create_html_table',
        properties: [
            {
                type : "text",
                label : "Headers",
                value : ""
            },
            {
                type : "text",
                label : "Data",
                value : ""
            },
            {
                type : "dropdown",
                label : "Type",
                options : ["object","array"],
                value : "object"
            },
        ]
    },
    {
        type: "action",
        title: 'ImageListView Widget',
        category: "html",
        description : 'ImageListView HTML Widget',
        icon : 'ic_keyboard.png',
        action: 'action_create_image_listview_widget',
        properties: [
            {
                type : "text",
                label : "Image",
                value : ""
            },
            {
                type : "text",
                label : "Title",
                value : ""
            },
            {
                type : "longtext",
                label : "Body",
                value : ""
            },
        ]
    },


]