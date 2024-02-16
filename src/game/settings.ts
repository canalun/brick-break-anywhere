import type { Vector } from "./utils"

export const ballId = "bba-ball"
export const barId = "bba-bar"
export const scoreboardId = "bba-scoreboard"
export const collisionPointOnBallClass = "bba-collision-point-on-ball"

type BarSetting = {
  width: number
  height: number
  color: string
}

export const barSetting: BarSetting = (() => {
  const width = window.innerWidth * 0.28
  return {
    width,
    height: Math.max((10 * width) / 250, 10),
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

// per frame
export const initialBallSpeed = 2.5
export const initialBallDirection: Vector = {
  x: Math.cos(Math.PI / 4),
  y: Math.cos(Math.PI / 4)
}
// per frame
export const ballAcceleration = 0.002

export const minimumRadianBetweenBallDirectionAndBar = Math.PI / 6

export const numberOfCollisionPoints = 36

// The bug of ball's going through the bar or blocks happens,
// when the value is too small. 3 and 15 is the magic number led by trial and error.
export const redundancyOfCollisionWithBlocks = 3
export const redundancyOfCollisionWithBar = 15
