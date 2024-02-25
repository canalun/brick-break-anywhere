import {
  getBallCenterPosition,
  getCurrentCollisionPointsOnBall,
  type Ball
} from "./ball"
import type { Block } from "./blocks"
import { updateDirectionByCollisionWithBlocks } from "./detectCollision"
import { main } from "./main"
import {
  ballId,
  ballZIndex,
  collisionPointOnBallClass,
  numberOfCollisionPoints
} from "./settings"
import { startBlockAndScoreUpdate } from "./updateBlocks"
import type { Vector } from "./utils"

// This file contains tools only for debug.
// These tools should never be used in production.
// Unsafe. Possibly Memory-leaky.

export function visualizeBlocks(blocks: Block[]) {
  for (let i = 0; i < blocks.length; i++) {
    const blockElement = blocks[i].element
    if (blocks[i].remain) {
      Object.assign(blockElement.style, {
        border: "0.1px solid red"
      })
    } else {
      Object.assign(blockElement.style, {
        border: "none"
      })
    }
  }
}

const divsForCollisionPointsOnBall: HTMLDivElement[] = []
export function visualizeCollisionPointsOnBall() {
  for (let i = 0; i < numberOfCollisionPoints; i++) {
    const collisionPointOnBall = document.createElement("div")
    collisionPointOnBall.classList.add(collisionPointOnBallClass)
    Object.assign(collisionPointOnBall.style, {
      position: "fixed",
      left: "0px",
      bottom: "0px",
      width: "3px",
      height: "3px",
      backgroundColor: "black",
      borderRadius: "50%",
      zIndex: ballZIndex + 1
    })
    document.documentElement.insertAdjacentElement(
      "beforeend",
      collisionPointOnBall
    )
    divsForCollisionPointsOnBall.push(collisionPointOnBall)
  }
}
export function updateVisualizedCollisionPointsOnBall(
  collisionPointsOnBall: Vector[]
) {
  for (let i = 0; i < collisionPointsOnBall.length; i++) {
    const collisionPointOnBall = collisionPointsOnBall[i]
    divsForCollisionPointsOnBall[i].style.transform =
      `translate(` +
      `${collisionPointOnBall.x}px,` +
      `${-collisionPointOnBall.y}px` +
      `)`
  }
}

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
