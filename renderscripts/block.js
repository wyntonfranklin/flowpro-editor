const { ipcRenderer } = require('electron')


document.body.addEventListener('contextmenu', e=>{
    ipcRenderer.invoke('show-context-menu','blockview');
});



ipcRenderer.on('display', function (evt, results) {

    console.log(results);
    let block = results.details;

    document.getElementById("prop-title").innerText = block.title;
    document.getElementById("prop-desc").innerText = block.description;
    document.getElementById("prop-body").innerText = "";
    let properties = block.properties;
    let output = "";
    if(properties.length > 0){
        properties.forEach(prop=>{
            output += "<tr>";
            output += `<td>${prop.label}</td>`;
            output += `<td>${prop.value}</td>`;
            output += "<tr>";
        });
    }else{
        output += "<tr><td colspan='2'>No Properties</td></tr>"
    }
    document.getElementById("prop-body").innerHTML = output;

});