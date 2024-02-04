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

  requestAnimationFrame(() => {
    updateBallPositionAndVelocity(ball)
  })

  function updateBallPositionAndVelocity(ball: Ball): void {
    updateBallVelocity(ball)
    updateBallPosition(ball)
    requestAnimationFrame(() => updateBallPositionAndVelocity(ball))
  }

  function updateBallPosition(ball: Ball): void {
    Object.assign(ball.style, {
      left: `${parseInt(ball.style.left) + currentBallVelocity.x}px`,
      bottom: `${parseInt(ball.style.bottom) + currentBallVelocity.y}px`
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
