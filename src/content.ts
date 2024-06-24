import { replay } from "~game/end/gameOver"
import { main } from "~game/main"
import {
  createContentIsReadyMessage,
  isMessageStartMessage,
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
chrome.runtime.onMessage.addListener(function(message) {

  if (!isMessageStartMessage(message)) {
    return
  }

  // Check and mark as started only when the message is "start".
  if (started) {
    replay(message.options)
    return
  }
  started = true

  // Use the "complete" event rather than the "interactive",
  // because document.body is required for exec `preventScroll()`,
  // and block calculation should be executed after iframes have been loaded.
  if (window.document.readyState === "complete") {
    main(message.options)
  } else {
    window.addEventListener("load", () => {
      main(message.options)
    })
  }
})
