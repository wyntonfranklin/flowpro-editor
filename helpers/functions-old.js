const world = require("../helpers/world");
const fs = require('fs');
const nodemailer = require('nodemailer');
const logs = require("../helpers/logs");
const {set} = require("./settingsManager");
const mysqlHandler = require("../modules/sqlContainer");
const Queue = require("../helpers/callbackHolder");


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

module.exports = {
    add_two_numbers : function(properties, output, prev, settings){
        let num1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let num2 = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        if(isNull(num2)){
            logs.add("Second property is missing", settings);
        }
        return parseInt(num1) + parseInt(num2);
    },
    long_text_input : function(properties, output, prev, settings){
        let o = "";
        properties.forEach(prop=>{
            if(prop.value !== null){
                o = prop.value;

            }
        })
        return o;
    },
    short_text_input : function(properties, output, cb){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : "";
        cb(userinput);
    },
    numerical_text_input : function(properties){
        let output = "";
        properties.forEach(prop=>{
            if(prop.value !== null){
                output = prop.value;

            }
        })
        return output;
    },
    action_split_text : function (properties, output, prev, settings){
        let o = [];
        let input = properties[0].value;
        try{
            o = output.split(input)
            return o;
        }catch (e){
            logs.logger.error(e);
        }
    }
    ,
    action_find_replace : function (properties, output){
        let find = properties[0].value;
        let replace = properties[1].value;
        var re = new RegExp(find, "gi")
        return output.replace(re, replace)
    },
    action_char_count : function(properties, output){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        var charCount = Array.from(userinput).length;
        return charCount;
    },
    action_word_count : function(properties, output){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        var text = userinput.split(' ');
        var wordCount = 0;
        for (var i = 0; i < text.length; i++) {
            if (text[i] !== ' ') {
                wordCount++;
            }
        }
        return wordCount;
    },
    do_nothing: function(properties, output){
        return output;
    },
    action_prepend_string : function(properties, output){
        let append = (properties[0].value) ? world.parseForWorld(properties[0].value) : "";
        let prepend = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        return append + output  + prepend;
    },
    action_concat_string : function (properties, output, prev){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let userinput2 = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        return userinput + userinput2;
    },
    action_concat_assign_string : function(properties, output, prev){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let userinput2 = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        let userinput3 = (properties[2].value) ? world.parseForWorld(properties[2].value) : "";
        let final = userinput + userinput2;
        world.concatWorldVariable(userinput3, final);
        return final;
    },
    action_concat_variable : function(properties, output, prev, settings){
        let userinput = (properties[0].value) ? world.parseForWorld(properties[0].value) : "";
        let userinput2 = (properties[1].value) ? world.parseForWorld(properties[1].value) : output;
        if(isNull(userinput)){
            logs.add("Property one cannot be blank", settings)
        }else{
            world.concatWorldVariable(userinput, userinput2);
        }
    },
    action_add_numbers_array : function(properties, output){
        let current = 0;
        if(Array.isArray(output)){
            output.forEach(number=>{
                    current += parseFloat(number);
            })
        }
        return current
    },
    action_add_numbers : function(properties, output, prev){
      return parseFloat(prev) + parseFloat(output);
    },
    action_if_else : function(properties, output){
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
    action_left_trim: function(properties, output){
        return output.replace(/^\s+/, '');
    },
    action_right_trim:  function(properties, output){
        return output.trimRight();
    },
    action_full_trim: function(properties, output){
        return output.trim();
    },
    action_assign_variable : function(properties, output){
        let varName = (properties[0].value) ? properties[0].value : "";
        let vvalue = (properties[1].value) ? world.parseForWorld(properties[1].value) : output;
        world.addWorldVariable(varName, vvalue);
        return output;
    },
    action_get_array_value : function(properties, output){
        let index = (properties[0].value) ? properties[0].value : "";
        index = world.parseForWorld(index);
        let array_name = (properties[1].value) ? properties[1].value : null;
        if(array_name){
            let arr = world.parseForWorld(array_name);
            output = arr;
        }
        if(Array.isArray(output)){
            return output[index];
        }
        return "";
    },
    action_random_number : function(properties, output){
        let min = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let max = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    subtract_two_numbers : function(properties, output){
        let myoutput = 0;
        let num1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let num2 = world.parseForWorld(properties[1].value);
        myoutput = parseFloat(num1) - parseFloat(num2);
        return myoutput;
    },
    action_to_lowercase : function(properties, output){
        let text = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        return text.toLowerCase()
    },
    action_to_uppercase : function(properties, output){
        let text = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        return text.toUpperCase()
    },
    action_multiply_two_numbers: function(properties, output){
        let results = 0;
        let num1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let num2 = world.parseForWorld(properties[1].value);
        results = parseFloat(num1) * parseFloat(num2);
        return results;
    },
    action_divide_two_numbers : function(properties, output){
        let results = 0;
        let num1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let num2 = world.parseForWorld(properties[1].value);
        results = parseFloat(num1) / parseFloat(num2);
        return results;
    },
    action_round_number : function(properties, output){
        let num1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        return Math.round(num1);
    },
    action_read_file : function(properties, output, prev, settings){
        let filePath = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        if(isNull(filePath)){
            logs.add("File path cannot be blank", settings);
        }
        var content = fs.readFileSync(filePath,  {encoding: 'utf8'});
        return content;
    },
    action_fetch_data : function (properties, output) {
        let response = "";
        let urlPath = world.parseForWorld(doesPropExists(properties, 0)) ?? output;
        let rType = doesPropExists(properties, 1) ?? "text";
        let headers = convertQueryToObject(doesPropExists(properties, 2));
        console.log(headers, "my headers");
        let request = new XMLHttpRequest();
        request.open('GET', urlPath, false);  // `false` makes the request synchronous
        if(Object.keys(headers).length > 1){
            for (const key in headers) {
                request.setRequestHeader(key, headers[key]);
            }
        }
        try{
            request.send(null);
            if (request.status === 200) {

            }
            if(rType == 'text'){
                response = request.responseText;
                console.log(response);
            }else if(rType == "json"){
                response = JSON.parse(request.responseText);
                console.log(response);
            }
        }catch (e){
            logs.logger.error(e);
            return null;
        }
        return response;
    },
    action_math_ceil : function(properties, output){
        let num1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        return Math.round(num1);
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
    action_string_left : function(properties, output){
        let string = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let match = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        return world.subStrAfterChars(string, match,'b');
    },
    action_string_right : function(properties, output){
        let string = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let match = (properties[1].value) ? world.parseForWorld(properties[1].value) : "";
        return world.subStrAfterChars(string, match,'a');
    },
    action_string_length : function(properties, output){
        let string = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        return string.length;
    },
    action_send_email : async function(properties, output){
        let connectionString = (doesPropExists(properties, 0)) ?? "";
        let connectionObject = convertQueryToObject(connectionString);
        let toString = (doesPropExists(properties, 1)) ?? "";
        let subjectString = (doesPropExists(properties, 2)) ?? "";
        let bodyString = getPropertyValue(properties, 3, output, true);
        //validation
        const message = {
            from: 'flowpro@gmail.com',
            to: toString,
            subject: subjectString,
            text: stripHtml(bodyString),
            html : bodyString,
        };
        let transport = nodemailer.createTransport({
            host: getDefaultIfPropNoExists(connectionObject, 'host', ""),
            port: getDefaultIfPropNoExists(connectionObject, 'port',""),
            auth: {
                user: getDefaultIfPropNoExists(connectionObject,'user',''),
                pass: getDefaultIfPropNoExists(connectionObject,'password','')
            }
        });
        let results = await transport.sendMail(message);
        sendToConsole("Email sent successfully");

    },
    action_matches_by_regex : function(properties, output){
        let match = (properties[0].value) ? properties[0].value : "";
        let re = new RegExp(match);
        console.log(match);
        console.log(output.match(re));
        return output.match(re);
    },
    action_get_value_by_index : function(properties, output){
        let index = (properties[0].value) ? properties[0].value : 0;
        let ar = (properties[1].value) ? world.parseForWorld(properties[1].value) : output;
        if(Array.isArray(ar)){
            return ar[index];
        }
    },
    action_get_value_by_key : function(properties, output){
        let index = (properties[0].value) ? properties[0].value : "";
        let ar = (properties[1].value) ? world.parseForWorld(properties[1].value) : output;
        try{
            if(typeof ar == "object"){
                return ar[index];
            }
        }catch (e){
            logs.logger.error(e);
        }
    },
    action_reverse_array : function(properties, output){
        if(Array.isArray(output)){
            return output.reverse();
        }
    },
    action_if_null : function(properties, output){
        if(Array.isArray(output) && output.length <=0){
            return true;
        }else if(typeof output == "object" && Object.keys(output).length <=0){
            return true;
        }else if(typeof output == "string" && output.length <=0){
            return true;
        }else if(output == undefined || output == undefined){
            return true;
        }
        return false;
    },
    action_if_not_null : function(properties, output){
        if(Array.isArray(output) && output.length <=0){
            return false;
        }else if(typeof output == "object" && Object.keys(output).length <=0){
            return false;
        }else if(typeof output == "string" && output.length <=0){
            return false;
        }else if(output == undefined || output == undefined){
            return false;
        }
        return true;
    },
    action_math_pow : function(properties, output){
        let x = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let y = (properties[1].value) ? properties[1].value : 0;
        return Math.pow(x, y);
    },
    action_sqr_root : function(properties, output){
        let x = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        return Math.sqrt(x);
    },
    action_sin_cal : function(properties, output){
        let x = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        return Math.sin(x);
    },
    action_cos_cal : function(properties, output){
        let x = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        return Math.cos(x);
    },
    action_pi_cal : function(properties, output){
        return Math.PI;
    },
    action_wait_time : function(properties, output){
        let time = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        wait(time);
        return output;
    },
    action_write_to_file : function(properties, output, prev, settings){
        let filePath = (properties[0].value) ? world.parseForWorld(properties[0].value) : "";
        let type = (properties[1].value) ? world.parseForWorld(properties[1].value) : "overwrite";
        if(isNull(filePath)){
            logs.add("File path cannot be blank", settings);
        }
        try {
            if(type == "overwrite"){
                fs.writeFileSync(filePath, output);
            }else{
                fs.appendFileSync(filePath, output + "\r\n");
            }
        } catch (error) {
            console.log(error);
            logs.logger.error(error);
        }
        return output;
    },
    action_filter_by_condition : function(properties, output){
        let compare = (properties[0].value) ? world.parseForWorld(properties[0].value) : "";
        let condition = (properties[1].value) ? properties[1].value : "";
        let results = null;
        if(Array.isArray(output)){
            results = output.filter(val=>{
                return compareByValue(val,condition, compare);
            })
        }
        return results;
    },
    output_results : function(properties, output){
        return output;
    },
    action_if_do : function(properties, output){
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        let condition = (properties[1].value) ? properties[1].value : "";
        let ip2 = (properties[2].value) ? world.parseForWorld(properties[2].value) : "";
        return compareByValue(ip1,condition, ip2);
    },
    action_increment_number : function(properties, output){
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        return ++ip1;
    },
    action_read_excel_as_array: async function(properties, output){
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
      //  const workbook = new Excel.Workbook();
      //  await workbook.xlsx.readFile(filename);
       // return results;
    },
    action_split_by_line : function(properties, output){
        try{
            return output.split("\n");
        }catch (e){
            logs.logger.error(e);
            return output;
        }
    },
    action_math_constants : function(properties, output){
        let ip1 = (properties[0].value) ? properties[0].value : "";
        if(ip1 == "E"){
            return Math.E;
        }else if(ip1 == "LN2"){
            return Math.LN2;
        }else if(ip1 == "LN10"){
            return Math.LN10;
        }else if(ip1 == "LOG2E"){
            return Math.LOG2E;
        }else if(ip1 == "PI"){
            return Math.PI;
        }else if(ip1 == "SQRT1_2"){
            return Math.SQRT1_2;
        }else if(ip1 == "SQRT2"){
            return Math.SQRT2;
        }
        return null;
    },
    action_decrement_number : function(properties, output){
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        return --ip1;
    },
    action_to_string : function(properties, output, prev, settings){
        let ip1 = (properties[0].value) ? world.parseForWorld(properties[0].value) : output;
        try{
            return ip1.toString();
        }catch (e){
            logs.logger.error(e);
        }
    },
    action_bulk_assignment : function(properties, output, prev, settings){
        let ip1 = (properties[0].value) ? properties[0].value : output;
        if(isNull(ip1)){
            logs.add("Input cannot be null", settings);
        }
        let params = convertQueryToObject(ip1);
        console.log(params);
        world.bulkAssign(params);
    },
    action_add_line_break : function(properties, output, prev, settings){
        let ip1 = (properties[0].value) ? properties[0].value : output;
        return output + "\r\n";
    },
    action_create_p_element : function(properties, output, prev, settings){
        let ip1 = doesPropExists(properties, 0) ?? output;
        return "<p>" + ip1 + "</p>";
    },
    action_run_mysql_query : function(properties, output, prev, settings){
        mysqlHandler.callBackQuery({}, "");
        setTimeout(function(){
            let results =  Queue.removeFromQuery();
            Queue.clearQueue();
            console.log(results, 'my results functions.js');
            return results;
        }, 5000)
    }

}