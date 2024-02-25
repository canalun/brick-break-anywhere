import {
  ballAcceleration,
  barSetting,
  minimumRadianBetweenBallDirectionAndBar,
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
import { getFlippedVector, getRotatedVector, type Vector } from "../utils"

export function getUpdatedBallSpeed(currentBallSpeed: number) {
  return currentBallSpeed + ballAcceleration
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

  const directionUpdatedByWall = updateBallDirectionByCollisionWithWall(
    collisionPointsOnBall,
    currentBallDirection
  )

  const directionUpdatedByBar = updateBallDirectionByCollisionWithBar(
    collisionPointsOnBall,
    bar,
    directionUpdatedByWall
  )

  const directionUpdatedByBlock = updateBallDirectionByCollisionWithBlocks(
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

// It's not necessary to consider the initial value of `previousBarPosition`,
// because the value is updated immediately after the game starts.
let previousBarPosition: Vector = { x: 0, y: 0 }
let counter = 0
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

  const isCollidingWithBar =
    currentBallDirection.y < 0 && // ball must be going down
    -1 * redundancyOfCollisionWithBar <=
      mostBottomPointsOnBall.y -
        (getBarCenterPosition(bar).y + barSetting.height / 2) &&
    // The upper limit is -1,
    // because the feeling of reflection is better when the ball is a bit lower than the bar top.
    mostBottomPointsOnBall.y -
      (getBarCenterPosition(bar).y + barSetting.height / 2) <=
      -1 &&
    Math.abs(getBarCenterPosition(bar).x - mostBottomPointsOnBall.x) <=
      barSetting.width / 2

  if (!isCollidingWithBar) {
    previousBarPosition = getBarCenterPosition(bar)
    return currentBallDirection
  }

  // update the direction considering the bar's movement
  // it's a bit complicated, but it improves the game experience a lot!!
  const currentBarPosition = getBarCenterPosition(bar)
  const dx = (currentBarPosition.x - previousBarPosition.x) / 50
  const updatedDirection = getRotatedVector(
    getFlippedVector(currentBallDirection, "vertical"),
    (Math.PI / 6) * (Math.abs(dx) < 1 ? dx : dx / Math.abs(dx))
  )

  const isUpdatedDirectionWithinLimit =
    0 <= updatedDirection.y &&
    Math.cos(Math.PI - minimumRadianBetweenBallDirectionAndBar) <=
      updatedDirection.x &&
    updatedDirection.x <= Math.cos(minimumRadianBetweenBallDirectionAndBar)

  return throttledAssign(previousBarPosition, currentBarPosition) &&
    isUpdatedDirectionWithinLimit
    ? updatedDirection
    : 0 <= updatedDirection.x
      ? {
          x: Math.cos(minimumRadianBetweenBallDirectionAndBar),
          y: Math.sin(minimumRadianBetweenBallDirectionAndBar)
        }
      : {
          x: Math.cos(Math.PI - minimumRadianBetweenBallDirectionAndBar),
          y: Math.sin(Math.PI - minimumRadianBetweenBallDirectionAndBar)
        }

  ////////////////////////////////////////
  function throttledAssign<T>(variable: T, value: T) {
    if (counter === 7) {
      counter = 0
      return (variable = value) && variable
    }
    counter++
    return variable
  }
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
        currentBallDirection.y > 0 && // ball must be going up
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
        currentBallDirection.y < 0 && // ball must be going down
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
        currentBallDirection.x > 0 && // ball must be going right
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
        currentBallDirection.x < 0 && // ball must be going left
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
