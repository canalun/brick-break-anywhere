import {
  getEdgedCollisionPointsOnBall,
  type CollisionPointOnBall
} from "./ball"
import { getBarCenterPosition, type Bar } from "./bar"
import type { Block } from "./blocks"
import { barSetting, widthOfEdgeOfCollisionWithBlocks } from "./settings"
import { type Vector } from "./utils"

export function updateDirectionByCollisionWithWall(
  collisionPointsOnBall: CollisionPointOnBall[],
  currentBallDirection: Vector
): Vector {
  const { right, top, left, bottom } = getEdgedCollisionPointsOnBall(
    collisionPointsOnBall
  )
  if (window.innerWidth <= right.x) {
    return { x: -1, y: currentBallDirection.y }
  }
  if (left.x <= 0) {
    return { x: 1, y: currentBallDirection.y }
  }
  if (window.innerHeight <= top.y) {
    return { x: currentBallDirection.x, y: -1 }
  }
  if (bottom.y <= 0) {
    // It's not necessary to update the direction by collision with the bottom wall
    // because the game is over.
    return { x: currentBallDirection.x, y: currentBallDirection.y }
  }
  return { x: currentBallDirection.x, y: currentBallDirection.y }
}

export function updateDirectionByCollisionWithBar(
  collisionPointsOnBall: CollisionPointOnBall[],
  bar: Bar,
  currentBallDirection: Vector
): Vector {
  const { bottom } = getEdgedCollisionPointsOnBall(collisionPointsOnBall)

  if (
    Math.abs(bottom.y - getBarCenterPosition(bar).y + barSetting.height / 2) <=
      10 &&
    Math.abs(getBarCenterPosition(bar).x - bottom.x) <= barSetting.width / 2
  ) {
    return { x: currentBallDirection.x, y: 1 }
  }
  return { x: currentBallDirection.x, y: currentBallDirection.y }
}

export function updateDirectionByCollisionWithBlocks(
  collisionPointsOnBall: CollisionPointOnBall[],
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
        return { x: currentBallDirection.x, y: -1 }
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
        return { x: currentBallDirection.x, y: 1 }
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
        return { x: -1, y: currentBallDirection.y }
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
        return { x: 1, y: currentBallDirection.y }
      }
    }
  }
  return { x: currentBallDirection.x, y: currentBallDirection.y }
}
