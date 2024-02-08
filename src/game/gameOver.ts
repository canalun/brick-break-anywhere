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
      getBallCenterPosition(ball).y - ballSetting.height / 2 <= 0
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
  const gameOverMessage = document.createElement("div")
  gameOverMessage.style.position = "absolute"
  gameOverMessage.style.top = "50%"
  gameOverMessage.style.left = "50%"
  gameOverMessage.style.transform = "translate(-50%, -50%)"
  gameOverMessage.style.padding = "20px"
  gameOverMessage.style.backgroundColor = "rgba(255, 255, 255, 0.7)"
  gameOverMessage.style.color = "block"
  gameOverMessage.style.border = "2px solid black"
  gameOverMessage.style.fontSize = "24px"
  gameOverMessage.style.fontWeight = "bold"
  gameOverMessage.style.textAlign = "center"
  gameOverMessage.textContent = "Game Over"
  gameOverMessage.style.zIndex = `${veilZIndex + 1}`
  document.documentElement.appendChild(gameOverMessage)

  const destroyedBlocks = document.createElement("div")
  destroyedBlocks.style.marginTop = "20px"
  destroyedBlocks.style.fontSize = "24px"
  destroyedBlocks.innerHTML =
    `Destroyed: ` +
    `${blocks.filter((b) => !b.remain).length} / ${blocks.length} blocks<br>` +
    `(${Math.round(
      (blocks.filter((b) => !b.remain).length / blocks.length) * 100
    )}%)`
  gameOverMessage.appendChild(destroyedBlocks)

  const replayButton = document.createElement("button")
  replayButton.style.marginTop = "20px"
  replayButton.style.fontSize = "20px"
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
