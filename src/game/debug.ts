import { updateBallDirectionByCollisionWithBlocks, updateBallPositionTo } from "./animation/updateBall"
import { startBlockAndScoreUpdate } from "./animation/updateBlocks"
import {
  ballId,
  ballSetting,
  ballZIndex,
  collisionPointOnBallClass,
  initialBottom,
  numberOfCollisionPoints
} from "./configuration/settings"
import {
  getBallCenterPosition,
  getCurrentCollisionPointsOnBall,
  type Ball
} from "./object/ball"
import type { Block } from "./object/blocks"
import { assert } from "./utils/dom"
import type { Vector } from "./utils/vector"

// This file contains tools only for debug.
// These tools should never be used in production.
// Unsafe. Possibly Memory-leaky.

export function visualizeBlocks(blocks: Block[]) {
  for (let i = 0; i < blocks.length; i++) {
    const blockElement = blocks[i].element
    if (blocks[i].remain) {
      ;(blockElement as HTMLElement).style && // TODO: remove type assertion
        Object.assign((blockElement as HTMLElement).style, {
          outline: "0.1px solid red"
        })
    } else {
      ;(blockElement as HTMLElement).style && // TODO: remove type assertion
        Object.assign((blockElement as HTMLElement).style, {
          outline: "none"
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

export function controlBallByMouse(blocks: Block[]): () => void {
  const ball = document.getElementById(ballId)
  assert(ball !== null, "ball element must be found")

  startBlockAndScoreUpdate(blocks, null)

  function onMousemove(e: MouseEvent){
    const mousePosition = {
      x: e.clientX - ballSetting.radius,
      y: -(window.innerHeight - e.clientY - initialBottom + ballSetting.radius)
    }
    updateBallPositionTo(ball as Ball, mousePosition)

    const mouseDirection = { x: e.movementX, y: e.movementY }
    updateBallDirectionByCollisionWithBlocks(
      getCurrentCollisionPointsOnBall(
        getBallCenterPosition(ball as Ball),
        mouseDirection
      ),
      blocks,
      mouseDirection
    )
  }
  document.documentElement.addEventListener("mousemove", onMousemove)

  return function removeControlBallByMouse() {
    document.documentElement.removeEventListener("mousemove", onMousemove)
  }
}
