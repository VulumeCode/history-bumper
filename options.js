function saveOptions(e) {
  browser.storage.sync.set({
    onActivated: document.querySelector("#onActivated").checked,
    onClosed: document.querySelector("#onClosed").checked,
    onWindowClosed: document.querySelector("#onWindowClosed").checked
  });

  e.preventDefault();
}

async function restoreOptions() {
  document.querySelector("#onActivated").checked = (await browser.storage.sync.get('onActivated')).onActivated;
  document.querySelector("#onClosed").checked = (await browser.storage.sync.get('onClosed')).onClosed;
  document.querySelector("#onWindowClosed").checked = (await browser.storage.sync.get('onWindowClosed')).onWindowClosed;
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
