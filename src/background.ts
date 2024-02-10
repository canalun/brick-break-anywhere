export {}

// Add eventlistener to send message to content.js when the page is reloaded
chrome.runtime.onMessage.addListener((message, sender) => {
  if (!sender.tab?.id) {
    return
  }
  const senderTabId = sender.tab.id

  if (message.type === "RequestReplayToBackground") {
    const { withScoreboard } = message.options
    const startReplay: Parameters<
      typeof chrome.runtime.onMessage.addListener
    >[0] = (message, _sender) => {
      if (!_sender.tab?.id) {
        return
      }
      const _senderTabId = _sender.tab.id
      if (_senderTabId === senderTabId && message.type === "ContentIsReady") {
        chrome.tabs.sendMessage(_senderTabId, {
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

// Display the instruction page after installation
chrome.runtime.onInstalled.addListener(function (object) {
  let internalUrl = chrome.runtime.getURL("/options.html")
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: internalUrl })
  }
})
