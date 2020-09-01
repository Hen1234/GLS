//URL json guide
var URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867";

//Fetching the data from the given endpoint
fetch(URL).then(r => r.text()).then(result => {
    // Result now contains the response text
    result = result.substring(11, result.length-1);
    console.log(result);
    //Convert the data to js object
    result = JSON.parse(result);
    console.log(result);
    
})


//Communication with the embedding page
window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_GOOGLE")) {
        console.log("Content script received message: " + event.data.text);
    }
});



// var script = document.createElement('script'); 
// script.text = "// your js code here"; 
// (document.head||document.documentElement).appendChild(script);

// var s = document.createElement('script');
// // TODO: add "script.js" to web_accessible_resources in manifest.json
// s.src = chrome.runtime.getURL('player.js');
// s.onload = function() {
//     this.remove();
// };
// (document.head || document.documentElement).appendChild(s);
