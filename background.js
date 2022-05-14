
function bump(url) {
  if (!url.match(/^about:/)) {
    browser.history.addUrl(
      {
        url: url,
        transition: "auto_bookmark"
      }
    ).then(() => {
      console.log("bumped", url)
    });
  }

  browser.tabs.query({}).then((tabs) => {
    allTabs = tabs;
  });
}

var allTabs = null;

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("onUpdated", changeInfo, tab.title);
  bump(tab.url)
}, {
  properties: ["attention", "url"]
});

browser.tabs.onActivated.addListener(activeInfo => {
  console.log("onActivated", activeInfo);
  // bump(tab.url)
}
);
browser.windows.onFocusChanged.addListener((windowId) => {
  console.log("Newly focused window: ", windowId);
});


browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  const removedTab = allTabs.find(t => t.id == tabId);
  console.log("onRemoved", removedTab.title)
  bump(removedTab.url)
})