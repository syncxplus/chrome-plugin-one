chrome.runtime.sendMessage({command: 'register'}, console.log);

chrome.runtime.onMessage.addListener(
    function(data, sender, sendResponse) {
        console.log(data, 'from', sender);
        switch (data.command) {
            case 'shopify-order-list':
                let data = '';
                document.querySelectorAll('li._1D_TZ').forEach(function (o, i) {
                    console.log(i, o.innerText);
                    data += o.innerText.split('\n');
                    data += '\n';
                });
                sendResponse({data: data});
                break;
            default:
                sendResponse({data: 'unsupported command'});
        }
    }
);

window.onload = function() {
    setTimeout(
        function () {
            let toolbar = document.querySelector("ng-include[src='vm.toolbar'] > div");
            if (toolbar) {
                let html = '<button class="btn btn-sm btn-success" onclick="window.open(\'https://baidu.com\')">baidu</buttion>';
                toolbar.insertAdjacentHTML('beforeEnd', html);
            }
        },
        3000
    );
};
