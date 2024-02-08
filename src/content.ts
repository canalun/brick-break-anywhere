import { getBlocks } from "~game/blocks"
import { dragAndMoveBall } from "~game/dragAndMoveBall"
import { main } from "~game/main"
import { visualizeBlocks } from "~game/utils"

export {}
console.log("content script loaded.")

// TODO: Enable the below code when add the "cross origin iframe" feature.
// It's necessary to inject scripts to all frames, in order to handling cross origin iframes.
// You must not set 'ISOLATED' to the 'world' property,
// because it doesn't work possibly due to plasmo bug and its default value is 'ISOLATED'.
//
// import type { PlasmoCSConfig } from "plasmo"
// export const config: PlasmoCSConfig = {
//   all_frames: true
// }

chrome.runtime.sendMessage({ type: "ContentIsReady" })

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === "start") {
    // Execute when the document has finished loading,
    // as document.body is required for preventScroll,
    // and it should be after iframes have been loaded to calculate the blocks.
    // So, use the "complete" event rather than the "interactive".
    if (window.document.readyState === "complete") {
      main({ withScoreboard: message.withScoreboard })
    } else {
      window.addEventListener("load", () => {
        main({ withScoreboard: message.withScoreboard })
      })
    }
  }
})

if (process.env.NODE_ENV === "development") {
  chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === "test") {
      const blocks = getBlocks()
      visualizeBlocks(blocks)
      dragAndMoveBall(blocks)
    }
  })
}
