import type { CollisionPointOnBall } from "./ball"
import { getBarCenterPosition, type Bar } from "./bar"
import type { Block } from "./blocks"
import { barSetting, widthOfEdgeOfCollisionWithBlocks } from "./settings"
import { getFlippedVector, type Vector } from "./utils"

export function updateDirectionByCollisionWithWall(
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

export function updateDirectionByCollisionWithBar(
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

  if (
    Math.abs(
      mostBottomPointsOnBall.y -
        getBarCenterPosition(bar).y +
        barSetting.height / 2
    ) <= 10 &&
    Math.abs(getBarCenterPosition(bar).x - mostBottomPointsOnBall.x) <=
      barSetting.width / 2
  ) {
    return getFlippedVector(currentBallDirection, "vertical")
  }
  return currentBallDirection
}

export function updateDirectionByCollisionWithBlocks(
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
        currentBallDirection.y > 0 &&
        block.rect.left <= collisionPointOnBall.x &&
        collisionPointOnBall.x <= block.rect.right &&
        0 <= block.rect.bottom - collisionPointOnBall.y &&
        block.rect.bottom - collisionPointOnBall.y <=
          widthOfEdgeOfCollisionWithBlocks
      ) {
        block.remain = false
        process.env.NODE_ENV === "development" &&
          console.log("removed by collision with bottom edge:", block.element)
        return getFlippedVector(currentBallDirection, "vertical")
      }
      // top edge
      if (
        currentBallDirection.y < 0 &&
        block.rect.left <= collisionPointOnBall.x &&
        collisionPointOnBall.x <= block.rect.right &&
        0 <= collisionPointOnBall.y - block.rect.top &&
        collisionPointOnBall.y - block.rect.top <=
          widthOfEdgeOfCollisionWithBlocks
      ) {
        block.remain = false
        process.env.NODE_ENV === "development" &&
          console.log("removed by collision with top edge:", block.element)
        return getFlippedVector(currentBallDirection, "vertical")
      }
      // left edge
      if (
        currentBallDirection.x > 0 &&
        0 <= block.rect.left - collisionPointOnBall.x &&
        block.rect.left - collisionPointOnBall.x <=
          widthOfEdgeOfCollisionWithBlocks &&
        block.rect.bottom <= collisionPointOnBall.y &&
        collisionPointOnBall.y <= block.rect.top
      ) {
        block.remain = false
        process.env.NODE_ENV === "development" &&
          console.log("removed by collision with left edge:", block.element)
        return getFlippedVector(currentBallDirection, "horizontal")
      }
      // right edge
      if (
        currentBallDirection.x < 0 &&
        0 <= collisionPointOnBall.x - block.rect.right &&
        collisionPointOnBall.x - block.rect.right <=
          widthOfEdgeOfCollisionWithBlocks &&
        block.rect.bottom <= collisionPointOnBall.y &&
        collisionPointOnBall.y <= block.rect.top
      ) {
        block.remain = false
        process.env.NODE_ENV === "development" &&
          console.log("removed by collision with right edge:", block.element)
        return getFlippedVector(currentBallDirection, "horizontal")
      }
    }
  }
  return { x: currentBallDirection.x, y: currentBallDirection.y }
}
