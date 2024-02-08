import {
  getBallCenterPosition,
  getCollisionPointsOnBall,
  type Ball
} from "./ball"
import type { Block } from "./blocks"
import { updateDirectionByCollisionWithBlocks } from "./detectCollision"
import { main } from "./main"
import { ballId } from "./settings"
import { startBlockRemoveAnimation } from "./updateBlocks"

// WARNING: Don't use in production.
//          It's definitely for debug. unsafe. memory-leaky.
export function dragAndMoveBall(blocks: Block[]) {
  main()

  const ball = document.getElementById(ballId)
  if (!ball) {
    return
  }

  startBlockRemoveAnimation(blocks)

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
      getCollisionPointsOnBall(
        getBallCenterPosition(ball as Ball),
        { x: e.movementX, y: e.movementY },
        { x: e.movementX, y: e.movementY }
      ),
      blocks,
      { x: e.movementX, y: e.movementY }
    )
  })
}
