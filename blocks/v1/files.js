module.exports = [
    {
        type: "action",
        title: 'Read File',
        action: 'action_read_files_as_string',
        category: "files",
        description : 'Read File as String',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "File Path",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'File Base Name',
        action: 'action_file_base_name',
        category: "files",
        description : 'Get File base name',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "File Path",
                value : ""
            },
        ]
    },
    {
        type: "conditional",
        title: 'IF File Exists',
        action: 'action_file_exists_check',
        category: "files",
        description : 'Get File base name',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "File Path",
                value : ""
            },
        ]
    },
    {
        type: "conditional",
        title: 'IF Path is File',
        action: 'action_file_is_file',
        category: "files",
        description : 'Path is file',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "File Path",
                value : ""
            },
        ]
    },
    {
        type: "conditional",
        title: 'IF Path is directory',
        action: 'action_file_is_directory',
        category: "files",
        description : 'Path is directory',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "File Path",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Copy File',
        action: 'action_file_copy',
        category: "files",
        description : 'Copy a File to destination',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Src Path",
                value : ""
            },
            {
                type : "text",
                label : "Destination",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Move File',
        action: 'action_file_move',
        category: "files",
        description : 'Move a File to destination',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Src Path",
                value : ""
            },
            {
                type : "text",
                label : "Destination",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'File Attributes',
        action: 'action_file_get_attributes',
        category: "files",
        description : 'Path is directory',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "File Path",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Create a Folder',
        action: 'action_create_folder',
        category: "files",
        description : 'Create a Folder',
        icon : 'ic_flow.png',
        properties: [
            {
                type : "text",
                label : "Folder Path",
                value : ""
            },
        ]
    },
]