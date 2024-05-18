import {
  createRequestReplayToBackgroundMessage,
  isMessageReplayIsConfirmedOnBackgroundMessage
} from "~message"

import {
  ballSetting,
  veilZIndex,
  type StartOptions
} from "../configuration/settings"
import { getBallCenterPosition, type Ball } from "../object/ball"
import type { Block } from "../object/blocks"

export function startCheckIsGameOver(
  ball: Ball,
  blocks: Block[],
  options: StartOptions,
  stopAnimationFuncs: (() => void)[]
) {
  requestAnimationFrame(checkIsGameOver)

  function checkIsGameOver() {
    const isBallTouchBottom =
      getBallCenterPosition(ball).y - ballSetting.radius <= 0
    if (isBallTouchBottom) {
      gameOver(blocks, options)
      stopAnimationFuncs.forEach((f) => f())
      return
    }
    const isAllBlocksDestroyed = !blocks.some((b) => b.remain)
    if (isAllBlocksDestroyed) {
      gameOver(blocks, options)
      stopAnimationFuncs.forEach((f) => f())
      return
    }
    requestAnimationFrame(checkIsGameOver)
  }
}

function gameOver(blocks: Block[], options: StartOptions) {
  const countOfBrokenBlocks = blocks.filter((b) => !b.remain).length

  const gameOverMessage = document.createElement("div")
  Object.assign(gameOverMessage.style, {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    color: "block",
    border: "2px solid black",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    zIndex: `${veilZIndex + 1}`
  })
  gameOverMessage.textContent =
    countOfBrokenBlocks === blocks.length ? "Congratulations!" : "Game Over..."
  document.documentElement.appendChild(gameOverMessage)

  const score = document.createElement("div")
  Object.assign(score.style, {
    marginTop: "20px",
    fontSize: "24px"
  })
  score.innerHTML =
    `Breaks: ${countOfBrokenBlocks} / ${blocks.length} blocks` +
    `<br>` +
    `(${Math.round((countOfBrokenBlocks / blocks.length) * 100)}%)`
  gameOverMessage.appendChild(score)

  const replayButton = document.createElement("button")
  Object.assign(replayButton.style, {
    marginTop: "20px",
    fontSize: "20px"
  })
  replayButton.textContent = "Replay"
  replayButton.onclick = () => {
    replay(options)
  }
  gameOverMessage.appendChild(replayButton)
}

export function replay(options: StartOptions) {
  chrome.runtime.onMessage.addListener((message) => {
    if (isMessageReplayIsConfirmedOnBackgroundMessage(message)) {
      location.reload()
    }
  })

  chrome.runtime.sendMessage(createRequestReplayToBackgroundMessage(options))
}
