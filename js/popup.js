"use strict";
let timeoutId = null;

function message(msg, isError = false) {
    const messageElement = document.getElementById("msg");
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    messageElement.classList.remove('error', 'success');
    if (isError) {
        messageElement.classList.add('error');
    } else {
        messageElement.classList.add('success');
    }

    messageElement.innerText = msg;

    timeoutId = setTimeout(() => {
        messageElement.classList.remove('error', 'success');
        messageElement.innerText = '';
        timeoutId = null;
    }, 10000);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

async function handleToggleAndSave() {
    const urlInput = document.getElementById("replace_url");
    const enabledCheckbox = document.getElementById("enabled");
    const urlValue = urlInput.value.trim();

    if (urlValue === '' || !isValidUrl(urlValue)) {
        message(chrome.i18n.getMessage("replace_url_required"), true);
        return;
    }

    try {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const currentTab = tabs[0];

        if (!currentTab || !currentTab.url) {
            return;
        }

        const hostname = new URL(currentTab.url).origin + '/';
        const isEnabled = enabledCheckbox.checked;

        await chrome.storage.sync.set({
            enabled: isEnabled,
            replace_url: urlValue,
            hostname: hostname
        });

        if (isEnabled) {
            message(chrome.i18n.getMessage("value_updated"));
            await chrome.tabs.update(currentTab.id, {url: currentTab.url});
        }

    } catch (error) {
        message(error, true);
    }
}

function restore() {
    chrome.storage.sync.get(['enabled', 'replace_url'], (data) => {
        const replaceUrlInput = document.getElementById("replace_url");

        document.getElementById("enabled").checked = data.enabled || false;
        replaceUrlInput.value = data.replace_url || '';

        if (replaceUrlInput.value === '') {
            replaceUrlInput.focus();
        }
    });
}

function init() {
    document.getElementById("enabled").addEventListener("click", handleToggleAndSave);
    document.getElementById("replace_url").addEventListener("focusout", handleToggleAndSave);

    restore();
    renderPopupMessages();
}

function renderPopupMessages() {
    const elements = ['lbl_enabled', 'lbl_replace_url'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = chrome.i18n.getMessage(id);
        }
    });
}

document.addEventListener("DOMContentLoaded", init);
