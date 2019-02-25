let foreground = {};

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.command) {
            case 'register':
                foreground = sender;
                sendResponse({message: 'register foreground ' + foreground.tab.id});
                break;
            default:
                sendResponse({message: 'nothing to do with ' + JSON.stringify(message)});
        }
    }
);

function notifyForeground(message) {
    if (foreground.tab && foreground.tab.id){
        chrome.tabs.sendMessage(foreground.tab.id, message);
    }
}
