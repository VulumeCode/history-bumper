/*
Default settings. If there is nothing in storage, use these values.
*/
var defaultSettings = {
  onActivated: true,
  onClosed: true,
  onWindowClosed: false,
};

/*
Generic error logger.
*/
function onError(e) {
  console.error(e);
}

/*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/
function checkStoredSettings(storedSettings) {
  console.log('checkStoredSettings', storedSettings)
  if (!storedSettings) {
    browser.storage.sync.set(defaultSettings);
  } else {
    cacheStoredSettings(storedSettings)
  }


}

var settingsCache = defaultSettings;

function cacheStoredSettings(storedSettings) {
  settingsCache = storedSettings
}

browser.storage.onChanged.addListener(async (_changes, area) => {
  if (area === "sync") {
    checkStoredSettings(await browser.storage.sync.get())
  }
})

const gettingStoredSettings = browser.storage.sync.get();
gettingStoredSettings.then(checkStoredSettings, onError);



var allTabs;

browser.tabs.query({}).then((tabs) => allTabs = tabs);

async function bump(url) {
  if (!url.match(/^about:/)) {
    await browser.history.addUrl(
      {
        url: url,
        transition: "auto_bookmark"
      }
    )
    console.log("bumped", url);
  }

  allTabs = await browser.tabs.query({});
}


browser.tabs.onActivated.addListener(async (activeInfo) => {
  if (settingsCache.onActivated) {
    console.log("onActivated", activeInfo);
    const tab = await browser.tabs.get(activeInfo.tabId);
    bump(tab.url)
  }
}
);

browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (settingsCache.onActivated) {

    console.log("Newly focused window: ", windowId);
    const win = await browser.windows.get(windowId);

    if (win.type == "normal") {
      let tabs = await browser.tabs.query({ active: true, windowId });
      bump(tabs[0].url);
    }
  }
});

browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (settingsCache.onClosed) {
    if (!removeInfo.isWindowClosing || settingsCache.onWindowClosed) {
      const removedTab = allTabs.find(t => t.id == tabId);
      console.log("onRemoved", removedTab.title, removeInfo)
      bump(removedTab.url)
    }
  }
})