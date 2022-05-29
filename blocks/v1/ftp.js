module.exports = [
    {
        type: "action",
        title: 'FTP Upload',
        action: 'action_ftp_upload',
        category: "ftp",
        description : 'Upload a file to ftp',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Connection Settings",
                value : ""
            },
            {
                type : "text",
                label : "File to upload",
                value : ""
            },
            {
                type : "text",
                label : "Remote Path",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'FTP Download',
        action: 'action_ftp_download',
        category: "ftp",
        description : 'Download a file from ftp',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Connection Settings",
                value : ""
            },
            {
                type : "text",
                label : "File to download",
                value : ""
            },
            {
                type : "text",
                label : "Local Save Path",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'FTP List Files',
        action: 'action_ftp_list',
        category: "ftp",
        description : 'List files from ftp',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Connection Settings",
                value : ""
            },
            {
                type : "text",
                label : "Directory to list",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'SFTP List Files',
        action: 'action_sftp_list',
        category: "ftp",
        description : 'SFTP list files',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Connection Settings",
                value : ""
            },
            {
                type : "text",
                label : "Remote Path",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'SFTP Download File',
        action: 'action_sftp_download_file',
        category: "ftp",
        description : 'SFTP Download a file',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Connection Settings",
                value : ""
            },
            {
                type : "text",
                label : "Remote File",
                value : ""
            },
            {
                type : "text",
                label : "Local Save Path",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'SFTP Upload File',
        action: 'action_sftp_upload_file',
        category: "ftp",
        description : 'SFTP Upload a file',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Connection Settings",
                value : ""
            },
            {
                type : "text",
                label : "Local File",
                value : ""
            },
            {
                type : "text",
                label : "Remote Path",
                value : ""
            },
        ]
    },

    ]