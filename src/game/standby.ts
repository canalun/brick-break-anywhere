import type { Ball } from "./ball"
import type { Bar } from "./bar"
import type { Block } from "./blocks"
import { ballSetting, barSetting } from "./settings"
import { setSoundEffect } from "./soundEffect"
import { startBallAnimation } from "./updateBall"
import { startBlockRemoveAnimation } from "./updateBlocks"

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
    startBlockRemoveAnimation(blocks)
  })

  function moveBarAndBall(e: MouseEvent | TouchEvent) {
    const { x } = getXYFromTouchEvent(e)
    Object.assign(ball.style, {
      transform: `translate(${x - ballSetting.width / 2}px, 0px)`
    })
    Object.assign(bar.style, {
      transform: `translate(${x - barSetting.width / 2}px, 0px)`
    })
  }

  function moveBar(e: MouseEvent | TouchEvent) {
    const { x } = getXYFromTouchEvent(e)
    Object.assign(bar.style, {
      transform: `translate(${x - barSetting.width / 2}px, 0px)`
    })
  }

  function getXYFromTouchEvent(event: TouchEvent | MouseEvent) {
    if (event instanceof MouseEvent) {
      return { x: event.clientX, y: event.clientY }
    } else {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY }
    }
  }
}
