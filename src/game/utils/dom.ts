import {
  ballId,
  barId,
  collisionPointOnBallClass,
  scoreboardId
} from "../configuration/settings"

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export function isSVGElement(element: Element): element is SVGElement {
  return element.tagName === "svg"
}

export function isTextareaElement(
  element: Element
): element is HTMLTextAreaElement {
  return element.tagName === "TEXTAREA"
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
    // @ts-ignore: intentional access to frame's document
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

// getComputedStyle() is expensive, so we should cache the result.
// We can assume that the style of an element doesn't change, because the page is frozen.
// Please note that DOMRect-related settings can't be used in this function,
// because they can change by removing blocks. Use getBoundingClientRect() instead.
const styleCache = new Map<Element, CSSStyleDeclaration>()
export function getComputedStyleWithCache(
  element: Element
): Omit<
  CSSStyleDeclaration,
  keyof ReturnType<typeof Element.prototype.getBoundingClientRect>
> {
  const cache = styleCache.get(element)
  if (cache) {
    return cache
  } else {
    const style = getComputedStyle(element)
    styleCache.set(element, style)
    return style
  }
}
