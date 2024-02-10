import {
  ballId,
  ballSetting,
  ballZIndex,
  barSetting,
  collisionPointOnBallClass,
  initialBottom,
  numberOfCollisionPoints
} from "./settings"
import {
  getInnerProduct,
  getNorm,
  getVectorMultipliedWithScalar,
  type Vector
} from "./utils"

export type Ball = HTMLDivElement & { _ball: never }

export function initializeBall(): Ball {
  const ball = document.createElement("div")
  ball.id = ballId
  Object.assign(ball.style, {
    position: "fixed",
    transform:
      `translate(` +
      `${window.innerWidth / 2 - ballSetting.width / 2}px,` +
      `${-(initialBottom + barSetting.height)}px` +
      `)`,
    left: "0px",
    bottom: "0px",
    width: `${ballSetting.width}px`,
    height: `${ballSetting.height}px`,
    backgroundColor: ballSetting.color,
    borderRadius: "50%",
    zIndex: ballZIndex
  })

  if (process.env.NODE_ENV === "development") {
    visualizeCollisionPointsOnBall()
  }

  return ball as Ball
}

export function getBallCenterPosition(ball: Ball): Vector {
  const rect = ball.getBoundingClientRect()
  return {
    x: rect.left + ballSetting.width / 2,
    y: window.innerHeight - rect.bottom + ballSetting.height / 2
  }
}

export type CollisionPointOnBall = Vector & { _collisionPointOnBall: never }

export function getCollisionPointsOnBall(
  ballPosition: Vector,
  ballDirection: Vector,
  ballSpeed: number
): CollisionPointOnBall[] {
  const ballVelocity = getVectorMultipliedWithScalar(ballSpeed, ballDirection)
  const normalizedBallVelocity = {
    x: ballVelocity.x / getNorm(ballVelocity),
    y: ballVelocity.y / getNorm(ballVelocity)
  }

  const collisionPointsOnBall: CollisionPointOnBall[] = []
  for (let i = 0; i < numberOfCollisionPoints; i++) {
    const theta = ((2 * Math.PI) / numberOfCollisionPoints) * i
    const vectorForCollisionPoint = { x: Math.cos(theta), y: Math.sin(theta) }
    if (getInnerProduct(vectorForCollisionPoint, normalizedBallVelocity) > 0) {
      collisionPointsOnBall.push({
        x: ballPosition.x + Math.cos(theta) * (ballSetting.width / 2),
        y: ballPosition.y + Math.sin(theta) * (ballSetting.height / 2)
      } as CollisionPointOnBall)
    }
  }

  if (process.env.NODE_ENV === "development") {
    updateVisualizedCollisionPointsOnBall(collisionPointsOnBall)
  }

  return collisionPointsOnBall
}

export function getEdgedCollisionPointsOnBall(
  collisionPoints: CollisionPointOnBall[]
) {
  return {
    right: collisionPoints[0],
    top: collisionPoints[Math.floor((numberOfCollisionPoints * 1) / 4)],
    left: collisionPoints[Math.floor((numberOfCollisionPoints * 2) / 4)],
    bottom: collisionPoints[Math.floor((numberOfCollisionPoints * 3) / 4)]
  }
}

// for debug //////////////////////////////////////////
const divsForCollisionPointsOnBall: HTMLDivElement[] = []
function visualizeCollisionPointsOnBall() {
  for (let i = 0; i < numberOfCollisionPoints; i++) {
    const collisionPointOnBall = document.createElement("div")
    collisionPointOnBall.classList.add(collisionPointOnBallClass)
    Object.assign(collisionPointOnBall.style, {
      position: "fixed",
      left: "0px",
      bottom: "0px",
      width: "3px",
      height: "3px",
      backgroundColor: "black",
      borderRadius: "50%",
      zIndex: ballZIndex + 1
    })
    document.documentElement.insertAdjacentElement(
      "beforeend",
      collisionPointOnBall
    )
    divsForCollisionPointsOnBall.push(collisionPointOnBall)
  }
}
function updateVisualizedCollisionPointsOnBall(
  collisionPointsOnBall: Vector[]
) {
  for (let i = 0; i < collisionPointsOnBall.length; i++) {
    const collisionPointOnBall = collisionPointsOnBall[i]
    divsForCollisionPointsOnBall[i].style.transform =
      `translate(` +
      `${collisionPointOnBall.x}px,` +
      `${-collisionPointOnBall.y}px` +
      `)`
  }
}
///////////////////////////////////////////////////////
