//URL json guide
let URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867";

let firstStep;

//Fetching the data from the given endpoint
fetch(URL).then(r => r.text()).then(result => {

    // Result now contains the response text
    result = result.substring(11, result.length-1);
    console.log(result);

    //Convert the data to js object
    result = JSON.parse(result);
    
    firstStep = result.data.structure.steps[0];

    //Create new div for the first step
    let div = document.createElement("div"); 
    div.className = "temp";
    document.body.appendChild(div); 
    
    //Display first html element on the page
    div.innerHTML= firstStep.action.contents["#content"];


})

//Connect to the background file
chrome.runtime.sendMessage("temp", (funcToSend) =>{
    console.log(funcToSend);
  });

