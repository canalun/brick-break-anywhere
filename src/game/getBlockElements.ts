import { getComputedStyleWithCache } from "./getComputedStyleWithCache"
import { ballId, barId } from "./settings"
import { isFrameElement, isPenetrableFrame } from "./utils"

export function getBlockElements(): Element[] {
  const blockElements: Element[] = []
  const canBeBlock = (el: Element) => {
    return isVisible(el) && !isTiny(el)
  }
  collectBlockElements(
    document.documentElement,
    canBeBlock,
    false,
    blockElements
  )
  return blockElements
}

function collectBlockElements(
  element: Element,
  _canBeBlock: (el: Element) => boolean,
  isParentElementTiny: boolean,
  blockElements: Element[]
) {
  const canBeBlock = isParentElementTiny
    ? (el: Element) => !isSetOverflowHidden(el) && _canBeBlock(el)
    : _canBeBlock

  if (canBeBlock(element)) {
    if (process.env.NODE_ENV === "development") {
      element.classList.add("bba-block")
    }
    blockElements.push(element)
  }

  if (isFrameElement(element)) {
    if (isPenetrableFrame(element)) {
      element.contentWindow.document.readyState === "complete"
        ? collectBlockElements(
            element.contentWindow.document.documentElement,
            _canBeBlock,
            isParentElementTiny || isTiny(element),
            blockElements
          )
        : element.addEventListener("load", () => {
            collectBlockElements(
              element.contentWindow.document.documentElement,
              _canBeBlock,
              isParentElementTiny || isTiny(element),
              blockElements
            )
          })
    }
  } else {
    const children = Array.from(element.children)
    for (const child of children) {
      collectBlockElements(
        child,
        _canBeBlock,
        isParentElementTiny || isTiny(element),
        blockElements
      )
    }
    if (element.shadowRoot) {
      for (const child of Array.from(element.shadowRoot.children)) {
        collectBlockElements(
          child,
          _canBeBlock,
          isParentElementTiny || isTiny(element),
          blockElements
        )
      }
    }
  }
}

// TODO: For elements inside iframes,
//       determine visibility by checking if they intersect with the frame's rectangle.
function isVisible(element: Element): boolean {
  if (
    element.id === ballId ||
    element.id === barId ||
    element.tagName === "BODY"
  ) {
    return false
  }

  // First, ensure the minimum visibility with checkVisibility.
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

  if (
    hasNoBorder(element) &&
    hasNoBackgroundColor(element) &&
    hasNoShadow(element) &&
    // hasNoBackgroundImage(element) &&
    hasNoTextNode(element)
  ) {
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

// To detect elements hidden by overflow:hidden, we need to check the size of the element.
// Elements with a width or height of 0 and ones with both a width and height of 5 or less
// are considered "tiny" elements.
const isTinyCache = new Map<Element, boolean>()
function isTiny(element: Element): boolean {
  const cache = isTinyCache.get(element)
  if (cache) {
    return cache
  } else {
    if (element.tagName === "HTML") {
      return false
    }
    const rect = element.getBoundingClientRect()
    const result =
      rect.width === 0 ||
      rect.height === 0 ||
      (rect.width <= 5 && rect.height <= 5)
        ? true
        : false
    isTinyCache.set(element, result)
    result &&
      process.env.NODE_ENV === "development" &&
      element.classList.add("bba-tiny")
    return result
  }
}

function isSetOverflowHidden(element: Element): boolean {
  const style = getComputedStyleWithCache(element)
  const result =
    style.overflowX === "hidden" ||
    style.overflowY === "hidden" ||
    style.overflow === "hidden"
  result &&
    process.env.NODE_ENV === "development" &&
    element.classList.add("bba-overflow-hidden")
  return result
}

function hasNoBorder(element: Element): boolean {
  const bodyBackgroundColor = window.getComputedStyle(
    window.document.body
  ).backgroundColor
  const style = getComputedStyleWithCache(element)
  const result =
    style.border === "" ||
    style.borderStyle === "none" ||
    style.borderWidth === "0px" ||
    style.borderColor === bodyBackgroundColor ||
    style.borderColor === "transparent" ||
    (() => {
      const result = style.borderColor.match(/rgba\(.*0\)/)?.length
      return !!result && result > 0
    })()
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

// TODO: use the below function when it becomes necessary to consider background-image
//       e.g. twitter might possibly use background-image to implement image preview with div element.
// function hasNoBackgroundImage(element: Element): boolean {
//   const style = getComputedStyleWithCache(element)
//   return style.backgroundImage === ""
// }
