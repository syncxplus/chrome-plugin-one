chrome.runtime.sendMessage({command: 'register'}, console.log);

chrome.runtime.onMessage.addListener(
    function(data, sender, sendResponse) {
        console.log(data, 'from', sender);
        switch (data.command) {
            case 'ufo':
                let rule = /\d+\.\d+\.\d+\.\d+/;
                let ip = '';
                document.querySelectorAll('td').forEach(function (o, i) {
                    if (rule.test(o.innerHTML)) {
                        console.log(i, o.innerHTML);
                        ip += o.innerHTML.match(rule)[0];
                        ip += '\n';
                    }
                });
                sendResponse({data: ip});
                break;
            default:
                sendResponse({data: 'unsupported command'});
        }
    }
);
