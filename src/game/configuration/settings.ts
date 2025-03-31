import type { Vector } from "../utils/vector"

export const ballId = "bba-ball"
export const barId = "bba-bar"
export const containerId = "bba-container"
export const scoreboardId = "bba-scoreboard"
export const collisionPointOnBallClass = "bba-collision-point-on-ball"

export type StartOptions = {
  withScoreboard: boolean
  initialBallSpeed: "low" | "middle" | "high" | "superHigh"
  sound: boolean,
  visualizeBlocks: boolean,
  demo: boolean,
  controlMode: "normal" | "mouse"
}

type BarSetting = {
  width: number
  height: number
  color: string
}

export const barSetting: BarSetting = (() => {
  const width = window.innerWidth * 0.28
  return {
    width,
    height: Math.max((10 * width) / 250, 10), // Just trial and error led me to this value.
    color: "blue"
  }
})()

// The magic numbers of `ballRadius` have no reason.
// Just trial and error led me to this value.
const ballRadius = Math.max((window.innerWidth * 2) / 250, 25) / 2
type BallSetting = {
  radius: number
  color: string
}
export const ballSetting: BallSetting = {
  radius: ballRadius,
  color: "red"
}

export const initialBottom = 30

export const scoreboardHeight = 30

export const ballZIndex = 2147483646
export const barZIndex = ballZIndex
export const veilZIndex = ballZIndex - 1

// Minimum value of the angle between the ball's direction and the bar
export const minimumRadianBetweenBallDirectionAndBar = Math.PI / 6

export const numberOfCollisionPoints = 36

// The bug of ball's going through the bar or blocks happens,
// when the value is too small. 3 and 15 is the magic number led by trial and error.
export const redundancyOfCollisionWithBlocks = 3
export const redundancyOfCollisionWithBar = barSetting.height

export const getInitialBallSpeed = (
  initialBallSpeed: StartOptions["initialBallSpeed"]
) => {
  // per frame
  switch (initialBallSpeed) {
    case "low":
      return 2.5
    case "middle":
      return 3.5
    case "high":
      return 4.5
    case "superHigh":
      return 6.5
    default:
      const _: never = initialBallSpeed
      throw new Error(`Invalid initialBallSpeed: ${_}`)
  }
}
export const ballAcceleration = 0.002 // per frame
export const maximumLimitOfBallSpeed = redundancyOfCollisionWithBar - 2 // per frame
export const initialBallDirection: Vector = {
  x: Math.cos(Math.PI / 4),
  y: Math.cos(Math.PI / 4)
}
