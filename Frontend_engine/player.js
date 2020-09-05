//URL json guide
const guideURL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867";

let stepsArray;
let userStepsArray;
let indexUserStepsArray;
let currentStep;
let currentStepID;
let prevStepID;
let tooltipDiv;
let sttipDiv;
let tooltipArrowDiv;
let tiplates;
let cssCode;

//Fetching the data from the given endpoint
fetch(guideURL).then(response => response.text()).then(result => {

    //Result now contains the response text
    result = result.substring(11, result.length-1);

    //Convert the data to js object
    result = JSON.parse(result);
    stepsArray = result.data.structure.steps;
    currentStepID = stepsArray[0].id;
    tiplates = result.data.tiplates;
    
    userStepsArray = [];
    indexUserStepsArray = 0;

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

/**
 * The function adds html elements because of discrepancy between html 
 * to css hierarchy (might done by automatic algorithm or manually)
 */
function createDivContainer(){

    tooltipDiv = document.createElement("div"); 
    tooltipDiv.className = "tooltip";
    tooltipDiv.style.width = "max-content";
    
    sttipDiv = document.createElement("div");
    sttipDiv.className = "sttip";
    sttipDiv.style.position = "absolute";
    sttipDiv.appendChild(tooltipDiv);
    sttipDiv.style.zIndex = "3543543434";

     tooltipArrowDiv = document.createElement("div");
     tooltipArrowDiv.className = "tooltip-arrow";
     tooltipArrowDiv.style.position = "absolute";

     tooltipDiv.style.position = "relative";
     tooltipDiv.style.border = "1px solid gray";
     tooltipDiv.style.borderRadius = "3px";
     tooltipDiv.style.padding = "0";
     tooltipDiv.style.backgroundColor = "white";
 
     tooltipDiv.appendChild(tooltipArrowDiv);

     //append the the container to the body of the page
     document.body.appendChild(sttipDiv);
   
}

function createNewStep(){

    //find the current step
    currentStep = stepsArray.find((step) => step.id === currentStepID)
    //update the steps array of the user
    userStepsArray[indexUserStepsArray] = currentStepID;
    
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


function placeTooltipAccordingToSelector(selectorOnPage) {

    const selectorPositionOnPage = selectorOnPage.getBoundingClientRect();
    if(currentStep.action.placement === 'right'){
        sttipDiv.style.top = selectorPositionOnPage.top.toString() + "px";
        sttipDiv.style.left = (selectorPositionOnPage.left + selectorPositionOnPage.width + tooltipArrowDiv.offsetWidth).toString() + "px"; // arrow width- 27
    }
    if(currentStep.action.placement === 'bottom'){
        sttipDiv.style.top = (selectorPositionOnPage.top + selectorPositionOnPage.height + tooltipArrowDiv.offsetHeight).toString() + "px"; // arrow height- 34
        sttipDiv.style.left = (selectorPositionOnPage.left + (selectorPositionOnPage.width * 0.5)).toString() + "px";
    }
	//TODO add top + left

}


/**
 * The function places the arrow according to the original guide (classes "in" from the css code didn't locate
 * the arrow position as well)
 */
function placeArrow() {
    //init values
    tooltipArrowDiv.style.removeProperty("right");
    tooltipArrowDiv.style.removeProperty("left");
    tooltipArrowDiv.style.removeProperty("top");
    tooltipArrowDiv.style.removeProperty("bottom");

    if(currentStep.action.placement === 'right' || currentStep.action.placement === 'left'){
		//17 is half of the arrow height
        tooltipArrowDiv.style.top = "17px";
        // tooltipArrowDiv.style.top = (tooltipArrowDiv.offsetHeight * 0.5 ) + "px";
        if(currentStep.action.placement === 'right') {
			//27 is the arrow width
            tooltipArrowDiv.style.left = "-27px";
        } else {
            tooltipArrowDiv.style.right = "-27px";
        }
    }
    if(currentStep.action.placement === 'bottom' || currentStep.action.placement === 'top'){
        tooltipArrowDiv.style.left = ((tooltipDiv.offsetWidth * 0.5 ) + tooltipArrowDiv.offsetWidth) + "px";
        if(currentStep.action.placement === 'bottom') {
            tooltipArrowDiv.style.top = (tooltipArrowDiv.offsetHeight * -1) + "px";
        } else {
            tooltipArrowDiv.style.bottom = (tooltipArrowDiv.offsetHeight * -1) + "px";
        }
    }

}

function updateHtmlTypeStep(){

    let htmlType = currentStep.action.type;

    //assign html type for the current step
    tooltipDiv.innerHTML = tiplates[htmlType];
    tooltipDiv.className = "tooltip in " + currentStep.action.classes +" "+ currentStep.action.placement;

     //for the arrow to be the first child
     tooltipDiv.insertBefore(tooltipArrowDiv, tooltipDiv.childNodes[0]);
     placeArrow();

}

function updateSelectorStep(){

    let stepSelector = currentStep.action.selector;

     //find stepSelector on the page
    let selectorOnPage = $(stepSelector)[0];
    console.log(selectorOnPage);

    //for the images section
    if(currentStep.next){
        selectorOnPage.href = "javascript:void(0);";
    }
    
    placeTooltipAccordingToSelector(selectorOnPage);
}

function updateContentStep(){

    //brings every element which has attribute of this- for the content
    document.querySelectorAll('[data-iridize-id=content]')[0].innerHTML = currentStep.action.contents["#content"];

}

function nextStep(){

    prevStepID = userStepsArray[indexUserStepsArray];
    //userStepsArray[indexUserStepsArray] = currentStepID;
    console.dir(userStepsArray);
    indexUserStepsArray++;
    //update the stepIndex
    currentStepID = currentStep.followers[0].next;
    createNewStep();

}

function prevStep(){

    if(prevStepID){
        currentStepID = userStepsArray[indexUserStepsArray-1];
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







