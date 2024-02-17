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
