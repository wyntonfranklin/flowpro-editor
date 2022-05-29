module.exports = [

    {
        type: "action",
        title: 'Short Text Input',
        category: "input",
        description : 'Add short text',
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
        title: 'Long Text Input',
        category: "input",
        description : 'Long Text input',
        icon : 'ic_keyboard.png',
        action: 'long_text_input',
        properties: [
            {
                type : "longtext",
                label : "Enter text",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Numerical Input',
        category: "input",
        description : 'Enter a number',
        icon : 'ic_keyboard.png',
        action: 'numerical_text_input',
        properties: [
            {
                type : "number",
                label : "Enter number",
                value : ""
            },
        ]
    },
    {
        type: "input",
        title: 'Fetch as HTML/Json',
        action: 'action_fetch_data',
        category: "input",
        description : 'Fetch json data using url',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Url or Api Link",
                value : ""
            },
            {
                type : "dropdown",
                label : "Return type",
                options : ["text","json"],
                value : ""
            },
            {
                type : "longtext",
                label : "Headers",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Read Excel as Array',
        action: 'action_read_excel_as_array',
        category: "input",
        description : 'Read Excel file as array',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Excel File path",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Read XML file',
        action: 'action_parse_xml_from_file',
        category: "input",
        description : 'Read XML file as object',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "XML File path",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Parse XML Data',
        action: 'action_parse_xml_from_output',
        category: "input",
        description : 'Parse XML data from input/output',
        icon : 'ic_keyboard.png',
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
        title: 'Read File As String',
        action: 'action_read_files_as_string',
        category: "input",
        description : 'Read File as String',
        icon : 'ic_keyboard.png',
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
        title: 'Read Dir',
        action: 'action_read_files_to_array',
        category: "input",
        description : 'Read Directory Return Array',
        icon : 'ic_keyboard.png',
        properties: [
            {
                type : "text",
                label : "Directory Path",
                value : ""
            },
        ]
    },
]