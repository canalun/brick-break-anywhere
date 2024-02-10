import { getBallCenterPosition, type Ball } from "./ball"
import type { Block } from "./blocks"
import type { Scoreboard } from "./initializeScoreboard"
import { ballSetting, veilZIndex } from "./settings"

export function startCheckIsGameOver(
  ball: Ball,
  blocks: Block[],
  scoreboard: Scoreboard | undefined,
  stopAnimationFuncs: (() => void)[]
) {
  requestAnimationFrame(checkIsGameOver)

  function checkIsGameOver() {
    const isBallTouchBottom =
      getBallCenterPosition(ball).y - ballSetting.radius <= 0
    if (isBallTouchBottom) {
      gameOver(blocks, { withScoreboard: !!scoreboard })
      stopAnimationFuncs.forEach((f) => f())
      return
    }
    const isAllBlocksDestroyed = !blocks.some((b) => b.remain)
    if (isAllBlocksDestroyed) {
      gameOver(blocks, { withScoreboard: !!scoreboard })
      stopAnimationFuncs.forEach((f) => f())
      return
    }
    requestAnimationFrame(checkIsGameOver)
  }
}

function gameOver(blocks: Block[], options: { withScoreboard: boolean }) {
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
  replayButton.textContent = "Replay(Reload Page)"
  replayButton.onclick = () => {
    replay(options)
  }
  gameOverMessage.appendChild(replayButton)
}

function replay(options: { withScoreboard: boolean }) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "ReplayIsConfirmedOnBackground") {
      location.reload()
    }
  })

  chrome.runtime.sendMessage({ type: "RequestReplayToBackground", options })
}
