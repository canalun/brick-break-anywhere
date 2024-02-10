import {
  getBallCenterPosition,
  getCurrentCollisionPointsOnBall,
  type Ball
} from "./ball"
import type { Block } from "./blocks"
import { updateDirectionByCollisionWithBlocks } from "./detectCollision"
import { main } from "./main"
import { ballId } from "./settings"
import { startBlockAndScoreUpdate } from "./updateBlocks"

// WARNING: Don't use in production.
//          It's definitely for debug. unsafe. memory-leaky.
export function dragAndMoveBall(blocks: Block[]) {
  main({ withScoreboard: false })

  const ball = document.getElementById(ballId)
  if (!ball) {
    return
  }

  startBlockAndScoreUpdate(blocks)

  // drag and move ball
  let isDragging = false
  let offsetX = 0
  let offsetY = 0
  ball.addEventListener("mousedown", (e) => {
    isDragging = true
    offsetX = e.clientX - ball.getBoundingClientRect().left
    offsetY = e.clientY - ball.getBoundingClientRect().top
  })
  ball.addEventListener("mouseup", () => {
    isDragging = false
  })
  ball.addEventListener("mousemove", (e) => {
    if (isDragging) {
      ball.style.left = `${e.clientX - offsetX}px`
      ball.style.top = `${e.clientY - offsetY}px`
    }

    updateDirectionByCollisionWithBlocks(
      getCurrentCollisionPointsOnBall(getBallCenterPosition(ball as Ball), {
        x: e.movementX,
        y: e.movementY
      }),
      blocks,
      { x: e.movementX, y: e.movementY }
    )
  })
}
