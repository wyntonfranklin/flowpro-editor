module.exports = [
    {
        type: "action",
        title: 'Form Settings',
        action: 'build_form_settings',
        category: "builder",
        description : 'Change the look and feel',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Form Title",
                value : ""
            },
            {
                type : "text",
                label : "Form Description",
                value : ""
            },
            {
                type : "text",
                label : "Form Background",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Read Me',
        action: 'build_form_readme',
        category: "builder",
        description : 'Readme for users',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "longtext",
                label : "Read Me",
                value : "Hello world. This is a readme"
            },
            {
                type : "dropdown",
                label : "Text Type",
                options : ['text','html','markdown'],
                value : "text"
            },
        ]
    },
    {
        type: "action",
        title: 'Render Label',
        action: 'action_render_label',
        category: "builder",
        description : 'Render Label',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Label Name",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Simple Input',
        action: 'build_text_box',
        category: "builder",
        description : 'Create a simple text input for a user',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Variable name",
                value : ""
            },
            {
                type : "text",
                label : "Form Label",
                value : ""
            },
            {
                type : "text",
                label : "Settings",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Simple Input (2)',
        action: 'build_text_box_2',
        category: "builder",
        description : 'Create a simple text input for a user',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Variable name #1",
                value : ""
            },
            {
                type : "text",
                label : "Form Label #1",
                value : ""
            },
            {
                type : "text",
                label : "Variable name #2",
                value : ""
            },
            {
                type : "text",
                label : "Form Label #2",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Long Text Input',
        action: 'build_longtext_box',
        category: "builder",
        description : 'User Long Text Input',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Variable name",
                value : ""
            },
            {
                type : "text",
                label : "Form Label",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Simple Number Input',
        action: 'build_number_box',
        category: "builder",
        description : 'Create a simple number input for a user',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Variable name",
                value : ""
            },
            {
                type : "text",
                label : "Form Label",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Dropdown',
        action: 'build_dropdown_box',
        category: "builder",
        description : 'User Dropdown',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Variable name",
                value : ""
            },
            {
                type : "text",
                label : "Label",
                value : ""
            },
            {
                type : "text",
                label : "Options",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Checkbox',
        action: 'build_check_box',
        category: "builder",
        description : 'User Yes/No Box',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Variable Name",
                value : ""
            },
            {
                type : "text",
                label : "Form Label",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Date Input',
        action: 'build_date_box',
        category: "builder",
        description : 'User Date Input',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Variable name",
                value : ""
            },
            {
                type : "text",
                label : "Label",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Date/Time Input',
        action: 'build_datetime_box',
        category: "builder",
        description : 'User Date/Time Input',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Variable name",
                value : ""
            },
            {
                type : "text",
                label : "Label",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Time Input',
        action: 'build_time_box',
        category: "builder",
        description : 'User Time Input',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Variable name",
                value : ""
            },
            {
                type : "text",
                label : "Label",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Filename Input',
        action: 'build_filename_box',
        category: "builder",
        description : 'Create a filename text box',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Variable name",
                value : ""
            },
            {
                type : "text",
                label : "File extension",
                value : ""
            },
            {
                type : "text",
                label : "Form Label",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Button Action',
        action: 'build_button_input',
        category: "builder",
        description : 'User Button Action',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "FlowPro file path",
                value : ""
            },
            {
                type : "text",
                label : "Variable Name",
                value : ""
            },
            {
                type : "text",
                label : "Label Name",
                value : ""
            },
            {
                type : "text",
                label : "Button Name",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'User Button Build Form',
        action: 'build_button_load',
        category: "builder",
        description : 'User Button Build Form',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "FlowPro file path",
                value : ""
            },
            {
                type : "text",
                label : "Label Name",
                value : ""
            },
            {
                type : "text",
                label : "Button Name",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Clear Form',
        action: 'action_build_clear_form',
        category: "builder",
        description : 'User Button Build Form',
        icon : 'ic_keyboard.png',
        properties: [

        ]
    },
    {
        type: "action",
        title: 'View',
        action: 'action_render_view',
        category: "builder",
        description : 'Place View',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "View ID",
                value : ""
            },
            {
                type : "text",
                label : "Settings",
                value : ""
            },
        ]
    },

]