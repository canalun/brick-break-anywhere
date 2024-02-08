function IndexPopup() {
  return (
    <div style={{ padding: "16px" }}>
      <h2>let's play a game!</h2>
      <button onClick={sendMessageToIsolatedWorldOnActiveTab}>start!!</button>
      {process.env.NODE_ENV === "development" ? (
        <button onClick={sendMessageToIsolatedWorldOnActiveTabForTest}>
          debug mode
        </button>
      ) : null}
    </div>
  )
}

export default IndexPopup

function sendMessageToIsolatedWorldOnActiveTab() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0]
    if (!activeTab.id) {
      return
    }
    chrome.tabs.sendMessage(activeTab.id, { type: "start" })
  })
}

function sendMessageToIsolatedWorldOnActiveTabForTest() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0]
    if (!activeTab.id) {
      return
    }
    chrome.tabs.sendMessage(activeTab.id, { type: "test" })
  })
}
