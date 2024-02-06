import { getComputedStyleWithCache } from "./getComputedStyleWithCache"
import { isBBAElement, isFrameElement, isPenetrableFrame } from "./utils"

export function getBlockElements(): Element[] {
  const blockElements: Element[] = []
  const canBeBlock = (el: Element) => {
    return !isBBAElement(el) && isVisibleWithCache(el)
  }
  collectBlockElements(document, canBeBlock, blockElements)
  return blockElements
}

function collectBlockElements(
  topNode: Document | ShadowRoot,
  canBeBlock: (el: Element) => boolean,
  blockElements: Element[]
) {
  const elements = Array.from(topNode.querySelectorAll("*"))
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    if (canBeBlock(element)) {
      if (process.env.NODE_ENV === "development") {
        element.classList.add("bba-block")
      }
      blockElements.push(element)
    }
    if (element.shadowRoot) {
      collectBlockElements(element.shadowRoot, canBeBlock, blockElements)
    }
    if (isFrameElement(element)) {
      if (isPenetrableFrame(element)) {
        element.contentWindow.document.readyState === "complete"
          ? collectBlockElements(
              element.contentDocument,
              canBeBlock,
              blockElements
            )
          : element.addEventListener("load", () => {
              collectBlockElements(
                element.contentDocument,
                canBeBlock,
                blockElements
              )
            })
      }
    }
  }
}

// TODO: For elements inside iframes,
//       determine visibility by checking if they intersect with the frame's rectangle.
const isVisibleCache = new Map<Element, boolean>()
function isVisibleWithCache(element: Element): boolean {
  const cache = isVisibleCache.get(element)
  if (cache !== undefined) {
    return cache
  }
  const result = isVisible(element)
  isVisibleCache.set(element, result)
  return result
}
function isVisible(element: Element): boolean {
  if (element.tagName === "BODY") {
    return false
  }

  if (isFrameElement(element)) {
    return true
  }

  if (
    // TODO: polyfill
    element.checkVisibility &&
    !element.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })
  ) {
    process.env.NODE_ENV === "development" &&
      element.classList.add("bba-check-visibility-false")
    return false
  }

  if (
    element.tagName === "IMG" ||
    element.tagName === "VIDEO" ||
    element.tagName === "svg" ||
    element.tagName === "SELECT"
  ) {
    return true
  }

  if (isTiny(element)) {
    return (
      !hasNoBorder(element) || isOverflowVisibleAndHasVisibleChildNodes(element)
    )
  }

  if (
    hasNoBorder(element) &&
    hasNoBackgroundColor(element) &&
    hasNoShadow(element) &&
    hasNoBackgroundImage(element) &&
    hasNoTextNode(element)
  ) {
    return false
  }

  // Ultra edge case on Google Search page.
  if (isClippedToTinySize(element)) {
    return false
  }

  return true
}

function hasNoTextNode(element: Element): boolean {
  const childNodes = Array.from(element.childNodes)
  const result = !childNodes.some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  )
  result &&
    process.env.NODE_ENV === "development" &&
    element.classList.add("bba-no-text-node")
  return result
}

// To detect elements hidden by overflow:hidden,
// we need to check the size of the element.
// So, elements with a width or height of 0,
// and ones with both a width and height of 2 or less are considered as "tiny".
const isTinyCache = new Map<Element, boolean>()
function isTiny(element: Element): boolean {
  const cache = isTinyCache.get(element)
  if (cache !== undefined) {
    return cache
  }

  if (element.tagName === "HTML") {
    return false
  }
  const rect = element.getBoundingClientRect()
  const result =
    rect.width === 0 ||
    rect.height === 0 ||
    (rect.width <= 2 && rect.height <= 2)
      ? true
      : false
  isTinyCache.set(element, result)
  result &&
    process.env.NODE_ENV === "development" &&
    element.classList.add("bba-tiny")
  return result
}

const hasNoBorderCache = new Map<Element, boolean>()
function hasNoBorder(element: Element): boolean {
  const cache = hasNoBorderCache.get(element)
  if (cache !== undefined) {
    return cache
  }

  const style = getComputedStyleWithCache(element)

  const hasBorder =
    !(
      style.border === "" &&
      style.borderTop === "" &&
      style.borderRight === "" &&
      style.borderBottom === "" &&
      style.borderLeft === ""
    ) &&
    !(
      style.borderStyle === "none" &&
      style.borderTopStyle === "none" &&
      style.borderRightStyle === "none" &&
      style.borderBottomStyle === "none" &&
      style.borderLeftStyle === "none"
    ) &&
    !(
      style.borderWidth === "0px" &&
      style.borderTopWidth === "0px" &&
      style.borderRightWidth === "0px" &&
      style.borderBottomWidth === "0px" &&
      style.borderLeftWidth === "0px"
    )
  if (!hasBorder) {
    hasNoBorderCache.set(element, true)
    element.classList.add("bba-no-border")
    return true
  }

  const hasColoredBorder =
    style.borderColor &&
    !(
      style.borderColor ===
        getComputedStyleWithCache(window.document.body).backgroundColor ||
      style.borderColor === "transparent" ||
      (() => {
        const result = style.borderColor.match(/rgba\(.*0\)/)?.length
        return !!result && result > 0
      })()
    )
  const result = !hasColoredBorder
  hasNoBorderCache.set(element, result)
  result &&
    process.env.NODE_ENV === "development" &&
    element.classList.add("bba-no-border")
  return result
}

function hasNoShadow(element: Element): boolean {
  const style = getComputedStyleWithCache(element)
  const result =
    style.boxShadow === "" ||
    style.boxShadow === "none" ||
    (() => {
      const result = style.boxShadow.match(/rgba\(.*0\)/)?.length
      return !!result && result > 0
    })()
  result &&
    process.env.NODE_ENV === "development" &&
    element.classList.add("bba-has-no-shadow")
  return result
}

function hasNoBackgroundColor(element: Element): boolean {
  const bodyBackgroundColor = window.getComputedStyle(
    window.document.body
  ).backgroundColor
  const style = getComputedStyleWithCache(element)
  const result =
    style.backgroundColor === "" ||
    style.backgroundColor === bodyBackgroundColor ||
    (() => {
      const result = style.backgroundColor.match(/rgba\(.*0\)/)?.length
      return !!result && result > 0
    })()
  result &&
    process.env.NODE_ENV === "development" &&
    element.classList.add("bba-no-background-color")
  return result
}

function hasNoBackgroundImage(element: Element): boolean {
  const style = getComputedStyleWithCache(element)
  // initial value is 'none'
  // ref: https://drafts.csswg.org/css-backgrounds/#background-image
  const result = style.backgroundImage === "none"
  result &&
    process.env.NODE_ENV === "development" &&
    element.classList.add("bba-no-background-image")
  return result
}

function isOverflowVisibleAndHasVisibleChildNodes(element: Element): boolean {
  return isOverflowVisible(element) && hasVisibleChildNodes(element)
}

function isOverflowVisible(element: Element): boolean {
  const style = getComputedStyleWithCache(element)
  const result =
    style.overflowX === "visible" ||
    style.overflowY === "visible" ||
    style.overflow === "visible"
  result &&
    process.env.NODE_ENV === "development" &&
    element.classList.add("bba-overflow-visible")
  return result
}

function hasVisibleChildNodes(element: Element): boolean {
  const result = Array.from(element.childNodes).some((node) => {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        return isVisibleWithCache(node as Element)
      case Node.TEXT_NODE:
        return node.textContent.trim() !== ""
      default:
        return false
    }
  })
  result &&
    process.env.NODE_ENV === "development" &&
    element.classList.add("bba-visible-child-nodes")
  return result
}

// Element with `clip: rect(1px, 1px, 1px, 1px)` is not visible,
// but it can have visible child nodes and its DOMRect is not 1x1.
function isClippedToTinySize(element: Element): boolean {
  const style = getComputedStyleWithCache(element)
  const result = style.clip === "rect(1px, 1px, 1px, 1px)"
  result &&
    process.env.NODE_ENV === "development" &&
    element.classList.add("bba-clipped-to-tiny-size")
  return result
}
