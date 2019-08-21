chrome.runtime.sendMessage({command: 'register'}, console.log);

chrome.runtime.onMessage.addListener(
    function(data, sender, sendResponse) {
        console.log(data, 'from', sender);
        switch (data.command) {
            case 'shopify-order-list':
                let orders = '';
                document.querySelectorAll('li._1D_TZ').forEach(function (o, i) {
                    console.log(i, o.innerText);
                    orders += o.innerText.split('\n');
                    orders += '\n';
                });
                sendResponse({data: orders});
                break;
            case 'shopify-flash-metrics':
                let metrics = {};
                let frame = window.frames["galaxy"].document;
                let names = frame.querySelectorAll(".ID-item");
                let values = frame.querySelectorAll(".ID-metric-data-1");
                for (let i = 0; i < names.length; i++) {
                    let name = names[i].innerText.split("/").pop().split("?").shift();
                    let metric = Number(values[i].innerText.split("(").shift());
                    if (metrics[name]) {
                        metrics[name] += metric;
                    } else {
                        metrics[name] = metric;
                    }
                }
                console.log(metrics);
                let text = 'name,metrics\n';
                for (let name in metrics) {
                    text += name;
                    text += ',';
                    text += metrics[name];
                    text += '\n';
                }
                sendResponse({data: text});
                break;
            default:
                sendResponse({data: 'unsupported command: ' + data.command});
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
