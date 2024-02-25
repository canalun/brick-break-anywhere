import {
  ballSetting,
  initialBallDirection,
  initialBallSpeed
} from "../configuration/settings"
import type { Ball } from "../object/ball"
import { getBallCenterPosition } from "../object/ball"
import type { Bar } from "../object/bar"
import type { Block } from "../object/blocks"
import type { Vector } from "../utils/vector"
import { getVectorMultipliedWithScalar } from "../utils/vector"
import { getUpdatedBallDirection, getUpdatedBallSpeed } from "./updateBall"

export function startBallAnimation(
  ball: Ball,
  bar: Bar,
  blocks: Block[],
  ringSoundEffect: () => void
) {
  let currentBallSpeed = initialBallSpeed
  let currentBallDirection: Vector = initialBallDirection
  let currentBallVelocity: Vector = getVectorMultipliedWithScalar(
    currentBallSpeed,
    currentBallDirection
  )

  let id = requestAnimationFrame(() => {
    updateBall(ball)
  })
  function updateBall(ball: Ball): void {
    updateBallVelocity(ball)
    updateBallPosition(ball)
    id = requestAnimationFrame(() => updateBall(ball))
  }

  const stopBallAnimation = () => cancelAnimationFrame(id)
  if (process.env.NODE_ENV === "development") {
    window.addEventListener("click", stopBallAnimation)
  }
  return stopBallAnimation

  function updateBallPosition(ball: Ball): void {
    const currentBallPosition = getBallCenterPosition(ball)
    Object.assign(ball.style, {
      transform:
        `translate(` +
        `${currentBallPosition.x - ballSetting.radius + currentBallVelocity.x}px, ` +
        `${-(currentBallPosition.y - ballSetting.radius + currentBallVelocity.y)}px` +
        `)`
    })
  }

  function updateBallVelocity(ball: Ball): void {
    // acceleration
    currentBallSpeed = getUpdatedBallSpeed(currentBallSpeed)

    // collision detection
    currentBallDirection = getUpdatedBallDirection(
      ball,
      bar,
      blocks,
      currentBallDirection,
      ringSoundEffect
    )

    currentBallVelocity = getVectorMultipliedWithScalar(
      currentBallSpeed,
      currentBallDirection
    )
  }
}
