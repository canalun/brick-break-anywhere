import { type Block } from "./blocks"
import {
  ballId,
  barId,
  collisionPointOnBallClass,
  scoreboardId
} from "./settings"

export type Vector = {
  x: number
  y: number
}

export function multiplyScalarToVector(a: number, v: Vector): Vector {
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

export function addVectors(a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  }
}

export function flipVector(
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

export function rotateVector(v: Vector, radian: number): Vector {
  const rotateMatrix = getRotateMatrix(radian)
  return multiplyMatrixToVector(rotateMatrix, v)
}
type Matrix = number[][]

function multiplyMatrixToVector(m: Matrix, v: Vector): Vector {
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

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export function isSVGElement(element: Element): element is SVGElement {
  return element.tagName === "svg"
}

export function isFrameElement(
  element: Element
): element is HTMLIFrameElement | HTMLFrameElement {
  return element.tagName === "IFRAME" || element.tagName === "FRAME"
}

export function isPenetrableFrame(
  frame: HTMLIFrameElement | HTMLFrameElement
): boolean {
  try {
    frame.contentWindow.document
  } catch (e) {
    return false
  }
  return true
}

export function isBBAElement(element: Element): boolean {
  return (
    element.id === ballId ||
    element.id === barId ||
    element.id === scoreboardId ||
    element.classList.contains(collisionPointOnBallClass)
  )
}

// for debug
export function visualizeBlocks(blocks: Block[]) {
  for (let i = 0; i < blocks.length; i++) {
    const blockElement = blocks[i].element
    if (blocks[i].remain) {
      Object.assign(blockElement.style, {
        border: "0.1px solid red"
      })
    } else {
      Object.assign(blockElement.style, {
        border: "none"
      })
    }
  }
}
