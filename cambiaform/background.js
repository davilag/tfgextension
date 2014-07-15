// When the extension is installed or upgraded ...
//chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].id === tabId) {
            if (changeInfo && changeInfo.status === 'complete') {
                chrome.tabs.sendMessage(tabId, {greeting: "find_form"});
            }
        }
        else {
            return false;
        }
    });
});
//});

