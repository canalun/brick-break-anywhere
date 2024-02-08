export {}

// Add eventlistener to send message to content.js when the page is reloaded
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "RequestReplayToBackground") {
    const { withScoreboard } = message.options
    const startReplay: Parameters<
      typeof chrome.runtime.onMessage.addListener
    >[0] = (message, _sender) => {
      if (
        _sender.tab.id === sender.tab.id &&
        message.type === "ContentIsReady"
      ) {
        chrome.tabs.sendMessage(_sender.tab.id, {
          type: "start",
          withScoreboard
        })
      }
      chrome.runtime.onMessage.removeListener(startReplay)
    }
    chrome.runtime.onMessage.addListener(startReplay)

    chrome.tabs.sendMessage(sender.tab.id, {
      type: "ReplayIsConfirmedOnBackground"
    })
  }
})
