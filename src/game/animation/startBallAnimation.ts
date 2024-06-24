import {
  getInitialBallSpeed,
  initialBallDirection,
  type StartOptions
} from "../configuration/settings"
import type { Ball } from "../object/ball"
import type { Bar } from "../object/bar"
import type { Block } from "../object/blocks"
import type { Vector } from "../utils/vector"
import { getVectorMultipliedWithScalar } from "../utils/vector"
import { getUpdatedBallDirection, getUpdatedBallSpeed, updateBallPositionBy } from "./updateBall"

export function startBallAnimation(
  ball: Ball,
  bar: Bar,
  blocks: Block[],
  initialBallSpeed: StartOptions["initialBallSpeed"],
  ringSoundEffect: () => void
) {
  let currentBallSpeed = getInitialBallSpeed(initialBallSpeed)
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
    updateBallPositionBy(ball, currentBallVelocity)
    id = requestAnimationFrame(() => updateBall(ball))
  }

  const stopBallAnimation = () => cancelAnimationFrame(id)
  if (process.env.NODE_ENV === "development") {
    window.addEventListener("click", stopBallAnimation)
  }
  return stopBallAnimation

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
