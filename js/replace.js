"use strict";

function notify(msg) {
    if (!document.getElementById('img-relace-notify')) {
        let elem = document.createElement('span');
        elem.id = 'img-relace-notify';
        document.body.appendChild(elem);
    }

    document.getElementById('img-relace-notify').innerHTML = msg;
}

function replace(replace_url, currentHostname, only_404 = true) {
    notify(chrome.i18n.getMessage('replacing'));
    let images = document.getElementsByTagName("img");
    let count = 0;
    for (let i = 0; i < images.length; i++) {
        if (only_404) {
            if ((images[i].complete && images[i].naturalWidth === 0) && !images[i].classList.contains('image-replaced')) {
                count++;
                images[i].src = images[i].src.replace(currentHostname, replace_url);
                images[i].classList.add('image-replaced');
            }
        }else if (!images[i].classList.contains('image-replaced')){
            count++;
            images[i].src = images[i].src.replace(currentHostname, replace_url);
            images[i].classList.add('image-replaced');
        }

    }
    notify(count + chrome.i18n.getMessage('images_updated'));
}

chrome.storage.sync.get([
    'enabled',
    'only_404',
    'replace_url',
    'replaceTime',
    'hostname'
    ], function (data) {
        if (data.enabled) {
            let currentHostname = new URL(window.location.origin).href;
            if (currentHostname === data.hostname) {
                setTimeout(function () {
                    replace(data.replace_url, currentHostname);
                    setInterval(function () {
                        replace(data.replace_url, currentHostname, data.only_404);
                    }, data.replaceTime);
                }, data.replaceTime);
            }
        }
    });