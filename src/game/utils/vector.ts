export type Vector = {
  x: number
  y: number
}

export function getVectorMultipliedWithScalar(a: number, v: Vector): Vector {
  return {
    x: a * v.x,
    y: a * v.y
  }
}

export function getInnerProduct(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y
}

export function getNorm(a: Vector): number {
  return Math.sqrt(getInnerProduct(a, a))
}

export function getSumOfVectors(a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  }
}

export function getFlippedVector(
  v: Vector,
  direction: "horizontal" | "vertical"
): Vector {
  switch (direction) {
    case "horizontal":
      return {
        x: -1 * v.x,
        y: v.y
      }
    case "vertical":
      return {
        x: v.x,
        y: -1 * v.y
      }
  }
}

export function getRotatedVector(v: Vector, radian: number): Vector {
  const rotateMatrix = getRotateMatrix(radian)
  return getVectorMultipliedWithMatrix(rotateMatrix, v)
}
type Matrix = number[][]

function getVectorMultipliedWithMatrix(m: Matrix, v: Vector): Vector {
  return {
    x: m[0][0] * v.x + m[0][1] * v.y,
    y: m[1][0] * v.x + m[1][1] * v.y
  }
}

function getRotateMatrix(radian: number): Matrix {
  return [
    [Math.cos(radian), -1 * Math.sin(radian)],
    [Math.sin(radian), Math.cos(radian)]
  ]
}
