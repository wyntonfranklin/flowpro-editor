module.exports = {
    blocks : function(){
        return [
            {
                type: "action",
                title: 'Do nothing',
                category: "general",
                description : 'Do nothing. Just pass along',
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
                type: "action",
                category: "numeric",
                title: 'Add Two Values',
                description : 'Add Values',
                icon : 'ic_math.png',
                action: 'add_two_numbers',
                properties : [
                    {
                        type : "text",
                        label : "First Number",
                        value : ""
                    },
                    {
                        type : "text",
                        label : "Second Number",
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
                title: 'Subtract Two Values',
                description : 'Subtract tow values',
                icon : 'ic_math.png',
                action: 'subtract_two_numbers',
                properties : [
                    {
                        type : "text",
                        label : "First Number",
                        value : ""
                    },
                    {
                        type : "text",
                        label : "Second Number",
                        value : ""
                    },
                ]
            },
            {
                type: "action",
                category: "numeric",
                title: 'Multiply two values',
                description : 'Multiply two Values',
                icon : 'ic_math.png',
                action: 'action_multiply_two_numbers',
                properties : [
                    {
                        type : "text",
                        label : "First Value",
                        value : ""
                    },
                    {
                        type : "text",
                        label : "Second Value",
                        value : ""
                    },
                ]
            },
            {
                type: "action",
                category: "numeric",
                title: 'Divide two values',
                description : 'Divide two Values',
                icon : 'ic_math.png',
                action: 'action_divide_two_numbers',
                properties : [
                    {
                        type : "text",
                        label : "First Value",
                        value : ""
                    },
                    {
                        type : "text",
                        label : "Second Value",
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
                type: "screen",
                title: 'Output Results',
                category: "output",
                description : 'Output Results',
                icon : 'ic_computer.png',
                action: 'output_results',
                properties: [
                    {
                        type : "dropdown",
                        label : "Select screen results",
                        options : ["console","dialog","window"],
                        value : ""
                    },
                ]
            },
            {
                type: "screen",
                title: 'Send Email',
                category: "output",
                description : 'Send Email',
                icon : 'ic_email.png',
                action: 'action_send_email',
                properties: [
                    {
                        type : "dropdown",
                        label : "Select screen results",
                        options : ["console","dialog","window"],
                        value : ""
                    },
                ]
            },
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
                        type : "text",
                        label : "Prepend",
                        value : ""
                    },
                    {
                        type : "text",
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
                type: "loop",
                title: 'Loop by number',
                action: 'forloop',
                category: "loops",
                description : 'Loop by a given amount',
                icon : 'ic_repeat.png',
                properties: [
                    {
                        type : "number",
                        label : "Maximum Loops",
                        value : ""
                    },
                ]
            },
            {
                type: "loop",
                title: 'Loop by Input',
                action: 'foreach',
                category: "loops",
                description : 'Loop by given input',
                icon : 'ic_repeat.png',
                properties: [

                ]
            },
            {
                type: "conditional",
                title: 'If Else',
                action: 'action_if_else',
                category: "conditional",
                description : 'If Else statements',
                icon : 'ic_flow.png',
                properties: [
                    {
                        type : "text",
                        label : "Field1",
                        value : ""
                    },
                    {
                        type : "text",
                        label : "Operator",
                        value : ""
                    },
                    {
                        type : "text",
                        label : "Field2",
                        value : ""
                    },
                    {
                        type : "text",
                        label : "Output",
                        value : ""
                    },
                    {
                        type : "text",
                        label : "Else (Output)",
                        value : ""
                    },
                ]
            },
            {
                type: "input",
                title: 'Read File As String',
                action: 'action_read_file',
                category: "input",
                description : 'Read a file',
                icon : 'ic_keyboard.png',
                properties: [
                    {
                        type : "text",
                        label : "File path",
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
                        type : "number",
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
                type: "loop",
                title: 'End Loop',
                action: 'action_end_loop',
                category: "loops",
                description : 'End loop or if statement',
                icon : 'ic_repeat.png',
                properties: [

                ]
            },
            {
                type: "action",
                title: 'Reverse Array',
                action: 'action_reverse_array',
                category: "arrays",
                description : 'Reverse an array',
                icon : 'ic_edit.png',
                properties: [

                ]
            },
            {
                type: "conditional",
                title: 'If Null',
                action: 'action_if_null',
                category: "conditional",
                description : 'If input is null',
                icon : 'ic_flow.png',
                properties: [

                ]
            },
            {
                type: "conditional",
                title: 'If Not Null',
                action: 'action_if_not_null',
                category: "conditional",
                description : 'If input is not null',
                icon : 'ic_flow.png',
                properties: [

                ]
            },
            {
                type: "action",
                title: 'End If',
                action: 'endif',
                category: "conditional",
                description : 'End If statement',
                icon : 'ic_flow.png',
                properties: [

                ]
            },
            {
                type: "action",
                title: 'Pow',
                action: 'action_math_pow',
                category: "math",
                description : 'End If statement',
                icon : 'ic_math.png',
                properties: [
                    {
                        type : "text",
                        label : "X",
                        value : ""
                    },
                    {
                        type : "text",
                        label : "Y",
                        value : ""
                    },
                ]
            },
            {
                type: "action",
                title: 'Square Root',
                action: 'action_sqr_root',
                category: "math",
                description : 'Square Root',
                icon : 'ic_math.png',
                properties: [
                    {
                        type : "text",
                        label : "X",
                        value : ""
                    },
                ]
            },
            {
                type: "action",
                title: 'Sin',
                action: 'action_sin_cal',
                category: "math",
                description : 'Math.sin()',
                icon : 'ic_math.png',
                properties: [
                    {
                        type : "text",
                        label : "X",
                        value : ""
                    },
                ]
            },
            {
                type: "action",
                title: 'Cos',
                action: 'action_cos_cal',
                category: "math",
                description : 'Math.cos()',
                icon : 'ic_math.png',
                properties: [
                    {
                        type : "text",
                        label : "X",
                        value : ""
                    },
                ]
            },
            {
                type: "action",
                title: 'PI',
                action: 'action_pi_cal',
                category: "math",
                description : 'Get PI',
                icon : 'ic_math.png',
                properties: [

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
                    {
                        type : "dropdown",
                        label : "Select screen results",
                        options : ["console","dialog","window"],
                        value : ""
                    },
                ]
            },
            {
                type: "conditional",
                title: 'If Do',
                action: 'action_if_do',
                category: "conditional",
                description : 'If condition execute block',
                icon : 'ic_flow.png',
                properties: [
                    {
                        type : "text",
                        label : "Input 1 /Output",
                        value : ""
                    },
                    {
                        type : "dropdown",
                        label : "Conditions",
                        options : ["==","<","<=",">=","!=", ">"],
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
                title: 'Split Text By Line',
                action: 'action_split_by_line',
                category: "string",
                description : 'Split text by line. Returns array',
                icon : 'ic_word.png',
                properties: [

                ]
            },
        ]
    }
}