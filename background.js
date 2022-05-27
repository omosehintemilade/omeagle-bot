/* Event: Runs when extension is installed */
chrome.runtime.onInstalled.addListener(function () {
  // Set which URL the extension can run on
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              urlContains: "omegle.com"
            }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

function bombOmeagle() {
  chrome.tabs.query({}, function (tabs) {
    // Call executeScrip to run our contentscript.js file
    chrome.tabs.executeScript(tabs[0].id, { file: "contentscript.js" });
  });
}

bombOmeagle();
