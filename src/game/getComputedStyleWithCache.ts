// getComputedStyle() is expensive, so we should cache the result.
// We can assume that the style of an element doesn't change, because the page is frozen.
const styleCache = new Map<Element, CSSStyleDeclaration>()
export function getComputedStyleWithCache(
  element: Element
): CSSStyleDeclaration {
  const cache = styleCache.get(element)
  if (cache) {
    return cache
  } else {
    const style = getComputedStyle(element)
    styleCache.set(element, style)
    return style
  }
}
