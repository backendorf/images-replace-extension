"use strict";
let notifierElement = null;

function notify(msg) {
    if (!notifierElement) {
        notifierElement = document.createElement('span');
        notifierElement.id = 'img-replace-notify';
        document.body.appendChild(notifierElement);
    }

    notifierElement.innerHTML = msg;
    notifierElement.style.display = 'block';
    if (notifierElement.timerId) {
        clearTimeout(notifierElement.timerId);
    }
    notifierElement.timerId = setTimeout(() => {
        notifierElement.style.display = 'none';
        notifierElement.innerHTML = '';
        notifierElement.timerId = null;
    }, 5000);
}

function replaceImages(newUrl, oldHostname) {
    notify(chrome.i18n.getMessage('replacing'));

    const images = document.querySelectorAll('img:not(.image-replaced)');
    let count = 0;
    const oldHostnameRegex = new RegExp(oldHostname, 'g');

    images.forEach(img => {
        if (img.src && img.src.includes(oldHostname)) {
            img.src = img.src.replace(oldHostnameRegex, newUrl);
            count++;
        }

        const dataSrc = img.getAttribute('data-src');
        if (dataSrc && dataSrc.includes(oldHostname)) {
            img.setAttribute('data-src', dataSrc.replace(oldHostnameRegex, newUrl));
        }

        img.classList.add('image-replaced');
    });

    notify(count + chrome.i18n.getMessage('images_replaced'));
}

(async () => {
    const data = await chrome.storage.sync.get(['enabled', 'replace_url', 'hostname']);

    if (!data.enabled) {
        return;
    }

    const currentOrigin = window.location.origin + '/';
    if (currentOrigin !== data.hostname) {
        return;
    }

    setTimeout(() => {
        replaceImages(data.replace_url, data.hostname);
    }, 1000);
})();