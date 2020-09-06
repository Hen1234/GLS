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
let prevMouseX;
let prevMouseY;


//Replace the tooltips when the browser window is resized
window.addEventListener('resize', resizeWindowFunction);

function resizeWindowFunction(){
    if(selectorOnPage)
        placeTooltipAccordingToSelector(selectorOnPage);
}


/**
 * This section refers to fetching the data from the given endpoint which was not possible due to CORS policy block 
 * (started at 06/09/2020) 
 * As a workaround, the JSON will be consumed locally from a file 
 */
//fetch(guideURL).then(response => response.text()).then(result => {

    //result = result.substring(11, result.length-1);
    //Convert the data to js object
    //result = JSON.parse(result);
 
// }).catch(error => {
//     throw new Error("Invalid URL");
// })

const url = chrome.runtime.getURL('data.json');

fetch(url)
    .then((response) => response.text()) 
    .then((result) => main(result));

function main(result) {

    result = result.substring(11, result.length-1);

    //Convert the data to js object
    result = JSON.parse(result);
    console.log("The extension was installed successfully");
    
    stepsArray = result.data.structure.steps;
    currentStepID = stepsArray[0].id;
    tiplates = result.data.tiplates;
    
    userStepsArray = [];
    indexUserStepsArray = 0;

    //watchDog detection 
    document.addEventListener('mousemove', onMouseUpdate);
    prevMouseX = 0; prevMouseY = 0;

    //CSS code from the data
    cssCode = result.data.css;
    loadCSS();
    createDivContainer();

    //create first step
    createNewStep();

}


function loadCSS(){

    //Connect to the background file	    
    chrome.runtime.sendMessage(cssCode.toString());

}


/**
 * The function adds HTML elements because of discrepancy between the given HTML 
 * to CSS hierarchy (might done by automatic algorithm or manually)
 */
function createDivContainer(){

    tooltipDiv = document.createElement("div"); 
    tooltipDiv.className = "tooltip";
    
    sttipDiv = document.createElement("div");
    sttipDiv.className = "sttip";
    sttipDiv.appendChild(tooltipDiv);
    //sttipDiv.style.zIndex = "3543543434";

    tooltipArrowDiv = document.createElement("div");
    tooltipArrowDiv.className = "tooltip-arrow";
    tooltipDiv.appendChild(tooltipArrowDiv);

     //append the the container to the body of the page
     document.body.appendChild(sttipDiv);
     createDivContainerCSS();
   
}


/**
 * The function adds CSS code according to the div container and the given example guide from the Oracle website
 */
function createDivContainerCSS(){

    tooltipDiv.style.width = "max-content";
    tooltipDiv.style.position = "relative";
    tooltipDiv.style.border = "1px solid gray";
    tooltipDiv.style.borderRadius = "3px";
    tooltipDiv.style.padding = "0";
    tooltipDiv.style.backgroundColor = "white";

    sttipDiv.style.position = "absolute";
    sttipDiv.style.width = "max-content";

    tooltipArrowDiv.style.position = "absolute";

}


function createNewStep(){

    //find the current step
    currentStep = stepsArray.find((step) => step.id === currentStepID)
    initWatchDog();

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


/**
 * The function implements the "watchDog" attribute
 */
function initWatchDog(){

     if(currentStep.action.watchDog){
        wdInterval = setInterval(checkMovement, 400);
        setTimeout(function(){ 
            if(mouseX === prevMouseX && mouseY === prevMouseY){
                console.warn("Warning: user is idle for 3 seconds, step "+currentStepID);
            }
               
        }, 3000);

    }
    
}


/**
 * WdInterval function
 */
function checkMovement(){

    //there was no mousemove from the last time
    if(mouseX === prevMouseX && mouseY === prevMouseY){
        idle = true;
        console.log("idle");
    }else{
        idle = false;
           
    }
    prevMouseX = mouseX;
    prevMouseY = mouseY;

}


function onMouseUpdate(e){

    mouseX = e.pageX;
    mouseY = e.pageY;
    
}


function updateHtmlTypeStep(){

    let htmlType = currentStep.action.type;

    //assign html type for the current step
    tooltipDiv.innerHTML = tiplates[htmlType];
    tooltipDiv.className = "tooltip in " + currentStep.action.classes +" "+ currentStep.action.placement;

    //define the prev/next/close buttons
    prevBt = document.querySelectorAll('[data-iridize-role=prevBt]')[0];
    nextBt = document.querySelectorAll('[data-iridize-role=nextBt]')[0];
    closeBt = document.querySelectorAll('[data-iridize-role=closeBt]')[0];

    //assign the classes attribute from the JSON guide causes the "next" button hides part of the "prev" button
    //fix it manually here 
    prevBt.style.maxWidth = "fit-content";
    prevBt.parentElement.style.height = "100%";

    //inner text of the "next" button
    if(currentStep.action.roleTexts){
        if(currentStep.action.roleTexts.nextBt)
            nextBt.innerText= currentStep.action.roleTexts.nextBt;   
    }
     //place the arrow correctly according to the DOM
     tooltipDiv.insertBefore(tooltipArrowDiv, tooltipDiv.childNodes[0]);
     placeArrow();

}


/**
 * The function places the arrow according to the given example guide from the Oracle website, 
 * class "in" from the CSS code in the JSON guide does not locate the arrow position as the given example
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

function updateSelectorStep(){

    let stepSelector = currentStep.action.selector;

     //find stepSelector on the page
    selectorOnPage = $(stepSelector);
    selectorOnPage = selectorOnPage.length > 1 ? findSelector(selectorOnPage) : selectorOnPage[0];

    //"Images" section- condition to forward the next step according to the JSON guide
    if(currentStep.next){
        currentStepHref = selectorOnPage.href;
        selectorOnPage.href = "javascript:void(0);";
         //listener the "Images" button
        selectorOnPage.addEventListener("click", imagesSection);
    }
    
    placeTooltipAccordingToSelector(selectorOnPage);
}


function placeTooltipAccordingToSelector(selectorOnPage) {

    const selectorPositionOnPage = selectorOnPage.getBoundingClientRect();
    if(currentStep.action.placement === 'right'){
        sttipDiv.style.top = selectorPositionOnPage.top.toString() + "px";
        sttipDiv.style.left = (selectorPositionOnPage.left + selectorPositionOnPage.width + tooltipArrowDiv.offsetWidth).toString() + "px"; 
    }
    if(currentStep.action.placement === 'bottom'){
        sttipDiv.style.top = (selectorPositionOnPage.top + selectorPositionOnPage.height + tooltipArrowDiv.offsetHeight).toString() + "px"; 
        sttipDiv.style.left = (selectorPositionOnPage.left + (selectorPositionOnPage.width * 0.5)).toString() + "px";
    }
    if(currentStep.action.placement === 'left'){
        sttipDiv.style.top = selectorPositionOnPage.top.toString() + "px";
        sttipDiv.style.left = (selectorPositionOnPage.left - sttipDiv.offsetWidth - tooltipArrowDiv.offsetWidth).toString() + "px"; 
    }
    if(currentStep.action.placement === 'top'){
        sttipDiv.style.top = (selectorPositionOnPage.top - sttipDiv.offsetHeight - tooltipArrowDiv.offsetHeight).toString() + "px"; 
        sttipDiv.style.left = (selectorPositionOnPage.left + (selectorPositionOnPage.width * 0.5)).toString() + "px";
    }

}


/**
 * The function returns the valid selector element in the page
 * @param selectorsElementsOnPage- the appropriate selectors elements according to the JSON guide 
 */
function findSelector(selectorsElementsOnPage) {
    let validElement =  selectorsElementsOnPage[0];
        selectorsElementsOnPage.each((index, element) => {
        const elementOffset = element.getBoundingClientRect();
        if(elementOffset.left !== 0 || elementOffset.top !== 0){
            validElement = element;
            return false;
        }
        });
    return  validElement;
}


function updateContentStep(){

    document.querySelectorAll('[data-iridize-id=content]')[0].innerHTML = currentStep.action.contents["#content"];

}

function updateStepsCount(){

    let stepCount = document.querySelector('[data-iridize-role=stepCount]');
    stepCount.innerHTML = stepCount.innerHTML+ (currentStep.action.stepOrdinal);
    
    let stepsCount = document.querySelector('[data-iridize-role=stepsCount]');
    //refer the step ordinal of the last actual step as the same step ordinal of the step before it as written in the JSON guide
    stepsCount.innerHTML = stepsCount.innerHTML+ (stepsArray.length-2);

}

function nextStep(){

    if(wdInterval > 0) clearInterval(wdInterval);
    prevStepID = userStepsArray[indexUserStepsArray];
    //update the userStepIndex
    indexUserStepsArray++;
    //update the current step ID
    currentStepID = currentStep.followers[0].next;
    createNewStep();

}

function prevStep(){

    if(wdInterval > 0) clearInterval(wdInterval);
    if(prevStepID){
        if(currentStep.next){
            selectorOnPage.href = currentStepHref;
            selectorOnPage.removeEventListener("click", imagesSection);
        }
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
    nextBt.style.display = "inline-flex";
    selectorOnPage.href = currentStepHref;
    selectorOnPage.removeEventListener("click", imagesSection);
   
}

function closeGuide(){

    //remove all listeners
    nextBt.removeEventListener("click", nextStep);
    prevBt.removeEventListener("click", prevStep);
    closeBt.removeEventListener("click", closeGuide);
    window.removeEventListener('resize', resizeWindowFunction);
    document.removeEventListener('mousemove', onMouseUpdate);


    //remove wdInterval
    if(wdInterval > 0){
        clearInterval(wdInterval);
    } 

    //update the href
    if(currentStep.next){
        selectorOnPage.href = currentStepHref;
        selectorOnPage.removeEventListener("click", imagesSection);

    }
   
    //remove div container
    sttipDiv.remove();
 
}
