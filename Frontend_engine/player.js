//URL json guide
const URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867";

let stepsArray;
let currentStep;
let currentStepID;
let tootipDiv;
let sttipDiv;
let tiplates;
let cssCode;

//Fetching the data from the given endpoint
fetch(URL).then(r => r.text()).then(result => {

    //Result now contains the response text
    result = result.substring(11, result.length-1);

    //Convert the data to js object
    result = JSON.parse(result);
    stepsArray = result.data.structure.steps;
    currentStepID = stepsArray[0].id;
    tiplates = result.data.tiplates;
    
    //CSS code from the data
    cssCode = result.data.css;
    loadCSS();
    createDivContainer();
    //create first step
    createNewStep();
    

})


function loadCSS(){

    //Connect to the background file
    chrome.runtime.sendMessage(cssCode.toString(), (funcToSend) =>{
        console.log(funcToSend);

    });


}

function createDivContainer(){

    tootipDiv = document.createElement("div"); 
    tootipDiv.className = "tooltip";
    sttipDiv = document.createElement("div");
    sttipDiv.className = "sttip";
    sttipDiv.appendChild(tootipDiv);

    //Display html element on the page
    document.body.appendChild(sttipDiv); 

   
}

function createNewStep(){

    //find the current step
    currentStep = stepsArray.find((step) => step.id === currentStepID)
    
    //last step
    if(currentStep.action.type === "closeScenario"){
        console.log("hereLastttt");
        sttipDiv.remove();
        return;
    }

    let htmlType = currentStep.action.type;

    //assign html type for the current step
    tootipDiv.innerHTML = tiplates[htmlType];

    //brings every element which has attribute of this- for the content
    document.querySelectorAll('[data-iridize-id=content]')[0].innerHTML = currentStep.action.contents["#content"];

    //find next button
    document.querySelectorAll('[data-iridize-role=nextBt]')[0].addEventListener("click", nextStep);
    //find prev button
    document.querySelectorAll('[data-iridize-role=prevBt]')[0].addEventListener("click", prevStep);


}


function nextStep(){

    //update the stepIndex
    currentStepID = currentStep.followers[0].next;
    createNewStep();


}

function prevStep(){

    
}







