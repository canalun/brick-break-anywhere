import type { Ball } from "./ball"
import type { Bar } from "./bar"
import type { Block } from "./blocks"
import { startCheckIsGameOver } from "./gameOver"
import type { Scoreboard } from "./initializeScoreboard"
import { ballSetting, barSetting, initialBottom } from "./settings"
import { setSoundEffect } from "./soundEffect"
import { startBallAnimation } from "./updateBall"
import { startBlockAndScoreUpdate } from "./updateBlocks"

export function standby(
  ball: Ball,
  bar: Bar,
  blocks: Block[],
  scoreboard?: Scoreboard
) {
  const ring = setSoundEffect()

  window.addEventListener("mousemove", moveBarAndBall)

  window.addEventListener("click", function start() {
    window.removeEventListener("click", start)

    window.removeEventListener("mousemove", moveBarAndBall)

    window.addEventListener("mousemove", moveBar)

    const stopBallAnimation = startBallAnimation(ball, bar, blocks, ring)
    const stopBlockAndScoreUpdate = startBlockAndScoreUpdate(blocks, scoreboard)

    startCheckIsGameOver(ball, blocks, scoreboard, [
      stopBallAnimation,
      stopBlockAndScoreUpdate,
      () => {
        window.removeEventListener("mousemove", moveBar)
      }
    ])
  })

  function moveBarAndBall(e: MouseEvent) {
    bar.style.transform =
      `translate(` +
      `${e.clientX - barSetting.width / 2}px, ` +
      `${-1 * initialBottom}px` +
      `)`
    ball.style.transform =
      `translate(` +
      `${e.clientX - ballSetting.radius}px, ` +
      `${-(initialBottom + barSetting.height)}px` +
      `)`
  }

  function moveBar(e: MouseEvent) {
    bar.style.transform =
      `translate(` +
      `${e.clientX - barSetting.width / 2}px, ` +
      `${-1 * initialBottom}px` +
      `)`
  }
}
