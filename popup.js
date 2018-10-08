let tab, bookmarks, isUrl, depth, bg = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', getBookmarks);

window.onload = function () {
    chrome.tabs.getSelected(null, function (selected) {
        tab = selected;
    });
    document.getElementById('menu-save').onclick = function() {
        let file = new File([bookmarks], 'bookmarks.md', {type: 'text/markdown;charset=utf-8'});
        saveAs(file);
    }
    document.getElementById('menu-bookmark').onclick = function () {
        let pre = document.getElementsByTagName('pre');
        if (pre.length == 0){
            setHomeMenu();
            let child = document.createElement('pre');
            child.innerHTML = '<pre>' + bookmarks + '</pre>';
            (document.getElementsByTagName('body')[0]).appendChild(child);
        }
    }
    document.getElementById('menu-qrcode').onclick = function() {
        let img = document.getElementById('qrcode');
        if (img == null) {
            setHomeMenu();
            img = document.createElement('div');
            img.setAttribute('id', 'qrcode');
            document.getElementById('menu').insertAdjacentElement('afterend', img);
            let qrcode = new QRCode(img, {
                width: 200,
                height: 200
            });
            qrcode.makeCode(tab.url);    
        }
    }
}

function setHomeMenu() {
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
    if (!isUrl) {
        depth ++;
    }
    isUrl = (bookmark.url != 'None');
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
    if (bookmark.id != 0) {
        for (let i = 0; i < (bookmark.depth - 2); i++) {
            s += '  ';
        }
        if (bookmark.url == 'None') {
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
