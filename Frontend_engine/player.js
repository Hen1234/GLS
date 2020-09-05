//URL json guide
const guideURL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867";

let stepsArray;
let userStepsArray;
let indexUserStepsArray;
let currentStep;
let selectorOnPage;
let currentStepID;
let prevStepID;
let tooltipDiv;
let sttipDiv;
let tooltipArrowDiv;
let tiplates;
let cssCode;
let prevBt;
let nextBt;
let closeBt;
let currentStepHref;
let wdInterval;
let idle;
let mouseX;
let mouseY;
let lastMouseX;
let lastMouseY;

//Replace the tooltips when the browser window is resized
window.addEventListener('resize', function(event){
    if(selectorOnPage)
        placeTooltipAccordingToSelector(selectorOnPage);
});

//TODO- try JSONP or with jquery or with jsonFetch
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

    //for the watchDog
    document.addEventListener('mousemove', onMouseUpdate);
    lastMouseX = 0; lastMouseY = 0;

    //CSS code from the data
    cssCode = result.data.css;
    loadCSS();
    createDivContainer();
    //create first step
    createNewStep();


}).catch(error => {
    throw new Error("Invalid URL");
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

     //TODO explain
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
    watchDog();

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
    updateStepsCount();
    
    //listener next button
    nextBt.addEventListener("click", nextStep);
    //listener prev button
    prevBt.addEventListener("click", prevStep);
    //listener the "close" button
    closeBt.addEventListener("click", closeGuide);
    
    
}

function watchDog(){

     if(currentStep.action.watchDog){
        wdInterval = setInterval(checkMovement, 400);
        setTimeout(function(){ 
            if(mouseX === lastMouseX && mouseY === lastMouseY){
                console.warn("Warning: user is idle for 3 seconds, step "+currentStepID);
                 //TODO RESET?
            }
               
        }, 3000);

    }

}


function checkMovement(){

    //there was no mousemove from the last time
    //idle = (mouseY === lastMouseY && mouseX === lastMouseX) ? true : false
    if(mouseX === lastMouseX && mouseY === lastMouseY){
        idle = true;
        console.log("idle");
    }else{
        idle = false;
           
    }
    lastMouseX = mouseX;
    lastMouseY = mouseY;

}

function onMouseUpdate(e){

    mouseX = e.pageX;
    mouseY = e.pageY;
    
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

    //assign the prev/next/close buttons
    prevBt = document.querySelectorAll('[data-iridize-role=prevBt]')[0];
    nextBt = document.querySelectorAll('[data-iridize-role=nextBt]')[0];
    closeBt = document.querySelectorAll('[data-iridize-role=closeBt]')[0];

    //assign the classes attribute from the json guide causes the "next" button hides part of the "prev" button
    //fix it manually here 
    prevBt.style.maxWidth = "fit-content";
    prevBt.parentElement.style.height = "100%";
    
    //inner text of the "next" button
    if(currentStep.action.roleTexts){
        if(currentStep.action.roleTexts.nextBt)
            nextBt.innerText= currentStep.action.roleTexts.nextBt;   
    }
     //for the arrow to be the first child
     tooltipDiv.insertBefore(tooltipArrowDiv, tooltipDiv.childNodes[0]);
     placeArrow();

}

function updateSelectorStep(){

    let stepSelector = currentStep.action.selector;

     //find stepSelector on the page
    selectorOnPage = $(stepSelector);
    
    console.dir(selectorOnPage);
    selectorOnPage = selectorOnPage.length > 1 ? correctSelector(selectorOnPage) : selectorOnPage[0];

    //for the "images" section- there is a condition to forward the next step
    //as long as the user uses the guide, he is not able to get the "images" section
    if(currentStep.next){
        currentStepHref = selectorOnPage.href;
        selectorOnPage.href = "javascript:void(0);";
        //selectorOnPage.attr("href", "javascript:void(0);");
        console.dir(selectorOnPage);
         //listener the images button
        selectorOnPage.addEventListener("click", imagesSection);
    }
    
    placeTooltipAccordingToSelector(selectorOnPage);
}

function correctSelector(selectorsElementsOnPage) {
    let validElement =  selectorsElementsOnPage[0];
		//for loop jQuery
        selectorsElementsOnPage.each((index, element) => {
        const elementOffset = element.getBoundingClientRect();
        if(elementOffset.left !== 0 || elementOffset.top !== 0){
            validElement = element;
            return false;
        }
        });
    console.dir(validElement);
    return  validElement;


}

function updateContentStep(){

    //brings every element which has attribute of this- for the content
    document.querySelectorAll('[data-iridize-id=content]')[0].innerHTML = currentStep.action.contents["#content"];

}

function updateStepsCount(){

    let stepCount = document.querySelector('[data-iridize-role=stepCount]');
    stepCount.innerHTML = stepCount.innerHTML+ (currentStep.action.stepOrdinal);
    
    let stepsCount = document.querySelector('[data-iridize-role=stepsCount]');
    //refer the step ordinal of the last actual step as the same step ordinal of the step before it as written in the json guide
    stepsCount.innerHTML = stepsCount.innerHTML+ (stepsArray.length-2);

}

function nextStep(){

    prevStepID = userStepsArray[indexUserStepsArray];
    //userStepsArray[indexUserStepsArray] = currentStepID;
    console.dir(userStepsArray);
    //update the userStepIndex
    indexUserStepsArray++;
    //update the current step ID
    currentStepID = currentStep.followers[0].next;
    createNewStep();

}

function prevStep(){

    if(prevStepID){
        currentStepID = userStepsArray[indexUserStepsArray-1];
        indexUserStepsArray--;
        if(indexUserStepsArray === 0){
            prevStepID = null;
        }
        createNewStep();
    }
     
}

function imagesSection(event){

    event.preventDefault();
    document.querySelector('[data-iridize-role=nextBt]').style.display = "inline-flex";
    selectorOnPage.href = currentStepHref;
    selectorOnPage.removeEventListener("click", imagesSection);
   
}

function closeGuide(){

    //remove all listeners
    nextBt.removeEventListener("click", nextStep);
    prevBt.removeEventListener("click", prevStep);
    closeBt.removeEventListener("click", closeGuide);
    //update the href
    if(currentStep.next){
        selectorOnPage.href = currentStepHref;
        selectorOnPage.removeEventListener("click", imagesSection);

    }
   
    sttipDiv.remove();
 
}







