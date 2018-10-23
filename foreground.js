chrome.extension.sendRequest({command: 'register'}, console.log)

chrome.extension.onMessage.addListener(
    function(data, sender, sendResponse) {
        console.log(data);
        switch (data.command) {
            case 'ufo':
                let ip = '';
                $('td').each(function (i, o) {
                    let rule = /\d+\.\d+\.\d+\.\d+/;
                    if (rule.test(o.innerHTML)) {
                        ip += o.innerHTML.match(rule)[0];
                        ip += '\n';
                    }
                });
                sendResponse(ip);
                break;
            default:
                sendResponse('unknown command');
        }
    }
);
