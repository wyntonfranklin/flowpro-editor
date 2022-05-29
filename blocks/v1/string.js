module.exports = [
    {
        type: "action",
        title: 'Split Text',
        action: 'action_split_text',
        category: "string",
        description : 'Split Text using delimiter',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Enter the delimiter",
                value : ""
            },
            {
                type : "dropdown",
                label : "Return as",
                value : "",
                options : ['string', 'array']
            },
        ]
    },
    {
        type: "action",
        title: 'Find and replace',
        category: "string",
        description : 'Find and replace',
        action: 'action_find_replace',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Find",
                value : ""
            },
            {
                type : "text",
                label : "Replace with",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Character Count',
        action: 'action_char_count',
        category: "string",
        description : 'Calculate the number of characters in string',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Input",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Word Count',
        action: 'action_word_count',
        category: "string",
        description : 'Calculate the number of word in string',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Prepend",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'String Length',
        action: 'action_string_length',
        category: "string",
        description : 'Calculate string length',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Input (optional)",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Prepend/Append',
        action: 'action_prepend_string',
        category: "string",
        description : 'Prepend or Append String',
        icon : 'ic_word.png',
        properties: [
            {
                type : "longtext",
                label : "Prepend",
                value : ""
            },
            {
                type : "longtext",
                label : "Append",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Concat',
        action: 'action_concat_string',
        category: "string",
        description : 'Concat String',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Input",
                value : ""
            },
            {
                type : "text",
                label : "Input 2",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Concat And Assign',
        action: 'action_concat_assign_string',
        category: "string",
        description : 'Concat and Assign String',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Input",
                value : ""
            },
            {
                type : "longtext",
                label : "Input 2",
                value : ""
            },
            {
                type : "text",
                label : "Assign to Variable",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Right Trim',
        action: 'action_right_trim',
        category: "string",
        description : 'Trim whitespace right',
        icon : 'ic_word.png',
        properties: [
        ]
    },
    {
        type: "action",
        title: 'Left Trim',
        action: 'action_left_trim',
        category: "string",
        description : 'Trim whitespace left',
        icon : 'ic_word.png',
        properties: [
        ]
    },
    {
        type: "action",
        title: 'Trim',
        action: 'action_full_trim',
        category: "string",
        description : 'Trim whitespace on string',
        icon : 'ic_word.png',
        properties: [
        ]
    },
    {
        type: "action",
        title: 'To Lowercase',
        action: 'action_to_lowercase',
        category: "string",
        description : 'Make String lowercase',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Input (optional)",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'To Uppercase',
        action: 'action_to_uppercase',
        category: "string",
        description : 'Make String upper',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Input (optional)",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Left (Before String)',
        category: "string",
        description : 'Left (Before String)',
        action: 'action_string_left',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "String/Input",
                value : ""
            },
            {
                type : "text",
                label : "Match",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Right (Before String)',
        category: "string",
        description : 'Right (Before String)',
        action: 'action_string_right',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "String/Input",
                value : ""
            },
            {
                type : "text",
                label : "Match",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Matches by Regex',
        action: 'action_matches_by_regex',
        category: "string",
        description : 'Find match using regex return array',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Regex",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Split Text By Line',
        action: 'action_split_by_line',
        category: "string",
        description : 'Split text by line. Returns array',
        icon : 'ic_word.png',
        properties: [

        ]
    },
    {
        type: "action",
        title: 'To String',
        action: 'action_to_string',
        category: "string",
        description : 'Convert value to string if possible',
        icon : 'ic_word.png',
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
        title: 'Line Break',
        action: 'action_add_line_break',
        category: "string",
        description : 'Add Line Break',
        icon : 'ic_word.png',
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
        title: 'Join Strings',
        action: 'action_join_strings',
        category: "string",
        description : 'Join Strings together',
        icon : 'ic_word.png',
        properties: [
            {
                type : "text",
                label : "Values to join",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'Template String',
        action: 'action_template_string',
        category: "string",
        description : 'Creating a string using a template',
        icon : 'ic_word.png',
        properties: [
            {
                type : "longtext",
                label : "Enter content here",
                value : ""
            },
            {
                type : "text",
                label : "Assign to variable",
                value : ""
            },
        ]
    },

]