import {
  ballAcceleration,
  barSetting,
  maximumLimitOfBallSpeed,
  redundancyOfCollisionWithBar,
  redundancyOfCollisionWithBlocks
} from "../configuration/settings"
import {
  getBallCenterPosition,
  getCurrentCollisionPointsOnBall,
  type Ball,
  type CollisionPointOnBall
} from "../object/ball"
import { getBarCenterPosition, type Bar } from "../object/bar"
import type { Block } from "../object/blocks"
import {
  getFlippedVector,
  getRotatedVector,
  type Vector
} from "../utils/vector"

export function getUpdatedBallSpeed(currentBallSpeed: number) {
  return Math.min(currentBallSpeed + ballAcceleration, maximumLimitOfBallSpeed)
}

export function getUpdatedBallDirection(
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

  const directionUpdatedByBlock = updateBallDirectionByCollisionWithBlocks(
    collisionPointsOnBall,
    blocks,
    currentBallDirection
  )
  if (
    directionUpdatedByBlock.x !== currentBallDirection.x ||
    directionUpdatedByBlock.y !== currentBallDirection.y
  ) {
    ringSoundEffect()
    return directionUpdatedByBlock
  }

  const directionUpdatedByWall = updateBallDirectionByCollisionWithWall(
    collisionPointsOnBall,
    directionUpdatedByBlock
  )
  if (
    directionUpdatedByWall.x !== currentBallDirection.x ||
    directionUpdatedByWall.y !== currentBallDirection.y
  ) {
    ringSoundEffect()
    return directionUpdatedByWall
  }

  const directionUpdatedByBar = updateBallDirectionByCollisionWithBar(
    collisionPointsOnBall,
    bar,
    directionUpdatedByWall
  )
  if (
    directionUpdatedByBar.x !== currentBallDirection.x ||
    directionUpdatedByBar.y !== currentBallDirection.y
  ) {
    ringSoundEffect()
    return directionUpdatedByBar
  }

  return currentBallDirection
}

function updateBallDirectionByCollisionWithWall(
  collisionPointsOnBall: CollisionPointOnBall[],
  currentBallDirection: Vector
): Vector {
  const xs = [...collisionPointsOnBall.map((vector) => vector.x)]
  const maxXOfCollisionPointsOnBall = Math.max(...xs)
  const minXOfCollisionPointsOnBall = Math.min(...xs)

  const ys = [...collisionPointsOnBall.map((vector) => vector.y)]
  const maxYOfCollisionPointsOnBall = Math.max(...ys)

  if (
    minXOfCollisionPointsOnBall <= 0 ||
    window.innerWidth <= maxXOfCollisionPointsOnBall
  ) {
    return getFlippedVector(currentBallDirection, "horizontal")
  }
  if (window.innerHeight <= maxYOfCollisionPointsOnBall) {
    return getFlippedVector(currentBallDirection, "vertical")
  }
  // It's not necessary to update the direction by collision with the bottom wall
  // because the game is over.
  return currentBallDirection
}

function updateBallDirectionByCollisionWithBar(
  collisionPointsOnBall: Vector[],
  bar: Bar,
  currentBallDirection: Vector
): Vector {
  const minY = Math.min(...collisionPointsOnBall.map((v) => v.y))
  const mostBottomPointsOnBall = collisionPointsOnBall.find((v) => v.y === minY)
  if (!mostBottomPointsOnBall) {
    console.log("mostBottomPointsOnBall is not found")
    return currentBallDirection
  }

  const currentBarPosition = getBarCenterPosition(bar)

  const isCollidingWithBar =
    currentBallDirection.y < 0 && // ball must be going down
    -1 * redundancyOfCollisionWithBar <=
      mostBottomPointsOnBall.y -
        (currentBarPosition.y + barSetting.height / 2) &&
    // The upper limit is -1,
    // because the feeling of reflection is better when the ball is a bit lower than the bar top.
    mostBottomPointsOnBall.y - (currentBarPosition.y + barSetting.height / 2) <=
      -1 &&
    Math.abs(currentBarPosition.x - mostBottomPointsOnBall.x) <=
      barSetting.width / 2

  if (!isCollidingWithBar) {
    return currentBallDirection
  }

  // Update the direction according to how close the collision point is to the edge of the bar.
  const updatedDirection = getRotatedVector(
    { x: 0, y: 1 },
    (Math.PI / 3) *
      ((currentBarPosition.x - mostBottomPointsOnBall.x) /
        (barSetting.width / 2))
  )
  return updatedDirection
}

export function updateBallDirectionByCollisionWithBlocks(
  collisionPointsOnBall: Vector[],
  blocks: Block[],
  currentBallDirection: Vector
): Vector {
  for (let j = 0; j < collisionPointsOnBall.length; j++) {
    const collisionPointOnBall = collisionPointsOnBall[j]
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      if (!block.remain) {
        continue
      }
      // bottom edge
      if (
        block.rect.left <= collisionPointOnBall.x &&
        collisionPointOnBall.x <= block.rect.right &&
        0 <= block.rect.bottom - collisionPointOnBall.y &&
        block.rect.bottom - collisionPointOnBall.y <=
          redundancyOfCollisionWithBlocks
      ) {
        block.remain = false
        process.env.NODE_ENV === "development" &&
          console.log(
            "block removed by collision with bottom edge:",
            block.element
          )
        return getFlippedVector(currentBallDirection, "vertical")
      }
      // top edge
      if (
        block.rect.left <= collisionPointOnBall.x &&
        collisionPointOnBall.x <= block.rect.right &&
        0 <= collisionPointOnBall.y - block.rect.top &&
        collisionPointOnBall.y - block.rect.top <=
          redundancyOfCollisionWithBlocks
      ) {
        block.remain = false
        process.env.NODE_ENV === "development" &&
          console.log(
            "block removed by collision with top edge:",
            block.element
          )
        return getFlippedVector(currentBallDirection, "vertical")
      }
      // left edge
      if (
        0 <= block.rect.left - collisionPointOnBall.x &&
        block.rect.left - collisionPointOnBall.x <=
          redundancyOfCollisionWithBlocks &&
        block.rect.bottom <= collisionPointOnBall.y &&
        collisionPointOnBall.y <= block.rect.top
      ) {
        block.remain = false
        process.env.NODE_ENV === "development" &&
          console.log(
            "block removed by collision with left edge:",
            block.element
          )
        return getFlippedVector(currentBallDirection, "horizontal")
      }
      // right edge
      if (
        0 <= collisionPointOnBall.x - block.rect.right &&
        collisionPointOnBall.x - block.rect.right <=
          redundancyOfCollisionWithBlocks &&
        block.rect.bottom <= collisionPointOnBall.y &&
        collisionPointOnBall.y <= block.rect.top
      ) {
        block.remain = false
        process.env.NODE_ENV === "development" &&
          console.log(
            "block removed by collision with right edge:",
            block.element
          )
        return getFlippedVector(currentBallDirection, "horizontal")
      }
    }
  }
  return { x: currentBallDirection.x, y: currentBallDirection.y }
}
