import { useCallback, useState } from "react"

import {
  createStartMessage,
  createTestMessage,
  type StartMessage,
  type TestMessage
} from "~message"

function IndexPopup() {
  const [withScoreboard, setWithScoreboard] = useState(true)

  const sendMessageToIsolatedWorldOnActiveTab = useCallback(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0]
      if (!activeTab.id) {
        return
      }
      chrome.tabs.sendMessage<StartMessage>(
        activeTab.id,
        createStartMessage({ withScoreboard })
      )
    })
  }, [withScoreboard])

  const sendMessageToIsolatedWorldOnActiveTabForTest = useCallback(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0]
      if (!activeTab.id) {
        return
      }
      chrome.tabs.sendMessage<TestMessage>(activeTab.id, createTestMessage())
      window.close()
    })
  }, [])

  return (
    <div
      style={{
        maxWidth: "220px",
        minWidth: "220px",
        padding: "16px"
      }}>
      <h2>Brick Break Anywhere</h2>
      <button
        onClick={() => {
          sendMessageToIsolatedWorldOnActiveTab()
          window.close()
        }}>
        Start!
      </button>
      <br />
      <div style={{ marginTop: "16px" }}>
        <label>
          <input
            type="checkbox"
            checked={withScoreboard}
            onChange={(e) => setWithScoreboard(e.target.checked)}
          />
          with score board
        </label>
      </div>
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
