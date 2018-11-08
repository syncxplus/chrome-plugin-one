chrome.extension.sendRequest({command: 'register'}, console.log)

chrome.extension.onMessage.addListener(
    function(data, sender, sendResponse) {
        console.log(data);
        switch (data.command) {
            case 'ufo':
                let rule = /\d+\.\d+\.\d+\.\d+/;
                let ip = '';
                document.querySelectorAll('td').forEach(function (o, i) {
                    if (rule.test(o.innerHTML)) {
                        console.log(i, o.innerHTML)
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
