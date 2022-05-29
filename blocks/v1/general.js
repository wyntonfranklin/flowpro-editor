module.exports = [
    {
        type: "action",
        title: 'Start',
        category: "general",
        description : 'Parent Node. Start here',
        icon : 'ic_leaf.png',
        action: 'do_nothing',
        properties: [
        ]
    },
    {
        type: "action",
        title: 'End Block',
        category: "general",
        description : 'End flow here',
        icon : 'ic_leaf.png',
        action: 'do_nothing',
        properties: [
        ]
    },
    {
        type: "action",
        title: 'Variable',
        category: "general",
        description : 'Assign output to variable',
        icon : 'ic_box.png',
        action: 'action_assign_variable',
        properties: [
            {
                type : "text",
                label : "Variable Name",
                value : ""
            },
            {
                type : "text",
                label : "Initialize As",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Concat Variable',
        category: "general",
        description : 'Concat World Variable',
        icon : 'ic_box.png',
        action: 'action_concat_variable',
        properties: [
            {
                type : "text",
                label : "Variable Name",
                value : ""
            },
            {
                type : "text",
                label : "Initialize As",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Comment',
        category: "general",
        description : 'Add a comment',
        icon : 'ic_leaf.png',
        action: '',
        properties: [
            {
                type : "text",
                label : "Add your comment",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Variable from Array',
        category: "general",
        description : 'Get value from array based on index',
        icon : 'ic_edit.png',
        action: 'action_get_array_value',
        properties: [
            {
                type : "text",
                label : "Enter Key",
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
        type: "file",
        title: 'File Function',
        action: 'action_file_function',
        category: "general",
        description : 'File function',
        icon : 'ic_file.png',
        properties: [
            {
                type : "text",
                label : "Enter File Path",
                value : ""
            },
        ]
    },
    {
        type: "file",
        title: 'Include File',
        action: 'action_include_file',
        category: "general",
        description : 'Include flow. Same variables',
        icon : 'ic_file.png',
        properties: [
            {
                type : "text",
                label : "Enter File Path",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Wait a little',
        action: 'action_wait_time',
        category: "general",
        description : 'Wait some time',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Time in milliseconds",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Bulk Assign',
        action: 'action_bulk_assignment',
        category: "general",
        description : 'Assign values to multiple variables',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Variables and values to assign",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Validation Block',
        action: 'action_validate_variables',
        category: "general",
        description : 'Validate flow at this point',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Conditions String",
                value : ""
            },
            {
                type : "dropdown",
                label : "Response to flow",
                value : "break",
                options: ["break","continue"]
            },
        ]
    },
    {
        type: "action",
        title: 'Break Execution',
        action: 'action_stop_execution',
        category: "general",
        description : 'Stop flow execution here',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Stop message",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Parse Markdown',
        action: 'action_parse_markdown',
        category: "general",
        description : 'Parse Markdown',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Markdown Input",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Unique Date ID',
        action: 'action_generate_date_id',
        category: "general",
        description : 'Generate unique id using date',
        icon : 'ic_leaf.png',
        properties: [

        ]
    },
    {
        type: "action",
        title: 'Unique String ID',
        action: 'action_generate_string_id',
        category: "general",
        description : 'Generate unique string id',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Max Characters",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Open a File',
        action: 'action_open_a_file',
        category: "general",
        description : 'Open a File',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "File to open",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Play a File',
        action: 'action_play_a_sound',
        category: "general",
        description : 'Play a File',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "File to play",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Parse String as object',
        action: 'action_parse_string',
        category: "general",
        description : 'Parse String as object',
        icon : 'ic_leaf.png',
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
        title: 'Download a file',
        action: 'action_download_file',
        category: "general",
        description : 'Download a file given a link',
        icon : 'ic_leaf.png',
        properties: [
            {
                type : "text",
                label : "Url or Path",
                value : ""
            },
            {
                type : "text",
                label : "Save Location",
                value : ""
            },
        ]
    },


]