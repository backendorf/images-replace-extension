"use strict";

function notify(msg) {
    if (!document.getElementById('img-relace-notify')) {
        let elem = document.createElement('span');
        elem.id = 'img-relace-notify';
        document.body.appendChild(elem);
    }

    document.getElementById('img-relace-notify').innerHTML = msg;
}

function replace(replace_url, currentHostname, only_404 = true, mc_hash = '', local_mc_hash = null) {
    notify(chrome.i18n.getMessage('replacing'));
    let images = document.getElementsByTagName("img");
    let count = 0;
    for (let i = 0; i < images.length; i++) {
        let canReplace = false;
        if (local_mc_hash) {
            if (only_404) {
                if ((images[i].complete && images[i].naturalWidth === 0) && !images[i].classList.contains('image-replaced')) {
                    canReplace = true;
                }
            } else if (!images[i].classList.contains('image-replaced')) {
                canReplace = true;
            }
        }

        if (canReplace) {
            count++;
            images[i].src = images[i].src.replace(currentHostname, replace_url).replace(local_mc_hash, mc_hash);
            if (images[i].getAttribute('data-src')) {
                images[i].setAttribute('data-src', images[i].getAttribute('data-src').replace(currentHostname, replace_url).replace(local_mc_hash, mc_hash));
            }
            images[i].classList.add('image-replaced');
        }
    }
    notify(count + chrome.i18n.getMessage('images_updated'));
}

function getLocalMcHash() {
    let images = document.getElementsByTagName("img");

    for (let i = 0; i < images.length; i++) {
        if (images[i].src.includes('media/catalog/product') && !images[i].classList.contains('image-replaced')) {
            const regexExp = /^[a-f0-9]{32}$/gi;
            let segments = images[i].src.split('/');
            for (var s = 0; s < segments.length; s++) {
                if (regexExp.test(segments[s])) {
                    notify('Local deployed version is: ' + segments[s]);
                    return segments[s];
                }
            }
        }
    }
    return null;
}

chrome.storage.sync.get([
    'enabled',
    'only_404',
    'replace_url',
    'replace_time',
    'hostname',
    'mc_hash',
    'local_mc_hash'
], function (data) {
    if (data.enabled) {
        let currentHostname = new URL(window.location.origin).href;
        if (currentHostname === data.hostname) {
            let local_mc_hash = getLocalMcHash();
            setTimeout(function () {
                replace(data.replace_url, currentHostname, data.only_404, data.mc_hash, local_mc_hash);
                setInterval(function () {
                    if (!local_mc_hash) {
                        local_mc_hash = getLocalMcHash();
                    }
                    replace(data.replace_url, currentHostname, data.only_404, data.mc_hash, local_mc_hash);
                }, data.replace_time);
            }, data.replace_time);
        }
    }
});