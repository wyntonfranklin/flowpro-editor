const world = require("../helpers/world");
const fs = require('fs');
const nodemailer = require('nodemailer');
const logs = require("../helpers/logs");
const {set} = require("./settingsManager");
const mysqlHandler = require("../modules/sqlContainer");
const commandHandler = require("../modules/commandContainer");
const excelHandler = require("../modules/excelContainer");
const emailHandler = require("../modules/mailContainer");
const xmlHandler = require("../modules/xmlContainer");
const notificationHandler = require("../helpers/notifications");
const UTILS = require("../helpers/utils");
const url = require("url");


function stripHtml(html)
{
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function getDefaultIfPropNoExists(object, prop, def){
    if(object[prop]){
        return object[prop];
    }
    return def;
}

function convertQueryToObject(text){
    let results = {};
    let params = new URLSearchParams(text);
    for(const [key, value] of params) { // each 'entry' is a [key, value] tupple
        results[key] = value;
    }
    return results;
}

function getQueryStringParseWorld(query){
    let queryObject  = convertQueryToObject(query);
    let results = { };
    const entries = Object.entries(queryObject);
    for (const [key, value] of entries) {
            results[key] = world.parseForWorld(value);
    }
    return results;
}

function getArrayValuesCheckWorld(values){
    let results = [];
    values.forEach(val=>{
        results.push(world.parseForWorld(val))
    });
    return results;
}

function convertStringToArray(input, delim, dotrim){
    let output = input.split(delim);
    let results = [];
    output.forEach(val=>{
        if(dotrim){
            results.push(val.trim())
        }else{
            results.push(val)
        }
    })
    return results;
}

function doesPropExists(properties, num){
    if(properties[num]){
        return properties[num].value
    }
    return null;
}

function getPropertyValue(prop, key, def, checkworld){
    if(prop[key]){
        if(isNull(prop[key].value)){
            return def;
        }else{
            if(checkworld){
                return world.parseForWorld(prop[key].value)
            }else{
                return prop[key].value;
            }
        }
    }else{
        return def;
    }
}

function wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

function isNull(value){
    if(value == undefined || value == ""){
        return true;
    }
    if(typeof value == "string" && value.length <=0){
       //return true;
    }
    return false;
}

function compareByValue(value, condition, compare){
    if(condition == "=="){
        if(value == compare){
            return true;
        }
    }else if(condition == "<"){
        if(compare < value){
            return true;
        }
    }else if(condition == "<="){
        if(compare <= value){
            return true;
        }
    }else if(condition == ">="){
        if(compare >= value){
            return true;
        }
    }else if(condition == "!="){
        if(compare != value){
            return true;
        }
    }
    return false;
}

function getVariablesFromString(userinput, delim, trim){
    return getArrayValuesCheckWorld(convertStringToArray(userinput,delim, trim))
}

module.exports = {
    add_two_numbers : function(properties, output, cb){
        let numbers = (properties[0].value) ? properties[0].value : output;
        let values = getVariablesFromString(numbers,",", true);
        let results = 0;
        values.forEach(val=>{
            results += parseFloat(val);
        })
        cb(results);
    },
    long_text_input : function(properties, output, cb){
        let o = "";
        properties.forEach(prop=>{
            if(prop.value !== null){
                o = prop.value;

            }
        })
        cb(o);
    },
    short_text_input : function(properties, output, cb){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : "";
        cb(userinput);
    },
    numerical_text_input : function(properties, output, cb){
        let results = "";
        properties.forEach(prop=>{
            if(prop.value !== null){
                results = prop.value;

            }
        })
        cb(results);
    },
    action_split_text : function (properties, output, cb){
        let o = [];
        let input = properties[0].value;
        try{
            o = output.split(input)
            cb(o);
        }catch (e){
            logs.logger.error(e);
        }
    }
    ,
    action_find_replace : function (properties, output, cb){
        let find = properties[0].value;
        let replace = properties[1].value;
        var re = new RegExp(find, "gi")
        cb(output.replace(re, replace));
    },
    action_char_count : function(properties, output, cb){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        var charCount = Array.from(userinput).length;
        cb(charCount);
    },
    action_word_count : function(properties, output, cb){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        var text = userinput.split(' ');
        var wordCount = 0;
        for (var i = 0; i < text.length; i++) {
            if (text[i] !== ' ') {
                wordCount++;
            }
        }
        cb(wordCount);
    },
    do_nothing: function(properties, output, cb){
        cb(output);
    },
    action_prepend_string : function(properties, output, cb){
        let append = (properties[0].value) ? world.parseForWorld(properties[0].value) : "";
        let prepend = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        cb(append + output  + prepend);
    },
    action_concat_string : function (properties, output, cb){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let userinput2 = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        cb(userinput + userinput2);
    },
    action_concat_assign_string : function(properties, output,cb){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let userinput2 = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        let userinput3 = (properties[2].value) ? world.parseForWorld(properties[2].value) : "";
        let final = userinput + userinput2;
        world.concatWorldVariable(userinput3, final);
        cb(final);
    },
    action_concat_variable : function(properties, output, cb){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : "";
        let userinput2 = (properties[1].value) ? world.parseForWorld(properties[1].value) : output;
        if(isNull(userinput)){
         //   logs.add("Property one cannot be blank", {})
        }else{
            world.concatWorldVariable(userinput, userinput2);
        }
        cb(output);
    },
    action_add_numbers_array : function(properties, output, cb){
        let current = 0;
        if(Array.isArray(output)){
            output.forEach(number=>{
                    current += parseFloat(number);
            })
        }
        cb(current);
    },
    action_add_numbers : function(properties, output, cb){
      cb(parseFloat(prev) + parseFloat(output));
    },
    action_if_else : function(properties, output, cb){
        let field1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let strOp = (properties[1].value) ? properties[1].value : "";
        let comparison = (properties[2].value) ? world.parseForWorld(properties[2].value) : "";
        let conpos = (properties[3].value) ? world.parseForWorld(properties[3].value) : "";
        let conneg = (properties[4].value) ? world.parseForWorld(properties[4].value) : "";
        if(strOp === "=="){
            if(field1 == comparison){
                return conpos;
            }else{
                return conneg;
            }
        }else if(strOp === "!="){
            if(field1 != comparison){
                return conpos;
            }else{
                return conneg;
            }
        }
    },
    action_left_trim: function(properties, output, cb){
        cb(output.replace(/^\s+/, ''));
    },
    action_right_trim:  function(properties, output, cb){
       cb(output.trimRight());
    },
    action_full_trim: function(properties, output, cb){
        console.log(output, "trming");
        cb(output.trim());
    },
    action_assign_variable : function(properties, output, cb){
        let varName = (properties[0].value) ? properties[0].value : "";
        let vvalue = (properties[1].value) ? world.parseForWorld(properties[1].value) : output;
        world.addWorldVariable(varName, vvalue);
        cb(output);
    },
    action_get_array_value : function(properties, output, cb){
        let index = (properties[0].value) ? properties[0].value : "";
        index = world.parseForWorld(index);
        let array_name = (properties[1].value) ? properties[1].value : null;
        if(array_name){
            let arr = world.parseForWorld(array_name);
            output = arr;
        }
        if(Array.isArray(output)){
            cb(output[index]);
        }else{
            cb("");
        }
    },
    action_random_number : function(properties, output, cb){
        let min = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let max = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        cb(Math.floor(Math.random() * (max - min + 1) + min));
    },
    subtract_two_numbers : function(properties, output, cb){
        let myoutput = 0;
        let numbers = (properties[0].value) ? properties[0].value : output;
        let variables = getVariablesFromString(numbers,",", true);
        variables.forEach(vr=>{
            if(myoutput == 0){
                myoutput = vr;
            }else{
                myoutput = myoutput - vr;
            }
        })
        cb(myoutput);
    },
    action_to_lowercase : function(properties, output, cb){
        let text = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        cb(text.toLowerCase());
    },
    action_to_uppercase : function(properties, output, cb){
        let text = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        cb(text.toUpperCase());
    },
    action_multiply_two_numbers: function(properties, output, cb){
        let results = null;
        let userInput = (properties[0].value) ? properties[0].value : output;
        let numbers = getVariablesFromString(userInput,",", true);
        results = numbers[0];
        numbers.forEach((num, i)=>{
            if(i!==0){
                results = results*num;
            }
        })
        cb(results);
    },
    action_divide_two_numbers : function(properties, output, cb){
        let results = null;
        let userInput = (properties[0].value) ? properties[0].value : output;
        let numbers = getVariablesFromString(userInput,",", true);
        results = numbers[0];
        numbers.forEach((num,i)=>{
            if(i!==0){
                results = results/num;
            }
        });
        cb(results);
    },
    action_round_number : function(properties, output, cb){
        let num1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        cb(Math.round(num1));
    },
    action_read_file : function(properties, output, cb){
        let filePath = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        if(isNull(filePath)){
           // logs.add("File path cannot be blank", settings);
        }
        var content = fs.readFileSync(filePath,  {encoding: 'utf8'});
        cb(content);
    },
    action_fetch_data : function (properties, output, cb) {
        let response = "";
        let urlPath = world.parseForWorld(doesPropExists(properties, 0)) ?? output;
        let rType = doesPropExists(properties, 1) ?? "text";
        let headers = convertQueryToObject(doesPropExists(properties, 2));
        console.log(headers, "my headers");
        if(rType == "json"){
            fetch(urlPath, {headers: headers })
                .then(response => response.json())
                .then(data => cb(data));
        }else{
            fetch(urlPath,{headers: headers })
                .then(response => response.text())
                .then(data => cb(data));
        }
    },
    action_math_ceil : function(properties, output, cb){
        let num1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        cb(Math.round(num1));
    },
    action_post_data: function(properties, output){
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "ajaxfile.php", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Response
                var response = this.responseText;
            }
        };
        var data = {name:'yogesh',salary: 35000,email: 'yogesh@makitweb.com'};
        xhttp.send(JSON.stringify(data));
    },
    action_string_left : function(properties, output, cb){
        let string = UTILS.getPropertyValue(properties, 0, output, true);
        let match = UTILS.getPropertyValue(properties, 1, "", false);
        if(match){
            cb(world.subStrAfterChars(string, match,'b'));
        }else{
            logs.sendToConsole("No match. Returning current output");
            cb(output);
        }
    },
    action_string_right : function(properties, output, cb){
        let string = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let match = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        cb(world.subStrAfterChars(string, match,'a'));
    },
    action_string_length : function(properties, output, cb){
        let string = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        cb(string.length);
    },
    action_send_email : function(properties, output, cb){
        let connectionString = world.parseForWorld(doesPropExists(properties, 0)) ?? "";
        let connectionObject = convertQueryToObject(connectionString);
        let toString = (doesPropExists(properties, 1)) ?? "";
        toString = world.parseForWorld(toString);
        let subjectString = (doesPropExists(properties, 2)) ?? "";
        subjectString = world.parseForWorld(subjectString);
        let bodyString = getPropertyValue(properties, 3, output, true);
        emailHandler.send(toString, subjectString,bodyString, connectionObject, cb);

    },
    action_matches_by_regex : function(properties, output, cb){
        let match = (properties[0].value) ? properties[0].value : "";
        let re = new RegExp(match);
        console.log(match);
        console.log(output.match(re));
        cb(output.match(re));
    },
    action_get_value_by_index : function(properties, output, cb){
        let index = (properties[0].value) ? properties[0].value : 0;
        let ar = (properties[1].value) ? world.parseForWorld(properties[1].value) : output;
        if(Array.isArray(ar)){
           cb(ar[index]);
        }
    },
    action_get_value_by_key : function(properties, output, cb){
        let index = (properties[0].value) ? properties[0].value : "";
        let ar = (properties[1].value) ? world.parseForWorld(properties[1].value) : output;
        try{
            if(typeof ar == "object"){
                cb(ar[index]);
            }
        }catch (e){
            logs.logger.error(e);
        }
    },
    action_reverse_array : function(properties, output, cb){
        if(Array.isArray(output)){
            cb(output.reverse());
        }
    },
    action_if_null : function(properties, output, cb){
        let result = false;
        if(Array.isArray(output) && output.length <=0){
            result =  true;
        }else if(typeof output == "object" && Object.keys(output).length <=0){
            result = true;
        }else if(typeof output == "string" && output.length <=0){
            result = true;
        }else if(output == undefined || output == undefined){
            result = true;
        }
        cb(result);
    },
    action_if_not_null : function(properties, output, cb){
        let result = true;
        if(Array.isArray(output) && output.length <=0){
            result = false;
        }else if(typeof output == "object" && Object.keys(output).length <=0){
            result = false;
        }else if(typeof output == "string" && output.length <=0){
            result = false;
        }else if(output == undefined || output == undefined){
            result = false;
        }
        cb(result);
    },
    action_math_pow : function(properties, output, cb){
        let x = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let y = (properties[1].value) ? properties[1].value : 0;
        cb(Math.pow(x, y));
    },
    action_sqr_root : function(properties, output, cb){
        let x = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        cb(Math.sqrt(x));
    },
    action_sin_cal : function(properties, output, cb){
        let x = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        cb(Math.sin(x));
    },
    action_cos_cal : function(properties, output, cb){
        let x = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        cb(Math.cos(x));
    },
    action_pi_cal : function(properties, output, cb){
        cb(Math.PI);
    },
    action_wait_time : function(properties, output, cb){
        let time = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        setTimeout(function(){
            cb(output);
        }, time);
    },
    action_write_to_file : function(properties, output, cb){
        let filePath = UTILS.getPropertyValue(properties, 0, output, true);
        let type = UTILS.getPropertyValue(properties, 1, "overwrite", false);
        if(isNull(filePath)){
            logs.sendToConsole("File cannot be blank [Write to File Block]");
        }else{
            try {
                if(type == "overwrite"){
                    fs.writeFileSync(filePath, output,  { flag: 'a+' });
                }else{
                    fs.appendFileSync(filePath, output + "\r\n");
                }
            } catch (error) {
                console.log(error);
                logs.logger.error(error);
            }
            cb(output);
        }
    },
    action_filter_by_condition : function(properties, output, cb){
        let compare = (properties[0].value) ? world.parseForWorld(properties[0].value) : "";
        let condition = (properties[1].value) ? properties[1].value : "";
        let results = null;
        if(Array.isArray(output)){
            results = output.filter(val=>{
                cb(compareByValue(val,condition, compare))
            })
        }else{
            cb(results);
        }
    },
    output_results : function(properties, output, cb){
        cb(output);
    },
    action_if_do : function(properties, output, cb){
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let condition = (properties[1].value) ? properties[1].value : "";
        let ip2 = (properties[2].value) ? world.parseForWorld(properties[2].value) : "";
        cb(compareByValue(ip1,condition, ip2));
    },
    action_increment_number : function(properties, output, cb){
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
       cb(++ip1);
    },
    action_read_excel_as_array: async function(properties, output, cb){
        let filename = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        excelHandler.getRows(filename, function(results){
           cb(results);
        });
    },
    action_split_by_line : function(properties, output, cb){
        try{
            cb(output.split("\n"));
        }catch (e){
            logs.logger.error(e);
            cb(output);
        }
    },
    action_math_constants : function(properties, output, cb){
        let results = "";
        let ip1 = (properties[0].value) ? properties[0].value : "";
        if(ip1 == "E"){
            results =  Math.E;
        }else if(ip1 == "LN2"){
            results = Math.LN2;
        }else if(ip1 == "LN10"){
            results = Math.LN10;
        }else if(ip1 == "LOG2E"){
            results = Math.LOG2E;
        }else if(ip1 == "PI"){
            results = Math.PI;
        }else if(ip1 == "SQRT1_2"){
            results = Math.SQRT1_2;
        }else if(ip1 == "SQRT2"){
            results = Math.SQRT2;
        }
       cb(results);
    },
    action_decrement_number : function(properties, output, cb){
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        cb(--ip1);
    },
    action_to_string : function(properties, output, cb){
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        try{
            if(typeof ip1 == "object"){
                cb(JSON.stringify(ip1));
            }else{
                cb(ip1.toString());
            }
        }catch (e){
            logs.logger.error(e);
        }
    },
    action_bulk_assignment : function(properties, output, cb){
        let ip1 = (properties[0].value) ? properties[0].value : output;
        if(isNull(ip1)){
          //  logs.add("Input cannot be null");
        }
        let params = convertQueryToObject(ip1);
        console.log(params);
        world.bulkAssign(params);
        cb(output);
    },
    action_add_line_break : function(properties, output, cb){
        let ip1 = (properties[0].value) ? properties[0].value : output;
        cb(output + "\r\n");
    },
    action_create_p_element : function(properties, output, cb){
        let ip1 = doesPropExists(properties, 0) ?? output;
        cb("<p>" + ip1 + "</p>");
    },
    action_run_mysql_query : function(properties, output, cb){
        let connectionString = world.parseForWorld(doesPropExists(properties, 0)) ?? output;
        let sqlQuery = doesPropExists(properties, 1) ?? null;
        let connectionObject = convertQueryToObject(connectionString);
        mysqlHandler.callBackQuery(connectionObject, sqlQuery, function(results){
            console.log(results, "here are my results");
            cb(results);
        });
    },
    action_basic_command : function(properties, output, cb){
        let commandString = world.parseForWorld(UTILS.getProperty(properties,0, ""));
        commandHandler.run(commandString, function(results){
            cb(results);
        });
    },
    action_parse_xml_from_file : function(properties, output, cb){
        let ip1 = doesPropExists(properties, 0) ?? "";
        let data = fs.readFileSync(ip1).toString("utf-8");
        xmlHandler.parse(data, {}, function(results){
            cb(results);
        });
    },
    action_parse_xml_from_output : function(properties, output, cb){
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        xmlHandler.parse(ip1, {}, function(results){
            cb(results);
        });
    },
    /*
    action_print_output : function(properties, output, cb) {
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let ip2 = (properties[1].value) ? properties[1].value : "";
    },*/
    action_print_output : function(properties, output, cb){
        cb(output);
    },
    action_escaped_query: function(properties, output, cb){
        let connectionString = world.parseForWorld(UTILS.getProperty(properties,0,""));
        let sqlQuery =  (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        let placeholders =  (properties[2].value) ? properties[2].value : "";
        let connectionObject = convertQueryToObject(connectionString);
        let placeHolderArray = getArrayValuesCheckWorld(placeholders.split(","));
        mysqlHandler.escapedQuery(connectionObject, sqlQuery, placeHolderArray, function(results){
            console.log(results, "here are my results");
            cb(results);
        });
    },
    action_create_html_table: function(properties, output, cb){
        let headers = (properties[0].value) ? properties[0].value : "";
        let headerArray = convertStringToArray(headers,",", true);
        let data = (properties[1].value) ? world.parseForWorld(properties[1].value) : output;
        let type = (properties[2].value) ? properties[2].value : "object";
        let results = "<table>";
        if(headerArray.length >= 1){
            results += '<tr>';
            headerArray.forEach(headerText => {
                results += `<td>${headerText}</td>`;
            });
            results += '</tr>';
        }
        if(type == "array"){
            data.forEach(row=>{
                results += '<tr>';
                row.forEach(rw=>{
                    results += `<td>${rw}</td>`;
                });
                results += '</tr>';
            })
        }else{
            data.forEach(row=>{
                results += '<tr>';
                Object.values(row).forEach(text => {
                    results += `<td>${text}</td>`;
                })
                results += '</tr>';
            })
        }
        results += "</table>";
        cb(results);
    },
    action_show_notification: function(properties, output, cb){
        let message = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let messageType = (properties[1].value) ? properties[1].value : "success";
        if(messageType == "success"){
            notificationHandler.success(message);
        }else if(messageType == "error"){
            notificationHandler.error(message);
        }
        cb(output);
    },
    action_join_strings : function(properties, output, cb){
        let message = (properties[0].value) ? properties[0].value : "";
        let results = "";
        let options = getArrayValuesCheckWorld(convertStringToArray(message,",", false));
        options.forEach(item=>{
            results += item;
        });
        cb(results);
    },
    action_create_object_from_string : function(properties, output, cb){
        let userInput = (properties[0].value) ? properties[0].value : "";
        let obj = getQueryStringParseWorld(userInput);
        cb(obj);
    }

}