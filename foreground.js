notifyBackground({command: 'register'});

function notifyBackground(message) {
    chrome.extension.sendRequest(message, console.log);
}

chrome.extension.onMessage.addListener(
    function(data, sender, sendResponse) {
        console.log(data, sender, sendResponse);
        notifyBackground({command: 'nothing'});
    }
);
