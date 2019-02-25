let tab, bookmarks, isUrl, depth, bg = chrome.extension.getBackgroundPage();

chrome.tabs.getSelected(null, function (selected) {
    tab = selected;
});

document.addEventListener('DOMContentLoaded', function () {
    getBookmarks();

    document.getElementById('menu-qrcode').onclick = function() {
        let img = document.getElementById('qrcode');
        if (img == null) {
            addCloseIcon();
            img = document.createElement('div');
            img.setAttribute('id', 'qrcode');
            document.getElementById('menu').insertAdjacentElement('afterend', img);
            let qrcode = new QRCode(img, {
                width: 200,
                height: 200
            });
            qrcode.makeCode(tab.url);
        }
    };

    document.getElementById('menu-bookmark').onclick = function() {
        let data = {
            api: '',
            api_key: '',
            api_token: '',
            page_title: 'Bookmarks',
            page_content: bookmarks
        };
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
                alert('Upload bookmarks done');
            })
            .catch(function () {
                for (let i = 0; i < arguments.length; i++) {
                    console.log(arguments[i]);
                }
                alert('Upload bookmarks error');
            });
        //let file = new File([bookmarks], 'bookmarks.md', {type: 'text/markdown;charset=utf-8'});
        //saveAs(file);
    };

    document.getElementById('menu-ufo').onclick = function() {
        chrome.tabs.sendMessage(tab.id, {command: 'ufo'}, function (response) {
            if (response && response.length) {
                let file = new File([response], 'ip.md', {type: 'text/markdown;charset=utf-8'});
                saveAs(file);
            } else {
                chrome.notifications.getPermissionLevel(function(level){
                    if(level == 'granted'){
                        chrome.notifications.create(
                            'ufo_vps_notification',
                            {
                                type: 'basic',
                                iconUrl: 'logo_48.png',
                                title: 'Not found:',
                                message: 'There is no ufo vps on this page: ' + tab.url
                            },
                            chrome.notifications.clear
                        );
                    }else{
                        alert('no ufo vps')
                    }
                });
            }
        })
    }
});

function addCloseIcon() {
    document.getElementById('menu').innerHTML = '<div id="menu-close"><i class="fas fa-times-circle"></i></div>';
    document.getElementById('menu-close').onclick = function() {
        location.reload();
    };
}

function getBookmarks() {
    bookmarks = '';
    isUrl = false;
    depth = 0;
    chrome.bookmarks.getTree(function(tree) {
        for(let i = 0; i < tree.length; i++){
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
        url: bookmarkNode.url|| 'None'
    };
    console.log(bookmark)
    if (!isUrl) {
        depth ++;
    }
    isUrl = (bookmark.url !== 'None');
    bookmark.depth = depth;
    bookmarks += bookmark2md(bookmark);
    if (bookmarkNode.children == null) {
        return;
    }
    for(let i = 0; i < bookmarkNode.children.length; i++) {
        traverseBookmarkNode(bookmarkNode.children[i]);
    }
    depth --;
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
