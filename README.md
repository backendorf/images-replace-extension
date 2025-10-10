# Images Replace Extension

A simple Chrome/Chromium Manifest V3 browser extension that helps reload product images from an alternative domain. Originally created for Magento 2 storefronts where images may be served from a CDN or a different host, but it can work on any site that serves <img> tags.

When enabled on a tab, the extension will:
- Replace the hostname in image URLs on the current page with a user-provided base URL.
- Also update data-src attributes (commonly used by lazy-loading).
- Visually notify how many images were updated.

## Stack
- Language: JavaScript (vanilla)
- Platform: Chrome/Chromium Browser Extension — Manifest Version 3
- UI: Popup (HTML/CSS/JS)
- i18n: Chrome i18n with _locales/en_US/messages.json
- Package manager/build: None (pure, unpacked extension)

## Features
- Toggle enable/disable per-site from the popup.
- Set a replacement base URL (e.g., switch images from https://example.com to https://cdn.example.com).
- Replaces both img src and data-src occurrences.
- Minimal, no build step.

## Requirements
- Google Chrome or a Chromium-based browser with Manifest V3 support.
- Permissions used:
  - storage: to persist enable state, replacement URL, and the active site origin.
  - activeTab: to access the current tab for refresh after changes.
  - Content script matches: <all_urls> (the content script runs on all pages, but it only takes action when enabled and when the current origin matches the stored hostname).

## Installation (Load Unpacked for Development/Use)
1. Clone or download this repository.
2. Open Chrome and go to chrome://extensions/.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select the project directory.
5. The extension will appear in your toolbar.

## Usage
1. Navigate to the site where you want to replace image hosts.
2. Click the extension icon to open the popup.
3. Enter the Replacement URL (e.g., https://cdn.example.com/).
4. Toggle Enabled on.
5. The tab will reload and images whose URLs match the current page origin will be rewritten to use the replacement base URL. A small on-page notification will show how many were changed.

Notes:
- The extension only performs replacements when:
  - The extension is Enabled, and
  - The current tab origin matches the stored hostname captured when you enabled it in that tab.
- Replacement is a direct string replacement of the hostname portion. It will not rewrite paths or query parameters beyond the host.

## Project Structure
- manifest.json — Extension manifest (MV3), declares content script, popup, permissions, and icons.
- html/popup.html — Popup UI markup.
- js/popup.js — Popup logic (toggle, validate, save settings, refresh tab, render i18n labels).
- js/replace.js — Content script that does the image URL replacement and in-page notifications.
- css/popup.css — Popup styles.
- css/notify.css — On-page notification styles injected by content script.
- _locales/en_US/messages.json — i18n message strings.
- images/logo{16,32,48,128}.png — Extension icons.
- LICENSE — MIT License.

## Entry Points
- Popup: html/popup.html → js/popup.js
- Content script: js/replace.js (injected per manifest.json)

## Configuration and Environment Variables
- No environment variables are required.
- User settings are stored via chrome.storage.sync:
  - enabled: boolean
  - replace_url: string (must be a valid URL)
  - hostname: string (captured origin + trailing slash for the site where it was enabled)

## Scripts and Tooling
- There is no package.json or build tooling in this repository.
- No npm/yarn/pnpm scripts are defined.
- To modify the code, edit the files directly and reload the extension at chrome://extensions/ (use the Reload button on the extension card).

## Testing
- There are currently no automated tests in this repository.
- TODO: Add minimal e2e/manual test instructions, e.g. test page with images and lazy-loaded images, verify replacement and counts.

## Internationalization (i18n)
- Messages are defined in _locales/en_US/messages.json and consumed via chrome.i18n.getMessage in the popup and content script.
- TODO: Add additional locales if needed.

## Privacy and Permissions
- The extension stores its settings using chrome.storage.sync.
- The content script runs on all pages (<all_urls>) but is a no-op unless you explicitly enable it for the site (the origin must match the stored hostname).
- See PRIVACY.md for the full privacy policy.

## Publishing
- TODO: Add instructions for packaging and publishing to the Chrome Web Store if distribution is desired.

## License
This project is licensed under the MIT License — see the LICENSE file for details.