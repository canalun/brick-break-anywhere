import { getBlocks } from "~game/blocks"
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

chrome.runtime.onMessage.addListener(function (request) {
  if (request.message === "start") {
    // Execute when the document has finished loading,
    // as document.body is required for preventScroll,
    // and it's necessary to calculate the blocks after the iframe elements have loaded.
    // so use the "complete" event rather than the "interactive".
    if (window.document.readyState === "complete") {
      main()
    } else {
      window.addEventListener("load", main)
    }
  }
})

chrome.runtime.onMessage.addListener(function (request) {
  if (request.message === "test") {
    const blocks = getBlocks()
    setTimeout(() => {
      // @ts-ignore
      window.bbaDebugBlocks = blocks
      visualizeBlocks(blocks)
    }, 3000)
  }
})
