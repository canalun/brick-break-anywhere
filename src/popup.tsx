import { useCallback, useState } from "react"

function IndexPopup() {
  const [withScoreboard, setWithScoreboard] = useState(false)

  const sendMessageToIsolatedWorldOnActiveTab = useCallback(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0]
      if (!activeTab.id) {
        return
      }
      chrome.tabs.sendMessage(activeTab.id, {
        type: "start",
        withScoreboard
      })
    })
  }, [withScoreboard])

  const sendMessageToIsolatedWorldOnActiveTabForTest = useCallback(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0]
      if (!activeTab.id) {
        return
      }
      chrome.tabs.sendMessage(activeTab.id, { type: "test" })
    })
  }, [])

  return (
    <div style={{ padding: "16px" }}>
      <h2>Brick Break Anywhere</h2>
      <button onClick={sendMessageToIsolatedWorldOnActiveTab}>Start!</button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={withScoreboard}
          onChange={(e) => setWithScoreboard(e.target.checked)}
        />
        score board (experimental)
      </label>
      <br />
      {process.env.NODE_ENV === "development" ? (
        <button onClick={sendMessageToIsolatedWorldOnActiveTabForTest}>
          debug mode
        </button>
      ) : null}
    </div>
  )
}

export default IndexPopup
