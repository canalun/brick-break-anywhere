import type { Ball } from "./ball"
import type { Bar } from "./bar"
import type { Block } from "./blocks"
import { ballSetting, barSetting } from "./settings"
import { setSoundEffect } from "./soundEffect"
import { startBallAnimation } from "./updateBall"
import { requestBlockRemoveAnimation } from "./updateBlocks"

export function standby(ball: Ball, bar: Bar, blocks: Block[]) {
  const ring = setSoundEffect()

  window.addEventListener("mousemove", moveBarAndBall)
  window.addEventListener("touchmove", moveBarAndBall)

  window.addEventListener("click", function start() {
    window.removeEventListener("click", start)

    window.removeEventListener("mousemove", moveBarAndBall)
    window.removeEventListener("touchmove", moveBarAndBall)

    window.addEventListener("mousemove", moveBar)
    window.addEventListener("touchmove", moveBar)

    startBallAnimation(ball, bar, blocks, ring)
    requestBlockRemoveAnimation(blocks)
  })

  function moveBarAndBall(e: MouseEvent | TouchEvent) {
    const { x } = getXYFromTouchEvent(e)
    bar.style.left = `${x - barSetting.width / 2}px`
    ball.style.left = `${x - ballSetting.width / 2}px`
  }

  function moveBar(e: MouseEvent | TouchEvent) {
    const { x } = getXYFromTouchEvent(e)
    bar.style.left = `${x - barSetting.width / 2}px`
  }

  function getXYFromTouchEvent(event: TouchEvent | MouseEvent) {
    if (event instanceof MouseEvent) {
      return { x: event.clientX, y: event.clientY }
    } else {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY }
    }
  }
}
