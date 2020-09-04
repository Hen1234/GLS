//URL json guide
const URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867";

let stepsArray;
let currentStep;
let currentStepID;
let prevStepID;
let tooltipDiv;
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

    tooltipDiv = document.createElement("div"); 
    tooltipDiv.className = "tooltip";
    tooltipDiv.style.width = "fit-content";
    
    sttipDiv = document.createElement("div");
    sttipDiv.className = "sttip";
    sttipDiv.style.position = "absolute";
    sttipDiv.appendChild(tooltipDiv);
     //sttipDiv.style[stepPlacement] = 0;
     sttipDiv.style.zIndex = "3543543434";
   
}

function createNewStep(){

    //find the current step
    currentStep = stepsArray.find((step) => step.id === currentStepID)
    
    //last step
    if(currentStep.action.type === "closeScenario"){
        closeGuide();
        return;
    }

    updateHtmlTypeStep();
    updateSelectorStep();
    updateContentStep();
    
    //find next button
    document.querySelectorAll('[data-iridize-role=nextBt]')[0].addEventListener("click", nextStep);
    //find prev button
    document.querySelectorAll('[data-iridize-role=prevBt]')[0].addEventListener("click", prevStep);
    //find the images button
    document.querySelectorAll('.gb_g')[1].addEventListener("click", imagesSection);
    //find the "close" button
    document.querySelectorAll('[data-iridize-role=closeBt]')[0].addEventListener("click", closeGuide);


}

function updateHtmlTypeStep(){

    let htmlType = currentStep.action.type;

    //assign html type for the current step
    tooltipDiv.innerHTML = tiplates[htmlType];
    tooltipDiv.className = "tooltip "+currentStep.action.classes;

}

function updateSelectorStep(){

    let stepSelector = currentStep.action.selector;
    let selectorOnPage;
    //TODO- step 2 selector
    //find stepSelector on the page
    if(stepSelector.includes(":contains(")){
        selectorOnPage = $(stepSelector);    //////jquery
        stepSelector = stepSelector.substring(0, stepSelector.indexOf(":contains("));
        selectorOnPage = document.querySelectorAll(stepSelector)[1];
        document.querySelectorAll(stepSelector)[1].href = "javascript:void(0);";
      

        
    }else{
        selectorOnPage = document.querySelector(stepSelector);
    }

    selectorOnPage.parentNode.style.position = "relative";
    //let stepPlacement = currentStep.action.placement;
    selectorOnPage.parentNode.appendChild(sttipDiv);
}

function updateContentStep(){

    //brings every element which has attribute of this- for the content
    document.querySelectorAll('[data-iridize-id=content]')[0].innerHTML = currentStep.action.contents["#content"];

}

function nextStep(){

    prevStepID = currentStepID;
    //update the stepIndex
    currentStepID = currentStep.followers[0].next;
    createNewStep();

}

function prevStep(){

    if(prevStepID){
        currentStepID = prevStepID;
        createNewStep();
    }
    

    
}

function imagesSection(){

    document.querySelector('[data-iridize-role=nextBt]').style.display = "inline-flex";
}

function closeGuide(){

    //remove all listeners
    document.querySelectorAll('[data-iridize-role=nextBt]')[0].removeEventListener("click", nextStep);
    document.querySelectorAll('[data-iridize-role=prevBt]')[0].removeEventListener("click", prevStep);
    document.querySelectorAll('[data-iridize-role=closeBt]')[0].removeEventListener("click", closeGuide);
    document.querySelectorAll('.gb_g')[1].removeEventListener("click", imagesSection);
    //update image section ref
    document.querySelectorAll('.gb_g')[1].href = "https://www.google.co.il/imghp?hl=en&tab=wi&authuser=0&ogbl";

    sttipDiv.remove();
 
}







