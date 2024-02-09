import type { Ball } from "./ball"
import { getBallCenterPosition, getCollisionPointsOnBall } from "./ball"
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
  initialBallAbsoluteVelocity,
  initialBallDirection
} from "./settings"
import type { Vector } from "./utils"
import { vectorAdd, vectorProduction } from "./utils"

export function startBallAnimation(
  ball: Ball,
  bar: Bar,
  blocks: Block[],
  ringSoundEffect: () => void
) {
  let currentBallAbsoluteVelocity: Vector = initialBallAbsoluteVelocity
  let currentBallDirection: Vector = initialBallDirection
  let currentBallVelocity: Vector = vectorProduction(
    currentBallAbsoluteVelocity,
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
        `${currentBallPosition.x - ballSetting.width / 2 + currentBallVelocity.x}px, ` +
        `${-(currentBallPosition.y - ballSetting.height / 2 + currentBallVelocity.y)}px` +
        `)`
    })
  }

  function updateBallVelocity(ball: Ball): void {
    // acceleration
    currentBallAbsoluteVelocity = getUpdatedBallAbsoluteVelocity(
      currentBallAbsoluteVelocity
    )

    // collision detection
    currentBallDirection = getUpdatedBallDirection(
      ball,
      bar,
      blocks,
      currentBallDirection,
      currentBallAbsoluteVelocity,
      ringSoundEffect
    )

    currentBallVelocity = vectorProduction(
      currentBallAbsoluteVelocity,
      currentBallDirection
    )
  }
}

function getUpdatedBallAbsoluteVelocity(currentBallAbsoluteVelocity: Vector) {
  return vectorAdd(currentBallAbsoluteVelocity, ballAcceleration)
}

function getUpdatedBallDirection(
  ball: Ball,
  bar: Bar,
  blocks: Block[],
  currentBallDirection: Vector,
  currentBallAbsoluteVelocity: Vector,
  ringSoundEffect: () => void
): Vector {
  const collisionPointsOnBall = getCollisionPointsOnBall(
    getBallCenterPosition(ball),
    currentBallDirection,
    currentBallAbsoluteVelocity
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
