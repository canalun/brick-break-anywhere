import { useState } from "react"

import type { StartOptions } from "~game/configuration/settings"
import {
  createStartMessage,
  createTestMessage,
  type StartMessage,
  type TestMessage
} from "~message"

function IndexPopup() {
  const [withScoreboard, setWithScoreboard] =
    useState<StartOptions["withScoreboard"]>(true)
  const [initialBallSpeed, setInitialBallSpeed] =
    useState<StartOptions["initialBallSpeed"]>("middle")
  const handleSelectBallInitialSpeed = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInitialBallSpeed(e.target.value as StartOptions["initialBallSpeed"])
  }
  const [sound, setSound] = useState(true)

  const sendMessageToIsolatedWorldOnActiveTab = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0]
      if (!activeTab.id) {
        return
      }
      chrome.tabs.sendMessage<StartMessage>(
        activeTab.id,
        createStartMessage({ withScoreboard, initialBallSpeed, sound })
      )
    })
  }

  const sendMessageToIsolatedWorldOnActiveTabForTest = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0]
      if (!activeTab.id) {
        return
      }
      chrome.tabs.sendMessage<TestMessage>(activeTab.id, createTestMessage())
      window.close()
    })
  }

  return (
    <div
      style={{
        maxWidth: "240px",
        minWidth: "240px",
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
        Initial Ball Speed <br />
        <label>
          <input
            type="radio"
            value="low"
            checked={initialBallSpeed === "low"}
            onChange={handleSelectBallInitialSpeed}
          />
          Low
        </label>
        <label>
          <input
            type="radio"
            value="middle"
            checked={initialBallSpeed === "middle"}
            onChange={handleSelectBallInitialSpeed}
          />
          Middle
        </label>
        <label>
          <input
            type="radio"
            value="high"
            checked={initialBallSpeed === "high"}
            onChange={handleSelectBallInitialSpeed}
          />
          High
        </label>
        <label>
          <input
            type="radio"
            value="superHigh"
            checked={initialBallSpeed === "superHigh"}
            onChange={handleSelectBallInitialSpeed}
          />
          Super High
        </label>
      </div>
      <div style={{ marginTop: "16px" }}>
        Score Board <br />
        <label>
          <input
            type="radio"
            checked={withScoreboard}
            onChange={(e) => setWithScoreboard(e.target.checked)}
          />
          On
        </label>
        <label>
          <input
            type="radio"
            checked={!withScoreboard}
            onChange={(e) => setWithScoreboard(!e.target.checked)}
          />
          Off
        </label>
      </div>
      <div style={{ marginTop: "16px" }}>
        Sound {sound ? "🔊" : "🔇"}<br />
        <label>
          <input
            type="radio"
            checked={sound}
            onChange={(e) => setSound(e.target.checked)}
          />
          On
        </label>
        <label>
          <input
            type="radio"
            checked={!sound}
            onChange={(e) => setSound(!e.target.checked)}
          />
          Off
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
