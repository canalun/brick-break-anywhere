import { dragAndMoveBall, visualizeBlocks } from "~game/debug"
import { main } from "~game/main"
import { getBlocks } from "~game/object/blocks"
import {
  createContentIsReadyMessage,
  isMessageStartMessage,
  isMessageTestMessage
} from "~message"

export {}

// TODO: Enable the below code when add the "cross origin iframe" feature.
// It's necessary to inject scripts to all frames, in order to handling cross origin iframes.
// You must not set 'ISOLATED' to the 'world' property,
// because it doesn't work possibly due to plasmo bug and its default value is 'ISOLATED'.
//
// import type { PlasmoCSConfig } from "plasmo"
// export const config: PlasmoCSConfig = {
//   all_frames: true
// }

chrome.runtime.sendMessage(createContentIsReadyMessage())

let started = false // prevent multiple execution
chrome.runtime.onMessage.addListener(function (message) {
  if (!started && isMessageStartMessage(message)) {
    // Use the "complete" event rather than the "interactive",
    // because document.body is required for exec `preventScroll()`,
    // and block calculation should be executed after iframes have been loaded.
    if (window.document.readyState === "complete") {
      started = true
      main(message.options)
    } else {
      started = true
      window.addEventListener("load", () => {
        main(message.options)
      })
    }
  }
})

if (process.env.NODE_ENV === "development") {
  chrome.runtime.onMessage.addListener(function (message) {
    if (isMessageTestMessage(message)) {
      const blocks = getBlocks()
      visualizeBlocks(blocks)
      dragAndMoveBall(blocks)
    }
  })
}
