import { controlBallByMouse } from "~game/debug"
import { startBallAnimation } from "../animation/startBallAnimation"
import { startBlockAndScoreUpdate } from "../animation/updateBlocks"
import {
  ballSetting,
  barSetting,
  initialBottom,
  type StartOptions
} from "../configuration/settings"
import { setSoundEffect } from "../configuration/soundEffect"
import { startCheckIsGameOver } from "../end/gameOver"
import type { Ball } from "../object/ball"
import type { Bar } from "../object/bar"
import type { Block } from "../object/blocks"
import type { Scoreboard } from "../object/scoreboard"
import { updateBallPositionTo } from "~game/animation/updateBall"

export function standby(
  ball: Ball,
  bar: Bar,
  blocks: Block[],
  scoreboard: Scoreboard | null,
  startOptions: StartOptions
) {
  const ring = startOptions.sound ? setSoundEffect() : () => {}

  window.addEventListener("mousemove", moveBarAndBall)

  window.addEventListener("click", function start() {
    window.removeEventListener("click", start)

    window.removeEventListener("mousemove", moveBarAndBall)

    window.addEventListener("mousemove", moveBar)

    const stopBallAnimation = startOptions.controlMode === "normal"
      ? startBallAnimation(
          ball,
          bar,
          blocks,
          startOptions.initialBallSpeed,
          ring
        )
      : controlBallByMouse(blocks)
    const stopBlockAndScoreUpdate = startBlockAndScoreUpdate(blocks, scoreboard)

    startCheckIsGameOver(ball, blocks, startOptions, [
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
      `${-initialBottom}px` +
      `)`
    updateBallPositionTo(ball, {
      x: e.clientX - ballSetting.radius,
      y: -(initialBottom + barSetting.height)
    })
  }

  function moveBar(e: MouseEvent) {
    bar.style.transform =
      `translate(` +
      `${e.clientX - barSetting.width / 2}px, ` +
      `${-1 * initialBottom}px` +
      `)`
  }
}
