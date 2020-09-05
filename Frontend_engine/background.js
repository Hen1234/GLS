chrome.runtime.onMessage.addListener(injectCSS);


function injectCSS (message, sender, senderFunc) {
    //inject css to the page
    chrome.tabs.insertCSS(null, {code: message});
    senderFunc(message);
 
    
}




