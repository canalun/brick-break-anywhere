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

// TODO: For elements inside iframes, determine visibility by checking if they intersect with the frame's rectangle.
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
    return false
  }

  if (
    element.tagName === "IMG" ||
    element.tagName === "VIDEO" ||
    element.tagName === "svg"
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
  return !childNodes.some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  )
}

// 幅や高さが0の要素は見えない、また高さと幅がともに5以下の要素は微小要素であると判断する
// (高さが5だけどめちゃ平べったい要素に注意)
const isTinyCache = new Map<Element, boolean>()
function isTiny(element: Element): boolean {
  const cache = isTinyCache.get(element)
  if (cache) {
    return cache
  } else {
    const rect = element.getBoundingClientRect()
    const result =
      rect.width === 0 ||
      rect.height === 0 ||
      (rect.width <= 5 && rect.height <= 5)
        ? true
        : false
    isTinyCache.set(element, result)
    return result
  }
}

function isSetOverflowHidden(element: Element): boolean {
  const style = getComputedStyleWithCache(element)
  if (
    style.overflowX === "hidden" ||
    style.overflowY === "hidden" ||
    style.overflow === "hidden"
  ) {
    return true
  }
  return false
}

function hasNoBorder(element: Element): boolean {
  const bodyBackgroundColor = window.getComputedStyle(
    window.document.body
  ).backgroundColor
  const style = getComputedStyleWithCache(element)
  return (
    style.border === "" ||
    style.borderStyle === "none" ||
    style.borderWidth === "0px" ||
    style.borderColor === bodyBackgroundColor ||
    style.borderColor === "transparent" ||
    (() => {
      const result = style.borderColor.match(/rgba\(.*0\)/)?.length
      return !!result && result > 0
    })()
  )
}

function hasNoShadow(element: Element): boolean {
  const style = getComputedStyleWithCache(element)
  return (
    style.boxShadow === "" ||
    style.boxShadow === "none" ||
    (() => {
      const result = style.boxShadow.match(/rgba\(.*0\)/)?.length
      return !!result && result > 0
    })()
  )
}

function hasNoBackgroundColor(element: Element): boolean {
  const bodyBackgroundColor = window.getComputedStyle(
    window.document.body
  ).backgroundColor
  const style = getComputedStyleWithCache(element)
  return (
    style.backgroundColor === "" ||
    style.backgroundColor === bodyBackgroundColor ||
    (() => {
      const result = style.backgroundColor.match(/rgba\(.*0\)/)?.length
      return !!result && result > 0
    })()
  )
}

// TODO: use the below function when it becomes necessary to consider background-image
// (e.g. twitter might possibly use background-image to implement image preview with div element)
// function hasNoBackgroundImage(element: Element): boolean {
//   const style = getComputedStyleWithCache(element)
//   return style.backgroundImage === ""
// }
