"use strict";

function message(msg, isError = false) {
    document.getElementById("msg").style.visibility = 'visible';
    if (isError) {
        document.getElementById("msg").style.backgroundColor = '#f8d7da';
        document.getElementById("msg").style.color = '#721c24';
    } else {
        document.getElementById("msg").style.backgroundColor = '#d4edda';
        document.getElementById("msg").style.color = '#155724';
    }
    document.getElementById("msg").innerText = msg;
    setTimeout(function () {
            document.getElementById("msg").innerText = ''
            document.getElementById("msg").style.visibility = 'hidden';
        }, 2000
    );
}

function save() {
    if (document.getElementById("replace_url").value === '') {
        message(chrome.i18n.getMessage("replace_url_required"), true);
        return false;
    }

    if (document.getElementById("replace_time").value === '') {
        message(chrome.i18n.getMessage("replace_time_required"), true);
        return false;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let hostname = new URL(tabs[0].url).origin + '/';
        chrome.storage.sync.set({
            enabled: document.getElementById("enabled").checked,
            only_404: document.getElementById("only_404").checked,
            replace_url: document.getElementById("replace_url").value,
            replace_time: document.getElementById("replace_time").value,
            mc_hash: document.getElementById("mc_hash").value,
            hostname: hostname
        }, function () {
            message(chrome.i18n.getMessage("value_updated"));

            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
            });
        });
    });
}

function restore() {
    chrome.storage.sync.get([
        'enabled',
        'only_404',
        'replace_url',
        'replace_time',
        'mc_hash'
    ], function (data) {
        document.getElementById("enabled").checked = data.enabled;
        document.getElementById("only_404").checked = data.only_404;
        document.getElementById("replace_url").value = data.replace_url;
        document.getElementById("replace_time").value = data.replace_time;
        document.getElementById("mc_hash").value = data.mc_hash;
    });
}

function init() {
    restore();
    renderPopupMessages();
}

function renderPopupMessages() {
    document.getElementById("lbl_enabled").innerHTML = chrome.i18n.getMessage('lbl_enabled');
    document.getElementById("lbl_replace_url").innerHTML = chrome.i18n.getMessage('lbl_replace_url');
    document.getElementById("lbl_replace_time").innerHTML = chrome.i18n.getMessage('lbl_replace_time');
    document.getElementById("lbl_only_404").innerHTML = chrome.i18n.getMessage('lbl_only_404');
    document.getElementById("lbl_mc_hash").innerHTML = chrome.i18n.getMessage('lbl_mc_hash');
}

document.addEventListener("DOMContentLoaded", init);
document.getElementById("enabled").addEventListener("click", save);
document.getElementById("replace_url").addEventListener("focusout", save);
document.getElementById("replace_time").addEventListener("focusout", save);
document.getElementById("mc_hash").addEventListener("focusout", save);
document.getElementById("only_404").addEventListener("click", save);
