module.exports = [
    {
        type: "screen",
        title: 'Send Email',
        category: "output",
        description : 'Send Email',
        icon : 'ic_email.png',
        action: 'action_send_email',
        properties: [
            {
                type : "text",
                label : "Connection String",
                value : ""
            },
            {
                type : "text",
                label : "To",
                value : ""
            },
            {
                type : "text",
                label : "Subject",
                value : ""
            },
            {
                type : "longtext",
                label : "Body",
                value : ""
            },
            {
                type : "text",
                label : "From",
                value : ""
            },
            {
                type : "text",
                label : "Attachments",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Save to Excel',
        action: 'action_save_to_excel',
        category: "output",
        description : 'Save to excel',
        icon : 'ic_computer.png',
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
                type : "text",
                label : "Filename",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Write to file',
        action: 'action_write_to_file',
        category: "output",
        description : 'Write to file',
        icon : 'ic_computer.png',
        properties: [
            {
                type : "text",
                label : "File path",
                value : ""
            },
            {
                type : "dropdown",
                label : "Write options",
                options : ["append","overwrite"],
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Form Post Data',
        action: 'action_post_data',
        category: "output",
        description : 'Send a Form Post Request',
        icon : 'ic_computer.png',
        properties: [
            {
                type : "text",
                label : "Enter url",
                value : ""
            },
            {
                type : "text",
                label : "Post Data String",
                value : ""
            },
            {
                type : "dropdown",
                label : "Return Type",
                options : ['text','json'],
                value : "text"
            },
            {
                type : "text",
                label : "Headers",
                value : ""
            },
            {
                type : "text",
                label : "Files",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Pipe Output',
        action: 'action_pipe_output',
        category: "output",
        description : 'Pipe world to output',
        icon : 'ic_computer.png',
        properties: [
            {
                type : "text",
                label : "Pipe Values",
                value : ""
            },
        ]
    },
    {
        type: "screen",
        title: 'Output Results',
        category: "output",
        description : 'Output Results',
        icon : 'ic_computer.png',
        action: 'output_results',
        properties: [

        ]
    },
    {
        type: "screen",
        title: 'Output Results to View',
        category: "output",
        description : 'Output Results to View',
        icon : 'ic_computer.png',
        action: 'output_to_view',
        properties: [
            {
                type : "text",
                label : "View ID",
                value : ""
            },
            {
                type : "dropdown",
                label : "Display Option",
                options : ['overwrite','append'],
                value : "overwrite"
            },
        ]
    },
    {
        type: "screen",
        title: 'Echo Message',
        action: 'action_echo_message',
        category: "output",
        description : 'Echo or display a message',
        icon : 'ic_computer.png',
        properties: [
            {
                type : "text",
                label : "Message",
                value : ""
            },
        ]
    },
    {
        type: "screen",
        title: 'Output in Window',
        category: "output",
        description : 'Output Results In New Window',
        icon : 'ic_computer.png',
        action: 'output_results_in_window',
        properties: [
            {
                type : "text",
                label : "Page Title",
                value : ""
            },
            {
                type : "text",
                label : "Page Excerpt",
                value : ""
            },
            {
                type : "longtext",
                label : "Styling (CSS)",
                value : ""
            },
        ]
    },
    {
        type: "screen",
        title: 'Print output',
        action: 'action_print_output',
        category: "output",
        description : 'Print Output',
        icon : 'ic_computer.png',
        properties: [
            {
                type : "text",
                label : "Variable to Print",
                value : ""
            },
        ]
    },
    {
        type: "screen",
        title: 'Print World',
        action: 'action_print_world',
        category: "output",
        description : 'Print World Variables',
        icon : 'ic_computer.png',
        properties: [
        ]
    },
    {
        type: "action",
        title: 'Show Notification',
        action: 'action_show_notification',
        category: "output",
        description : 'Show a popup notification',
        icon : 'ic_computer.png',
        properties: [
            {
                type : "text",
                label : "Enter message",
                value : ""
            },
            {
                type : "dropdown",
                label : "Notification Type",
                options : ['success','error','info','warning'],
                value : "success"
            },
        ]
    },
    {
        type: "action",
        title: 'Display Data Table',
        category: "output",
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
            {
                type : "text",
                label : "View Id",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Pretty Print',
        action: 'action_pretty_print',
        category: "output",
        description : 'Format object in a nice way',
        icon : 'ic_computer.png',
        properties: [
            {
                type : "text",
                label : "Input/output",
                value : ""
            },
        ]
    },
    {
        type: "screen",
        title: 'Alert Dialog',
        action: 'action_alert_dialog',
        category: "output",
        description : 'Display an alert dialog',
        icon : 'ic_computer.png',
        properties: [
            {
                type : "text",
                label : "Message",
                value : ""
            },
            {
                type : "text",
                label : "Alert Style",
                value : ""
            },
            {
                type : "text",
                label : "Action button",
                value : ""
            },
            {
                type : "dropdown",
                label : "Action Type",
                options : ["Open flowpro","Open Link","Close Dialog"],
                value : "Open flowpro"
            },
            {
                type : "text",
                label : "Action Parameters",
                value : ""
            },
        ]
    },

]