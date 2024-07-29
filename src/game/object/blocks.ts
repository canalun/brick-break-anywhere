import { assert } from "~game/utils/dom"

import { getBlockElements } from "./getBlockElements"

// A block is "remained" until the ball hits it,
// and then it's "removed" when remove animation is done.
export type Block = {
  uuid: string
  element: Element // this includes not only HTMLElement but also others like SVGElement.
  rects: Rect[]
  remain: boolean
  removed: boolean
}

export type Rect = {
  top: number
  bottom: number
  left: number
  right: number
}

export function getBlocks(): Block[] {
  return getBlockElements().map(convertElementToBlock)
}

function convertElementToBlock(element: Element): Block {
  return {
    // crypto.randomUUID() is not available in HTTP pages :)
    // e.g. http://abehiroshi.la.coocan.jp/
    uuid: Math.random().toString(36).slice(-8),
    element,
    rects: getRectsOfBlock(element),
    remain: true,
    removed: false
  }
}

export function getRectsOfBlock(element: Element): Rect[] {
  const result: Rect[] = [];
  const rects = element.getClientRects();
  for (let i = 0; i < rects.length; i++) {
    const { top, bottom, left, right } = rects[i];
    const rect = { top, bottom, left, right }
    const offsetAddedRect = addFrameOffsetToRect(element, rect)
    result.push({
      top: window.innerHeight - offsetAddedRect.top,
      bottom: window.innerHeight - offsetAddedRect.bottom,
      left: offsetAddedRect.left,
      right: offsetAddedRect.right
    });
  }
  return result;
}

function addFrameOffsetToRect(
  element: Element,
  rect: Rect
): Rect {
  const result = { ...rect };
  let currentOwnerDocument: Document | null = element.ownerDocument
  assert(!!window.top, "window.top not found")
  while (currentOwnerDocument && currentOwnerDocument !== window.top.document) {
    const _srcFrameRect =
      currentOwnerDocument.defaultView?.frameElement?.getBoundingClientRect()
    if (!_srcFrameRect) {
      throw new Error("srcFrameRect not found")
    }

    result.top += _srcFrameRect.top
    result.bottom += _srcFrameRect.top
    result.left += _srcFrameRect.left
    result.right += _srcFrameRect.left

    currentOwnerDocument =
      currentOwnerDocument.defaultView?.frameElement?.ownerDocument || null
  }
  return result
}
