let tab, bookmarks, isUrl, depth, bg = chrome.extension.getBackgroundPage();

chrome.tabs.getSelected(null, function (selected) {
    tab = selected;
});

document.addEventListener('DOMContentLoaded', function () {
    getBookmarks();

    document.getElementById('qrcode').onclick = function () {
        let img = document.getElementById('qrcode-img');
        if (img == null) {
            addCloseIcon();
            img = document.createElement('div');
            img.setAttribute('id', 'qrcode-img');
            document.getElementById('menu').insertAdjacentElement('afterend', img);
            let qrcode = new QRCode(img, {
                width: 200,
                height: 200
            });
            qrcode.makeCode(tab.url);
        }
    };

    document.getElementById('bookmark').onclick = function () {
        let data = {
            api: '/server/index.php?s=/api/item/updateByApi',
            api_key: '',
            api_token: '',
            page_title: 'Bookmarks',
            page_content: bookmarks
        };
        let note = {
            title: 'Sync BookMarks',
            start: 'Upload bookmarks beginning',
            success: 'Upload bookmarks success',
            error: 'Upload bookmarks error'
        };
        basicNotification(note.title, note.start);
        fetch(data.api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: Object.keys(data)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
                .join('&'),
        })
            .then(function () {
                basicNotification(note.title, note.success);
            })
            .catch(function () {
                for (let i = 0; i < arguments.length; i++) {
                    console.log(arguments[i]);
                }
                alert(note.error);
            });
        //let file = new File([bookmarks], 'bookmarks.md', {type: 'text/markdown;charset=utf-8'});
        //saveAs(file);
    };

    document.getElementById('save').onclick = function () {
        let file = new File([bookmarks], 'bookmarks.md', {type: 'text/markdown;charset=utf-8'});
        saveAs(file);
    };

    document.getElementById('shopify-order-list').onclick = function () {
        chrome.tabs.sendMessage(tab.id, {command: 'shopify-order-list'}, function (response) {
            if (response && response.data) {
                let file = new File([response.data], 'shopify.md', {type: 'text/markdown;charset=utf-8'});
                saveAs(file);
            } else {
                basicNotification('Shopify Order List Not Found', tab.url);
            }
        })
    };

    document.getElementById('shopify-flash-metrics').onclick = function () {
        chrome.tabs.sendMessage(tab.id, {command: 'shopify-flash-metrics'}, function (response) {
            if (response && response.data) {
                let file = new File([response.data], 'metrics.txt', {type: 'text/plain;charset=utf-8'});
                saveAs(file);
            } else {
                basicNotification('Shopify Flash Metrics Not Found', tab.url);
            }
        })
    }
});

function addCloseIcon() {
    document.getElementById('menu').innerHTML = '<div id="qrcode-close"><i class="fa fa-times-circle"></i></div>';
    document.getElementById('qrcode-close').onclick = function () {
        location.reload();
    };
}

function getBookmarks() {
    bookmarks = '';
    isUrl = false;
    depth = 0;
    chrome.bookmarks.getTree(function (tree) {
        for (let i = 0; i < tree.length; i++) {
            traverseBookmarkNode(tree[i]);
        }
    });
}

function traverseBookmarkNode(bookmarkNode) {
    if (bookmarkNode == null) {
        return;
    }
    let bookmark = {
        id: bookmarkNode.id || 0,
        parentId: bookmarkNode.parentId || 0,
        index: bookmarkNode.index || 0,
        title: bookmarkNode.title || 'None',
        url: bookmarkNode.url || 'None'
    };
    console.log(bookmark)
    if (!isUrl) {
        depth++;
    }
    isUrl = (bookmark.url !== 'None');
    bookmark.depth = depth;
    bookmarks += bookmark2md(bookmark);
    if (bookmarkNode.children == null) {
        return;
    }
    for (let i = 0; i < bookmarkNode.children.length; i++) {
        traverseBookmarkNode(bookmarkNode.children[i]);
    }
    depth--;
}

function bookmark2md(bookmark) {
    let s = '';
    if (bookmark.id.toString() !== '0') {
        for (let i = 0; i < (bookmark.depth - 2); i++) {
            s += '  ';
        }
        if (bookmark.url === 'None') {
            s += '- ' + bookmark.title + '\n';
        } else {
            s += '- [';
            s += bookmark.title;
            s += '](';
            s += bookmark.url;
            s += ')\n';
        }
    }
    return s;
}

function basicNotification(title, message) {
    chrome.notifications.getPermissionLevel(function (level) {
        if (level === 'granted') {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'jibo.png',
                title: title,
                message: message
            });
        } else {
            alert(message)
        }
    });
}
