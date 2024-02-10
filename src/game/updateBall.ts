import type { Ball } from "./ball"
import { getBallCenterPosition, getCurrentCollisionPointsOnBall } from "./ball"
import type { Bar } from "./bar"
import type { Block } from "./blocks"
import {
  updateDirectionByCollisionWithBar,
  updateDirectionByCollisionWithBlocks,
  updateDirectionByCollisionWithWall
} from "./detectCollision"
import {
  ballAcceleration,
  ballSetting,
  initialBallDirection,
  initialBallSpeed
} from "./settings"
import type { Vector } from "./utils"
import { getVectorMultipliedWithScalar } from "./utils"

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

function getUpdatedBallSpeed(currentBallSpeed: number) {
  return currentBallSpeed + ballAcceleration
}

function getUpdatedBallDirection(
  ball: Ball,
  bar: Bar,
  blocks: Block[],
  currentBallDirection: Vector,
  ringSoundEffect: () => void
): Vector {
  const collisionPointsOnBall = getCurrentCollisionPointsOnBall(
    getBallCenterPosition(ball),
    currentBallDirection
  )

  const directionUpdatedByWall = updateDirectionByCollisionWithWall(
    collisionPointsOnBall,
    currentBallDirection
  )

  const directionUpdatedByBar = updateDirectionByCollisionWithBar(
    collisionPointsOnBall,
    bar,
    directionUpdatedByWall
  )

  const directionUpdatedByBlock = updateDirectionByCollisionWithBlocks(
    collisionPointsOnBall,
    blocks,
    directionUpdatedByBar
  )

  if (
    directionUpdatedByBlock.x !== currentBallDirection.x ||
    directionUpdatedByBlock.y !== currentBallDirection.y
  ) {
    ringSoundEffect()
  }

  return directionUpdatedByBlock
}
