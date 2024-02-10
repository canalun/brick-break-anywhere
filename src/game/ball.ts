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
  getSumOfVectors,
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
      `${window.innerWidth / 2 - ballSetting.radius}px,` +
      `${-(initialBottom + barSetting.height)}px` +
      `)`,
    left: "0px",
    bottom: "0px",
    width: `${ballSetting.radius * 2}px`,
    height: `${ballSetting.radius * 2}px`,
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
    x: rect.left + ballSetting.radius,
    y: window.innerHeight - rect.bottom + ballSetting.radius
  }
}

export type CollisionPointOnBall = Vector & { _collisionPointOnBall: never }

export function getCurrentCollisionPointsOnBall(
  ballPosition: Vector,
  ballDirection: Vector
): CollisionPointOnBall[] {
  const collisionPointsOnBall: CollisionPointOnBall[] = []
  const unitTheta = (2 * Math.PI) / numberOfCollisionPoints
  for (let i = 0; i < numberOfCollisionPoints; i++) {
    const theta = unitTheta * i
    const vectorForCollisionPoint = { x: Math.cos(theta), y: Math.sin(theta) }
    if (getInnerProduct(vectorForCollisionPoint, ballDirection) > 0) {
      collisionPointsOnBall.push(
        getSumOfVectors(
          ballPosition,
          getVectorMultipliedWithScalar(
            ballSetting.radius,
            vectorForCollisionPoint
          )
        ) as CollisionPointOnBall
      )
    }
  }

  if (process.env.NODE_ENV === "development") {
    updateVisualizedCollisionPointsOnBall(collisionPointsOnBall)
  }

  return collisionPointsOnBall
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
