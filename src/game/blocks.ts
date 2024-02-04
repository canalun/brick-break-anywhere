import { getBlockElements } from "./getBlockElements"

export type Block = {
  uuid: string
  element: Element
  rect: {
    top: number
    bottom: number
    left: number
    right: number
  }
  remain: boolean
}

export function getBlocks(): Block[] {
  return getBlockElements().map(convertElementToBlock)
}

function convertElementToBlock(element: Element): Block {
  return {
    uuid: crypto.randomUUID(),
    element,
    rect: getRectOfBlock(element),
    remain: true
  }
}

export function getRectOfBlock(element: Element) {
  const __rect = element.getBoundingClientRect()
  const _rect = {
    top: __rect.top,
    bottom: __rect.bottom,
    left: __rect.left,
    right: __rect.right
  }

  const offsetAddedRect = addFrameOffsetToRect(element, _rect)

  const rect = {
    top: window.innerHeight - offsetAddedRect.top,
    bottom: window.innerHeight - offsetAddedRect.bottom,
    left: offsetAddedRect.left,
    right: offsetAddedRect.right
  }

  return rect
}

function addFrameOffsetToRect(
  element: Element,
  rect: {
    top: number
    bottom: number
    left: number
    right: number
  }
) {
  let currentOwnerDocument = element.ownerDocument
  while (currentOwnerDocument !== window.top.document) {
    const _srcFrameRect =
      currentOwnerDocument.defaultView?.frameElement?.getBoundingClientRect()
    if (!_srcFrameRect) {
      throw new Error("srcFrameRect not found")
    }

    rect.top += _srcFrameRect.top
    rect.bottom += _srcFrameRect.top
    rect.left += _srcFrameRect.left
    rect.right += _srcFrameRect.left

    currentOwnerDocument =
      currentOwnerDocument.defaultView?.frameElement?.ownerDocument
  }
  return rect
}
