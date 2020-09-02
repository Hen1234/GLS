var css = "body { border: 20px solid red; }";

chrome.runtime.onMessage.addListener(injectCSS);


function injectCSS (message, sender, senderFunc) {
    //inject css to the page
    chrome.tabs.insertCSS({code: css});
    //answer the script
    senderFunc(sender.id);
    
}