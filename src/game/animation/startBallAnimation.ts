import {
  barSetting,
  getInitialBallSpeed,
  initialBallDirection,
  type StartOptions
} from "../configuration/settings"
import { type Ball, getBallCenterPosition } from "../object/ball"
import { type Bar } from "../object/bar"
import type { Block } from "../object/blocks"
import type { Vector } from "../utils/vector"
import { getVectorMultipliedWithScalar } from "../utils/vector"
import { getUpdatedBallDirection, getUpdatedBallSpeed, updateBallPositionBy } from "./updateBall"
import { moveBarTo } from "./updateBar"

export function startBallAnimation(
  ball: Ball,
  bar: Bar,
  blocks: Block[],
  startOptions: Pick<StartOptions, "initialBallSpeed" | "demo">,
  ringSoundEffect: () => void
) {
  let currentBallSpeed = getInitialBallSpeed(
    startOptions.initialBallSpeed
  )
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
    // To prevent the ball from falling into a loop as much as possible
    if (startOptions.demo) {
      const fluctuation = barSetting.width * 0.4 - Math.random() * 5;
      moveBarTo(bar, getBallCenterPosition(ball).x - fluctuation)
    }
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
