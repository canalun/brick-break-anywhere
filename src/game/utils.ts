import { type Block } from "./blocks"

export type Vector = {
  x: number
  y: number
}

// TODO: Adopt mathematical way of vector calculation.
//       The current implementation is not clear for others.
export function vectorProduction(a: Vector, b: Vector): Vector {
  return {
    x: a.x * b.x,
    y: a.y * b.y
  }
}

export function vectorInnerProduct(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y
}

export function vectorNorm(a: Vector): number {
  return Math.sqrt(vectorInnerProduct(a, a))
}

export function vectorAdd(a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  }
}

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
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